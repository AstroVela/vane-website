import useBrokenLinks from '@docusaurus/useBrokenLinks'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'
import PixelIcon, { type PixelIconName } from '../components/PixelIcon'
import PlatformArchitecture from '../components/PlatformArchitecture'
import { Link } from '../router'

const HERO_CODE = `<span class="k">import</span> vane
<span class="k">from</span> vane<span class="p">.</span>ai <span class="k">import</span> describe<span class="p">,</span> embed

vane<span class="p">.</span><span class="f">configure</span><span class="p">(</span>runner<span class="p">=</span><span class="s">"ray"</span><span class="p">)</span>
media <span class="p">=</span> vane<span class="p">.</span><span class="f">read</span><span class="p">(</span><span class="s">"media/*"</span><span class="p">)</span>

media <span class="p">=</span> <span class="f">describe</span><span class="p">(</span>
    media<span class="p">,</span>
    columns<span class="p">=[</span><span class="s">"video"</span><span class="p">,</span> <span class="s">"audio"</span><span class="p">,</span> <span class="s">"text"</span><span class="p">],</span>
    output<span class="p">=</span><span class="s">"understanding"</span><span class="p">,</span>
    schema<span class="p">=[</span><span class="s">"summary"</span><span class="p">,</span> <span class="s">"objects"</span><span class="p">,</span>
            <span class="s">"topics"</span><span class="p">,</span> <span class="s">"actions"</span><span class="p">],</span>
<span class="p">)</span>

media <span class="p">=</span> <span class="f">embed</span><span class="p">(</span>media<span class="p">,</span> <span class="s">"understanding.summary"</span><span class="p">)</span>
media<span class="p">.</span><span class="f">write</span><span class="p">(</span><span class="s">"ai_ready_media"</span><span class="p">)</span><span class="cur"></span>`

const DESIGN_PARTNER_HREF = 'mailto:hello@vane.ai?subject=Vane%20design%20partner'

const SCENARIOS: Array<{
  title: string
  status: 'Available now' | 'Coming soon'
  summary: string
  cta: string
  href: string
  icon: PixelIconName
}> = [
  {
    title: 'Autonomous Driving — Physical AI training data',
    status: 'Available now',
    summary: 'Turn PB-scale multi-sensor drive logs into training-ready, traceable datasets — without a days-long, multi-system rerun.',
    cta: 'Explore',
    href: '/use-cases/training',
    icon: 'multimodal',
  },
  {
    title: 'Enterprise Multimodal Agent',
    status: 'Available now',
    summary: 'Turn always-on streams of docs, images, audio and calls into grounded, auditable facts your agents can act on — in SQL.',
    cta: 'Explore',
    href: '/use-cases/enterprise-agent',
    icon: 'retrieval',
  },
  {
    title: 'Embodied AI — RL post-training',
    status: 'Coming soon',
    summary: 'Clean and re-score rollout trajectories and reward shards at training speed — and reproduce any run.',
    cta: 'Join the waitlist',
    href: DESIGN_PARTNER_HREF,
    icon: 'generation',
  },
  {
    title: 'Edge AI Agent',
    status: 'Coming soon',
    summary: 'Filter and preprocess multimodal data on the edge, with one semantics from device to cloud.',
    cta: 'Join the waitlist',
    href: DESIGN_PARTNER_HREF,
    icon: 'preprocessing',
  },
]

function ScenarioCard({ scenario }: { scenario: (typeof SCENARIOS)[number] }) {
  const body = (
    <>
      <div className="scenario-top">
        <span className="ic"><PixelIcon name={scenario.icon} size={20} /></span>
        <span className={`status-pill ${scenario.status === 'Available now' ? 'available' : 'soon'}`}>
          {scenario.status}
        </span>
      </div>
      <h3>{scenario.title}</h3>
      <p>{scenario.summary}</p>
      <span className="scenario-cta">{scenario.cta} <span className="ar">→</span></span>
    </>
  )

  if (scenario.href.startsWith('mailto:')) {
    return (
      <Box as="a" href={scenario.href} className="scenario-card is-soon">
        {body}
      </Box>
    )
  }

  return (
    <Box as={Link} to={scenario.href} className="scenario-card">
      {body}
    </Box>
  )
}

export default function Home() {
  const brokenLinks = useBrokenLinks()
  brokenLinks.collectAnchor('scenarios')
  brokenLinks.collectAnchor('benchmarks')

  return (
    <>
      <Nav ctaReveal />
      <a id="top" />

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <Eyebrow style={{ marginBottom: 20 }}>Vane</Eyebrow>
            <h1 className="h1 hero-h1">
              The Multimodal-Native AI Engine
            </h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: 480 }}>
              Powering the AI learning and action loop with real-world data.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 34, flexWrap: 'wrap' }}>
              <Button solid to="/docs" arrow>Get Started</Button>
              <Button to="#scenarios">View use cases</Button>
              <Button to="#benchmarks">See benchmarks</Button>
            </div>
            <div className="install" style={{ marginTop: 30 }}>
              <span className="c"><span className="p">$</span> pip install vane-ai</span>
              <span>·</span><span>pre-release</span><span>·</span><span>Apache-2.0</span>
            </div>
          </div>
          <CodeWindow filename="multimodal.py" running code={HERO_CODE} />
        </div>
      </section>

      {/* FOUR SCENARIOS */}
      <section className="section" id="scenarios" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
            <div>
              <Eyebrow>Use Cases</Eyebrow>
              <h2 className="h2" style={{ marginTop: 12 }}>Four real-world AI workloads. One engine.</h2>
              <p className="lead">
                From autonomous driving to enterprise agents, real-world AI runs on multimodal data. Pick the workload that's yours.
              </p>
            </div>
            <Button sm to="/use-cases" arrow>See all examples</Button>
          </div>
          <div className="scenario-grid">
            {SCENARIOS.map((scenario) => (
              <ScenarioCard scenario={scenario} key={scenario.title} />
            ))}
          </div>
        </div>
      </section>

      {/* BENCHMARKS PREVIEW */}
      <div className="wrap"><div className="ddiv" /></div>
      <section className="section" id="benchmarks" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Benchmarks</Eyebrow>
            <h2 className="h2">Built for real batch inference workloads.</h2>
            <p className="lead">
              One credible number, fully reproducible — vLLM batch inference over 66K rows on 2 GPUs, measured against Ray Data and Daft.
            </p>
          </div>
          <div className="calc-grid">
            <Box style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column' }}>
              <div className="azt" style={{ textAlign: 'left' }}>vLLM batch inference · 66K rows · 2× A100</div>
              <div style={{ fontSize: 'clamp(56px,7vw,80px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.95, margin: '14px 0 8px' }}>3.1×</div>
              <div className="mut" style={{ fontSize: 13.5, lineHeight: 1.5 }}>throughput vs Ray Data, with prefix bucketing on identical hardware.</div>
              <div className="bm-matrix">
                <div className="azt" style={{ textAlign: 'left', marginBottom: 10 }}>Reproducible matrix</div>
                <div className="bm-matrix-grid">
                  <span><b>~20× vs Spark</b></span>
                  <span><b>~2× vs Daft</b></span>
                  <span><b>~1.2× vs Ray Data</b></span>
                </div>
                <p>Image classification · document embedding · audio transcription · video object detection. Workload-dependent, fully reproducible.</p>
              </div>
              <Button sm to="/benchmarks" arrow style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>Full benchmarks</Button>
            </Box>
            <Box className="lat">
              <div className="azt" style={{ textAlign: 'left', marginBottom: 14 }}>Throughput — vLLM batch inference (higher is better)</div>
              <div className="latrow"><span className="pl">Vane</span><div className="bar"><div className="fillb vane" style={{ width: '100%' }} /></div><span className="val">3.1×</span></div>
              <div className="latrow"><span className="pl">Daft</span><div className="bar"><div className="fillb base" style={{ width: '52%' }} /></div><span className="val mut">1.6×</span></div>
              <div className="latrow"><span className="pl">Ray Data</span><div className="bar"><div className="fillb base" style={{ width: '32%' }} /></div><span className="val mut">1.0×</span></div>
              <div className="leg">
                <span><span className="sw" style={{ background: 'var(--ink)' }} />Vane</span>
                <span><span className="sw base" style={{ background: 'repeating-linear-gradient(45deg,var(--ink-3),var(--ink-3) 2px,transparent 2px,transparent 4px)' }} />baseline engines</span>
              </div>
              <div style={{ marginTop: 14, fontSize: 11.5, color: 'var(--ink-3)' }}>
                66K rows · 2× A100 · prefix bucketing<br /><span className="link">⌥ AstroVela/vane</span>
              </div>
            </Box>
          </div>
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE */}
      <section className="section architecture-section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Platform</Eyebrow>
            <h2 className="h2">Data, agents, and RL on one always-on core.</h2>
            <p className="lead">
              The four workloads above run on one core. Vane senses the world, learns from it, and acts on it — unifying multimodal data processing, long-running agents and RL, from a laptop to a Ray cluster.
            </p>
          </div>
          <PlatformArchitecture />
        </div>
      </section>

      {/* CTA */}
      <div className="wrap"><div className="ddiv" /></div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="start-grid">
            <Box flat className="start-step">
              <span>01</span>
              <h3>Install</h3>
              <p><code>pip install vane-ai</code></p>
            </Box>
            <Box flat className="start-step">
              <span>02</span>
              <h3>Run an example</h3>
              <p>Start from the docs examples and adapt the pipeline to your data.</p>
            </Box>
            <Box flat className="start-step">
              <span>03</span>
              <h3>Build your POC</h3>
              <p>Use the references and llms.txt files to wire Vane into your stack.</p>
            </Box>
          </div>
          <Cta>
            <Button solid to="/docs" arrow>Read the Docs</Button>
            <Button href={DESIGN_PARTNER_HREF}>Become a design partner</Button>
          </Cta>
        </div>
      </section>

      <Footer home />
    </>
  )
}
