import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'
import PixelIcon from '../components/PixelIcon'
import PlatformArchitecture from '../components/PlatformArchitecture'
import { Link } from '../router'
import { USE_CASES } from './useCasesData'

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

const OLD_WAY = [
  'SQL in one system',
  'Preprocessing in Python scripts',
  'Inference in separate Ray jobs',
  'Embeddings written through glue code',
  'Images, audio & video handled separately',
]

const NEW_WAY = [
  'DuckDB-compatible SQL',
  'Python map_batches UDFs',
  'Ray task & actor execution',
  'AI functions for embedding & prompting',
  'Parquet / S3 output in one pipeline',
]

export default function Home() {
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
              The multimodal-native<br />data engine for AI workloads
            </h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: 480 }}>
              Build SQL, Python UDF, preprocessing, embedding, and model inference pipelines on Ray — with DuckDB-compatible APIs.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 34, flexWrap: 'wrap' }}>
              <Button solid to="/docs" arrow>Get Started</Button>
              <Button to="/use-cases">View use cases</Button>
            </div>
            <div className="install" style={{ marginTop: 30 }}>
              <span className="c"><span className="p">$</span> pip install vane-ai</span>
              <span>·</span><span>pre-release</span><span>·</span><span>Apache-2.0</span>
            </div>
          </div>
          <CodeWindow filename="multimodal.py" running code={HERO_CODE} />
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE */}
      <section className="section architecture-section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Platform</Eyebrow>
            <h2 className="h2">Data, agents, and RL on one always-on core.</h2>
            <p className="lead">
              Vane unifies multimodal data processing, long-running agents, and reinforcement learning on a single execution core that runs on a laptop or a Ray cluster.
            </p>
          </div>
          <PlatformArchitecture />
        </div>
      </section>

      {/* WHY VANE DATA */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Why Vane Data</Eyebrow>
            <h2 className="h2">Why multimodal AI workloads need a data engine.</h2>
            <p className="lead">
              Text, images, audio and video pipelines usually scatter SQL, preprocessing, inference and output across separate systems. Vane unifies them on Ray behind DuckDB-compatible APIs.
            </p>
          </div>
          <div className="vs">
            <Box className="old" style={{ padding: '24px 26px' }}>
              <h3>The old way</h3>
              <ul className="rowl">
                {OLD_WAY.map((t, i) => (
                  <li key={i}><span className="mk x">✕</span>{t}</li>
                ))}
              </ul>
            </Box>
            <Box className="new" style={{ padding: '24px 26px' }}>
              <h3>With Vane Data</h3>
              <ul className="rowl">
                {NEW_WAY.map((t, i) => (
                  <li key={i}><span className="mk c">✓</span>{t}</li>
                ))}
              </ul>
            </Box>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="h2">From data lake to results, in one graph.</h2>
          </div>
          <Box className="arch">
            <div className="arch-flow">
              <div>
                <div className="azt">Sources</div>
                <div className="anode"><span className="mut">▦</span> Parquet</div>
                <div className="anode"><span className="mut">▦</span> S3 / object store</div>
                <div className="anode"><span className="mut">▦</span> Data lake</div>
              </div>
              <div className="conn"><span className="pk" /></div>
              <div>
                <div className="engine">
                  <div className="eh">
                    <span className="eng-ico">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 3 L11 8 L2 13 Z" fill="currentColor" />
                        <rect x="12" y="3" width="2" height="10" fill="currentColor" />
                      </svg>
                    </span>
                    <span className="wm">vane-data</span><span className="on">on Ray</span>
                  </div>
                  <div className="el"><span className="lt">query</span> DuckDB-compatible SQL / Relation</div>
                  <div className="el"><span className="lt">transform</span> map_batches · flat_map · UDFs</div>
                  <div className="el"><span className="lt">execute</span> Ray tasks · actors <span className="bars"><i /><i /><i /><i /></span></div>
                </div>
              </div>
              <div className="conn d2"><span className="pk" /></div>
              <div>
                <div className="azt">Results</div>
                <div className="anode"><span className="mut">▦</span> Arrow</div>
                <div className="anode"><span className="mut">▦</span> Parquet</div>
                <div className="anode"><span className="mut">▦</span> S3</div>
              </div>
            </div>
          </Box>
          <div className="cap-grid">
            <div className="cap"><span className="cn">01</span>DuckDB-compatible API</div>
            <div className="cap"><span className="cn">02</span>Ray distributed execution</div>
            <div className="cap"><span className="cn">03</span>Python-native AI UDFs</div>
            <div className="cap"><span className="cn">04</span>Multimodal preprocessing</div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="section" id="use-cases" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
            <div>
              <Eyebrow>Use Cases</Eyebrow>
              <h2 className="h2" style={{ marginTop: 12 }}>AI pipelines Vane is built for.</h2>
            </div>
            <Button sm to="/use-cases" arrow>See all</Button>
          </div>
          <div className="uc-grid">
            {USE_CASES.map((u) => (
              <Box as={Link} to={`/use-cases#${u.id}`} className="uc" key={u.id}>
                <div className="top">
                  <span className="ic"><PixelIcon name={u.icon} /></span>
                  <span className="tg">{u.tag}</span>
                </div>
                <h3>{u.title}</h3>
                <p>{u.summary}</p>
                <div className="ex">Example: <u>{u.filename}</u></div>
              </Box>
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

      {/* CTA */}
      <div className="wrap"><div className="ddiv" /></div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta>
            <Button solid to="/docs" arrow>Read the Docs</Button>
            <Button href="#use-cases">Explore Use Cases</Button>
          </Cta>
        </div>
      </section>

      <Footer home />
    </>
  )
}
