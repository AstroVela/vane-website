import {l, type Localized} from './types'

export type EtlStage = 'native' | 'udf' | 'understand' | 'embed' | 'query'
export type EtlExample = {
  id: string; label: Localized; code: {python: string; sql?: string}
  title: Localized; note: Localized; rows: readonly (readonly [string, string])[]
}
export const etlStages: {id: EtlStage; label: Localized}[] = [
  {id: 'native', label: l('Native types', '原生类型')},
  {id: 'udf', label: l('Custom functions', '自定义函数')},
  {id: 'understand', label: l('Structured extraction', '结构化信息提取')},
  {id: 'embed', label: l('Embeddings', '向量化')},
  {id: 'query', label: l('Search & joins', '检索与关联')},
]
export const etlExamples: Record<EtlStage, EtlExample[]> = {
  native: [
    {id: 'file', label: l('File', 'File'), title: l('Filter files before reading their content.', '先筛选文件，再读取内容'),
      code: {sql: `SELECT file AS source_file
FROM list_files($file_glob)
WHERE file_path(file) LIKE '%.pdf'
  AND file_size(file) < 20*1024*1024;`, python: `docs = (
    vane.from_files(f"{root}/equipment/**", connection=con)
    .filter("file_path(file) LIKE '%.pdf' "
            "AND file_size(file) < 20*1024*1024")
    .project("file AS source_file")
)`},
      rows: [['source_file', 'FILE'], ['source_url', 'equipment/A-017/manual.pdf'], ['size', '2.4 MB']],
      note: l('Filter object metadata first. Read the candidate files when a later operation needs their content.', '先根据对象元数据筛选，需要内容时再读取候选文件。')},
    {id: 'image', label: l('ImageFile', 'ImageFile'), title: l('Filter by image dimensions before decoding.', '按尺寸筛选，再解码图片'),
      code: {sql: `WITH images AS (
  SELECT image_file(file) AS image FROM list_files($image_glob)
), metadata AS (
  SELECT image, image_file_metadata(image) AS meta FROM images
)
SELECT image, decode_image_file(image,
    mode := 'RGB', on_error := 'null') AS pixels
FROM metadata WHERE meta.width >= 1920 AND meta.height >= 1080;`, python: `images = (
    vane.from_files(f"{root}/images/*.jpg", connection=con)
    .project("image_file(file) AS image")
    .project("image, image_file_metadata(image) AS meta")
    .filter("meta.width >= 1920 AND meta.height >= 1080")
    .project("image, decode_image_file(image, "
             "mode := 'RGB', on_error := 'null') AS pixels")
)`},
      rows: [['image', 'IMAGEFILE'], ['meta.width × meta.height', '1920 × 1080'], ['pixels', "IMAGE('RGB')"]],
      note: l('Bounded header reads select suitable images before full pixel decoding.', '先读取图像头部信息，合格图片才进入像素解码。')},
    {id: 'audio', label: l('AudioFile', 'AudioFile'), title: l('Prepare audio for downstream models.', '筛选音频，生成模型需要的波形'),
      code: {sql: `WITH audio AS (
  SELECT audio_file(file) AS audio FROM list_files($audio_glob)
), metadata AS (
  SELECT audio, audio_metadata(audio) AS meta FROM audio
)
SELECT audio, resample(audio, 16000) AS waveform FROM metadata
WHERE meta.frames/meta.sample_rate <= 3600 AND meta.sample_rate >= 8000;`, python: `audio = (
    vane.from_files(f"{root}/audio/*.wav", connection=con)
    .project("audio_file(file) AS audio")
    .project("audio, audio_metadata(audio) AS meta")
    .filter("meta.frames/meta.sample_rate <= 3600 "
            "AND meta.sample_rate >= 8000")
    .project("audio, resample(audio, 16000) AS waveform")
)`},
      rows: [['audio', 'AUDIOFILE'], ['duration / sample_rate', '12 s / 48,000 Hz'], ['waveform', 'TENSOR(DOUBLE, [192000, 1])']],
      note: l('Filter duration and sample rate, then produce a 16 kHz tensor for downstream processing.', '按时长与采样率筛选，再生成 16 kHz Tensor 供后续处理。')},
    {id: 'video', label: l('VideoFile', 'VideoFile'), title: l('Extract frames from the relevant time window.', '按时间区间抽帧，保留时间戳'),
      code: {sql: `WITH videos AS (
  SELECT video_file(file) AS video FROM list_files($video_glob)
), metadata AS (
  SELECT video, video_metadata(video) AS meta FROM videos
)
SELECT video, unnest(video_frames(video,
    start_time := 30, end_time := 40,
    sample_interval_seconds := 1, width := 640, height := 360)) AS frame
FROM metadata WHERE meta.height >= 1080;`, python: `frames = (
    vane.from_files(f"{root}/video/*.mp4", connection=con)
    .project("video_file(file) AS video")
    .project("video, video_metadata(video) AS meta")
    .filter("meta.height >= 1080")
    .project("""video, unnest(video_frames(video,
        start_time := 30, end_time := 40,
        sample_interval_seconds := 1, width := 640, height := 360)) AS frame""")
)`},
      rows: [['video', 'VIDEOFILE'], ['frame.frame_time', '30 s, 31 s, 32 s…'], ['frame.data', "IMAGE('RGB')"]],
      note: l('Sample the relevant window at 640 × 360, retaining frame times without decoding the full video.', '在相关时间窗内按 640 × 360 采样，保留原视频引用与帧时间。')},
  ],
  udf: [
    {id: 'units', label: l('Unit conversion', '单位换算'), title: l('Call your Python business logic from SQL.', 'Python 业务逻辑，可从 SQL 调用'),
      code: {python: `import re
UNITS = {"mm/s": 1, "m/s": 1000, "in/s": 25.4, "um/s": 0.001}

@vane.func(return_dtype="DOUBLE", name="vibration_mm_s")
def vibration_mm_s(text: str) -> float | None:
    text = (text or "").lower().replace("μ", "u").replace("µ", "u")
    m = re.search(r"([-+]?\\d+(?:\\.\\d+)?)\\s*(mm/s|m/s|in/s|um/s)", text)
    return round(float(m[1]) * UNITS[m[2]], 3) if m else None`},
      rows: [['measurement_text', '0.5 in/s'], ['vibration_mm_s', '12.7'], ['type', 'DOUBLE']],
      note: l('Use @vane.func for deterministic transforms. The numeric result stays available to later SQL.', '用 @vane.func 封装确定性的转换，数值结果继续参与 SQL 计算。')},
    {id: 'speech', label: l('Speech recognition', '语音转写'), title: l('Reuse models across calls in a UDF instance.', '在 UDF 实例内复用模型'),
      code: {python: `import json
from vane import AudioFile
from faster_whisper import WhisperModel

@vane.cls(return_dtype="VARCHAR", name="transcribe_audio")
class SpeechRecognizer:
    def __init__(self, model_path: str):
        self.model = WhisperModel(model_path,
            device="cpu", compute_type="int8")

    def __call__(self, audio: AudioFile) -> str:
        with audio.to_tempfile() as source:
            segments, _ = self.model.transcribe(source.name)
            return json.dumps([
                {"text": s.text, "start": s.start, "end": s.end}
                for s in segments])`},
      rows: [['source', 'audio/A-017/inspection.wav'], ['text', 'Vibration is 0.5 inches per second.'], ['start / end', '4.2 s / 8.6 s']],
      note: l('@vane.cls keeps a model in each instance. Transcript segments retain their source time windows.', '@vane.cls 在实例内复用模型，转写片段保留原始时间窗口。')},
  ],
  understand: [
    {id: 'document', label: l('Equipment document', '设备文档'), title: l('Turn model output into a native STRUCT.', '将模型输出转为原生 STRUCT'),
      code: {sql: `SELECT factory_id, asset_id, permission_scope, quality_status,
       source_url, evidence_locator,
       ai_prompt($doc_instruction, source_file,
         return_format := $observation_schema,
         provider := $prompt_provider, model := $prompt_model
       ) AS observation
FROM prepared_docs;`, python: `doc_observations = prepared_docs.select(
    *[vane.col(name) for name in meta_columns],
    vane.ai.prompt(
        [vane.lit(doc_instruction), vane.col("source_file")],
        return_format=observation_schema,
        provider=prompt_provider, model=prompt_model,
    ).alias("observation"),
)`},
      rows: [['asset_id', 'A-017'], ['observation.measurement_text', '0.5 in/s'], ['observation.failure_mode', 'Bearing wear indicators'], ['source', 'manual.pdf / p. 3']],
      note: l('A fixed JSON Schema determines the STRUCT fields. Keep source positions from the parser.', '固定 JSON Schema 约束输出字段，来源位置由解析阶段保留。')},
    {id: 'recording', label: l('Inspection recording', '巡检录音'), title: l('Extract a consistent schema from different sources.', '将不同来源提取为统一字段'),
      code: {sql: `SELECT factory_id, asset_id, permission_scope, quality_status,
       source_url, evidence_locator,
       ai_prompt(concat($audio_instruction, source_text),
         return_format := $observation_schema,
         provider := $prompt_provider, model := $prompt_model
       ) AS observation
FROM inspection_segments;`, python: `audio_observations = inspection_segments.select(
    *[vane.col(name) for name in meta_columns],
    vane.ai.prompt(
        vane.FunctionExpression("concat", vane.lit(audio_instruction),
                                vane.col("source_text")),
        return_format=observation_schema,
        provider=prompt_provider, model=prompt_model,
    ).alias("observation"),
)`},
      rows: [['asset_id', 'A-017'], ['observation.severity', 'P2'], ['observation.recommended_action', 'Inspect the bearing and fasteners'], ['source', 'inspection.wav / 4.2–8.6 s']],
      note: l('Merge document and transcript observations with UNION ALL using the same schema.', '文档与转写使用相同输出 Schema，通过 UNION ALL 合并观测。')},
  ],
  embed: [{id: 'embedding', label: l('Normalize & embed', '归一化与向量化'), title: l('Query and embed your analysis results.', '分析结果，可查询、可向量化'),
    code: {sql: `WITH normalized AS (
  SELECT factory_id, asset_id, permission_scope, quality_status,
         source_url, evidence_locator, observation.* EXCLUDE (event_time),
         try_cast(observation.event_time AS TIMESTAMPTZ) AS event_time,
         vibration_mm_s(observation.measurement_text) AS vibration_mm_s,
         concat_ws(' | ', observation.failure_mode,
                   observation.recommended_action,
                   observation.evidence_text) AS search_text
  FROM observations
)
SELECT *, ai_embed(search_text, provider := $embedding_provider,
    model := $embedding_model, dimensions := 1024) AS embedding
FROM normalized WHERE confidence >= 0.80
  AND asset_id IS NOT NULL AND event_time IS NOT NULL
  AND severity IN ('P1', 'P2', 'P3', 'P4') AND evidence_text IS NOT NULL;`, python: `normalized = observations.project("""
    factory_id, asset_id, permission_scope, quality_status,
    source_url, evidence_locator, observation.* EXCLUDE (event_time),
    try_cast(observation.event_time AS TIMESTAMPTZ) AS event_time,
    vibration_mm_s(observation.measurement_text) AS vibration_mm_s,
    concat_ws(' | ', observation.failure_mode,
              observation.recommended_action,
              observation.evidence_text) AS search_text
""")
valid = normalized.filter("""
    confidence >= 0.80 AND asset_id IS NOT NULL AND event_time IS NOT NULL
    AND severity IN ('P1', 'P2', 'P3', 'P4') AND evidence_text IS NOT NULL
""")
embedded = valid.select(
    vane.StarExpression(),
    vane.ai.embed(vane.col("search_text"), provider=embedding_provider,
                 model=embedding_model, dimensions=1024).alias("embedding"),
)`},
    rows: [['asset_id / severity', 'A-017 / P2'], ['vibration_mm_s', '12.7'], ['embedding', 'FLOAT[1024]'], ['source_url + evidence_locator', 'inspection.wav / 4.2–8.6 s']],
    note: l('Expand structured output, apply a Python rule and create a typed vector in the same data flow.', '展开结构化输出、应用 Python 规则、生成有类型的向量，都在同一份数据中完成。')}],
  query: [{id: 'join', label: l('Search & join', '检索与关联'), title: l('Join retrieved evidence with business data.', '将检索结果关联到业务数据'),
    code: {sql: `WITH events AS (
  SELECT * FROM lance_hybrid_search(
    'lance_ns.main.asset_observations',
    'embedding', $query_vector::FLOAT[1024],
    'search_text', $query_text, k = 50, prefilter = true)
  WHERE factory_id = $factory_id AND permission_scope = $permission_scope
    AND quality_status = 'approved'
    AND event_time >= current_date - INTERVAL '180 days'
    AND severity IN ('P1', 'P2')
)
SELECT a.asset_id, a.line_id, a.model,
       max(s._hybrid_score) AS match_score,
       list(struct_pack(
         event_time := s.event_time, failure_mode := s.failure_mode,
         action := s.recommended_action, evidence := s.evidence_text,
         locator := s.evidence_locator, source_url := s.source_url
       ) ORDER BY s._hybrid_score DESC) AS ranked_evidence
FROM eligible_assets a JOIN events s USING (asset_id)
GROUP BY a.asset_id, a.line_id, a.model
ORDER BY match_score DESC;`, python: `hits = con.sql("""
    SELECT * FROM lance_hybrid_search(
      'lance_ns.main.asset_observations',
      'embedding', $query_vector::FLOAT[1024], 'search_text', $query_text,
      k = 50, prefilter = true)
""", params={"query_vector": query_vector, "query_text": query_text})
events = hits.filter(
    (vane.col("factory_id") == vane.lit(factory_id)) &
    (vane.col("permission_scope") == vane.lit(permission_scope))
).filter("""quality_status = 'approved'
    AND event_time >= current_date - INTERVAL '180 days'
    AND severity IN ('P1', 'P2')""")
result = (eligible_assets.set_alias("a")
    .join(events.set_alias("s"), "a.asset_id = s.asset_id")
    .aggregate("""
        a.asset_id, a.line_id, a.model, max(s._hybrid_score) AS match_score,
        list(struct_pack(event_time := s.event_time,
            failure_mode := s.failure_mode, action := s.recommended_action,
            evidence := s.evidence_text, locator := s.evidence_locator,
            source_url := s.source_url)
            ORDER BY s._hybrid_score DESC) AS ranked_evidence
    """, "a.asset_id, a.line_id, a.model")
    .order("match_score DESC"))`},
    rows: [['asset_id / line_id', 'A-017 / Line 03'], ['model', 'Motor M-240'], ['ranked_evidence', 'Bearing wear indicators'], ['source', 'inspection.wav / 4.2–8.6 s']],
    note: l('Find relevant facts with hybrid search, constrain their scope and join the equipment register.', '混合检索找到相关事实，再限定范围、关联设备台账，保留依据。')}],
}
