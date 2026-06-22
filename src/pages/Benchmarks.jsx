import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'

const REPRODUCE_CODE = `<span class="c"># clone, pin the environment, run</span>
git clone https://github.com/AstroVela/vane
<span class="f">cd</span> vane/benchmarks
pip install -r requirements.lock

<span class="c"># vLLM batch inference benchmark</span>
python bench_vllm.py <span class="p">\\</span>
    --dataset s3://bench/prompts-66k.parquet <span class="p">\\</span>
    --gpus <span class="n">2</span> --bucketing prefix --runs <span class="n">3</span>`

function Divider() {
  return <div className="wrap"><div className="ddiv" /></div>
}

export default function Benchmarks() {
  return (
    <>
      <Nav />

      {/* INTRO */}
      <section className="intro">
        <div className="wrap">
          <Eyebrow>Benchmarks</Eyebrow>
          <h1 className="h1" style={{ marginTop: 16, fontSize: 'clamp(34px,4.6vw,52px)' }}>
            Benchmarks, with receipts
          </h1>
          <p className="lead" style={{ marginTop: 18, maxWidth: 640 }}>
            Credible technical evidence, not marketing numbers. Throughput is relative to Ray Data on identical hardware. Every row lists its dataset, hardware, command and environment — and links to a reproducible script.
          </p>
        </div>
      </section>

      <Divider />

      {/* SUMMARY */}
      <section className="bm-sec">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Summary</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>Benchmark summary</h2>
          </div>
          <Box flat style={{ overflow: 'hidden' }}>
            <table className="summary">
              <thead>
                <tr><th>Workload</th><th>Dataset</th><th>Hardware</th><th>Vane</th><th>Ray&nbsp;Data</th><th>Daft</th><th>Notes</th></tr>
              </thead>
              <tbody>
                <tr><td>vLLM batch inference</td><td className="b">66K rows</td><td className="b">2× A100 80GB</td><td className="v">3.1×</td><td className="b">1.0×</td><td className="b">1.6×</td><td><span className="tagx">stable</span></td></tr>
                <tr><td>Text embedding</td><td className="b">480M chunks</td><td className="b">8× A10G</td><td className="v">2.4×</td><td className="b">1.0×</td><td className="b">1.3×</td><td><span className="tagx">stable</span></td></tr>
                <tr><td>Image decode + CLIP</td><td className="b">12M images</td><td className="b">4× A10G</td><td className="v">1.9×</td><td className="b">1.0×</td><td className="b">1.7×</td><td><span className="tagx exp">experimental</span></td></tr>
                <tr><td>Audio transcription</td><td className="b">120K clips</td><td className="b">4× A100</td><td className="v">2.2×</td><td className="b">1.0×</td><td className="b">—</td><td><span className="tagx exp">experimental</span></td></tr>
              </tbody>
            </table>
          </Box>
          <p className="mut" style={{ fontSize: 12, marginTop: 12 }}>
            Higher is better. Vane / Ray Data / Daft columns are relative throughput; baseline = Ray Data 1.0×.
          </p>
        </div>
      </section>

      <Divider />

      {/* vLLM */}
      <section className="bm-sec">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Detail</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>vLLM batch inference</h2>
            <p className="lead" style={{ marginTop: 12, maxWidth: 640 }}>
              Prefix bucketing groups similar-length prompts to cut padding waste, raising effective batch utilization on the same GPUs.
            </p>
          </div>
          <div className="statline">
            <div className="stat"><div className="n">3.1×</div><div className="l">throughput vs Ray Data</div></div>
            <div className="stat"><div className="n">41<span style={{ fontSize: 18 }}> min</span></div><div className="l">wall-clock (was 127 min)</div></div>
            <div className="stat"><div className="n">92<span style={{ fontSize: 18 }}>%</span></div><div className="l">mean GPU utilization</div></div>
          </div>
          <div className="grid2">
            <Box className="lat">
              <div className="azt" style={{ textAlign: 'left', marginBottom: 14 }}>Throughput (higher is better)</div>
              <div className="latrow"><span className="pl">Vane</span><div className="bar"><div className="fillb vane" style={{ width: '100%' }} /></div><span className="val">3.1×</span></div>
              <div className="latrow"><span className="pl">Daft</span><div className="bar"><div className="fillb base" style={{ width: '52%' }} /></div><span className="val mut">1.6×</span></div>
              <div className="latrow"><span className="pl">Ray Data</span><div className="bar"><div className="fillb base" style={{ width: '32%' }} /></div><span className="val mut">1.0×</span></div>
              <div className="leg">
                <span><span className="sw" style={{ background: 'var(--ink)' }} />Vane</span>
                <span><span className="sw base" style={{ background: 'repeating-linear-gradient(45deg,var(--ink-3),var(--ink-3) 2px,transparent 2px,transparent 4px)' }} />baseline engines</span>
              </div>
            </Box>
            <Box flat style={{ overflow: 'hidden' }}>
              <table className="specs">
                <tbody>
                  <tr><th>Dataset</th><td>66K prompt rows · <span className="mut">s3://bench/prompts-66k.parquet</span></td></tr>
                  <tr><th>Hardware</th><td>AWS p4d · 2× A100 80GB · NVLink</td></tr>
                  <tr><th>Command</th><td><span className="link">python bench_vllm.py --gpus 2 --bucketing prefix</span></td></tr>
                  <tr><th>Env</th><td>ray==2.40 · vllm==0.6.3 · CUDA 12.4</td></tr>
                  <tr><th>Runtime</th><td>41 min (median of 3, warm cache excluded)</td></tr>
                  <tr><th>Throughput</th><td>3.1× vs Ray Data baseline</td></tr>
                  <tr><th>Notes</th><td className="note">Gains shrink to ~2.4× without prefix bucketing.</td></tr>
                </tbody>
              </table>
            </Box>
          </div>
        </div>
      </section>

      <Divider />

      {/* MULTIMODAL */}
      <section className="bm-sec">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Multimodal</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>Multimodal pipeline benchmarks</h2>
            <p className="lead" style={{ marginTop: 12, maxWidth: 640 }}>
              Image, audio, document and video workloads. Image-decode + CLIP and audio transcription are measured below; document and video are in progress.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <span className="tagx">Image · CLIP — stable</span>
            <span className="tagx">Audio · transcription — stable</span>
            <span className="tagx exp">Document · extraction — experimental</span>
            <span className="tagx exp">Video · frames — in progress</span>
          </div>
          <div className="grid2">
            <Box flat style={{ overflow: 'hidden' }}>
              <table className="specs">
                <tbody>
                  <tr><th>Workload</th><td>Image decode + CLIP features</td></tr>
                  <tr><th>Dataset</th><td>12M images · LAION subset</td></tr>
                  <tr><th>Hardware</th><td>4× A10G</td></tr>
                  <tr><th>Command</th><td><span className="link">python bench_image.py --gpus 4</span></td></tr>
                  <tr><th>Throughput</th><td>1.9× vs Ray Data</td></tr>
                  <tr><th>Notes</th><td className="note">Experimental; decode path still CPU-bound.</td></tr>
                </tbody>
              </table>
            </Box>
            <Box flat style={{ overflow: 'hidden' }}>
              <table className="specs">
                <tbody>
                  <tr><th>Workload</th><td>Audio transcription</td></tr>
                  <tr><th>Dataset</th><td>120K call recordings</td></tr>
                  <tr><th>Hardware</th><td>4× A100</td></tr>
                  <tr><th>Command</th><td><span className="link">python bench_audio.py --gpus 4</span></td></tr>
                  <tr><th>Throughput</th><td>2.2× vs Ray Data</td></tr>
                  <tr><th>Notes</th><td className="note">Whisper-large-v3; batch tuned to 8.</td></tr>
                </tbody>
              </table>
            </Box>
          </div>
        </div>
      </section>

      <Divider />

      {/* METHODOLOGY */}
      <section className="bm-sec">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Methodology</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>Methodology</h2>
            <p className="lead" style={{ marginTop: 12, maxWidth: 640 }}>
              A benchmark you can't reproduce is a marketing number. Everything here is pinned and scripted.
            </p>
          </div>
          <Box flat style={{ overflow: 'hidden' }}>
            <table className="specs">
              <tbody>
                <tr><th>Datasets</th><td>Common Crawl segments, RedPajama, LAION subset, internal call set. Manifests pinned by SHA.</td></tr>
                <tr><th>Hardware</th><td>AWS p4d / g5 instances. CUDA 12.4, driver 550, NVLink where noted.</td></tr>
                <tr><th>Environment</th><td>ray==2.40, vllm==0.6.3, pyarrow==14 — pinned in <span className="link">benchmarks/requirements.lock</span>.</td></tr>
                <tr><th>Measurement</th><td>Median of 3 runs, warm cache excluded. Wall-clock from first read to last write.</td></tr>
                <tr><th>Baselines</th><td>Ray Data and Daft on identical hardware, same dataset, same output target.</td></tr>
              </tbody>
            </table>
          </Box>
        </div>
      </section>

      <Divider />

      {/* REPRODUCE */}
      <section className="bm-sec" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>Reproduce</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>Reproduce</h2>
          </div>
          <CodeWindow filename="reproduce.sh" code={REPRODUCE_CODE} />
        </div>
      </section>

      {/* CTA */}
      <Divider />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta>
            <Button solid to="/docs" arrow>Read the Docs</Button>
            <Button to="/use-cases">Explore use cases</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
