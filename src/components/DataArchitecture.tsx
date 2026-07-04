import Box from './Box'

/* Vane Data overview: multimodal inputs -> the Vane Data engine -> model-ready
   outputs, over the shared Vane Core runtime panel. A Data-scoped companion to
   PlatformArchitecture; it reuses the same card anatomy and the `.pa-core`
   panel (identical content), and reflows to a vertical stack in the narrow
   docs column. */

type IconName =
  | 'sensors'
  | 'table'
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'events'
  | 'embeddings'
  | 'model'
  | 'graph'
  | 'chip'
  | 'cloud'
  | 'cube'
  | 'folder'
  | 'list'
  | 'loop'
  | 'database'
  | 'layers'
  | 'stream'
  | 'local'
  | 'ray'

const INPUTS: Array<{ icon: IconName; label: string }> = [
  { icon: 'sensors', label: 'Sensors' },
  { icon: 'table', label: 'Tables' },
  { icon: 'document', label: 'Documents' },
  { icon: 'image', label: 'Images' },
  { icon: 'video', label: 'Video' },
  { icon: 'audio', label: 'Audio' },
  { icon: 'events', label: 'Events' },
  { icon: 'embeddings', label: 'Embeddings' },
]

const OUTPUTS: Array<{ icon: IconName; label: string }> = [
  { icon: 'cube', label: 'Model-ready Multimodal Assets' },
  { icon: 'folder', label: 'Grounded Context Packages' },
  { icon: 'list', label: 'Agent Actions & Recommendations' },
  { icon: 'loop', label: 'Trajectory & Learning Updates' },
]

const STAGES = ['Ingest', 'Parse', 'Transform', 'Infer', 'Enrich', 'Package']

const CAPABILITIES: Array<{ icon: IconName; title: string; art: ArtName }> = [
  { icon: 'model', title: 'Native Multimodal Data Model', art: 'modalities' },
  { icon: 'graph', title: 'Compute + Inference Operator Graph', art: 'operators' },
  { icon: 'chip', title: 'Parallel CPU-GPU-IO Execution', art: 'compute' },
  { icon: 'cloud', title: 'Edge-to-Cloud Deployment', art: 'edge' },
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

function Icon({ name }: { name: IconName }) {
  switch (name) {
    case 'sensors':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.6 6.4a8 8 0 0 1 10.8 0" />
          <path d="M4.6 8.8a5 5 0 0 1 6.8 0" />
          <path d="M6.5 11a2.3 2.3 0 0 1 3 0" />
          <circle cx="8" cy="12.7" r="0.85" fill="currentColor" stroke="none" />
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
    case 'image':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" />
          <circle cx="6" cy="7" r="1.1" />
          <path d="M3 12l3-2.5 2.2 1.8L11 8l2.5 2" />
        </svg>
      )
    case 'video':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" />
          <path d="M6.8 6.1 10.3 8l-3.5 1.9z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'audio':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 6.5v3M6 4.5v7M8.5 3v10M11 5.5v5M13.2 7v2" />
        </svg>
      )
    case 'events':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 4L2.5 8 6 12M10 4l3.5 4-3.5 4" />
        </svg>
      )
    case 'embeddings':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <g fill="currentColor" stroke="none">
            <circle cx="4" cy="5" r="1" />
            <circle cx="8" cy="3.6" r="1" />
            <circle cx="11.8" cy="5.4" r="1" />
            <circle cx="5.4" cy="9" r="1" />
            <circle cx="9.4" cy="8.4" r="1" />
            <circle cx="12.4" cy="10.6" r="1" />
            <circle cx="4.2" cy="12.4" r="1" />
            <circle cx="8.6" cy="12.2" r="1" />
          </g>
        </svg>
      )
    case 'model':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 3.5 11.9 5.75v4.5L8 12.5 4.1 10.25v-4.5z" />
          <circle cx="8" cy="3.5" r="1.1" className="da-node" />
          <circle cx="11.9" cy="5.75" r="1.1" className="da-node" />
          <circle cx="11.9" cy="10.25" r="1.1" className="da-node" />
          <circle cx="8" cy="12.5" r="1.1" className="da-node" />
          <circle cx="4.1" cy="10.25" r="1.1" className="da-node" />
          <circle cx="4.1" cy="5.75" r="1.1" className="da-node" />
        </svg>
      )
    case 'graph':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 3.2 3.8 11.4h8.4z" />
          <circle cx="8" cy="3.2" r="1.8" className="da-node" />
          <circle cx="3.8" cy="11.4" r="1.8" className="da-node" />
          <circle cx="12.2" cy="11.4" r="1.8" className="da-node" />
        </svg>
      )
    case 'chip':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
          <rect x="6.7" y="6.7" width="2.6" height="2.6" />
          <path d="M6.5 2v2.5M9.5 2v2.5M6.5 11.5V14M9.5 11.5V14M2 6.5h2.5M2 9.5h2.5M11.5 6.5H14M11.5 9.5H14" />
        </svg>
      )
    case 'cloud':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 12h6a2.6 2.6 0 0 0 .4-5.2A3.6 3.6 0 0 0 4.6 7 2.6 2.6 0 0 0 5 12z" />
        </svg>
      )
    case 'cube':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2.3 13.4 5v6L8 13.7 2.6 11V5z" />
          <path d="M2.7 5.1 8 7.8l5.3-2.7M8 7.8v5.7" />
        </svg>
      )
    case 'folder':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.5 4.6h3.5l1.2 1.5h6.3v6.8h-11z" />
          <path d="M2.5 6.1h11" />
        </svg>
      )
    case 'list':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5.6 5h7.4M5.6 8h7.4M5.6 11h7.4" />
          <g fill="currentColor" stroke="none">
            <circle cx="3.1" cy="5" r="0.85" />
            <circle cx="3.1" cy="8" r="0.85" />
            <circle cx="3.1" cy="11" r="0.85" />
          </g>
        </svg>
      )
    case 'loop':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2 7.3v-.6a2.7 2.7 0 0 1 2.7-2.7H14" />
          <path d="m11.3 1.3 2.7 2.7-2.7 2.7" />
          <path d="M14 8.7v.6a2.7 2.7 0 0 1-2.7 2.7H2" />
          <path d="m4.7 14.7-2.7-2.7 2.7-2.7" />
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
          <path d="M2.5 5h11M2.5 8h11M2.5 11h11" />
          <circle cx="10.2" cy="5" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="5.4" cy="8" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="8.4" cy="11" r="1.25" fill="currentColor" stroke="none" />
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

type ArtName = 'modalities' | 'operators' | 'compute' | 'edge'

/* The right-hand illustration for each engine capability row. */
function CapabilityArt({ name }: { name: ArtName }) {
  if (name === 'modalities') {
    return (
      <div className="da-cap-art da-art-modalities" aria-hidden="true">
        <Icon name="document" />
        <Icon name="image" />
        <Icon name="audio" />
        <Icon name="events" />
        <Icon name="table" />
        <Icon name="embeddings" />
      </div>
    )
  }
  if (name === 'operators') {
    return (
      <div className="da-cap-art" aria-hidden="true">
        <svg className="da-art-operators" viewBox="0 0 232 44" fill="none">
          <path d="M38 9 66 31M71 29l11-6" />
          <path d="M94 22h16M103 17l8 5-8 5" />
          <path className="da-art-dash" d="M126 22 148 9M126 22l22 13M160 9l24 13M160 35l24-13M196 22h12" />
          <path d="M202 18l7 4-7 4" />
          <circle cx="38" cy="9" r="5.4" className="da-node" />
          <circle cx="66" cy="31" r="5.4" className="da-node" />
          <circle cx="88" cy="22" r="5.4" className="da-node" />
          <rect x="112" y="15" width="14" height="14" className="da-op" />
          <circle cx="154" cy="9" r="5.4" className="da-node" />
          <circle cx="154" cy="35" r="5.4" className="da-node" />
          <circle cx="190" cy="22" r="5.4" className="da-node" />
          <rect x="214" y="15" width="14" height="14" className="da-op" />
        </svg>
      </div>
    )
  }
  if (name === 'compute') {
    return (
      <div className="da-cap-art da-art-compute" aria-hidden="true">
        <span className="da-tag">CPU</span>
        <b>↔</b>
        <span className="da-tag">GPU</span>
        <b>↔</b>
        <Icon name="database" />
      </div>
    )
  }
  return (
    <div className="da-cap-art" aria-hidden="true">
      <svg className="da-art-edge" viewBox="0 0 196 52" fill="none">
        <path d="M22 27h28M35 15v12" />
        <circle cx="35" cy="10" r="3" className="da-node" />
        <rect x="16" y="27" width="38" height="14" rx="1.5" />
        <path d="M25 34h3M34 34h3M43 34h3" />
        <path d="M76 26h42M109 17l9 9-9 9M85 17l-9 9 9 9" />
        <path d="M151 40h22a13 13 0 0 0 1.4-25.9A18 18 0 0 0 140 18.2 11 11 0 0 0 151 40z" />
        <rect x="148" y="24" width="28" height="8" rx="1.3" />
        <rect x="148" y="32" width="28" height="8" rx="1.3" />
        <path d="M153 28h2M153 36h2M169 28h2M169 36h2" />
      </svg>
    </div>
  )
}

/* Decorative dotted node mesh down the engine's left edge — the "many inputs
   converge into one model" motif from the mockup. Stretched to the caps height
   via preserveAspectRatio="none"; the small nodes tolerate the vertical scale. */
function DataMesh() {
  return (
    <svg className="da-mesh" viewBox="0 0 40 240" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="da-mesh-link"
        d="M9 26 31 68M9 26 31 118M9 74 31 68M9 74 31 118M9 74 31 168M9 122 31 118M9 122 31 168M9 122 31 214M9 170 31 168M9 170 31 214M9 218 31 168M9 218 31 214"
      />
      <g className="da-mesh-node">
        <circle cx="9" cy="26" r="3.4" />
        <circle cx="9" cy="74" r="3.4" />
        <circle cx="9" cy="122" r="3.4" />
        <circle cx="9" cy="170" r="3.4" />
        <circle cx="9" cy="218" r="3.4" />
        <circle cx="31" cy="68" r="3.4" />
        <circle cx="31" cy="118" r="3.4" />
        <circle cx="31" cy="168" r="3.4" />
        <circle cx="31" cy="214" r="3.4" />
      </g>
    </svg>
  )
}

export default function DataArchitecture() {
  return (
    <Box className="data-arch">
      <div className="da-labels">
        <span className="da-label">Multimodal Inputs</span>
        <span className="da-label da-label-end">Outputs / Outcomes</span>
      </div>

      <div className="da-flow">
        <div className="da-io da-inputs">
          {INPUTS.map((item) => (
            <div className="da-io-card" key={item.label}>
              <span className="da-io-ic"><Icon name={item.icon} /></span>
              <span className="da-io-label">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="da-arrow" aria-hidden="true">→</div>

        <div className="da-engine">
          <h3 className="da-engine-name">Vane Data</h3>
          <div className="da-engine-panel">
            <div className="da-engine-body">
              <DataMesh />
              <div className="da-caps">
                {CAPABILITIES.map((cap) => (
                  <div className="da-cap" key={cap.title}>
                    <span className="da-cap-ic"><Icon name={cap.icon} /></span>
                    <span className="da-cap-title">{cap.title}</span>
                    <CapabilityArt name={cap.art} />
                  </div>
                ))}
              </div>
            </div>
            <div className="da-stages">
              {STAGES.map((stage) => (
                <span key={stage}>{stage}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="da-arrow" aria-hidden="true">→</div>

        <div className="da-io da-outputs">
          {OUTPUTS.map((item) => (
            <div className="da-io-card" key={item.label}>
              <span className="da-io-ic"><Icon name={item.icon} /></span>
              <span className="da-io-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pa-core">
        <div className="pa-core-head">
          <h3>Vane Core</h3>
          <div className="pa-runtime-pills">
            <span><Icon name="local" />Local Runtime</span>
            <b>+</b>
            <span><Icon name="ray" />Ray Runtime</span>
          </div>
        </div>

        <div className="pa-core-features">
          {CORE_FEATURES.map((feature) => (
            <div className="pa-core-feature" key={feature.title}>
              <div className="pa-core-feature-head">
                <span className="pa-core-icon"><Icon name={feature.icon} /></span>
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
