import Box from './Box'
import Eyebrow from './Eyebrow'

/* Site-native execution-timeline diagram: the shared multimodal pipeline is
   drawn once as a columnar flow, then Legacy and Vane execution are compared
   as wait/idle vs overlapped/full-GPU lanes. */

/* The pipeline as a convergent left-to-right flow; each inner array is one
   column, arrows are drawn between columns. */
const PIPELINE: string[][] = [
  ['camera frames', 'LiDAR sweeps', 'radar returns', 'ego pose + calib'],
  ['decode frames', 'load sweeps'],
  ['time sync', 'ego-pose align'],
  ['sensor projection'],
  ['label + track', 'sample embed'],
]

const PIPELINE_LABELS = ['inputs', 'decode', 'align', 'fuse', 'package']

type Lane = {
  key: 'legacy' | 'vane'
  name: string
  mode: string
  note: string
  gpuState: 'IDLE' | 'FULL'
  gpuNote: string
}

const LANES: Lane[] = [
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

function LegacyExecution() {
  return (
    <div className="tl-exec-main legacy">
      <div className="tl-hold-status" aria-label="Legacy waits for the full clip before GPU inference">
        <span>waiting for full clip</span>
        <i aria-hidden="true"><span /></i>
      </div>
      <div className="tl-work-row legacy">
        <span className="tl-work-card cpu">CPU decode</span>
        <span className="tl-gap-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="tl-work-card gpu">GPU infer</span>
      </div>
    </div>
  )
}

function VaneExecution() {
  return (
    <div className="tl-exec-main vane" aria-label="Vane overlaps CPU decode, dynamic batching, and GPU inference">
      <span className="tl-schedule-flow" aria-hidden="true">
        <i className="stream-a" />
        <i className="stream-b" />
        <i className="stream-c" />
        <i className="stream-d" />
      </span>
      <div className="tl-work-row overlap">
        <span className="tl-work-card cpu">CPU decode</span>
        <span className="tl-work-card batch">
          <span>dynamic batch</span>
          <i aria-hidden="true" />
        </span>
        <span className="tl-work-card gpu">GPU infer</span>
      </div>
    </div>
  )
}

function ExecutionTimeline({ lane }: { lane: Lane }) {
  return (
    <div className={`tl-execution ${lane.key}`} aria-label={`${lane.name} execution timeline`}>
      {lane.key === 'legacy' ? <LegacyExecution /> : <VaneExecution />}
      <GpuCard lane={lane} />
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

      <ExecutionTimeline lane={lane} />

      <p className="tl-note">{lane.note}</p>
    </article>
  )
}

export default function TrainingDataFactoryAnimation() {
  return (
    <section className="section training-data-factory" aria-label="Execution timeline">
      <div className="wrap">
        <div className="shead">
          <Eyebrow>Execution timeline</Eyebrow>
          <h2 className="h2">Legacy queues. Vane keeps the graph occupied.</h2>
          <p className="lead">
            The same multimodal training-data pipeline runs on both sides. Legacy execution builds queues between stages; Vane streams media, batches dynamically, and keeps GPU work fed.
          </p>
        </div>

        <Box className="tl-board">
          <div className="tl-pipeline">
            <div className="tl-pipeline-head">
              <span className="tl-kicker">Same pipeline</span>
              <span className="tl-pipeline-note">Legacy and Vane run these same stages; the lanes below compare execution.</span>
            </div>
            <div className="tl-flow">
              <figure className="tl-sample">
                <img src="/img/use-cases/hero-driving-intersection.webp" alt="Camera frame at an urban intersection" />
                <figcaption>camera frame · ts 00:14.280</figcaption>
              </figure>
              <div className="tl-flow-main" aria-label="Multimodal training-data pipeline stages">
                {PIPELINE.map((column, index) => (
                  <div className="tl-flow-step" key={PIPELINE_LABELS[index]}>
                    <span className="tl-mini-label">{PIPELINE_LABELS[index]}</span>
                    <div className="tl-step-items">
                      {column.map((label) => (
                        <span className={index === 0 ? 'tl-chip' : 'tl-stage'} key={label}>
                          {label}
                        </span>
                      ))}
                    </div>
                    {index < PIPELINE.length - 1 && <span className="tl-flow-arrow" aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tl-divider" aria-hidden="true" />

          <div className="tl-lanes">
            {LANES.map((lane) => (
              <ExecutionPanel lane={lane} key={lane.key} />
            ))}
          </div>
        </Box>
      </div>
    </section>
  )
}
