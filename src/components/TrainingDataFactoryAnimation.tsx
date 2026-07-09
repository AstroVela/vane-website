import Box from './Box'
import Eyebrow from './Eyebrow'
import { pickLocale, useSiteLocale } from '../siteI18n'

/* Site-native execution-timeline diagram: the shared multimodal pipeline is
   drawn once as a columnar flow, then Legacy and Vane execution are compared
   as wait/idle vs overlapped/full-GPU lanes. */

/* The pipeline as a convergent left-to-right flow; each inner array is one
   column, arrows are drawn between columns. */
const PIPELINE_EN: string[][] = [
  ['camera frames', 'LiDAR sweeps', 'radar returns', 'ego pose + calib'],
  ['decode frames', 'load sweeps'],
  ['time sync', 'ego-pose align'],
  ['sensor projection'],
  ['label + track', 'sample embed'],
]

const PIPELINE_ZH: string[][] = [
  ['camera frames', 'LiDAR sweeps', 'radar returns', 'ego pose + calib'],
  ['解码 frames', '加载 sweeps'],
  ['时间同步', 'ego-pose 对齐'],
  ['传感器投影'],
  ['标注 + 跟踪', '样本 embed'],
]

const PIPELINE_LABELS_EN = ['inputs', 'decode', 'align', 'fuse', 'package']
const PIPELINE_LABELS_ZH = ['输入', '解码', '对齐', '融合', '打包']

type Lane = {
  key: 'legacy' | 'vane'
  name: string
  mode: string
  note: string
  gpuState: 'IDLE' | 'FULL'
  gpuNote: string
}

const LANES_EN: Lane[] = [
  {
    key: 'legacy',
    name: 'Legacy Pipeline',
    mode: 'serialized waits',
    note: 'GPU work starts only after CPU decode and full-clip assembly finish.',
    gpuState: 'IDLE',
    gpuNote: 'waiting on CPU stages',
  },
  {
    key: 'vane',
    name: 'Vane Pipeline',
    mode: 'overlapped streaming',
    note: 'CPU decode, dynamic batching, and GPU inference stay overlapped.',
    gpuState: 'FULL',
    gpuNote: 'CPU and GPU overlap',
  },
]

const LANES_ZH: Lane[] = [
  {
    key: 'legacy',
    name: 'Legacy Pipeline',
    mode: '串行等待',
    note: 'GPU 工作要等 CPU 解码和完整片段组装完成后才开始。',
    gpuState: 'IDLE',
    gpuNote: '等待 CPU 阶段',
  },
  {
    key: 'vane',
    name: 'Vane Pipeline',
    mode: 'overlapped streaming',
    note: 'CPU 解码、dynamic batching 和 GPU 推理保持重叠。',
    gpuState: 'FULL',
    gpuNote: 'CPU 与 GPU 重叠',
  },
]

function GpuBars() {
  return (
    <span className="tl-gpu-bars" aria-hidden="true">
      <i /><i /><i /><i /><i />
    </span>
  )
}

function GpuCard({ lane }: { lane: Lane }) {
  return (
    <div className={`tl-gpu-card ${lane.key}`}>
      <span>GPU</span>
      <b>{lane.gpuState}</b>
      <GpuBars />
      <small>{lane.gpuNote}</small>
    </div>
  )
}

function LegacyExecution({ locale }: { locale: ReturnType<typeof useSiteLocale> }) {
  const copy = pickLocale(
    locale,
    {
      aria: 'Legacy waits for the full clip before GPU inference',
      waiting: 'waiting for full clip',
      cpu: 'CPU decode',
      gpu: 'GPU infer',
    },
    {
      aria: 'Legacy 在 GPU 推理前等待完整片段',
      waiting: '等待完整片段',
      cpu: 'CPU 解码',
      gpu: 'GPU 推理',
    },
  )

  return (
    <div className="tl-exec-main legacy">
      <div className="tl-hold-status" aria-label={copy.aria}>
        <span>{copy.waiting}</span>
        <i aria-hidden="true"><span /></i>
      </div>
      <div className="tl-work-row legacy">
        <span className="tl-work-card cpu">{copy.cpu}</span>
        <span className="tl-gap-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="tl-work-card gpu">{copy.gpu}</span>
      </div>
    </div>
  )
}

function VaneExecution({ locale }: { locale: ReturnType<typeof useSiteLocale> }) {
  const copy = pickLocale(
    locale,
    {
      aria: 'Vane overlaps CPU decode, dynamic batching, and GPU inference',
      cpu: 'CPU decode',
      batch: 'dynamic batch',
      gpu: 'GPU infer',
    },
    {
      aria: 'Vane 重叠执行 CPU 解码、dynamic batching 和 GPU 推理',
      cpu: 'CPU 解码',
      batch: 'dynamic batching',
      gpu: 'GPU 推理',
    },
  )

  return (
    <div className="tl-exec-main vane" aria-label={copy.aria}>
      <span className="tl-schedule-flow" aria-hidden="true">
        <i className="stream-a" />
        <i className="stream-b" />
        <i className="stream-c" />
        <i className="stream-d" />
      </span>
      <div className="tl-work-row overlap">
        <span className="tl-work-card cpu">{copy.cpu}</span>
        <span className="tl-work-card batch">
          <span>{copy.batch}</span>
          <i aria-hidden="true" />
        </span>
        <span className="tl-work-card gpu">{copy.gpu}</span>
      </div>
    </div>
  )
}

function ExecutionTimeline({ lane, locale }: { lane: Lane; locale: ReturnType<typeof useSiteLocale> }) {
  return (
    <div className={`tl-execution ${lane.key}`} aria-label={`${lane.name} execution timeline`}>
      {lane.key === 'legacy' ? <LegacyExecution locale={locale} /> : <VaneExecution locale={locale} />}
      <GpuCard lane={lane} />
    </div>
  )
}

function ExecutionPanel({ lane, locale }: { lane: Lane; locale: ReturnType<typeof useSiteLocale> }) {
  return (
    <article className={`tl-lane ${lane.key}`}>
      <div className="tl-lane-head">
        <span className={`tl-dot ${lane.key}`} />
        <span className="tl-lane-copy">
          <b>{lane.name}</b>
          <small>{lane.mode}</small>
        </span>
      </div>

      <ExecutionTimeline lane={lane} locale={locale} />

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
      title: 'Legacy queues. Vane keeps the graph occupied.',
      lead: 'The same multimodal training-data pipeline runs on both sides. Legacy execution builds queues between stages; Vane streams media, batches dynamically, and keeps GPU work fed.',
      samePipeline: 'Same pipeline',
      pipelineNote: 'Legacy and Vane run these same stages; the lanes below compare execution.',
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
      title: '传统流水线形成队列，Vane 让执行图保持忙碌。',
      lead: '两边运行的是同一条多模态训练数据流水线。传统执行会在阶段之间堆积队列；Vane 让媒体保持 streaming，执行 dynamic batching，并持续喂饱 GPU 工作。',
      samePipeline: '同一条流水线',
      pipelineNote: 'Legacy 和 Vane 运行相同阶段；下面两条泳道对比执行方式。',
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
                <img src="/img/use-cases/hero-driving-intersection.webp" alt={copy.imageAlt} />
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
              <ExecutionPanel lane={lane} locale={locale} key={lane.key} />
            ))}
          </div>
        </Box>
      </div>
    </section>
  )
}
