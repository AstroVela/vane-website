import Eyebrow from './Eyebrow'

const INPUTS = [
  { label: 'contract.pdf', meta: 'PDF', tone: 'pdf' },
  { label: 'inspection photo', meta: 'image', tone: 'image' },
  { label: 'video frame', meta: 'video', tone: 'video' },
  { label: 'call audio', meta: 'audio', tone: 'audio' },
  { label: 'spreadsheet', meta: 'table', tone: 'sheet' },
  { label: 'system log', meta: 'log', tone: 'log' },
]

const DAG_NODES = [
  { label: 'Parse documents', className: 'parse-docs' },
  { label: 'Decode media', className: 'media' },
  { label: 'Normalize tables', className: 'tables' },
  { label: 'Parse logs/events', className: 'logs' },
  { label: 'Evidence units', className: 'evidence' },
  { label: 'Structured signals', className: 'signals' },
  { label: 'Apply rules & package', className: 'package' },
]

const OUTPUTS = [
  { title: 'insights', detail: 'structured signals and issues' },
  { title: 'evidence', detail: 'file · chunk · quote · confidence' },
  { title: 'recommendations', detail: 'next action with rule context' },
]

function SourceVisual({ tone }: { tone: string }) {
  if (tone === 'image') {
    return (
      <div className="eca-media-grid" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
    )
  }

  if (tone === 'video') {
    return (
      <>
        <div className="eca-video-strip" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        <div className="eca-doc-lines" aria-hidden="true">
          <i /><i /><i />
        </div>
      </>
    )
  }

  if (tone === 'audio') {
    return (
      <div className="eca-waveform" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i /><i />
      </div>
    )
  }

  if (tone === 'log') {
    return (
      <div className="eca-log-lines" aria-hidden="true">
        <span>2026-06-30 10:42:18 event.ingest</span>
        <span>source=workflow status=queued</span>
        <span>policy.rule matched=true</span>
      </div>
    )
  }

  return (
    <>
      <div className="eca-doc-lines" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <div className="eca-doc-grid" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>
    </>
  )
}

function SourceCard({ label, meta, tone }: { label: string; meta: string; tone: string }) {
  return (
    <article className={`eca-source-card eca-${tone}`}>
      <header>
        <span>{label}</span>
        <b>{meta}</b>
      </header>
      <SourceVisual tone={tone} />
    </article>
  )
}

function VaneDag() {
  return (
    <div className="eca-vane-core">
      <div className="eca-vane-mark">
        <strong>Vane</strong>
        <span>Vane multimodal compute</span>
      </div>

      <svg className="eca-dag-lines" viewBox="0 0 375 345" aria-hidden="true">
        <path className="eca-dag-edge edge-docs-evidence" d="M112 68 C128 68 129 99 145 99" />
        <path className="eca-dag-edge edge-media-evidence" d="M112 130 C128 130 129 99 145 99" />
        <path className="eca-dag-edge edge-tables-signals" d="M112 192 C128 192 129 223 145 223" />
        <path className="eca-dag-edge edge-logs-signals" d="M112 254 C128 254 129 223 145 223" />
        <path className="eca-dag-edge edge-evidence-package" d="M243 99 C258 99 245 161 260 161" />
        <path className="eca-dag-edge edge-signals-package" d="M243 223 C258 223 245 161 260 161" />
      </svg>

      <div className="eca-dag-nodes">
        {DAG_NODES.map((node) => (
          <span className={`eca-dag-node ${node.className}`} key={node.label}>{node.label}</span>
        ))}
      </div>

      <div className="eca-dag-tokens" aria-hidden="true">
        <span className="eca-dag-token token-docs" />
        <span className="eca-dag-token token-media" />
        <span className="eca-dag-token token-tables" />
        <span className="eca-dag-token token-logs" />
        <span className="eca-dag-token token-evidence" />
        <span className="eca-dag-token token-signals" />
      </div>
    </div>
  )
}

function AgentReadyPanel() {
  return (
    <article className="eca-agent-panel">
      <header>
        <span>Agent-ready outputs</span>
        <b>context attached</b>
      </header>
      <div className="eca-agent-input">
        <i />
        <span>Context attached</span>
      </div>
      <ol className="eca-agent-trace">
        <li><i /><span>Context received</span></li>
        <li><i /><span>Evidence checked</span></li>
        <li><i /><span>Recommendation prepared</span></li>
      </ol>
      <div className="eca-output-stack">
        {OUTPUTS.map((output) => (
          <article className="eca-output-card" key={output.title}>
            <strong>{output.title}</strong>
            <span>{output.detail}</span>
          </article>
        ))}
      </div>
    </article>
  )
}

export default function EnterpriseContextAnimation() {
  return (
    <section className="section enterprise-context-animation" aria-label="Multimodal context pipeline">
      <div className="wrap">
        <div className="shead">
          <Eyebrow>Context pipeline</Eyebrow>
          <h2 className="h2">Multimodal context pipeline</h2>
          <p className="lead">
            PDFs, images, video, audio, forms, spreadsheets, logs, and documents flow through one Vane pipeline into auditable context for AI workflows.
          </p>
        </div>

        <div className="enterprise-context-scroll">
          <div className="enterprise-context-stage">
            <section className="eca-input-world" aria-label="Messy multimodal materials">
              <p className="eca-stage-label">messy materials</p>
              <div className="eca-source-stack">
                {INPUTS.map((input) => <SourceCard key={input.label} {...input} />)}
              </div>
            </section>

            <section className="eca-vane-world" aria-label="Vane multimodal compute">
              <VaneDag />
            </section>

            <section className="eca-output-world" aria-label="Outputs">
              <p className="eca-stage-label">outputs</p>
              <AgentReadyPanel />
            </section>

            <svg className="eca-motion-lines" viewBox="0 0 1180 560" aria-hidden="true">
              <path className="eca-motion-line line-input" d="M248 282 C328 236 406 224 484 264" />
              <path className="eca-motion-line line-output" d="M696 280 C792 224 910 206 1038 220" />
              <circle className="eca-motion-dot dot-input" cx="248" cy="282" r="6" />
              <circle className="eca-motion-dot dot-vane" cx="484" cy="264" r="7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
