import Head from '@docusaurus/Head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'
import EnterpriseContextAnimation from '../components/EnterpriseContextAnimation'
import { pickLocale, type SiteLocale, useSiteLocale } from '../siteI18n'
import { ENTERPRISE_DESIGN_PARTNER_MAILTO } from '../siteLinks'

const AUDIT_CODE = `from pydantic import BaseModel
import vane

class AuditResult(BaseModel):
    status: str
    reason: str

con = vane.connect()
docs = con.sql("""
    select document_id, claim_id, document_type, text, source_uri
    from read_parquet('data/insurance_documents/*.parquet')
    where text is not null
""")
docs.to_table("docs")

rule_hits = con.sql("""
    select document_id, claim_id, document_type, source_uri,
           case
             when lower(text) like '%missing signature%' then 'missing_signature'
             when lower(text) like '%expired%' then 'expired_reference'
           end as rule_hit
    from docs
    where lower(text) like '%missing signature%'
       or lower(text) like '%expired%'
""")

audit_only = docs.prompt(
    "text",
    provider="openai",
    system_message="Audit the insurance document for missing evidence. Return JSON.",
    return_format=AuditResult,
    output_column="audit_json",
    execution_backend="subprocess_actor",
)

docs_table = docs.to_arrow_table()
audit_table = audit_only.to_arrow_table()
if docs_table.num_rows != audit_table.num_rows:
    raise ValueError("model output row count changed")

audited = con.from_arrow(docs_table.append_column("audit_json", audit_table["audit_json"]))
audited.to_table("audited")

final = con.sql("""
    select claim_id, document_id, document_type, rule_hit, audit_json, source_uri
    from audited join rule_hits using (document_id, claim_id, document_type, source_uri)
""")`

const INSURANCE_AUDIT_DOC = '/docs/data/examples/insurance-document-audit'

function Divider() {
  return <div className="wrap"><div className="ddiv" /></div>
}

function MiniNode({ children }: { children: string }) {
  return <span className="enterprise-node">{children}</span>
}

function Motif({ compact = false, locale }: { compact?: boolean; locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      source: 'messy materials',
      target: 'auditable facts',
    },
    {
      source: '复杂材料',
      target: '可审计事实',
    },
  )

  return (
    <div className={compact ? 'enterprise-motif compact' : 'enterprise-motif'}>
      <span>{copy.source}</span>
      <b>→</b>
      <span>{copy.target}</span>
    </div>
  )
}

function ProblemDiagram({ locale }: { locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      before: 'BEFORE — a fragmented chain',
      steps: ['Messy Materials', 'OCR scripts', 'Temp files', 'LLM calls', 'More scripts', 'SQL rules', 'Manual review'],
      warning: '⚠ scattered systems · glue code everywhere · lost source references · hard to debug · poor reproducibility',
      after: 'AFTER — one pipeline',
      messy: 'Messy Materials',
      facts: 'Auditable Facts',
      outputs: 'insights · evidence · recommendations',
    },
    {
      before: '之前 — 割裂的处理链',
      steps: ['复杂材料', 'OCR 脚本', '临时文件', 'LLM 调用', '更多脚本', 'SQL 规则', '人工审核'],
      warning: '⚠ 系统分散 · glue code 到处都是 · 来源引用丢失 · 难以调试 · 可复现性差',
      after: '之后 — 一条 pipeline',
      messy: '复杂材料',
      facts: '可审计事实',
      outputs: '洞察 · 证据 · 建议',
    },
  )

  return (
    <div className="enterprise-problem-grid">
      <Box flat className="enterprise-chain">
        <h3>{copy.before}</h3>
        <div className="enterprise-steps">
          {copy.steps.map((step, index) => (
            <div className="enterprise-step" key={step}>
              <span>{step}</span>
              {index < 6 && <b>↓</b>}
            </div>
          ))}
        </div>
        <p>{copy.warning}</p>
      </Box>
      <Box flat className="enterprise-chain after">
        <h3>{copy.after}</h3>
        <div className="enterprise-after-flow">
          <MiniNode>{copy.messy}</MiniNode>
          <b>↓</b>
          <span className="enterprise-vane-node">VANE</span>
          <b>↓</b>
          <MiniNode>{copy.facts}</MiniNode>
          <em>{copy.outputs}</em>
        </div>
        <Motif compact locale={locale} />
      </Box>
    </div>
  )
}

/* Each card shares one shape: input chips converge (↓) into the dark result
   chip, so the three read as a matched set at any column width. STEP 02 adds a
   muted field list under its result (the columns the review row keeps). */
const HOW_CARDS: Array<{
  title: string
  titleZh: string
  copy: string
  copyZh: string
  inputs: string[]
  inputsZh: string[]
  result: string
  resultZh: string
  fields?: string
  fieldsZh?: string
}> = [
  {
    title: 'Compose SQL, UDFs, and model review as relations',
    titleZh: '把 SQL、UDF 和模型审核组合成 relation',
    copy: 'Start with parsed rows and source metadata, then add SQL rules, explicit UDF stages, and model-assisted review without splitting the workflow across separate jobs.',
    copyZh: '从解析后的行和来源元数据开始，再加入 SQL 规则、显式 UDF 阶段和模型辅助审核，不需要把 workflow 拆成多个独立任务。',
    inputs: ['SQL rules', 'UDF stages', 'model review'],
    inputsZh: ['SQL 规则', 'UDF 阶段', '模型审核'],
    result: 'relation pipeline',
    resultZh: 'relation pipeline',
  },
  {
    title: 'Make source references part of the output',
    titleZh: '让来源引用成为输出的一部分',
    copy: 'AI helpers return the configured output column, so final review rows should explicitly keep document IDs, rule hits, audit JSON, and source URIs together.',
    copyZh: 'AI helper 会返回配置好的输出列，因此最终审核行应显式保留 document ID、规则命中、audit JSON 和 source URI。',
    inputs: ['model output'],
    inputsZh: ['模型输出'],
    result: 'review row',
    resultZh: '审核行',
    fields: 'document ID · rule hit · audit JSON · source URI',
    fieldsZh: 'document ID · 规则命中 · audit JSON · source URI',
  },
  {
    title: 'Move to Ray after local validation',
    titleZh: '本地验证后再迁移到 Ray',
    copy: 'Validate locally first, then switch runner and UDF backends when distribution helps. The relation shape stays stable; worker storage, dependencies, and credentials still matter.',
    copyZh: '先在本地验证；只有分布式执行有帮助时，再切换 runner 和 UDF backend。relation 形态保持稳定，但 worker 存储、依赖和凭证仍然需要处理。',
    inputs: ['local sample', 'Ray runner'],
    inputsZh: ['本地样本', 'Ray runner'],
    result: 'same relation shape',
    resultZh: '相同 relation 形态',
  },
]

function HowVaneWorks({ locale }: { locale: SiteLocale }) {
  return (
    <div className="enterprise-how-grid">
      {HOW_CARDS.map((card, index) => (
        <Box className="enterprise-how-card" key={card.title}>
          <div className="enterprise-how-head">
            <span className="enterprise-how-step">STEP {String(index + 1).padStart(2, '0')}</span>
            <h3>{pickLocale(locale, card.title, card.titleZh)}</h3>
          </div>
          <div className="enterprise-how-viz-wrap">
            <div className="ehow-viz">
              <div className="ehow-inputs">
                {pickLocale(locale, card.inputs, card.inputsZh).map((input) => (
                  <span className="ehow-chip" key={input}>{input}</span>
                ))}
              </div>
              <b className="ehow-arrow" aria-hidden="true">↓</b>
              <span className="ehow-chip is-out">{pickLocale(locale, card.result, card.resultZh)}</span>
              {card.fields && <span className="ehow-note">{pickLocale(locale, card.fields, card.fieldsZh ?? card.fields)}</span>}
            </div>
          </div>
          <p>{pickLocale(locale, card.copy, card.copyZh)}</p>
        </Box>
      ))}
    </div>
  )
}

const DOC_ROWS_EN = [
  { id: 'DOC-1029', text: 'no signature', src: 'claim.pdf' },
  { id: 'DOC-1030', text: 'policy expired', src: 'policy.pdf' },
  { id: 'DOC-1031', text: 'coverage limit', src: 'memo.pdf' },
]
const DOC_ROWS_ZH = [
  { id: 'DOC-1029', text: 'no signature', src: 'claim.pdf' },
  { id: 'DOC-1030', text: 'policy expired', src: 'policy.pdf' },
  { id: 'DOC-1031', text: 'coverage limit', src: 'memo.pdf' },
]
const PIPELINE_STAGES_EN = ['SQL rules', 'model review', 'audit rows']
const PIPELINE_STAGES_ZH = ['SQL 规则', '模型审核', '审计行']
// The audit row's produced columns, straight from the final relation in
// AUDIT_CODE (rule_hit, audit_json, source_uri) — keeps the figure honest to the
// code below and reinforces the page's source-reference / evidence-chain point.
const AUDIT_OUTPUTS_EN = ['rule hit', 'audit JSON', 'source URI']
const AUDIT_OUTPUTS_ZH = ['规则命中', 'audit JSON', 'source URI']

/* Real-example flow: a parsed document table feeds one Vane pipeline (SQL rules
   -> model review -> audit rows) that produces auditable outputs. Three equal-
   height panels share one row anatomy; the middle is the green-accented hero. */
function ExamplePipelineDiagram({ locale }: { locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      parsed: 'Parsed document table',
      pipeline: 'Vane · one pipeline',
      outputs: 'Outputs',
      rows: DOC_ROWS_EN,
      stages: PIPELINE_STAGES_EN,
      auditOutputs: AUDIT_OUTPUTS_EN,
    },
    {
      parsed: '解析后的文档表',
      pipeline: 'Vane · 一条 pipeline',
      outputs: '输出',
      rows: DOC_ROWS_ZH,
      stages: PIPELINE_STAGES_ZH,
      auditOutputs: AUDIT_OUTPUTS_ZH,
    },
  )

  return (
    <Box flat className="epd">
      <div className="epd-panel">
        <div className="epd-head">{copy.parsed}</div>
        <div className="epd-body epd-table">
          <div className="epd-row epd-row-head">
            <span>document_id</span>
            <span>text</span>
            <span>source_uri</span>
          </div>
          {copy.rows.map((row) => (
            <div className="epd-row" key={row.id}>
              <span>{row.id}</span>
              <span>{row.text}</span>
              <span>{row.src}</span>
            </div>
          ))}
        </div>
      </div>

      <b className="epd-arrow" aria-hidden="true">→</b>

      <div className="epd-panel epd-panel-vane">
        <div className="epd-head epd-head-vane">{copy.pipeline}</div>
        <div className="epd-body">
          {copy.stages.map((stage, index) => (
            <div className="epd-stage" key={stage}>
              <span className="epd-stage-n">{index + 1}</span>
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </div>

      <b className="epd-arrow" aria-hidden="true">→</b>

      <div className="epd-panel">
        <div className="epd-head">{copy.outputs}</div>
        <div className="epd-body">
          {copy.auditOutputs.map((out) => (
            <div className="epd-out" key={out}>{out}</div>
          ))}
        </div>
      </div>
    </Box>
  )
}

export default function EnterpriseAgentUseCase() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      title: 'Enterprise Multimodal Data Infrastructure — Vane',
      description: 'Use Vane Data to keep parsed document rows, media references, SQL rules, explicit UDF stages, and model-assisted review in one auditable relation workflow.',
      ogTitle: 'Turn messy multimodal business materials into auditable facts.',
      ogDescription: 'Keep source rows, rules, model output, and source references together for enterprise review workflows.',
      eyebrow: 'Enterprise Multimodal Data Infrastructure',
      heading: 'Turn messy multimodal business materials into auditable facts.',
      lead: 'Bring parsed document rows, media references, tables, logs, and model outputs into one pipeline. Use SQL for deterministic checks, explicit UDF stages for extraction, and model-assisted review where it belongs.',
      runPipeline: 'Run the pipeline',
      requestDemo: 'Request a demo',
      meta: 'document rows · media refs · tables · logs · model outputs',
      problemEyebrow: 'The Problem',
      problemTitle: "The hard part isn't calling a model — it's rebuilding the evidence chain.",
      problemLead: 'Today that chain is stitched across OCR scripts, temp files, model calls, SQL jobs, and review tools.',
      how: 'How Vane Works',
      howTitle: 'source rows → auditable outputs, as one relation pipeline.',
      example: 'Real Example',
      exampleTitle: 'Insurance document audit pattern',
      exampleLead: 'Start from parsed claim documents and source references, then apply deterministic rules and optional model review in one auditable relation.',
      note: 'Note',
      noteCopy: 'Vane Data does not ship a dedicated insurance workflow. This example shows the SQL and Relation API shape, not a production decision system. OCR, parsing, and policy-system extraction happen upstream or in explicit UDF stages.',
      ctaTitle: 'Have document rows, media references, logs, or model outputs to turn into auditable facts?',
    },
    {
      title: '企业多模态数据基础设施 — Vane',
      description: '使用 Vane Data，把解析后的文档行、媒体引用、SQL 规则、显式 UDF 阶段和模型辅助审核放在同一个可审计的 relation workflow 中。',
      ogTitle: '把复杂的多模态业务材料转成可审计事实。',
      ogDescription: '在企业审核 workflow 中，让源行、规则、模型输出和来源引用保持在一起。',
      eyebrow: '企业多模态数据基础设施',
      heading: '把复杂的多模态业务材料转成可审计事实。',
      lead: '把解析后的文档行、媒体引用、表格、日志和模型输出放进一条 pipeline。用 SQL 做确定性检查，用显式 UDF 阶段做抽取，在合适的位置加入模型辅助审核。',
      runPipeline: '运行 pipeline',
      requestDemo: '申请演示',
      meta: '文档行 · 媒体引用 · 表格 · 日志 · 模型输出',
      problemEyebrow: '问题',
      problemTitle: '难点不在于调用模型，而在于重建证据链。',
      problemLead: '今天，这条链通常被拼在 OCR 脚本、临时文件、模型调用、SQL 任务和审核工具之间。',
      how: 'Vane 如何工作',
      howTitle: '源行 → 可审计输出，作为一条 relation pipeline。',
      example: '真实示例',
      exampleTitle: '保险文档审计模式',
      exampleLead: '从解析后的理赔文档和来源引用开始，再在同一个可审计 relation 中应用确定性规则和可选模型审核。',
      note: '说明',
      noteCopy: 'Vane Data 不内置专用保险 workflow。这个示例展示的是 SQL 和 Relation API 的形态，不是生产决策系统。OCR、解析和保单系统抽取发生在上游，或放在显式 UDF 阶段中。',
      ctaTitle: '有文档行、媒体引用、日志或模型输出，需要转成可审计事实？',
    },
  )

  return (
    <>
      <Head>
        <title>{copy.title}</title>
        <meta
          name="description"
          content={copy.description}
        />
        <meta property="og:title" content={copy.ogTitle} />
        <meta property="og:description" content={copy.ogDescription} />
      </Head>

      <Nav />

      {/* HERO — solutions intro archetype: editorial copy + primary actions,
          paired with the agent-context visual in the right rail. */}
      <section className="intro enterprise-hero">
        <div className="wrap enterprise-hero-grid">
          <div className="enterprise-hero-copy">
            <Eyebrow style={{ marginBottom: 20 }}>{copy.eyebrow}</Eyebrow>
            <h1 className="h1 enterprise-hero-title">{copy.heading}</h1>
            <p className="lead enterprise-hero-lead">
              {copy.lead}
            </p>
            <div className="enterprise-hero-actions">
              <Button solid to={INSURANCE_AUDIT_DOC} arrow>{copy.runPipeline}</Button>
              <Button href={ENTERPRISE_DESIGN_PARTNER_MAILTO} arrow>{copy.requestDemo}</Button>
            </div>
            <div className="enterprise-hero-meta">
              <Motif compact locale={locale} />
              <span>{copy.meta}</span>
            </div>
          </div>
          <div className="enterprise-hero-art">
            <EnterpriseContextAnimation />
          </div>
        </div>
      </section>

      <Divider />

      {/* THE PROBLEM */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.problemEyebrow}</Eyebrow>
            <h2 className="h2">{copy.problemTitle}</h2>
            <p className="lead">{copy.problemLead}</p>
          </div>
          <ProblemDiagram locale={locale} />
        </div>
      </section>

      <Divider />

      {/* HOW VANE WORKS */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.how}</Eyebrow>
            <h2 className="h2">{copy.howTitle}</h2>
          </div>
          <HowVaneWorks locale={locale} />
        </div>
      </section>

      <Divider />

      {/* REAL EXAMPLE */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.example}</Eyebrow>
            <h2 className="h2">{copy.exampleTitle}</h2>
            <p className="lead">{copy.exampleLead}</p>
          </div>
          <ExamplePipelineDiagram locale={locale} />
          <div className="enterprise-code-block">
            <CodeWindow filename="insurance_document_audit.py" code={AUDIT_CODE} language="python" />
            <Box flat className="enterprise-honesty">
              <span className="enterprise-honesty-label">{copy.note}</span>
              <span>
                {copy.noteCopy}
              </span>
            </Box>
          </div>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="section enterprise-section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta title={copy.ctaTitle}>
            <Button solid to={INSURANCE_AUDIT_DOC} arrow>{copy.runPipeline}</Button>
            <Button href={ENTERPRISE_DESIGN_PARTNER_MAILTO} arrow>{copy.requestDemo}</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
