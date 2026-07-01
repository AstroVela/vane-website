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

const DESIGN_PARTNER_HREF = 'mailto:hello@vane.ai?subject=Vane%20multimodal%20training%20data%20design%20partner'

const HERO_CODE = `import vane
from vane.ai import describe, embed

vane.configure(runner="ray")
items = vane.read("s3://training-corpus/*")             # images, video, audio, docs, logs
labeled = describe(items, columns=["image", "video", "audio", "text"],
                   model="your-caption-or-label-model", num_gpus=1)
clean = labeled.dedup("content_hash").write("s3://dataset-releases/mm-v42/")`

const PIPELINE_CODE = `import vane
from vane.ai import describe, embed

vane.configure(runner="ray")

items = vane.sql("""
    SELECT uri, media_type, text, metadata
    FROM read_files('s3://training-corpus/*')
    WHERE split = 'train'
""")

# 1) caption or auto-label as a GPU UDF, batched on Ray
labeled = describe(items, columns=["image", "video", "audio", "text"],
                   model="your-caption-or-label-model",
                   num_gpus=1, batch_size=64)

# 2) filter low-quality items, dedup, embed for retrieval/QC
filtered = labeled.filter("quality_score >= 0.8")
unique = filtered.dedup("content_hash")
enriched = embed(unique, "caption", provider="transformers")

# 3) write the packaged dataset release
enriched.write_parquet("s3://dataset-releases/mm-v42/")`

const RUN_CODE = `pip install -i https://test.pypi.org/simple/ vane-ai
python -m vane_examples.training_data_pipeline

# runs the sample multimodal training-data pipeline end-to-end on a single GPU`

function Divider() {
  return <div className="wrap"><div className="ddiv" /></div>
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
  brokenLinks.collectAnchor('benchmark')
  brokenLinks.collectAnchor('code')
  brokenLinks.collectAnchor('run-it')
  brokenLinks.collectAnchor('poc')

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

      {/* HERO */}
      <section className="hero training-hero">
        <div className="wrap hero-grid">
          <div>
            <Eyebrow style={{ marginBottom: 20 }}>Use Case · Multimodal Model Training</Eyebrow>
            <h1 className="h1">
              From raw multimodal data to training-ready dataset releases.
            </h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: 620 }}>
              VLMs, video models, VLA models, and physical AI systems all depend on the same hard data work: select, decode, caption, label, embed, deduplicate, filter, and package multimodal data at training scale. Vane runs that pipeline as one Ray-backed graph.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
              <Button solid to="/benchmarks" arrow>See benchmarks</Button>
              <Button to="/docs/examples/training-data-pipeline" arrow>Run the pipeline</Button>
            </div>
            <div className="install" style={{ marginTop: 28 }}>
              <span className="c"><span className="p">$</span> pip install vane-ai</span>
              <span>·</span><span>Apache-2.0</span>
            </div>
          </div>
          <CodeWindow filename="training_release.py" running code={HERO_CODE} language="python" />
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
              href="#benchmark"
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

      {/* BENCHMARK */}
      <section className="section" id="benchmark" style={{ padding: '52px 0 56px' }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Proof · Performance</Eyebrow>
            <h2 className="h2">Measured, and reproducible.</h2>
            <p className="lead">
              The headline benchmark measures the bottleneck many multimodal training pipelines hit first: high-throughput batch model inference for captioning, labeling, scoring, and embedding.
            </p>
          </div>
          <div className="training-proof-grid">
            <Box style={{ padding: '28px 30px' }}>
              <div className="azt" style={{ textAlign: 'left' }}>vLLM batch inference · 66K rows · 2x A100</div>
              <div className="training-stat">3.1×</div>
              <p className="mut" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>
                throughput vs Ray Data, with prefix bucketing on identical hardware.
              </p>
              <Button sm to="/benchmarks" arrow style={{ marginTop: 22 }}>Full benchmarks</Button>
            </Box>
            <Box flat className="training-matrix">
              <div className="azt" style={{ textAlign: 'left' }}>Reproducible public multimodal matrix</div>
              <div className="training-matrix-grid">
                <span><b>~20× Spark</b><em>image classification</em></span>
                <span><b>~2× Daft</b><em>document embedding</em></span>
                <span><b>~1.2× Ray Data</b><em>audio and video workloads</em></span>
              </div>
              <p>Workload-dependent · fully reproducible. Use the benchmark scripts as a starting point, then rerun with your own media mix, filters, and captioning or auto-label model.</p>
            </Box>
          </div>
        </div>
      </section>

      <Divider />

      {/* CODE */}
      <section className="section" id="code" style={{ padding: '52px 0 56px' }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Representative code</Eyebrow>
            <h2 className="h2">The training-data release pipeline in one graph.</h2>
            <p className="lead">
              File selection, media decoding, GPU captioning or auto-labeling, quality filters, deduplication, embedding, and packaged output stay in one readable pipeline.
            </p>
          </div>
          <CodeWindow filename="training_data_release.py" code={PIPELINE_CODE} language="python" />
          <p className="mut" style={{ maxWidth: 760, margin: '18px auto 0', fontSize: 13.5, lineHeight: 1.55 }}>
            For Physical AI and VLA training, the same pipeline can read camera, lidar, trajectories, actions, calibration, and scene metadata.
          </p>
        </div>
      </section>

      <Divider />

      {/* RUN IT */}
      <section className="section" id="run-it" style={{ padding: '52px 0 56px' }}>
        <div className="wrap">
          <div className="training-run-grid">
            <div>
              <Eyebrow>Run it</Eyebrow>
              <h2 className="h2" style={{ marginTop: 12 }}>Start with the training-data example.</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                Install the pre-release, run the sample multimodal training-data pipeline, then swap the sample manifest for your images, video, audio, documents, tables, or sensor logs.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
                <Button solid to="/docs/examples/training-data-pipeline" arrow>Open the example</Button>
                <Button to="/benchmarks">Benchmark scripts</Button>
              </div>
            </div>
            <CodeWindow filename="run.sh" code={RUN_CODE} language="bash" />
          </div>
        </div>
      </section>

      <Divider />

      {/* POC */}
      <section className="section" id="poc" style={{ padding: '52px 0 56px' }}>
        <div className="wrap">
          <Box className="training-poc">
            <div>
              <Eyebrow>Do a POC</Eyebrow>
              <h2 className="h2" style={{ marginTop: 12 }}>Estimate your training-data processing cost.</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                Point your code agent at our docs (llms.txt) and it'll scaffold a pipeline for your data schema. Curious whether Vane would lower your captioning, auto-labeling, or historical reprocessing bill? Bring your numbers — let's run the math together.
              </p>
            </div>
            <div className="training-poc-actions">
              <Button solid href={DESIGN_PARTNER_HREF} arrow>Become a design partner</Button>
              <Button href="https://vane.dev/docs/llms.txt">Open llms.txt</Button>
            </div>
          </Box>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta title="Preparing multimodal training data at scale? Let's make Vane fit your release pipeline.">
            <Button solid href={DESIGN_PARTNER_HREF} arrow>Become a design partner</Button>
            <Button to="/docs">Read the docs</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
