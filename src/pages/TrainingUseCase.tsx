import Head from '@docusaurus/Head'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'
import TrainingDataFactoryAnimation from '../components/TrainingDataFactoryAnimation'
import PixelIcon, { type PixelIconName } from '../components/PixelIcon'
import { TRAINING_DESIGN_PARTNER_MAILTO } from '../siteLinks'

const PIPELINE_CODE = `import vane

vane.configure(runner="ray")
con = vane.connect()

# Select train records from the raw manifest.
raw = con.sql("""
select id, uri, media_type, text, metadata, content_hash
from read_parquet('s3://training-corpus/manifest/*.parquet')
where split = 'train'
""")

# Decode media and run captioning / labeling on Ray actors.
labeled = raw.map_batches(
    CaptionAndScore, schema=release_schema,
    execution_backend="ray_actor", gpus=1, batch_size=64,
)
labeled.to_table("labeled")

# Filter by quality, dedupe by content hash, then embed captions.
release = con.sql("""
select * exclude rn
from (
  select *, row_number() over (
    partition by content_hash order by quality_score desc
  ) as rn
  from labeled
  where quality_score >= 0.8
)
where rn = 1
""").embed_text(
    "caption",
    provider="transformers",
    execution_backend="ray_actor",
)

# Publish a versioned training-data release.
release.write_parquet("s3://dataset-releases/mm-v42/")`

function Divider() {
  return <div className="wrap"><div className="ddiv" /></div>
}

const HERO_MODALITIES: Array<{ icon: PixelIconName; label: string; sub: string }> = [
  { icon: 'vision', label: 'IMAGE', sub: 'jpg · webp' },
  { icon: 'video', label: 'VIDEO', sub: 'mp4 · frames' },
  { icon: 'audio', label: 'AUDIO', sub: 'wav · pcm' },
  { icon: 'embeddings', label: 'TEXT', sub: 'caption · doc' },
  { icon: 'sensor', label: 'SENSOR', sub: 'lidar · pose' },
]

function TrainingHeroShape() {
  return (
    <div className="training-hero-art" aria-label="Five raw modalities — image, video, audio, text, and sensor — converging through the Vane engine into a versioned training-dataset release">
     <div className="thg-stage">
      <svg className="training-art-flow" viewBox="0 0 486 420" role="presentation" focusable="false">
        {/* raw modalities fan into the engine */}
        <path className="fan" d="M154 113 C 172 132 186 182 194 206" />
        <path className="fan" d="M154 167 C 174 180 188 197 194 208" />
        <path className="fan" d="M154 221 C 174 218 188 213 194 210" />
        <path className="fan" d="M154 275 C 174 262 188 224 194 212" />
        <path className="fan" d="M154 329 C 172 300 186 236 194 214" />
        {/* the engine emits one unified release */}
        <path className="emit" d="M302 210 C 320 220 322 246 338 251" />
        <path className="emit-head" d="M331 245 L340 251 L331 257" />
      </svg>

      <div className="training-art-orbit orbit-lens" aria-hidden="true" />

      <div className="thg-inputs" aria-hidden="true">
        {HERO_MODALITIES.map((m) => (
          <span className="thg-chip" key={m.label}>
            <span className="ic"><PixelIcon name={m.icon} size={15} /></span>
            <span className="thg-chip-copy">
              <b>{m.label}</b>
              <small>{m.sub}</small>
            </span>
          </span>
        ))}
      </div>

      <div className="thg-engine" aria-hidden="true">
        <span className="thg-engine-title">VANE</span>
        <span className="thg-engine-core" />
        <span className="thg-engine-ops">decode · caption<br />score · embed</span>
      </div>

      <div className="thg-release" aria-hidden="true">
        <span className="thg-score"><i /><i /><i /><i /></span>
        <span className="thg-card" />
        <span className="thg-card" />
        <span className="thg-card" />
      </div>

      <div className="training-art-label label-source">raw · multimodal</div>
      <div className="training-art-label label-release">dataset release</div>
     </div>
    </div>
  )
}

function Advantage({
  title,
  cost,
  bullets,
  href,
  cta,
}: {
  title: string
  cost: string
  bullets: Array<{ title: string; copy: string }>
  href: string
  cta: string
}) {
  return (
    <Box className="training-advantage">
      <h3>{title}</h3>
      <p className="training-cost">{cost}</p>
      <ul>
        {bullets.map((bullet) => (
          <li key={bullet.title}>
            <b>{bullet.title}</b>
            <span>{bullet.copy}</span>
          </li>
        ))}
      </ul>
      <a className="training-link" href={href}>{cta} <span className="ar">→</span></a>
    </Box>
  )
}

export default function TrainingUseCase() {
  const brokenLinks = useBrokenLinks()
  brokenLinks.collectAnchor('code')

  return (
    <>
      <Head>
        <title>Multimodal training data pipelines for AI models — Vane</title>
        <meta
          name="description"
          content="Prepare images, video, audio, documents, tables, and sensor logs for multimodal model training. Run filtering, captioning, embedding, deduplication, auto-labeling, and dataset release packaging in one Ray-backed pipeline."
        />
        <meta property="og:title" content="Multimodal training data pipelines for AI models — Vane" />
        <meta property="og:description" content="3.1x batch inference throughput vs Ray Data. Raw multimodal data to training-ready releases with one distributed pipeline." />
      </Head>

      <Nav />

      {/* HERO — solutions intro archetype: editorial copy + primary actions,
          leading straight into the execution timeline animation */}
      <section className="intro training-hero">
        <div className="wrap training-hero-grid">
          <div className="training-hero-copy">
            <Eyebrow style={{ marginBottom: 20 }}>Use Case · Multimodal Model Training</Eyebrow>
            <h1 className="h1">
              From raw multimodal data to training-ready dataset releases.
            </h1>
            <p className="lead">
              Prepare multimodal training data with one Ray-backed graph: select raw records, run GPU captioning or labeling, filter and dedupe in SQL, embed captions, and write a versioned release.
            </p>
            <div className="training-hero-actions">
              <Button solid to="/docs/data/examples/training-data-pipeline" arrow>Run the pipeline</Button>
              <Button href={TRAINING_DESIGN_PARTNER_MAILTO} arrow>Request a demo</Button>
            </div>
          </div>
          <TrainingHeroShape />
        </div>
      </section>

      <Divider />

      <TrainingDataFactoryAnimation />

      <Divider />

      {/* WHY VANE */}
      <section className="section" style={{ padding: '52px 0 56px' }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Why Vane</Eyebrow>
            <h2 className="h2">Faster pipelines, in far less code.</h2>
          </div>
          <div className="training-advantages">
            <Advantage
              title="Performance — higher throughput, fuller GPUs"
              cost="Training-scale multimodal data preparation, offline captioning, auto-labeling, quality scoring, embedding, deduplication, and historical reprocessing are all bottlenecked on throughput and GPU utilization. That's where the bill is."
              href="/benchmarks"
              cta="See the benchmarks"
              bullets={[
                {
                  title: 'Efficient heterogeneous execution',
                  copy: 'overlap media decode, GPU captioning, auto-labeling, embedding, and IO asynchronously, so expensive accelerators stay fed.',
                },
                {
                  title: 'Streaming + backpressure + dynamic batching',
                  copy: 'push large media and sensor objects through continuously, no OOM.',
                },
                {
                  title: 'Distributed on Ray',
                  copy: 're-run PB of history as one scalable graph, not a multi-system, multi-day job.',
                },
              ]}
            />
            <Advantage
              title="Simplicity — one engine, no glue code"
              cost="Today the pipeline scatters file selection, media decoding, model inference, quality filters, embeddings, deduplication, and dataset packaging across separate jobs and glue code."
              href="#code"
              cta="Read the code"
              bullets={[
                {
                  title: 'One engine, one graph',
                  copy: 'DuckDB-compatible SQL + Python UDFs + AI functions + Ray execution, with a single output.',
                },
                {
                  title: 'DuckDB-compatible API',
                  copy: 'low migration cost from existing Ray, Spark, or Daft pipelines.',
                },
                {
                  title: 'The whole raw-data to release pipeline',
                  copy: 'fits in one readable code window without separate orchestration glue.',
                },
              ]}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* CODE */}
      <section className="section" id="code" style={{ padding: '52px 0 56px' }}>
        <div className="wrap">
          <div className="training-code-layout">
            <div className="training-code-copy">
              <Eyebrow>Representative code</Eyebrow>
              <h2 className="h2">The training-data release pipeline in one graph.</h2>
              <p className="lead">
                File selection, media decoding, GPU captioning or auto-labeling, quality filters, deduplication, embedding, and packaged output stay in one readable pipeline.
              </p>
              <div className="training-code-steps" aria-label="Pipeline stages shown in the representative code">
                <span>SQL selection</span>
                <span>Ray GPU UDF</span>
                <span>SQL quality gate</span>
                <span>Embedding + release</span>
              </div>
              <p className="training-code-note">
                CaptionAndScore is your batch UDF for decoding media, running GPU captioning or labeling, and returning stable release columns.
              </p>
            </div>
            <div className="training-code-showcase">
              <CodeWindow filename="training_data_release.py" code={PIPELINE_CODE} language="python" />
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta title="Build a reproducible multimodal training-data pipeline.">
            <Button solid href={TRAINING_DESIGN_PARTNER_MAILTO} arrow>Become a design partner</Button>
            <Button to="/docs/data/examples">Read the docs</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
