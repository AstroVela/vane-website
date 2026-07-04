const INPUTS = [
  { label: 'contract.pdf', meta: 'PDF', tone: 'pdf' },
  { label: 'inspection photo', meta: 'image', tone: 'image' },
  { label: 'video frame', meta: 'video', tone: 'video' },
  { label: 'call audio', meta: 'audio', tone: 'audio' },
  { label: 'spreadsheet', meta: 'table', tone: 'sheet' },
  { label: 'system log', meta: 'log', tone: 'log' },
]

const OUTPUTS = [
  { title: 'insights', detail: 'structured signals and issues' },
  { title: 'evidence', detail: 'document · rule · source URI' },
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

function VaneCore() {
  return (
    <div className="eca-vane-core">
      <div className="eca-vane-mark">
        <strong>Vane</strong>
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
    <div className="enterprise-context-stage" aria-label="Enterprise multimodal materials flow">
      <section className="eca-input-world" aria-label="Messy multimodal materials">
        <p className="eca-stage-label">messy materials</p>
        <div className="eca-source-stack">
          {INPUTS.map((input) => <SourceCard key={input.label} {...input} />)}
        </div>
      </section>

      <section className="eca-vane-world" aria-label="Vane">
        <VaneCore />
      </section>

      <section className="eca-output-world" aria-label="Outputs">
        <p className="eca-stage-label">outputs</p>
        <AgentReadyPanel />
      </section>

      <svg className="eca-static-arrows" viewBox="0 0 640 330" aria-hidden="true">
        <defs>
          <marker id="eca-arrow-head" viewBox="0 0 8 8" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" />
          </marker>
        </defs>
        <path className="eca-static-arrow arrow-input" d="M214 166 C232 142 246 146 264 154" />
        <path className="eca-static-arrow arrow-output" d="M376 154 C394 138 412 130 430 126" />
      </svg>
    </div>
  )
}
