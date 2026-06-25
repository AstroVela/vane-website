import Box from './Box'

type Tone = 'data' | 'agent' | 'rl'

type IconName =
  | 'sensor'
  | 'table'
  | 'document'
  | 'media'
  | 'video'
  | 'audio'
  | 'event'
  | 'embedding'
  | 'database'
  | 'robot'
  | 'trend'
  | 'package'
  | 'folder'
  | 'list'
  | 'loop'
  | 'layers'
  | 'stream'
  | 'chip'
  | 'cloud'
  | 'local'
  | 'ray'

const INPUTS: Array<{ label: string; icon: IconName }> = [
  { label: 'Sensors', icon: 'sensor' },
  { label: 'Tables', icon: 'table' },
  { label: 'Documents', icon: 'document' },
  { label: 'Images', icon: 'media' },
  { label: 'Video', icon: 'video' },
  { label: 'Audio', icon: 'audio' },
  { label: 'Events', icon: 'event' },
  { label: 'Embeddings', icon: 'embedding' },
]

const PILLARS: Array<{
  tone: Tone
  name: string
  tagline: string
  icon: IconName
  capabilities: string[]
  status?: string
}> = [
  {
    tone: 'data',
    name: 'Vane Data',
    tagline: 'Multimodal data processing',
    icon: 'database',
    capabilities: ['Ingest', 'Parse', 'Transform', 'Infer', 'Enrich', 'Package'],
    status: 'Available now',
  },
  {
    tone: 'agent',
    name: 'Vane Agent',
    tagline: 'Always-on agent framework',
    icon: 'robot',
    capabilities: ['Observe', 'Reason', 'Act', 'Memory', 'Long-running Tasks'],
    status: 'Coming soon',
  },
  {
    tone: 'rl',
    name: 'Vane RL',
    tagline: 'RL for embodied AI',
    icon: 'trend',
    capabilities: ['Rollout', 'Trajectory', 'Reward', 'Training', 'Evaluation'],
    status: 'Coming soon',
  },
]

const OUTPUTS: Array<{ label: string; icon: IconName }> = [
  { label: 'Model-ready Multimodal Assets', icon: 'package' },
  { label: 'Grounded Context Packages', icon: 'folder' },
  { label: 'Agent Actions & Recommendations', icon: 'list' },
  { label: 'Trajectory & Learning Updates', icon: 'loop' },
]

const CORE_FEATURES: Array<{ title: string; copy: string; icon: IconName }> = [
  {
    title: 'Unified Multimodal Data Type',
    copy: 'Sensors, metadata, lineage, and model artifacts under one execution semantics.',
    icon: 'layers',
  },
  {
    title: 'Streaming + Backpressure + Dynamic Batching',
    copy: 'Continuous flow for large objects with adaptive batching and pressure control.',
    icon: 'stream',
  },
  {
    title: 'Overlapped Heterogeneous Execution',
    copy: 'CPU, GPU, IO, and model inference overlap through asynchronous scheduling.',
    icon: 'chip',
  },
  {
    title: 'Edge-Cloud Coordination',
    copy: 'The same pipeline runs across local devices and Ray clusters.',
    icon: 'cloud',
  },
]

function ArchitectureIcon({ name }: { name: IconName }) {
  switch (name) {
    case 'sensor':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.5 6.5a8 8 0 0 1 11 0" />
          <path d="M5 9a4.5 4.5 0 0 1 6 0" />
          <circle cx="8" cy="11.6" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'table':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="9" rx="1" />
          <path d="M2.5 7h11M8 3.5v9" />
        </svg>
      )
    case 'document':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 2.5h4.3L12 6v7.5H4z" />
          <path d="M8.3 2.5V6H12" />
          <path d="M5.8 8.6h4.4M5.8 10.8h4.4" />
        </svg>
      )
    case 'media':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="9" rx="1" />
          <circle cx="6" cy="7" r="1.1" />
          <path d="M3 12l3-2.5 2.2 1.8L11 8l2.5 2" />
        </svg>
      )
    case 'video':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="4" width="8" height="8" rx="1" />
          <path d="M10.5 6.5 13.5 5v6l-3-1.5z" />
          <path d="M5.2 6.6 8 8 5.2 9.4z" />
        </svg>
      )
    case 'audio':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 7v2M6 4.5v7M9 2.5v11M12 6v4" />
        </svg>
      )
    case 'event':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 4L2.5 8 6 12M10 4l3.5 4-3.5 4" />
        </svg>
      )
    case 'embedding':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" className="pa-fill-icon">
          <circle cx="4" cy="5" r="1" />
          <circle cx="8" cy="3.5" r="1" />
          <circle cx="12" cy="5.5" r="1" />
          <circle cx="5.5" cy="9" r="1" />
          <circle cx="10.5" cy="9" r="1" />
          <circle cx="8" cy="12.5" r="1" />
        </svg>
      )
    case 'database':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <ellipse cx="8" cy="4" rx="4.5" ry="1.8" />
          <path d="M3.5 4v8c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8V4" />
          <path d="M3.5 8c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8" />
        </svg>
      )
    case 'robot':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="3.5" y="5" width="9" height="7.5" rx="1.5" />
          <path d="M8 2.4v2.6" />
          <circle cx="8" cy="2.2" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="6.2" cy="8.3" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="9.8" cy="8.3" r="0.85" fill="currentColor" stroke="none" />
          <path d="M6.3 10.5h3.4" />
        </svg>
      )
    case 'trend':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 3v10h10" />
          <path d="M5 10l2.3-2.6 2 1.8L13 5" />
        </svg>
      )
    case 'package':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2.5l5 2.6v5.8L8 13.5 3 10.9V5.1z" />
          <path d="M3 5.1L8 7.7l5-2.6M8 7.7v5.8" />
        </svg>
      )
    case 'folder':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.5 4.5h4l1.2 1.5h5.8v6.5h-11z" />
          <path d="M6 9.5l1.6 1.6L10.5 8" />
        </svg>
      )
    case 'list':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5.5 4.5h7M5.5 8h7M5.5 11.5h4.5" />
          <circle cx="2.8" cy="4.5" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="2.8" cy="8" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="2.8" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'loop':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M12.6 6A5 5 0 1 0 13 9.3" />
          <path d="M13 3.2V6h-2.7" />
        </svg>
      )
    case 'layers':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2.5l5.5 2.7L8 7.9 2.5 5.2z" />
          <path d="M2.5 8.2L8 10.9l5.5-2.7" />
          <path d="M2.5 10.9L8 13.6l5.5-2.7" />
        </svg>
      )
    case 'stream':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.5 5h9M2.5 8h11M2.5 11h7" />
        </svg>
      )
    case 'chip':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
          <path d="M6.5 2v2.5M9.5 2v2.5M6.5 11.5V14M9.5 11.5V14M2 6.5h2.5M2 9.5h2.5M11.5 6.5H14M11.5 9.5H14" />
        </svg>
      )
    case 'cloud':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 12h6a2.6 2.6 0 0 0 .4-5.2A3.6 3.6 0 0 0 4.6 7 2.6 2.6 0 0 0 5 12z" />
        </svg>
      )
    case 'local':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2" y="3" width="12" height="8" rx="1" />
          <path d="M6 13.5h4M8 11v2.5" />
        </svg>
      )
    case 'ray':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="3.5" cy="3.5" r="1.6" />
          <circle cx="12.5" cy="3.5" r="1.6" />
          <circle cx="8" cy="12.5" r="1.6" />
          <path d="M4.8 4.6 7 11M11.2 4.6 9 11M5 3.5h6" />
        </svg>
      )
  }
}

function Connector({ tone }: { tone: 'data' | 'rl' }) {
  return (
    <div className={`pa-connector pa-tone-${tone}`} aria-hidden="true">
      <span />
    </div>
  )
}

function IconChip({ icon, tone }: { icon: IconName; tone: Tone }) {
  return (
    <span className={`pa-icon-chip pa-tone-${tone}`}>
      <ArchitectureIcon name={icon} />
    </span>
  )
}

export default function PlatformArchitecture() {
  return (
    <Box className="platform-arch">
      <div className="pa-grid">
        <div className="pa-rail pa-input-rail">
          <div className="pa-rail-head">
            <span className="pa-dot pa-tone-data" />
            Multimodal Inputs
          </div>
          <div className="pa-rail-items">
            {INPUTS.map((item) => (
              <div className="pa-rail-item" key={item.label}>
                <IconChip icon={item.icon} tone="data" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Connector tone="data" />

        <div className="pa-platform">
          <div className="pa-platform-head">
            <h3>VANE</h3>
          </div>

          <div className="pa-pillars">
            {PILLARS.map((pillar) => (
              <div className={`pa-pillar pa-tone-${pillar.tone}`} key={pillar.name}>
                <IconChip icon={pillar.icon} tone={pillar.tone} />
                <div>
                  <div className="pa-pillar-head">
                    <h4>{pillar.name}</h4>
                    {pillar.status ? <b>{pillar.status}</b> : null}
                    <span>{pillar.tagline}</span>
                  </div>
                  <div className="pa-capabilities">
                    {pillar.capabilities.map((capability) => (
                      <span key={capability}>{capability}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Connector tone="rl" />

        <div className="pa-rail pa-output-rail">
          <div className="pa-rail-head pa-rail-head-end">
            Outputs / Outcomes
            <span className="pa-dot pa-tone-rl" />
          </div>
          <div className="pa-rail-items">
            {OUTPUTS.map((item) => (
              <div className="pa-rail-item pa-output-item" key={item.label}>
                <IconChip icon={item.icon} tone="rl" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pa-core">
        <div className="pa-core-head">
          <div>
            <h3>Vane Core</h3>
          </div>
          <div className="pa-runtime-pills">
            <span><ArchitectureIcon name="local" />Local Runtime</span>
            <b>+</b>
            <span><ArchitectureIcon name="ray" />Ray Runtime</span>
          </div>
        </div>

        <div className="pa-core-features">
          {CORE_FEATURES.map((feature) => (
            <div className="pa-core-feature" key={feature.title}>
              <div className="pa-core-feature-head">
                <span className="pa-core-icon"><ArchitectureIcon name={feature.icon} /></span>
                <h4>{feature.title}</h4>
              </div>
              <p>{feature.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </Box>
  )
}
