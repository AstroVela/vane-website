import Head from '@docusaurus/Head'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'

const DESIGN_PARTNER_HREF = 'mailto:hello@vane.ai?subject=Vane%20autonomous%20driving%20design%20partner'

const HERO_CODE = `import vane
from vane.ai import detect, embed

vane.configure(runner="ray")
logs = vane.read("s3://drive-logs/*/frames/*")          # multi-sensor frames
labeled = detect(logs, columns=["camera", "lidar"],     # offboard auto-label model
                 model="perception-xl", num_gpus=1)
clean = labeled.dedup("scene_id").write("s3://release/v42/")`

const PIPELINE_CODE = `import vane
from vane.ai import detect, embed

vane.configure(runner="ray")

frames = vane.sql("""
    SELECT log_id, ts, camera, lidar, calib
    FROM read_parquet('s3://drive-logs/*/frames/*.parquet')
    WHERE split = 'train'
""")

# 1) offboard auto-label as a GPU UDF, batched on Ray
labeled = detect(frames, columns=["camera", "lidar"],
                 model="perception-xl", num_gpus=1, batch_size=64)

# 2) dedup near-identical scenes, embed for retrieval/QC
unique = labeled.dedup("scene_id")
enriched = embed(unique, "camera", provider="transformers")

# 3) write the packaged dataset release
enriched.write_parquet("s3://release/v42/")`

const RUN_CODE = `pip install -i https://test.pypi.org/simple/ vane-ai
python -m vane_examples.training_data_pipeline

# expected sample run: ~N min on 1x A10
# replace N with the measured C.1 example result`

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
        <title>Training-data pipelines for autonomous driving & physical AI — Vane</title>
        <meta
          name="description"
          content="Turn PB-scale multi-sensor drive logs into training-ready datasets — faster, in far less code. Distributed multimodal processing and batch auto-labeling on Ray, with DuckDB-compatible SQL/Python."
        />
        <meta property="og:title" content="Training-data pipelines for autonomous driving & physical AI — Vane" />
        <meta property="og:description" content="3.1x throughput vs Ray Data. Drive logs to training-ready releases with one distributed multimodal pipeline." />
      </Head>

      <Nav />

      {/* HERO */}
      <section className="hero training-hero">
        <div className="wrap hero-grid">
          <div>
            <Eyebrow style={{ marginBottom: 20 }}>Use Case · Autonomous Driving / Physical AI</Eyebrow>
            <h1 className="h1">
              From PB-scale drive logs to training-ready datasets.
            </h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: 620 }}>
              Fleets and robots stream multi-sensor logs faster than any single data stack can process. Vane runs the whole pipeline — decode, align, auto-label, dedup, package — distributed on Ray, with the DuckDB-compatible Python API you already use.
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
          <CodeWindow filename="drive_release.py" running code={HERO_CODE} language="python" />
        </div>
      </section>

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
              cost="Continuous PB/EB processing, offline auto-labeling and full historical recompute are all bottlenecked on throughput and GPU utilization. That's where the bill is."
              href="#benchmark"
              cta="See the benchmarks"
              bullets={[
                {
                  title: 'Efficient heterogeneous execution',
                  copy: 'overlap CPU decode, GPU inference and IO asynchronously, so GPUs stay fed.',
                },
                {
                  title: 'Streaming + backpressure + dynamic batching',
                  copy: 'push large sensor objects through continuously, no OOM.',
                },
                {
                  title: 'Distributed on Ray',
                  copy: 're-run PB of history as one scalable graph, not a multi-system, multi-day job.',
                },
              ]}
            />
            <Advantage
              title="Simplicity — one engine, no glue code"
              cost="Today the pipeline scatters SQL in one system, preprocessing in Python scripts, inference in separate Ray jobs, embeddings through glue code — images, audio and video each handled apart."
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
                  title: 'The whole drive-log to release pipeline',
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
              The headline benchmark is vLLM batch inference over 66K rows on 2x A100 with prefix bucketing. It is not a drive-log workload, but it tests the same bottleneck: keeping expensive GPUs fed.
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
              <p>Workload-dependent · fully reproducible. Use the benchmark scripts as the starting point, then rerun with your own sensor mix and auto-label model.</p>
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
            <h2 className="h2">The release pipeline in one graph.</h2>
            <p className="lead">
              SQL selection, GPU auto-label, dedup, embedding, and packaged output stay in one readable pipeline.
            </p>
          </div>
          <CodeWindow filename="training_data_release.py" code={PIPELINE_CODE} language="python" />
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
                Install the pre-release, run the sample pipeline, then swap the sample manifest for your drive-log schema. The example is the C.1 path this page points teams to first.
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
              <h2 className="h2" style={{ marginTop: 12 }}>Bring your sensor schema and your bill.</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                Point your code agent at our docs (llms.txt) and it'll scaffold a pipeline for your sensor schema. Curious whether Vane would cut your auto-label GPU bill? Bring your numbers — let's run the math together.
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
          <Cta title="Running perception data at fleet scale? Let's make Vane fit your release pipeline.">
            <Button solid href={DESIGN_PARTNER_HREF} arrow>Become a design partner</Button>
            <Button to="/docs">Read the docs</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
