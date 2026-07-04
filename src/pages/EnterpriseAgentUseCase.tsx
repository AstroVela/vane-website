import Head from '@docusaurus/Head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'
import EnterpriseContextAnimation from '../components/EnterpriseContextAnimation'
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

function Motif({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'enterprise-motif compact' : 'enterprise-motif'}>
      <span>messy materials</span>
      <b>→</b>
      <span>auditable facts</span>
    </div>
  )
}

function ProblemDiagram() {
  return (
    <div className="enterprise-problem-grid">
      <Box flat className="enterprise-chain">
        <h3>BEFORE — a fragmented chain</h3>
        <div className="enterprise-steps">
          {['Messy Materials', 'OCR scripts', 'Temp files', 'LLM calls', 'More scripts', 'SQL rules', 'Manual review'].map((step, index) => (
            <div className="enterprise-step" key={step}>
              <span>{step}</span>
              {index < 6 && <b>↓</b>}
            </div>
          ))}
        </div>
        <p>⚠ scattered systems · glue code everywhere · lost source references · hard to debug · poor reproducibility</p>
      </Box>
      <Box flat className="enterprise-chain after">
        <h3>AFTER — one pipeline</h3>
        <div className="enterprise-after-flow">
          <MiniNode>Messy Materials</MiniNode>
          <b>↓</b>
          <span className="enterprise-vane-node">VANE</span>
          <b>↓</b>
          <MiniNode>Auditable Facts</MiniNode>
          <em>insights · evidence · recommendations</em>
        </div>
        <Motif compact />
      </Box>
    </div>
  )
}

/* Each card shares one shape: input chips converge (↓) into the dark result
   chip, so the three read as a matched set at any column width. STEP 02 adds a
   muted field list under its result (the columns the review row keeps). */
const HOW_CARDS: Array<{
  title: string
  copy: string
  inputs: string[]
  result: string
  fields?: string
}> = [
  {
    title: 'Compose SQL, UDFs, and model review as relations',
    copy: 'Start with parsed rows and source metadata, then add SQL rules, explicit UDF stages, and model-assisted review without splitting the workflow across separate jobs.',
    inputs: ['SQL rules', 'UDF stages', 'model review'],
    result: 'relation pipeline',
  },
  {
    title: 'Make source references part of the output',
    copy: 'AI helpers return the configured output column, so final review rows should explicitly keep document IDs, rule hits, audit JSON, and source URIs together.',
    inputs: ['model output'],
    result: 'review row',
    fields: 'document ID · rule hit · audit JSON · source URI',
  },
  {
    title: 'Move to Ray after local validation',
    copy: 'Validate locally first, then switch runner and UDF backends when distribution helps. The relation shape stays stable; worker storage, dependencies, and credentials still matter.',
    inputs: ['local sample', 'Ray runner'],
    result: 'same relation shape',
  },
]

function HowVaneWorks() {
  return (
    <div className="enterprise-how-grid">
      {HOW_CARDS.map((card, index) => (
        <Box className="enterprise-how-card" key={card.title}>
          <div className="enterprise-how-head">
            <span className="enterprise-how-step">STEP {String(index + 1).padStart(2, '0')}</span>
            <h3>{card.title}</h3>
          </div>
          <div className="enterprise-how-viz-wrap">
            <div className="ehow-viz">
              <div className="ehow-inputs">
                {card.inputs.map((input) => (
                  <span className="ehow-chip" key={input}>{input}</span>
                ))}
              </div>
              <b className="ehow-arrow" aria-hidden="true">↓</b>
              <span className="ehow-chip is-out">{card.result}</span>
              {card.fields && <span className="ehow-note">{card.fields}</span>}
            </div>
          </div>
          <p>{card.copy}</p>
        </Box>
      ))}
    </div>
  )
}

const DOC_ROWS = [
  { id: 'DOC-1029', text: 'no signature', src: 'claim.pdf' },
  { id: 'DOC-1030', text: 'policy expired', src: 'policy.pdf' },
  { id: 'DOC-1031', text: 'coverage limit', src: 'memo.pdf' },
]
const PIPELINE_STAGES = ['SQL rules', 'model review', 'audit rows']
// The audit row's produced columns, straight from the final relation in
// AUDIT_CODE (rule_hit, audit_json, source_uri) — keeps the figure honest to the
// code below and reinforces the page's source-reference / evidence-chain point.
const AUDIT_OUTPUTS = ['rule hit', 'audit JSON', 'source URI']

/* Real-example flow: a parsed document table feeds one Vane pipeline (SQL rules
   -> model review -> audit rows) that produces auditable outputs. Three equal-
   height panels share one row anatomy; the middle is the green-accented hero. */
function ExamplePipelineDiagram() {
  return (
    <Box flat className="epd">
      <div className="epd-panel">
        <div className="epd-head">Parsed document table</div>
        <div className="epd-body epd-table">
          <div className="epd-row epd-row-head">
            <span>document_id</span>
            <span>text</span>
            <span>source_uri</span>
          </div>
          {DOC_ROWS.map((row) => (
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
        <div className="epd-head epd-head-vane">Vane · one pipeline</div>
        <div className="epd-body">
          {PIPELINE_STAGES.map((stage, index) => (
            <div className="epd-stage" key={stage}>
              <span className="epd-stage-n">{index + 1}</span>
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </div>

      <b className="epd-arrow" aria-hidden="true">→</b>

      <div className="epd-panel">
        <div className="epd-head">Outputs</div>
        <div className="epd-body">
          {AUDIT_OUTPUTS.map((out) => (
            <div className="epd-out" key={out}>{out}</div>
          ))}
        </div>
      </div>
    </Box>
  )
}

export default function EnterpriseAgentUseCase() {
  return (
    <>
      <Head>
        <title>Enterprise Multimodal Data Infrastructure — Vane</title>
        <meta
          name="description"
          content="Use Vane Data to keep parsed document rows, media references, SQL rules, explicit UDF stages, and model-assisted review in one auditable relation workflow."
        />
        <meta property="og:title" content="Turn messy multimodal business materials into auditable facts." />
        <meta property="og:description" content="Keep source rows, rules, model output, and source references together for enterprise review workflows." />
      </Head>

      <Nav />

      {/* HERO — solutions intro archetype: editorial copy + primary actions,
          paired with the agent-context visual in the right rail. */}
      <section className="intro enterprise-hero">
        <div className="wrap enterprise-hero-grid">
          <div className="enterprise-hero-copy">
            <Eyebrow style={{ marginBottom: 20 }}>Enterprise Multimodal Data Infrastructure</Eyebrow>
            <h1 className="h1 enterprise-hero-title">Turn messy multimodal business materials into auditable facts.</h1>
            <p className="lead enterprise-hero-lead">
              Bring parsed document rows, media references, tables, logs, and model outputs into one pipeline. Use SQL for deterministic checks, explicit UDF stages for extraction, and model-assisted review where it belongs.
            </p>
            <div className="enterprise-hero-actions">
              <Button solid to={INSURANCE_AUDIT_DOC} arrow>Run the pipeline</Button>
              <Button href={ENTERPRISE_DESIGN_PARTNER_MAILTO} arrow>Request a demo</Button>
            </div>
            <div className="enterprise-hero-meta">
              <Motif compact />
              <span>document rows · media refs · tables · logs · model outputs</span>
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
            <Eyebrow>The Problem</Eyebrow>
            <h2 className="h2">The hard part isn't calling a model — it's rebuilding the evidence chain.</h2>
            <p className="lead">Today that chain is stitched across OCR scripts, temp files, model calls, SQL jobs, and review tools.</p>
          </div>
          <ProblemDiagram />
        </div>
      </section>

      <Divider />

      {/* HOW VANE WORKS */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>How Vane Works</Eyebrow>
            <h2 className="h2">source rows → auditable outputs, as one relation pipeline.</h2>
          </div>
          <HowVaneWorks />
        </div>
      </section>

      <Divider />

      {/* REAL EXAMPLE */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Real Example</Eyebrow>
            <h2 className="h2">Insurance document audit pattern</h2>
            <p className="lead">Start from parsed claim documents and source references, then apply deterministic rules and optional model review in one auditable relation.</p>
          </div>
          <ExamplePipelineDiagram />
          <div className="enterprise-code-block">
            <CodeWindow filename="insurance_document_audit.py" code={AUDIT_CODE} language="python" />
            <Box flat className="enterprise-honesty">
              <span className="enterprise-honesty-label">Note</span>
              <span>
                Vane Data does not ship a dedicated insurance workflow. This example shows the SQL and Relation API shape, not a production decision system. OCR, parsing, and policy-system extraction happen upstream or in explicit UDF stages.
              </span>
            </Box>
          </div>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="section enterprise-section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta title="Have document rows, media references, logs, or model outputs to turn into auditable facts?">
            <Button solid to={INSURANCE_AUDIT_DOC} arrow>Run the pipeline</Button>
            <Button href={ENTERPRISE_DESIGN_PARTNER_MAILTO} arrow>Request a demo</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
