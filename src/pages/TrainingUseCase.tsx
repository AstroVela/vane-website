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
import { pickLocale, useSiteLocale } from '../siteI18n'
import { TRAINING_DESIGN_PARTNER_MAILTO } from '../siteLinks'
import { Link } from '../router'

const PIPELINE_CODE = `import vane

vane.configure(runner="ray")
con = vane.connect()

raw = con.sql("""
    SELECT id, uri, media_type, content_hash
    FROM read_parquet('s3://training-corpus/*.parquet')
    WHERE split = 'train'
""")

labeled = raw.map_batches(
    CaptionAndScore,
    schema=release_schema,
    gpus=1,
    actor_number=4,
)
labeled.to_table("labeled")

release = con.sql("""
    SELECT id, uri, caption, quality_score,
           ai_embed(
               caption,
               struct_pack(
                   provider := 'transformers',
                   model := 'sentence-transformers/all-MiniLM-L6-v2'
               )
           ) AS caption_embedding
    FROM labeled
    WHERE quality_score >= 0.8
    QUALIFY row_number() OVER (
        PARTITION BY content_hash
        ORDER BY quality_score DESC
    ) = 1
""")

release.write_parquet("s3://dataset-releases/mm-v42/part-00000.parquet")`

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

function TrainingHeroShape({ locale }: { locale: ReturnType<typeof useSiteLocale> }) {
  const copy = pickLocale(
    locale,
    {
      aria: 'Five raw modalities — image, video, audio, text, and sensor — converging through the Vane engine into a versioned training-dataset release',
      ops: <>decode · caption<br />score · embed</>,
      source: 'raw · multimodal',
      release: 'dataset release',
    },
    {
      aria: '五种原始模态：图像、视频、音频、文本和传感器，通过 Vane 引擎汇聚成带版本的训练数据集发布',
      ops: <>解码 · caption<br />评分 · embed</>,
      source: '原始 · 多模态',
      release: '数据集发布',
    },
  )

  return (
    <div className="training-hero-art" aria-label={copy.aria}>
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
        <span className="thg-engine-ops">{copy.ops}</span>
      </div>

      <div className="thg-release" aria-hidden="true">
        <span className="thg-score"><i /><i /><i /><i /></span>
        <span className="thg-card" />
        <span className="thg-card" />
        <span className="thg-card" />
      </div>

      <div className="training-art-label label-source">{copy.source}</div>
      <div className="training-art-label label-release">{copy.release}</div>
     </div>
    </div>
  )
}

function Advantage({
  title,
  cost,
  bullets,
  to,
  cta,
}: {
  title: string
  cost: string
  bullets: Array<{ title: string; copy: string }>
  to: string
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
      <Link className="training-link" to={to}>{cta} <span className="ar">→</span></Link>
    </Box>
  )
}

export default function TrainingUseCase() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      title: 'Multimodal training data pipelines for AI models — Vane',
      description: 'Prepare images, video, audio, documents, tables, and sensor logs for multimodal model training. Run filtering, captioning, embedding, deduplication, auto-labeling, and dataset release packaging in one Ray-backed pipeline.',
      ogDescription: '3.1x batch inference throughput vs Ray Data. Raw multimodal data to training-ready releases with one distributed pipeline.',
      eyebrow: 'Use Case · Multimodal Model Training',
      heading: 'From raw multimodal data to training-ready dataset releases.',
      lead: 'A unified multimodal training data pipeline that transforms raw data into versioned, training-ready datasets with SQL processing, GPU-accelerated labeling, embedding, and scalable execution from local to Ray clusters.',
      runPipeline: 'Run the pipeline',
      requestDemo: 'Request a demo',
      why: 'Why Vane',
      faster: 'Faster pipelines, in far less code.',
      performanceTitle: 'High Performance — Extreme throughput, maximum resource utilization',
      performanceCost: "From data preparation to embedding, multimodal AI workloads are bottlenecked by pipeline efficiency. Vane maximizes end-to-end throughput.",
      seeBenchmarks: 'See the benchmarks',
      efficientTitle: 'Efficient heterogeneous execution',
      efficientCopy: 'Overlap CPU processing, GPU inference, data movement, and I/O asynchronously, enabling heterogeneous resources to work concurrently instead of waiting on each other.',
      streamingTitle: 'Streaming execution with backpressure & dynamic batching',
      streamingCopy: 'Continuously process large-scale media and sensor data with adaptive batching and flow control, maximizing throughput while maintaining bounded memory usage.',
      distributedTitle: 'Ray-Native distributed scaling',
      distributedCopy: 'Execute petabyte-scale historical reprocessing as a unified scalable graph on Ray, replacing fragmented multi-system pipelines and long-running batch workflows.',
      simplicityTitle: 'Simplicity — One engine, no glue code',
      simplicityCost: 'Multimodal data workflows often require multiple systems and layers of orchestration. Vane unifies data processing, AI inference, and dataset preparation into a single execution graph.',
      readCode: 'Read the code',
      oneEngineTitle: 'One engine, one graph',
      oneEngineCopy: 'DuckDB-compatible SQL, Python UDFs, AI functions, and Ray execution in one unified pipeline.',
      duckdbTitle: 'DuckDB-compatible API',
      duckdbCopy: 'Low migration cost from existing Ray, Spark, or Daft pipelines.',
      wholePipelineTitle: 'From raw data to release-ready datasets',
      wholePipelineCopy: 'A complete pipeline in one readable graph — no glue code required.',
      representative: 'Representative code',
      codeTitle: 'The training-data release pipeline in one graph.',
      codeLead: 'File selection, media decoding, GPU captioning or auto-labeling, quality filters, deduplication, embedding, and packaged output stay in one readable pipeline.',
      codeAria: 'Pipeline stages shown in the representative code',
      codeSteps: ['SQL selection', 'Ray GPU UDF', 'SQL quality gate', 'Embedding + release'],
      note: 'CaptionAndScore is your GPU batch UDF. Vane reuses it across Ray actors; remove the runner configuration to execute the same pipeline locally.',
      ctaTitle: 'Build a reproducible multimodal training-data pipeline.',
      designPartner: 'Become a design partner',
      readDocs: 'Read the docs',
    },
    {
      title: '多模态AI模型训练数据流水线 — Vane',
      description: '为多模态模型训练准备图像、视频、音频、文档、表格和传感器日志。用一条 Ray 支撑的流水线完成筛选、caption、embedding、去重、自动标注和数据集发布。',
      ogDescription: '批量推理 throughput 达到 Ray Data 的 3.1 倍。用一条分布式流水线把原始多模态数据转换为可训练发布版本。',
      eyebrow: '用例 · 多模态模型训练',
      heading: '把原始多模态数据变成可发布的训练数据集',
      lead: '通过一条统一的多模态训练数据流水线，以 SQL 处理、GPU 加速标注和 embedding 将原始数据转换为带版本、可直接训练的数据集，并从本地环境扩展到 Ray 集群。',
      runPipeline: '运行流水线',
      requestDemo: '申请演示',
      why: '为什么选择 Vane',
      faster: '更高吞吐，更简洁的代码',
      performanceTitle: '高性能：极高吞吐，最大化资源利用率',
      performanceCost: '从数据准备到 embedding，多模态 AI 工作负载的核心瓶颈是流水线效率。Vane 最大化端到端吞吐。',
      seeBenchmarks: '查看基准测试',
      efficientTitle: '异构执行，不让 GPU 空等',
      efficientCopy: '异步重叠 CPU 处理、GPU 推理、数据传输与 I/O，使异构资源并发工作，避免阶段间等待。',
      streamingTitle: '带背压与动态批处理的流式执行',
      streamingCopy: '通过自适应批处理与流量控制，持续处理大规模媒体和传感器数据；在内存占用有界的前提下最大化吞吐。',
      distributedTitle: 'Ray 原生分布式扩展',
      distributedCopy: '在 Ray 上将 PB 级历史数据重处理作为一张统一的可扩展执行图运行，替代割裂的多系统流水线和长周期批处理任务。',
      simplicityTitle: '一套引擎，代码简单',
      simplicityCost: '多模态数据工作流通常需要多套系统和多层编排。Vane 将数据处理、AI 推理与数据集准备统一到一张执行图中。',
      readCode: '阅读代码',
      oneEngineTitle: '一个引擎，一张图',
      oneEngineCopy: '在一条统一流水线中组合 DuckDB 兼容 SQL、Python UDF、AI 函数和 Ray 执行。',
      duckdbTitle: 'DuckDB 兼容 API',
      duckdbCopy: '从现有 Ray、Spark 或 Daft 流水线迁移成本低。',
      wholePipelineTitle: '从原始数据到可发布数据集',
      wholePipelineCopy: '完整流水线收敛为一张可读执行图，无需额外胶水代码。',
      representative: '代表性代码',
      codeTitle: '训练数据发布流水线',
      codeLead: '文件选择、媒体解码、GPU caption/自动标注、质量过滤、去重、embedding 和发布打包都在同一条可读流水线里完成。',
      codeAria: '代表性代码中展示的流水线阶段',
      codeSteps: ['SQL 选择', 'Ray GPU UDF', 'SQL 质量门', 'Embedding + 发布'],
      note: 'CaptionAndScore 是你的 GPU batch UDF。Vane 会在 Ray actors 中复用它；删除 runner 配置即可让同一条流水线在本地执行。',
      ctaTitle: '构建高效简单的多模态训练数据流水线',
      designPartner: '成为设计伙伴',
      readDocs: '阅读文档',
    },
  )
  const brokenLinks = useBrokenLinks()
  brokenLinks.collectAnchor('code')

  return (
    <>
      <Head>
        <title>{copy.title}</title>
        <meta
          name="description"
          content={copy.description}
        />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.ogDescription} />
      </Head>

      <Nav />

      {/* HERO — solutions intro archetype: editorial copy + primary actions,
          leading straight into the execution timeline animation */}
      <section className="intro training-hero">
        <div className="wrap training-hero-grid">
          <div className="training-hero-copy">
            <Eyebrow style={{ marginBottom: 20 }}>{copy.eyebrow}</Eyebrow>
            <h1 className="h1">
              {copy.heading}
            </h1>
            <p className="lead">
              {copy.lead}
            </p>
            <div className="training-hero-actions">
              <Button solid to="/docs/data/examples/training-data-pipeline" arrow>{copy.runPipeline}</Button>
              <Button href={TRAINING_DESIGN_PARTNER_MAILTO} arrow>{copy.requestDemo}</Button>
            </div>
          </div>
          <TrainingHeroShape locale={locale} />
        </div>
      </section>

      <Divider />

      <TrainingDataFactoryAnimation />

      <Divider />

      {/* WHY VANE */}
      <section className="section" style={{ padding: '52px 0 56px' }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.why}</Eyebrow>
            <h2 className="h2">{copy.faster}</h2>
          </div>
          <div className="training-advantages">
            <Advantage
              title={copy.performanceTitle}
              cost={copy.performanceCost}
              to="/benchmarks"
              cta={copy.seeBenchmarks}
              bullets={[
                {
                  title: copy.efficientTitle,
                  copy: copy.efficientCopy,
                },
                {
                  title: copy.streamingTitle,
                  copy: copy.streamingCopy,
                },
                {
                  title: copy.distributedTitle,
                  copy: copy.distributedCopy,
                },
              ]}
            />
            <Advantage
              title={copy.simplicityTitle}
              cost={copy.simplicityCost}
              to="#code"
              cta={copy.readCode}
              bullets={[
                {
                  title: copy.oneEngineTitle,
                  copy: copy.oneEngineCopy,
                },
                {
                  title: copy.duckdbTitle,
                  copy: copy.duckdbCopy,
                },
                {
                  title: copy.wholePipelineTitle,
                  copy: copy.wholePipelineCopy,
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
              <Eyebrow>{copy.representative}</Eyebrow>
              <h2 className="h2">{copy.codeTitle}</h2>
              <p className="lead">
                {copy.codeLead}
              </p>
              <div className="training-code-steps" aria-label={copy.codeAria}>
                {copy.codeSteps.map((step) => <span key={step}>{step}</span>)}
              </div>
              <p className="training-code-note">
                {copy.note}
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
          <Cta title={copy.ctaTitle}>
            <Button solid href={TRAINING_DESIGN_PARTNER_MAILTO} arrow>{copy.designPartner}</Button>
            <Button to="/docs/data/examples">{copy.readDocs}</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
