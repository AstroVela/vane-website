import Box from './Box'
import Eyebrow from './Eyebrow'
import { pickLocale, useSiteLocale } from '../siteI18n'

/* Site-native execution-timeline diagram: the shared multimodal pipeline is
   drawn once as a columnar flow, then Traditional and Vane execution are
   compared on aligned CPU, GPU, and I/O timelines. */

/* The pipeline as a convergent left-to-right flow; each inner array is one
   column, arrows are drawn between columns. */
const PIPELINE_EN: string[][] = [
  ['IMAGEFILE', 'AUDIOFILE', 'VIDEOFILE', 'FILE'],
  ['decode + resize', 'resample + frames'],
  ['model labeling', 'embedding'],
  ['filter + dedupe'],
  ['Lance / Iceberg', 'Parquet files'],
]

const PIPELINE_ZH: string[][] = [
  ['IMAGEFILE', 'AUDIOFILE', 'VIDEOFILE', 'FILE'],
  ['解码与缩放', '重采样与抽帧'],
  ['模型标注', '向量化'],
  ['过滤与去重'],
  ['Lance / Iceberg', 'Parquet 文件'],
]

const PIPELINE_LABELS_EN = ['inputs', 'prepare', 'infer', 'select', 'write']
const PIPELINE_LABELS_ZH = ['输入', '预处理', '推理', '筛选', '写入']

type Lane = {
  key: 'traditional' | 'vane'
  name: string
  mode: string
  note: string
  aria: string
  saved?: {
    label: string
    start: number
  }
  rows: Array<{
    key: 'cpu' | 'gpu' | 'io'
    label: string
    segments: Array<{
      label: string
      start: number
      span: number
      state?: 'work' | 'wait'
    }>
  }>
}

const LANES_EN: Lane[] = [
  {
    key: 'traditional',
    name: 'Traditional Pipeline',
    mode: 'stage barriers · longer critical path',
    note: 'Stage barriers serialize CPU decoding, GPU inference, and I/O, leaving the GPU waiting for decoded batches.',
    aria: 'Traditional pipeline timeline: CPU decoding runs first, GPU inference waits, and I/O writes finish the longer end-to-end critical path',
    rows: [
      { key: 'cpu', label: 'CPU', segments: [{ label: 'decoding', start: 1, span: 5 }] },
      {
        key: 'gpu',
        label: 'GPU',
        segments: [
          { label: 'waiting', start: 1, span: 5, state: 'wait' },
          { label: 'inference', start: 6, span: 5 },
        ],
      },
      { key: 'io', label: 'I/O', segments: [{ label: 'write', start: 11, span: 2 }] },
    ],
  },
  {
    key: 'vane',
    name: 'Vane Pipeline',
    mode: 'overlapped streaming · shorter critical path',
    note: 'Dynamic batching overlaps CPU decoding, GPU inference, and I/O streaming, completing the same pipeline earlier.',
    aria: 'Vane pipeline timeline: CPU decoding, GPU inference, and I/O streaming overlap to complete the same work earlier on the shared time scale',
    saved: { label: 'time saved', start: 9 },
    rows: [
      { key: 'cpu', label: 'CPU', segments: [{ label: 'decoding', start: 1, span: 5 }] },
      { key: 'gpu', label: 'GPU', segments: [{ label: 'inference', start: 3, span: 5 }] },
      { key: 'io', label: 'I/O', segments: [{ label: 'streaming', start: 1, span: 8 }] },
    ],
  },
]

const LANES_ZH: Lane[] = [
  {
    key: 'traditional',
    name: 'Traditional Pipeline',
    mode: '阶段屏障 · 更长关键路径',
    note: '阶段屏障使 CPU 解码、GPU 推理和 I/O 串行执行，GPU 需要等待解码批次。',
    aria: 'Traditional Pipeline 时间线：CPU 解码先执行，GPU 推理需要等待，最后由 I/O 写入完成更长的端到端关键路径',
    rows: [
      { key: 'cpu', label: 'CPU', segments: [{ label: '解码', start: 1, span: 5 }] },
      {
        key: 'gpu',
        label: 'GPU',
        segments: [
          { label: '等待', start: 1, span: 5, state: 'wait' },
          { label: '推理', start: 6, span: 5 },
        ],
      },
      { key: 'io', label: 'I/O', segments: [{ label: '写入', start: 11, span: 2 }] },
    ],
  },
  {
    key: 'vane',
    name: 'Vane Pipeline',
    mode: '重叠流式执行 · 更短关键路径',
    note: 'Dynamic batching 让 CPU 解码、GPU 推理和 I/O 流式传输重叠，更早完成同一条流水线。',
    aria: 'Vane Pipeline 时间线：CPU 解码、GPU 推理和 I/O 流式传输重叠执行，在相同时间尺度上更早完成相同工作',
    saved: { label: '节省时间', start: 9 },
    rows: [
      { key: 'cpu', label: 'CPU', segments: [{ label: '解码', start: 1, span: 5 }] },
      { key: 'gpu', label: 'GPU', segments: [{ label: '推理', start: 3, span: 5 }] },
      { key: 'io', label: 'I/O', segments: [{ label: '流式传输', start: 1, span: 8 }] },
    ],
  },
]

function ResourceTimeline({ lane }: { lane: Lane }) {
  return (
    <div className={`tl-execution ${lane.key}`} role="img" aria-label={lane.aria}>
      {lane.rows.map((row) => (
        <div className={`tl-resource-row tl-resource-${row.key}`} key={row.key}>
          <span className="tl-resource-label">{row.label}</span>
          <span className="tl-time-track">
            {lane.saved && (
              <span
                className="tl-time-saved"
                aria-hidden="true"
                style={{ gridColumn: `${lane.saved.start} / -1` }}
              >
                {row.key === 'gpu' ? lane.saved.label : null}
              </span>
            )}
            {row.segments.map((segment) => (
              <span
                className={`tl-time-segment ${segment.state ?? 'work'}`}
                key={`${segment.label}-${segment.start}`}
                style={{ gridColumn: `${segment.start} / span ${segment.span}` }}
              >
                {segment.label}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}

function ExecutionPanel({ lane }: { lane: Lane }) {
  return (
    <article className={`tl-lane ${lane.key}`}>
      <div className="tl-lane-head">
        <span className={`tl-dot ${lane.key}`} />
        <span className="tl-lane-copy">
          <b>{lane.name}</b>
          <small>{lane.mode}</small>
        </span>
      </div>

      <ResourceTimeline lane={lane} />

      <p className="tl-note">{lane.note}</p>
    </article>
  )
}

export default function TrainingDataFactoryAnimation() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      aria: 'Execution timeline',
      eyebrow: 'Execution timeline',
      title: 'Overlaps heterogeneous resources.',
      lead: 'Traditional pipelines create stage barriers and pipeline bubbles. Vane overlaps CPU, GPU, and I/O workloads through streaming execution and dynamic batching.',
      samePipeline: 'Same pipeline',
      pipelineNote: 'Illustrative timing for the same stages; actual performance depends on the data, models, and hardware.',
      imageAlt: 'Camera frame at an urban intersection',
      caption: 'camera frame · ts 00:14.280',
      stagesAria: 'Multimodal training-data pipeline stages',
      lanes: LANES_EN,
      pipeline: PIPELINE_EN,
      labels: PIPELINE_LABELS_EN,
    },
    {
      aria: '执行时间线',
      eyebrow: '执行时间线',
      title: '异构资源重叠执行。',
      lead: '传统流水线会形成阶段屏障和流水线气泡。Vane 通过流式执行与动态批处理，将 CPU、GPU 和 I/O 工作负载重叠调度。',
      samePipeline: '同一条流水线',
      pipelineNote: '相同阶段的执行时序示意；实际性能取决于数据、模型与硬件。',
      imageAlt: '城市路口相机帧',
      caption: 'camera frame · ts 00:14.280',
      stagesAria: '多模态训练数据流水线阶段',
      lanes: LANES_ZH,
      pipeline: PIPELINE_ZH,
      labels: PIPELINE_LABELS_ZH,
    },
  )

  return (
    <section className="section training-data-factory" aria-label={copy.aria}>
      <div className="wrap">
        <div className="shead">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 className="h2">{copy.title}</h2>
          <p className="lead">
            {copy.lead}
          </p>
        </div>

        <Box className="tl-board">
          <div className="tl-pipeline">
            <div className="tl-pipeline-head">
              <span className="tl-kicker">{copy.samePipeline}</span>
              <span className="tl-pipeline-note">{copy.pipelineNote}</span>
            </div>
            <div className="tl-flow">
              <figure className="tl-sample">
                <img src="/img/solutions/hero-driving-intersection.webp" alt={copy.imageAlt} />
                <figcaption>{copy.caption}</figcaption>
              </figure>
              <div className="tl-flow-main" aria-label={copy.stagesAria}>
                {copy.pipeline.map((column, index) => (
                  <div className="tl-flow-step" key={copy.labels[index]}>
                    <span className="tl-mini-label">{copy.labels[index]}</span>
                    <div className="tl-step-items">
                      {column.map((label) => (
                        <span className={index === 0 ? 'tl-chip' : 'tl-stage'} key={label}>
                          {label}
                        </span>
                      ))}
                    </div>
                    {index < copy.pipeline.length - 1 && <span className="tl-flow-arrow" aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tl-divider" aria-hidden="true" />

          <div className="tl-lanes">
            {copy.lanes.map((lane) => (
              <ExecutionPanel lane={lane} key={lane.key} />
            ))}
          </div>
        </Box>
      </div>
    </section>
  )
}
