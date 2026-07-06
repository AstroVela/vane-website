import { pickLocale, useSiteLocale } from '../siteI18n'

const INPUTS = [
  { label: 'contract.pdf', labelZh: 'contract.pdf', meta: 'PDF', metaZh: 'PDF', tone: 'pdf' },
  { label: 'inspection photo', labelZh: 'inspection photo', meta: 'image', metaZh: '图像', tone: 'image' },
  { label: 'video frame', labelZh: 'video frame', meta: 'video', metaZh: '视频', tone: 'video' },
  { label: 'call audio', labelZh: 'call audio', meta: 'audio', metaZh: '音频', tone: 'audio' },
  { label: 'spreadsheet', labelZh: 'spreadsheet', meta: 'table', metaZh: '表格', tone: 'sheet' },
  { label: 'system log', labelZh: 'system log', meta: 'log', metaZh: '日志', tone: 'log' },
]

const OUTPUTS = [
  { title: 'insights', titleZh: '洞察', detail: 'structured signals and issues', detailZh: '结构化信号和问题' },
  { title: 'evidence', titleZh: '证据', detail: 'document · rule · source URI', detailZh: '文档 · 规则 · source URI' },
  { title: 'recommendations', titleZh: '建议', detail: 'next action with rule context', detailZh: '带规则上下文的下一步动作' },
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

function AgentReadyPanel({ locale }: { locale: ReturnType<typeof useSiteLocale> }) {
  const copy = pickLocale(
    locale,
    {
      title: 'Agent-ready outputs',
      meta: 'context attached',
      context: 'Context attached',
    },
    {
      title: 'Agent 可用输出',
      meta: '上下文已附加',
      context: '上下文已附加',
    },
  )

  return (
    <article className="eca-agent-panel">
      <header>
        <span>{copy.title}</span>
        <b>{copy.meta}</b>
      </header>
      <div className="eca-agent-input">
        <i />
        <span>{copy.context}</span>
      </div>
      <div className="eca-output-stack">
        {OUTPUTS.map((output) => (
          <article className="eca-output-card" key={output.title}>
            <strong>{pickLocale(locale, output.title, output.titleZh)}</strong>
            <span>{pickLocale(locale, output.detail, output.detailZh)}</span>
          </article>
        ))}
      </div>
    </article>
  )
}

export default function EnterpriseContextAnimation() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      stageAria: 'Enterprise multimodal materials flow',
      inputAria: 'Messy multimodal materials',
      messy: 'messy materials',
      outputAria: 'Outputs',
      outputs: 'outputs',
    },
    {
      stageAria: '企业多模态材料流',
      inputAria: '复杂多模态材料',
      messy: '复杂材料',
      outputAria: '输出',
      outputs: '输出',
    },
  )

  return (
    <div className="enterprise-context-stage" aria-label={copy.stageAria}>
      <section className="eca-input-world" aria-label={copy.inputAria}>
        <p className="eca-stage-label">{copy.messy}</p>
        <div className="eca-source-stack">
          {INPUTS.map((input) => (
            <SourceCard
              key={input.label}
              label={pickLocale(locale, input.label, input.labelZh)}
              meta={pickLocale(locale, input.meta, input.metaZh)}
              tone={input.tone}
            />
          ))}
        </div>
      </section>

      <section className="eca-vane-world" aria-label="Vane">
        <VaneCore />
      </section>

      <section className="eca-output-world" aria-label={copy.outputAria}>
        <p className="eca-stage-label">{copy.outputs}</p>
        <AgentReadyPanel locale={locale} />
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
