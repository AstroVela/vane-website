/* Seven detailed use cases — Problem / Pipeline / Code / Input·Output / When /
   Example. Code is pre-highlighted markup using the current public APIs. */
import type {PixelIconName} from '../components/PixelIcon'

export type UseCase = {
  id: string
  icon: PixelIconName
  title: string
  titleZh: string
  tag: string
  tagZh: string
  pipeline: string[]
  pipelineZh: string[]
  problem: string
  problemZh: string
  input: string
  inputZh: string
  output: string
  outputZh: string
  when: string
  whenZh: string
  filename: string
  example: string
  code: string
}

export const USE_CASES = [
  {
    id: 'embeddings',
    icon: 'embeddings',
    title: 'Web Text to Embeddings',
    titleZh: '网页文本转嵌入',
    tag: 'embeddings',
    tagZh: 'embedding',
    pipeline: ['read_parquet', 'filter SQL', 'chunk_text', 'SQL ai_embed', 'write_parquet'],
    pipelineZh: ['read_parquet', 'SQL 过滤', 'chunk_text', 'SQL ai_embed', 'write_parquet'],
    problem:
      'Turning web-scale crawl dumps into clean, chunked embeddings usually means stitching SQL filtering, Python chunking, a GPU embedding model and Parquet output across separate systems.',
    problemZh:
      '要把网页级抓取数据变成可检索语料，通常不能靠临时脚本拼 SQL、分块、GPU embedding 和 Parquet 写出。',
    input: '2.1 TB Common Crawl parquet',
    inputZh: '2.1 TB Common Crawl Parquet',
    output: '480M chunk embeddings · 768-d',
    outputZh: '4.8 亿 chunk embeddings · 768 维',
    when: 'Building a retrieval corpus or a pretraining filter from raw crawl data.',
    whenZh: '从原始爬取数据构建检索语料或预训练过滤器时使用。',
    filename: 'common_crawl.py',
    example: 'examples/common_crawl.py',
    code: `docs <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT url, text FROM read_parquet('s3://cc/*.parquet')"</span><span class="p">)</span>
chunks <span class="p">=</span> docs<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>chunk_text<span class="p">,</span> schema<span class="p">=</span>chunk_schema<span class="p">,</span> execution_backend<span class="p">=</span><span class="s">"ray_task"</span><span class="p">)</span>
chunks<span class="p">.</span><span class="f">to_table</span><span class="p">(</span><span class="s">"chunks"</span><span class="p">)</span>
emb <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"""
SELECT url, text,
       ai_embed(text, struct_pack(
           provider := 'transformers',
           model := 'sentence-transformers/all-MiniLM-L6-v2'
       )) AS embedding
FROM chunks
"""</span><span class="p">)</span>
emb<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://corpus/embeddings/"</span><span class="p">)</span>`,
  },
  {
    id: 'search',
    icon: 'retrieval',
    title: 'Semantic Search',
    titleZh: '语义搜索',
    tag: 'retrieval',
    tagZh: '检索',
    pipeline: ['SQL ai_embed', 'write index', 'cosine query'],
    pipelineZh: ['SQL ai_embed', '写入索引', 'cosine query'],
    problem:
      'You need an offline index of a large Q&A corpus and a way to match related records without standing up a vector DB just to experiment.',
    problemZh:
      '想先验证大型问答语料的相关匹配，不必一开始就部署向量数据库。',
    input: '14M StackExchange questions',
    inputZh: '1400 万条 StackExchange 问题',
    output: 'top-k similar per query',
    outputZh: '每个查询的 top-k 相似结果',
    when: 'Prototyping retrieval or near-duplicate matching over a static corpus.',
    whenZh: '在静态语料上原型验证检索或近重复匹配时使用。',
    filename: 'semantic_search.py',
    example: 'examples/semantic_search.py',
    code: `idx <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"""
SELECT id, title, body,
       ai_embed(body, struct_pack(
           provider := 'transformers',
           model := 'sentence-transformers/all-MiniLM-L6-v2'
       )) AS embedding
FROM read_parquet('s3://qa/*.parquet')
"""</span><span class="p">)</span>
idx<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://index/qa/"</span><span class="p">)</span>
hits <span class="p">=</span> conn<span class="p">.</span><span class="f">execute</span><span class="p">(</span><span class="s">"SELECT id FROM 's3://index/qa/' ORDER BY list_cosine_similarity(embedding, ?::FLOAT[]) DESC LIMIT 10"</span><span class="p">, [</span>q<span class="p">]).</span><span class="f">fetchall</span><span class="p">()</span>`,
  },
  {
    id: 'dedupe',
    icon: 'preprocessing',
    title: 'Text Deduplication',
    titleZh: '文本去重',
    tag: 'preprocessing',
    tagZh: '预处理',
    pipeline: ['normalize', 'minhash', 'lsh_bands (flat_map)', 'keep one'],
    pipelineZh: ['标准化', 'MinHash', 'LSH band（flat_map）', '保留一条'],
    problem:
      'Near-duplicate dedup at scale needs MinHash signatures and LSH bucketing wired into your data pipeline — not a one-off notebook.',
    problemZh:
      '大规模近重复去重，需要把 MinHash 与 LSH 分桶接入正式流水线，而不是停留在 notebook。',
    input: '900M documents',
    inputZh: '9 亿文档',
    output: '612M unique (32% removed)',
    outputZh: '6.12 亿唯一文档（移除 32%）',
    when: 'Cleaning a training set before tokenization or embedding.',
    whenZh: '在分词或 embedding 前清洗训练集时使用。',
    filename: 'minhash_dedupe.py',
    example: 'examples/minhash_dedupe.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, text FROM read_parquet('s3://raw/*.parquet')"</span><span class="p">)</span>
sig <span class="p">=</span> rel<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>minhash_128<span class="p">,</span> schema<span class="p">=</span>signature_schema<span class="p">)</span>
buckets <span class="p">=</span> sig<span class="p">.</span><span class="f">flat_map</span><span class="p">(</span>lsh_bands_16<span class="p">,</span> schema<span class="p">=</span>band_schema<span class="p">)</span>
clean <span class="p">=</span> buckets<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>keep_one_per_cluster<span class="p">,</span> schema<span class="p">=</span>clean_schema<span class="p">)</span>
clean<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://clean/"</span><span class="p">)</span>`,
  },
  {
    id: 'images',
    icon: 'vision',
    title: 'Image Pipelines',
    titleZh: '图像流水线',
    tag: 'vision',
    tagZh: '视觉',
    pipeline: ['manifest sql', 'decode_image', 'DetectFeatures (actor)', 'write'],
    pipelineZh: ['manifest SQL', 'decode_image', 'DetectFeatures（actor）', '写出'],
    problem:
      'Decoding millions of images and running a vision model means juggling IO, CPU decode and GPU inference with the right batch sizes by hand.',
    problemZh:
      '数百万图片的解码、视觉模型推理和写出，要同时协调 IO、CPU 与 GPU batch。',
    input: '12M images',
    inputZh: '1200 万张图像',
    output: 'detections + CLIP features',
    outputZh: '检测结果 + CLIP 特征',
    when: 'Tagging, filtering, or feature-extracting a large image dataset.',
    whenZh: '给大型图像数据集打标签、过滤或抽取特征时使用。',
    filename: 'querying_images.py',
    example: 'examples/querying_images.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, path FROM read_parquet('s3://images/manifest.parquet')"</span><span class="p">)</span>
imgs <span class="p">=</span> rel<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>decode_image<span class="p">,</span> schema<span class="p">=</span>image_schema<span class="p">,</span> batch_size<span class="p">=</span><span class="n">128</span><span class="p">,</span> execution_backend<span class="p">=</span><span class="s">"ray_task"</span><span class="p">)</span>
feats <span class="p">=</span> imgs<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">DetectFeatures</span><span class="p">,</span> schema<span class="p">=</span>feature_schema<span class="p">,</span> execution_backend<span class="p">=</span><span class="s">"ray_actor"</span><span class="p">,</span> gpus<span class="p">=</span><span class="n">1</span><span class="p">,</span> actor_number<span class="p">=</span><span class="n">4</span><span class="p">,</span> batch_size<span class="p">=</span><span class="n">64</span><span class="p">)</span>
feats<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://features/"</span><span class="p">)</span>`,
  },
  {
    id: 'imagegen',
    icon: 'generation',
    title: 'Image Generation',
    titleZh: '图像生成',
    tag: 'generation',
    tagZh: '生成',
    pipeline: ['prompts sql', 'Diffusion (model actor)', 'write'],
    pipelineZh: ['prompts SQL', 'Diffusion（model actor）', '写出'],
    problem:
      'Generating images for a whole prompt table means managing a GPU model actor, batching, and writing results back — repeatedly.',
    problemZh:
      '对整张 prompt 表批量生成图像时，需要稳定管理 GPU model actor、batching 和结果回写。',
    input: '50K prompts',
    inputZh: '5 万条 prompt',
    output: '50K images · 1024²',
    outputZh: '5 万张图像 · 1024²',
    when: 'Synthetic-data generation or bulk creative rendering.',
    whenZh: '合成数据生成或批量创意渲染时使用。',
    filename: 'image_generation.py',
    example: 'examples/image_generation.py',
    code: `prompts <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, prompt FROM read_parquet('s3://prompts.parquet')"</span><span class="p">)</span>
images <span class="p">=</span> prompts<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>
    <span class="t">Diffusion</span><span class="p">,</span> schema<span class="p">=</span>image_schema<span class="p">,</span> execution_backend<span class="p">=</span><span class="s">"ray_actor"</span><span class="p">,</span> gpus<span class="p">=</span><span class="n">1</span><span class="p">,</span> actor_number<span class="p">=</span><span class="n">2</span><span class="p">,</span> batch_size<span class="p">=</span><span class="n">16</span><span class="p">)</span>
images<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://generated/"</span><span class="p">)</span>`,
  },
  {
    id: 'multimodal',
    icon: 'multimodal',
    title: 'Multimodal Structured Output',
    titleZh: '多模态结构化输出',
    tag: 'multimodal',
    tagZh: '多模态',
    pipeline: ['image+text sql', 'VLM (schema)', 'Judge', 'write'],
    pipelineZh: ['图像+文本 SQL', 'VLM（schema）', 'Judge', '写出'],
    problem:
      'Getting reliable structured fields out of a vision-language model — and grading them — needs schema enforcement plus a second judge pass.',
    problemZh:
      '要从 VLM 得到可信字段，不能只看生成结果；还需要 schema 约束和二次评审。',
    input: '300K document images',
    inputZh: '30 万张文档图像',
    output: 'typed JSON + judge score',
    outputZh: '类型化 JSON + judge 分数',
    when: 'Extracting structured data from documents or images at scale.',
    whenZh: '从文档或图像中大规模抽取结构化数据时使用。',
    filename: 'multimodal_structured_outputs.py',
    example: 'examples/multimodal_structured_outputs.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, image, question FROM 's3://docs/*.parquet'"</span><span class="p">)</span>
ans <span class="p">=</span> rel<span class="p">.</span><span class="f">prompt</span><span class="p">(</span>
    <span class="s">"question"</span><span class="p">,</span> image_columns<span class="p">=[</span><span class="s">"image"</span><span class="p">],</span> provider<span class="p">=</span><span class="s">"openai"</span><span class="p">,</span>
    return_format<span class="p">=</span><span class="t">Receipt</span><span class="p">,</span> output_column<span class="p">=</span><span class="s">"receipt_json"</span><span class="p">)</span>
graded <span class="p">=</span> ans<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">Judge</span><span class="p">,</span> schema<span class="p">=</span>judge_schema<span class="p">,</span> batch_size<span class="p">=</span><span class="n">32</span><span class="p">)</span>
graded<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://extracted/"</span><span class="p">)</span>`,
  },
  {
    id: 'voice',
    icon: 'audio',
    title: 'Voice AI Analytics',
    titleZh: '语音 AI 分析',
    tag: 'audio',
    tagZh: '音频',
    pipeline: ['audio SQL', 'Transcribe', 'Summarize', 'SQL ai_embed'],
    pipelineZh: ['audio SQL', 'Transcribe', 'Summarize', 'SQL ai_embed'],
    problem:
      'A voice-analytics pipeline chains transcription, summarization, captioning and embedding — each a different model, each needing batching on GPUs.',
    problemZh:
      '通话分析要串起转写、摘要、caption 和 embedding；每一步模型都要做好 GPU batching。',
    input: '120K call recordings',
    inputZh: '12 万段通话录音',
    output: 'transcript · summary · embedding',
    outputZh: '转写 · 摘要 · embedding',
    when: 'Call analytics, meeting summaries, or audio search.',
    whenZh: '通话分析、会议摘要或音频搜索时使用。',
    filename: 'voice_ai_analytics.py',
    example: 'examples/voice_ai_analytics.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, audio FROM read_parquet('s3://calls/*.parquet')"</span><span class="p">)</span>
out <span class="p">=</span> <span class="p">(</span>rel
   <span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">Transcribe</span><span class="p">,</span> schema<span class="p">=</span>transcript_schema<span class="p">,</span> execution_backend<span class="p">=</span><span class="s">"ray_actor"</span><span class="p">,</span> gpus<span class="p">=</span><span class="n">1</span><span class="p">,</span> actor_number<span class="p">=</span><span class="n">4</span><span class="p">)</span>
   <span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">Summarize</span><span class="p">,</span> schema<span class="p">=</span>summary_schema<span class="p">,</span> batch_size<span class="p">=</span><span class="n">32</span><span class="p">))</span>
out<span class="p">.</span><span class="f">to_table</span><span class="p">(</span><span class="s">"transcribed"</span><span class="p">)</span>
ready <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"""
SELECT id, transcript, summary,
       ai_embed(summary, struct_pack(
           provider := 'transformers',
           model := 'sentence-transformers/all-MiniLM-L6-v2'
       )) AS embedding
FROM transcribed
"""</span><span class="p">)</span>
ready<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://analytics/"</span><span class="p">)</span>`,
  },
] satisfies UseCase[]
