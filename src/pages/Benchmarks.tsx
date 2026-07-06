import Nav from '../components/Nav'
import type {ReactNode} from 'react'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'
import { pickLocale, useSiteLocale } from '../siteI18n'

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
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      eyebrow: 'Benchmarks',
      heading: 'Benchmarks, with receipts',
      lead: 'Credible technical evidence, not marketing numbers. Throughput is relative to Ray Data on identical hardware. Every row lists its dataset, hardware, command and environment — and links to a reproducible script.',
      summary: 'Summary',
      summaryTitle: 'Benchmark summary',
      table: ['Workload', 'Dataset', 'Hardware', 'Vane', 'Ray Data', 'Daft', 'Notes'],
      stable: 'stable',
      experimental: 'experimental',
      higher: 'Higher is better. Vane / Ray Data / Daft columns are relative throughput; baseline = Ray Data 1.0×.',
      detail: 'Detail',
      vllmLead: 'Prefix bucketing groups similar-length prompts to cut padding waste, raising effective batch utilization on the same GPUs.',
      throughputVs: 'throughput vs Ray Data',
      wallClock: 'wall-clock (was 127 min)',
      gpuUtil: 'mean GPU utilization',
      throughputTitle: 'Throughput (higher is better)',
      baselineEngines: 'baseline engines',
      specs: {
        dataset: 'Dataset',
        hardware: 'Hardware',
        command: 'Command',
        env: 'Env',
        runtime: 'Runtime',
        throughput: 'Throughput',
        notes: 'Notes',
        runtimeValue: '41 min (median of 3, warm cache excluded)',
        throughputValue: '3.1× vs Ray Data baseline',
        notesValue: 'Gains shrink to ~2.4× without prefix bucketing.',
      },
      multimodal: 'Multimodal',
      multimodalTitle: 'Multimodal pipeline benchmarks',
      multimodalLead: 'Image, audio, document and video workloads. Image-decode + CLIP and audio transcription are measured below; document and video are in progress.',
      tags: ['Image · CLIP — stable', 'Audio · transcription — stable', 'Document · extraction — experimental', 'Video · frames — in progress'],
      workload: 'Workload',
      imageWorkload: 'Image decode + CLIP features',
      audioWorkload: 'Audio transcription',
      imageNotes: 'Experimental; decode path still CPU-bound.',
      audioNotes: 'Whisper-large-v3; batch tuned to 8.',
      methodology: 'Methodology',
      methodologyLead: "A benchmark you can't reproduce is a marketing number. Everything here is pinned and scripted.",
      methodRows: [
        ['Datasets', 'Common Crawl segments, RedPajama, LAION subset, internal call set. Manifests pinned by SHA.'],
        ['Hardware', 'AWS p4d / g5 instances. CUDA 12.4, driver 550, NVLink where noted.'],
        ['Environment', <>ray==2.40, vllm==0.6.3, pyarrow==14 — pinned in <span className="link">benchmarks/requirements.lock</span>.</>],
        ['Measurement', 'Median of 3 runs, warm cache excluded. Wall-clock from first read to last write.'],
        ['Baselines', 'Ray Data and Daft on identical hardware, same dataset, same output target.'],
      ] as Array<[string, ReactNode]>,
      reproduce: 'Reproduce',
      readDocs: 'Read the Docs',
      explore: 'Explore use cases',
    },
    {
      eyebrow: '基准测试',
      heading: '有证据的基准测试',
      lead: '这里展示的是可信的技术证据，不是营销数字。吞吐量是在相同硬件上相对于 Ray Data 的结果。每一行都列出数据集、硬件、命令和环境，并链接到可复现脚本。',
      summary: '摘要',
      summaryTitle: '基准测试摘要',
      table: ['工作负载', '数据集', '硬件', 'Vane', 'Ray Data', 'Daft', '备注'],
      stable: '稳定',
      experimental: '实验性',
      higher: '越高越好。Vane / Ray Data / Daft 列表示相对吞吐量；基线 = Ray Data 1.0×。',
      detail: '详情',
      vllmLead: 'Prefix bucketing 会把长度相近的 prompt 分组，减少 padding 浪费，从而在同一批 GPU 上提高有效 batch 利用率。',
      throughputVs: '相比 Ray Data 的吞吐量',
      wallClock: '总耗时（原为 127 min）',
      gpuUtil: '平均 GPU 利用率',
      throughputTitle: '吞吐量（越高越好）',
      baselineEngines: '基线引擎',
      specs: {
        dataset: '数据集',
        hardware: '硬件',
        command: '命令',
        env: '环境',
        runtime: '运行时间',
        throughput: '吞吐量',
        notes: '备注',
        runtimeValue: '41 min（3 次运行中位数，排除 warm cache）',
        throughputValue: '相对 Ray Data 基线为 3.1×',
        notesValue: '不使用 prefix bucketing 时，收益缩小到约 2.4×。',
      },
      multimodal: '多模态',
      multimodalTitle: '多模态 pipeline 基准测试',
      multimodalLead: '覆盖图像、音频、文档和视频工作负载。下方展示 Image decode + CLIP 和音频转写；文档和视频仍在进行中。',
      tags: ['Image · CLIP — 稳定', 'Audio · transcription — 稳定', 'Document · extraction — 实验性', 'Video · frames — 进行中'],
      workload: '工作负载',
      imageWorkload: '图像解码 + CLIP 特征',
      audioWorkload: '音频转写',
      imageNotes: '实验性；decode 路径仍受 CPU 限制。',
      audioNotes: 'Whisper-large-v3；batch 调优为 8。',
      methodology: '方法',
      methodologyLead: '无法复现的 benchmark 只是营销数字。这里的所有内容都固定了版本并提供脚本。',
      methodRows: [
        ['数据集', 'Common Crawl segments、RedPajama、LAION subset、internal call set。Manifest 通过 SHA 固定。'],
        ['硬件', 'AWS p4d / g5 实例。CUDA 12.4，driver 550；如使用 NVLink 会单独注明。'],
        ['环境', <>ray==2.40, vllm==0.6.3, pyarrow==14 — 固定在 <span className="link">benchmarks/requirements.lock</span>。</>],
        ['测量方式', '3 次运行中位数，排除 warm cache。从第一次读取到最后一次写出统计 wall-clock。'],
        ['基线', 'Ray Data 和 Daft 使用相同硬件、相同数据集、相同输出目标。'],
      ] as Array<[string, ReactNode]>,
      reproduce: '复现',
      readDocs: '阅读文档',
      explore: '浏览使用场景',
    },
  )

  return (
    <>
      <Nav />

      {/* INTRO */}
      <section className="intro">
        <div className="wrap">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1 className="h1" style={{ marginTop: 16, fontSize: 'clamp(34px,4.6vw,52px)' }}>
            {copy.heading}
          </h1>
          <p className="lead" style={{ marginTop: 18, maxWidth: 640 }}>
            {copy.lead}
          </p>
        </div>
      </section>

      <Divider />

      {/* SUMMARY */}
      <section className="bm-sec">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.summary}</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>{copy.summaryTitle}</h2>
          </div>
          <Box flat style={{ overflow: 'hidden' }}>
            <table className="summary">
              <thead>
                <tr>{copy.table.map((heading) => <th key={heading}>{heading}</th>)}</tr>
              </thead>
              <tbody>
                <tr><td>vLLM batch inference</td><td className="b">66K rows</td><td className="b">2× A100 80GB</td><td className="v">3.1×</td><td className="b">1.0×</td><td className="b">1.6×</td><td><span className="tagx">{copy.stable}</span></td></tr>
                <tr><td>Text embedding</td><td className="b">480M chunks</td><td className="b">8× A10G</td><td className="v">2.4×</td><td className="b">1.0×</td><td className="b">1.3×</td><td><span className="tagx">{copy.stable}</span></td></tr>
                <tr><td>Image decode + CLIP</td><td className="b">12M images</td><td className="b">4× A10G</td><td className="v">1.9×</td><td className="b">1.0×</td><td className="b">1.7×</td><td><span className="tagx exp">{copy.experimental}</span></td></tr>
                <tr><td>Audio transcription</td><td className="b">120K clips</td><td className="b">4× A100</td><td className="v">2.2×</td><td className="b">1.0×</td><td className="b">—</td><td><span className="tagx exp">{copy.experimental}</span></td></tr>
              </tbody>
            </table>
          </Box>
          <p className="mut" style={{ fontSize: 12, marginTop: 12 }}>
            {copy.higher}
          </p>
        </div>
      </section>

      <Divider />

      {/* vLLM */}
      <section className="bm-sec">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.detail}</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>vLLM batch inference</h2>
            <p className="lead" style={{ marginTop: 12, maxWidth: 640 }}>
              {copy.vllmLead}
            </p>
          </div>
          <div className="statline">
            <div className="stat"><div className="n">3.1×</div><div className="l">{copy.throughputVs}</div></div>
            <div className="stat"><div className="n">41<span style={{ fontSize: 18 }}> min</span></div><div className="l">{copy.wallClock}</div></div>
            <div className="stat"><div className="n">92<span style={{ fontSize: 18 }}>%</span></div><div className="l">{copy.gpuUtil}</div></div>
          </div>
          <div className="grid2">
            <Box className="lat">
              <div className="azt" style={{ textAlign: 'left', marginBottom: 14 }}>{copy.throughputTitle}</div>
              <div className="latrow"><span className="pl">Vane</span><div className="bar"><div className="fillb vane" style={{ width: '100%' }} /></div><span className="val">3.1×</span></div>
              <div className="latrow"><span className="pl">Daft</span><div className="bar"><div className="fillb base" style={{ width: '52%' }} /></div><span className="val mut">1.6×</span></div>
              <div className="latrow"><span className="pl">Ray Data</span><div className="bar"><div className="fillb base" style={{ width: '32%' }} /></div><span className="val mut">1.0×</span></div>
              <div className="leg">
                <span><span className="sw" style={{ background: 'var(--ink)' }} />Vane</span>
                <span><span className="sw base" style={{ background: 'repeating-linear-gradient(45deg,var(--ink-3),var(--ink-3) 2px,transparent 2px,transparent 4px)' }} />{copy.baselineEngines}</span>
              </div>
            </Box>
            <Box flat style={{ overflow: 'hidden' }}>
              <table className="specs">
                <tbody>
                  <tr><th>{copy.specs.dataset}</th><td>66K prompt rows · <span className="mut">s3://bench/prompts-66k.parquet</span></td></tr>
                  <tr><th>{copy.specs.hardware}</th><td>AWS p4d · 2× A100 80GB · NVLink</td></tr>
                  <tr><th>{copy.specs.command}</th><td><span className="link">python bench_vllm.py --gpus 2 --bucketing prefix</span></td></tr>
                  <tr><th>{copy.specs.env}</th><td>ray==2.40 · vllm==0.6.3 · CUDA 12.4</td></tr>
                  <tr><th>{copy.specs.runtime}</th><td>{copy.specs.runtimeValue}</td></tr>
                  <tr><th>{copy.specs.throughput}</th><td>{copy.specs.throughputValue}</td></tr>
                  <tr><th>{copy.specs.notes}</th><td className="note">{copy.specs.notesValue}</td></tr>
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
            <Eyebrow>{copy.multimodal}</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>{copy.multimodalTitle}</h2>
            <p className="lead" style={{ marginTop: 12, maxWidth: 640 }}>
              {copy.multimodalLead}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <span className="tagx">{copy.tags[0]}</span>
            <span className="tagx">{copy.tags[1]}</span>
            <span className="tagx exp">{copy.tags[2]}</span>
            <span className="tagx exp">{copy.tags[3]}</span>
          </div>
          <div className="grid2">
            <Box flat style={{ overflow: 'hidden' }}>
              <table className="specs">
                <tbody>
                  <tr><th>{copy.workload}</th><td>{copy.imageWorkload}</td></tr>
                  <tr><th>{copy.specs.dataset}</th><td>12M images · LAION subset</td></tr>
                  <tr><th>{copy.specs.hardware}</th><td>4× A10G</td></tr>
                  <tr><th>{copy.specs.command}</th><td><span className="link">python bench_image.py --gpus 4</span></td></tr>
                  <tr><th>{copy.specs.throughput}</th><td>1.9× vs Ray Data</td></tr>
                  <tr><th>{copy.specs.notes}</th><td className="note">{copy.imageNotes}</td></tr>
                </tbody>
              </table>
            </Box>
            <Box flat style={{ overflow: 'hidden' }}>
              <table className="specs">
                <tbody>
                  <tr><th>{copy.workload}</th><td>{copy.audioWorkload}</td></tr>
                  <tr><th>{copy.specs.dataset}</th><td>120K call recordings</td></tr>
                  <tr><th>{copy.specs.hardware}</th><td>4× A100</td></tr>
                  <tr><th>{copy.specs.command}</th><td><span className="link">python bench_audio.py --gpus 4</span></td></tr>
                  <tr><th>{copy.specs.throughput}</th><td>2.2× vs Ray Data</td></tr>
                  <tr><th>{copy.specs.notes}</th><td className="note">{copy.audioNotes}</td></tr>
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
            <Eyebrow>{copy.methodology}</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>{copy.methodology}</h2>
            <p className="lead" style={{ marginTop: 12, maxWidth: 640 }}>
              {copy.methodologyLead}
            </p>
          </div>
          <Box flat style={{ overflow: 'hidden' }}>
            <table className="specs">
              <tbody>
                {copy.methodRows.map(([label, value]) => (
                  <tr key={label}><th>{label}</th><td>{value}</td></tr>
                ))}
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
            <Eyebrow>{copy.reproduce}</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12 }}>{copy.reproduce}</h2>
          </div>
          <CodeWindow filename="reproduce.sh" code={REPRODUCE_CODE} />
        </div>
      </section>

      {/* CTA */}
      <Divider />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta>
            <Button solid to="/docs" arrow>{copy.readDocs}</Button>
            <Button to="/use-cases">{copy.explore}</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
