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

const AUDIT_CODE = `import vane

@vane.func(return_dtype="VARCHAR")
def policy_check(text):
    return "missing_signature" if "missing signature" in text.lower() else None

con = vane.connect()
vane.attach_function(
    policy_check,
    parameters=["VARCHAR"],
    connection=con,
)

findings = con.sql("""
    SELECT claim_id, document_id,
           policy_check(text) AS rule_hit,
           ai_prompt(
               text,
               struct_pack(
                   provider := 'openai',
                   model := 'gpt-4o-mini',
                   system_message := 'Find missing claim evidence.'
               )
           ) AS ai_finding,
           source_uri
    FROM read_parquet('claims/*.parquet')
""")

findings.write_parquet("audit_findings.parquet")`

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
      target: '可信决策',
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
      before: '之前 — 碎片化链路',
      steps: ['杂乱材料', 'OCR 脚本', '临时文件', 'LLM 调用', '更多脚本', 'SQL 规则', '人工审查'],
      warning: '⚠ 系统分散 · 到处是 glue code · 来源引用丢失 · 难以调试 · 可复现性差',
      after: '之后 — 一条流水线',
      messy: '杂乱材料',
      facts: '可信决策',
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
    titleZh: '把 SQL、UDF 和模型推理组合成一条关系流水线',
    copy: 'Start with parsed rows and source metadata, then add SQL rules, explicit UDF stages, and model-assisted review without splitting the workflow across separate jobs.',
    copyZh: '从原始多模态数据开始，把 SQL 规则、UDF 计算和模型推理接到同一条流水线里，不再拆成多个任务。',
    inputs: ['SQL rules', 'UDF stages', 'model review'],
    inputsZh: ['SQL 规则', 'UDF 计算', '模型推理'],
    result: 'relation pipeline',
    resultZh: '关系流水线',
  },
  {
    title: 'Make source references part of the output',
    titleZh: '把来源引用保留到最终结果里',
    copy: 'SQL ai_prompt returns a scalar result; alias it in the projection, then keep document IDs, rule hits, the model response, and source URIs together in the same review row.',
    copyZh: 'SQL ai_prompt 返回标量结果；在 projection 中为它设置别名，并在同一审查行保留文档 ID、规则命中、模型响应和来源 URI。',
    inputs: ['model output'],
    inputsZh: ['模型输出'],
    result: 'review row',
    resultZh: '证据追溯',
    fields: 'document ID · rule hit · model response · source URI',
    fieldsZh: '文档 ID · 规则命中 · 模型响应 · 来源 URI',
  },
  {
    title: 'Move to Ray after local validation',
    titleZh: '从本地执行，快速切换到 Ray 扩展',
    copy: 'Validate locally first, then switch runner and UDF backends when distribution helps. The relation shape stays stable; worker storage, dependencies, and credentials still matter.',
    copyZh: '从本地运行，简单快速的切换到 Ray 分布式运行',
    inputs: ['local sample', 'Ray runner'],
    inputsZh: ['本地运行', 'Ray runner'],
    result: 'same relation shape',
    resultZh: '同一关系形态',
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
const PIPELINE_STAGES_EN = ['Python rule', 'SQL AI review', 'audit rows']
const PIPELINE_STAGES_ZH = ['Python 规则', 'SQL AI 审查', '审核结果']
// Keep the diagram labels aligned with the columns produced by AUDIT_CODE.
const AUDIT_OUTPUTS_EN = ['rule hit', 'AI finding', 'source URI']
const AUDIT_OUTPUTS_ZH = ['规则命中', 'AI 发现', '来源 URI']

/* Real-example flow: a parsed document table feeds one Vane pipeline (Python rule
   -> SQL AI review -> audit rows) that produces auditable outputs. Three equal-
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
      parsed: '原始材料',
      pipeline: 'Vane · 一条流水线',
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
      exampleLead: 'Register a Python policy rule once, then call it beside ai_prompt in SQL. Business IDs and source references stay on every audit row.',
      ctaTitle: 'Have document rows, media references, logs, or model outputs to turn into auditable facts?',
    },
    {
      title: '企业多模态Agent — Vane',
      description: '用 Vane Data 将文档行、媒体引用、SQL 规则、UDF 计算和模型推理放进一条可追溯的关系流水线。',
      ogTitle: '把分散的业务材料整理成可复核的证据链',
      ogDescription: '为企业审查工作流把 source rows、规则、模型输出和 source references 放在一起。',
      eyebrow: '企业多模态Agent',
      heading: '从繁杂的多模态文件到Agent的业务决策',
      lead: '一个SQL流水线统筹文档、图片、视频、表格、日志处理和模型推理，Agent决策可信可追溯',
      runPipeline: '运行示例',
      requestDemo: '申请演示',
      meta: 'document rows · media refs · 表格 · 日志 · 模型输出',
      problemEyebrow: '问题',
      problemTitle: '为Agent构建从多模态文件到可信决策和可追溯的证据链',
      problemLead: '如今这条链通常被拼接在 OCR 脚本、临时文件、模型调用、SQL 任务和审查工具之间。',
      how: 'Vane 如何工作',
      howTitle: '以一条关系语义的SQL流水线，从多模数据变成可信决策',
      example: '真实示例',
      exampleTitle: '保险审核流水线',
      exampleLead: 'Python 规则注册一次后即可在 SQL 中与 ai_prompt 并排调用；业务 ID 和来源引用始终保留在每条审核结果中。',
      ctaTitle: '有文档、视频、图片、日志等多模数据需要转变为Agent可信决策吗？',
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
