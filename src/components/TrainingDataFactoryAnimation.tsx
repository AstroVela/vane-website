import Eyebrow from './Eyebrow'

const inputCards = [
  ['video', 'camera frames'],
  ['lidar', 'LiDAR sweeps'],
  ['pose', 'radar returns'],
  ['can', 'ego pose + calib'],
]

const legacyLinkPaths = [
  'M 129 24 C 137 24 137 29 146 29',
  'M 129 66 C 137 66 137 83 146 83',
  'M 129 108 C 137 108 137 83 146 83',
  'M 129 150 C 178 150 224 117 279 117',
  'M 260 29 C 268 29 270 63 279 63',
  'M 260 83 C 268 83 270 63 279 63',
  'M 327 81 C 327 89 336 91 336 99',
  'M 394 117 C 418 117 418 35 400 35',
  'M 459 53 C 459 62 454 64 454 73',
  'M 454 109 C 454 117 454 121 454 129',
]

const vaneLinkPaths = [
  'M 129 24 C 137 24 137 29 146 29',
  'M 129 66 C 137 66 137 83 146 83',
  'M 129 108 C 137 108 137 83 146 83',
  'M 129 150 C 178 150 224 117 279 117',
  'M 260 29 C 268 29 270 63 279 63',
  'M 260 83 C 268 83 270 63 279 63',
  'M 327 81 C 327 89 336 91 336 99',
  'M 394 117 C 384 91 392 61 400 35',
  'M 459 53 C 459 62 454 64 454 73',
  'M 454 109 C 454 117 454 121 454 129',
]

const legacyNodes = [
  ['node-decode', 'decode frames'],
  ['node-load', 'load sweeps'],
  ['node-sync', 'time sync'],
  ['node-label', 'ego-pose align'],
  ['node-project', 'sensor projection'],
  ['node-embed', 'label + track'],
  ['node-manifest', 'sample embed'],
]

const vaneNodes = [
  ['decode', 'decode frames'],
  ['load', 'load sweeps'],
  ['sync', 'time sync'],
  ['project', 'ego-pose align'],
  ['infer', 'sensor projection'],
  ['label', 'label + track'],
  ['embed', 'sample embed'],
]

function InputStack({ label }: { label: string }) {
  return (
    <div className="input-stack" aria-label={label}>
      {inputCards.map(([kind, text]) => (
        <div className={`input-card ${kind}`} key={text}>{text}</div>
      ))}
    </div>
  )
}

function Links({ kind }: { kind: 'legacy' | 'vane' }) {
  const paths = kind === 'vane' ? vaneLinkPaths : legacyLinkPaths

  return (
    <svg className={`${kind}-links`} viewBox="0 0 500 260" aria-hidden="true">
      {paths.map((path) => (
        <path className={`${kind}-link`} d={path} key={path} />
      ))}
    </svg>
  )
}

function HeroSample() {
  return (
    <section className="hero-sample" aria-label="Autonomous driving hero sample">
      <img src="/img/use-cases/hero-driving-intersection.webp" alt="Autonomous driving camera frame at an urban intersection" />
      <div className="sample-shade" />
      <div className="sample-tag raw">camera frame</div>
      <div className="sample-tag time">ts 00:14.280</div>
      <div className="sample-tag lidar">LiDAR projection</div>
      <div className="sample-tag label">vehicle / track 024</div>
      <div className="sample-tag lineage">lineage attached</div>
      <div className="sample-lidar" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => <span key={index} />)}
      </div>
      <svg className="sample-overlay" viewBox="0 0 360 170" aria-hidden="true">
        <rect className="box vehicle-box" x="157" y="78" width="62" height="42" rx="4" />
        <rect className="box cyclist-box" x="275" y="68" width="23" height="47" rx="4" />
        <path className="track-line" d="M188 124 C190 138 194 147 202 157" />
        <g className="embedding-dots">
          <circle cx="285" cy="142" r="3" />
          <circle cx="297" cy="136" r="2.6" />
          <circle cx="308" cy="146" r="2.4" />
          <circle cx="320" cy="139" r="2.8" />
          <circle cx="332" cy="149" r="2.2" />
        </g>
      </svg>
    </section>
  )
}

function QueueStack({ className }: { className: string }) {
  return (
    <span className={className}>
      <i /><i /><i /><i />
    </span>
  )
}

function GpuBars() {
  return (
    <div className="gpu-bars" aria-hidden="true">
      <i /><i /><i /><i /><i />
    </div>
  )
}

function LegacyPanel() {
  return (
    <article className="panel legacy">
      <div className="panel-title">
        <span className="status-dot red" />
        <span>Legacy Pipeline</span>
      </div>

      <InputStack label="Legacy raw inputs" />

      <div className="legacy-workflow">
        <Links kind="legacy" />
        {legacyNodes.map(([className, text]) => (
          <div className={`node ${className}`} key={className}>{text}</div>
        ))}
      </div>

      <div className="queue-buildup" aria-hidden="true">
        <QueueStack className="queue-stack queue-a" />
        <QueueStack className="queue-stack queue-b" />
        <QueueStack className="queue-stack queue-c" />
      </div>

      <div className="legacy-wait">
        <div className="progress-label">waiting for full clip</div>
        <div className="progress-track"><span /></div>
      </div>

      <div className="legacy-wait-row" aria-label="Legacy stage wait">
        <div className="compute cpu">CPU decode</div>
        <div className="wait-dots" aria-hidden="true"><i /><i /><i /></div>
        <div className="compute gpu">GPU infer</div>
      </div>

      <div className="gpu-card legacy-gpu">
        <header>GPU</header>
        <strong>IDLE</strong>
        <GpuBars />
        <small>waiting on CPU stages</small>
      </div>
    </article>
  )
}

function VanePanel() {
  return (
    <article className="panel vane">
      <div className="panel-title">
        <span className="status-dot green" />
        <span>Vane Pipeline</span>
      </div>

      <InputStack label="Vane raw inputs" />

      <div className="vane-dag">
        <Links kind="vane" />
        {vaneNodes.map(([className, text]) => (
          <div className={`node ${className}`} key={className}>{text}</div>
        ))}
      </div>

      <div className="pipeline-occupancy" aria-hidden="true">
        <span className="occupancy-pulse pulse-main" />
        <span className="occupancy-pulse pulse-main pulse-delay-a" />
        <span className="occupancy-pulse pulse-lidar" />
        <span className="occupancy-pulse pulse-lidar pulse-delay-b" />
      </div>

      <div className="compute-row">
        <div className="compute cpu">CPU decode</div>
        <div className="batch">
          <span>dynamic batch</span>
          <i />
        </div>
        <div className="compute gpu">GPU infer</div>
      </div>

      <div className="gpu-card vane-gpu">
        <header>GPU</header>
        <strong>FULL</strong>
        <GpuBars />
        <small>CPU and GPU overlap</small>
      </div>
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

        <div className="factory-stage-scroll">
          <main className="stage" aria-label="Vane autonomous data factory animation">
            <HeroSample />

            <section className="outcome-ledger" aria-label="Performance outcome comparison">
              <div className="ledger-row legacy-ledger">
                <b>Legacy</b>
                <span className="result-badge transfer-result">queue buildup</span>
                <span className="result-badge wait-result">stage wait</span>
                <span className="result-badge gpu-result">GPU feed gap</span>
              </div>
              <div className="ledger-row vane-ledger">
                <b>Vane</b>
                <span className="result-badge transfer-result">steady occupancy</span>
                <span className="result-badge stream-result">streaming frames</span>
                <span className="result-badge balance-result">balanced pipeline</span>
              </div>
            </section>

            <section className="comparison">
              <LegacyPanel />
              <div className="divider" aria-hidden="true" />
              <VanePanel />
            </section>
          </main>
        </div>
      </div>
    </section>
  )
}
