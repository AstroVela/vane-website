import Head from '@docusaurus/Head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'

const DESIGN_PARTNER_HREF = 'mailto:hello@vane.ai?subject=Vane%20enterprise%20agent%20design%20partner'

const CLAIMS_SQL = `-- files → extraction → model → SQL → finding, in one execution plan
WITH evidence AS (
  SELECT claim_id, file_id,
         extract_document(media_type, uri)                  AS doc,  -- OCR / parse
         prompt('Extract claim fields as JSON; keep the quote', doc) AS fact  -- model, in SQL
  FROM read_files('claims/CLM-POC-001/*')                           -- files
)
SELECT claim_id, fact,
       provenance()   AS evidence,      -- file · chunk · quote · confidence
       'needs_review' AS status         -- SQL rule → finding
FROM evidence
WHERE confidence < 0.8;`

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

function HeroDiagram() {
  return (
    <Box className="enterprise-hero-diagram">
      <div className="enterprise-diagram-label">messy materials</div>
      <div className="enterprise-material-grid">
        {['PDF', 'scan', 'photo', 'form', 'sheet', 'log'].map((item) => (
          <MiniNode key={item}>{item}</MiniNode>
        ))}
      </div>
      <div className="enterprise-arrow">→</div>
      <div className="enterprise-vane-node">VANE</div>
      <div className="enterprise-arrow">→</div>
      <div>
        <div className="enterprise-diagram-label">auditable facts</div>
        <div className="enterprise-fact-stack">
          <MiniNode>finding + evidence</MiniNode>
          <MiniNode>review task</MiniNode>
          <MiniNode>claim summary</MiniNode>
        </div>
      </div>
    </Box>
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
        <p>⚠ scattered systems · glue code everywhere · missing provenance · hard to debug · poor reproducibility</p>
      </Box>
      <Box flat className="enterprise-chain after">
        <h3>AFTER — one pipeline</h3>
        <div className="enterprise-after-flow">
          <MiniNode>Messy Materials</MiniNode>
          <b>↓</b>
          <span className="enterprise-vane-node">VANE</span>
          <b>↓</b>
          <MiniNode>Auditable Facts</MiniNode>
          <em>evidence · review · summary</em>
        </div>
        <Motif compact />
      </Box>
    </div>
  )
}

function HowVaneWorks() {
  const cards = [
    {
      title: 'One pipeline for files, models and rules',
      copy: 'File extraction, model inference and SQL rules run as one pipeline.',
      visual: (
        <div className="enterprise-mini-flow">
          <span>files</span><span>models</span><span>rules</span><b>→</b><strong>one pipeline</strong>
        </div>
      ),
    },
    {
      title: 'Every finding comes with evidence',
      copy: 'Each finding carries its proof — explainable and reviewable.',
      visual: (
        <div className="enterprise-object-flow">
          <strong>finding</strong><b>→</b><span>{'{ file · chunk · quote · confidence · triggering rule }'}</span>
        </div>
      ),
    },
    {
      title: 'Scale without rewriting',
      copy: 'Start local, move to distributed — business logic unchanged.',
      visual: (
        <div className="enterprise-scale-flow">
          <span>local</span><b>⇄</b><span>distributed</span><em>same pipeline</em>
        </div>
      ),
    },
  ]

  return (
    <div className="enterprise-how-grid">
      {cards.map((card) => (
        <Box className="enterprise-how-card" key={card.title}>
          {card.visual}
          <h3>{card.title}</h3>
          <p>{card.copy}</p>
        </Box>
      ))}
    </div>
  )
}

function ExamplePipelineDiagram() {
  return (
    <Box flat className="enterprise-example-diagram">
      <div>
        <div className="enterprise-diagram-label">Claim packet</div>
        <MiniNode>photos · scanned forms · estimates</MiniNode>
      </div>
      <b>↓</b>
      <div className="enterprise-vane-pipeline">
        <span>extract</span>
        <b>→</b>
        <span>model</span>
        <b>→</b>
        <span>SQL rules</span>
        <strong>VANE: one pipeline</strong>
      </div>
      <b>→</b>
      <div>
        <div className="enterprise-diagram-label">Outputs</div>
        <div className="enterprise-fact-stack">
          <MiniNode>evidence</MiniNode>
          <MiniNode>review tasks</MiniNode>
          <MiniNode>claim summary</MiniNode>
        </div>
      </div>
    </Box>
  )
}

function RunTerminal() {
  return (
    <Box className="enterprise-terminal" flat>
      <div><span>$</span> pip install vane-ai</div>
      <div><span>$</span> python -m vane_examples.claims_evidence</div>
      <div><b>→</b> evidence · review_tasks · claim_summary <em>(~N min, CPU-only)</em></div>
    </Box>
  )
}

export default function EnterpriseAgentUseCase() {
  return (
    <>
      <Head>
        <title>Enterprise Multimodal Agent Infrastructure — Vane</title>
        <meta
          name="description"
          content="Turn messy multimodal business materials — PDFs, scans, photos, forms, spreadsheets, logs — into auditable facts. One pipeline for files, models and rules."
        />
        <meta property="og:title" content="Turn messy multimodal business materials into auditable facts." />
        <meta property="og:description" content="messy materials → auditable facts for claims, compliance and document review teams." />
      </Head>

      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid enterprise-hero-grid">
          <div>
            <Eyebrow style={{ marginBottom: 20 }}>Enterprise Multimodal Agent Infrastructure</Eyebrow>
            <h1 className="h1">Turn messy multimodal business materials into auditable facts.</h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: 620 }}>
              Claims, compliance and document review — Vane extracts the evidence, runs the rules, and returns auditable findings.
            </p>
            <div className="enterprise-audience">claims teams · compliance teams · document review teams · enterprise AI teams</div>
            <div style={{ marginTop: 18 }}><Motif compact /></div>
            <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
              <Button solid to="/docs/examples/insurance-document-audit" arrow>Run the claims pipeline</Button>
              <Button to="/docs">Read the docs</Button>
            </div>
            <div className="install" style={{ marginTop: 28 }}>
              <span className="c"><span className="p">$</span> pip install vane-ai</span>
              <span>·</span><span>Apache-2.0</span>
            </div>
          </div>
          <HeroDiagram />
        </div>
      </section>

      <Divider />

      {/* THE PROBLEM */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>The Problem</Eyebrow>
            <h2 className="h2">The hard part isn't calling a model — it's rebuilding the evidence chain.</h2>
            <p className="lead">Today that chain is stitched across scattered systems and glue code.</p>
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
            <h2 className="h2">messy materials → auditable facts, as one pipeline.</h2>
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
            <h2 className="h2">Claims evidence pipeline</h2>
            <p className="lead">Turn a claim packet — photos, scanned forms, estimates — into evidence, review tasks and a claim-level summary.</p>
          </div>
          <ExamplePipelineDiagram />
          <div className="enterprise-code-block">
            <CodeWindow filename="claims_evidence.sql" code={CLAIMS_SQL} language="sql" />
            <Box flat className="enterprise-honesty">
              Runs on public / synthetic proxy data — it shows the pipeline shape, not a production decision system. Plug in your own OCR / VLM / LLM along the same interface.
            </Box>
          </div>
          <Button solid to="/docs/examples/insurance-document-audit" arrow>Run the claims pipeline</Button>
        </div>
      </section>

      <Divider />

      {/* RUN IT */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Run It</Eyebrow>
            <h2 className="h2">Three commands to inspect the pipeline shape.</h2>
          </div>
          <RunTerminal />
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="section enterprise-section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta
            kicker={<Motif compact />}
            title="Have a stack of claims to turn into auditable facts?"
          >
            <Button solid to="/docs/examples/insurance-document-audit" arrow>Run the claims pipeline</Button>
            <Button href={DESIGN_PARTNER_HREF}>Become a design partner</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
