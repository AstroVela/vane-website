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
      lead: 'Prepare multimodal training data with one Ray-backed graph: select raw records, run GPU captioning or labeling, filter and dedupe in SQL, embed captions, and write a versioned release.',
      runPipeline: 'Run the pipeline',
      requestDemo: 'Request a demo',
      why: 'Why Vane',
      faster: 'Faster pipelines, in far less code.',
      performanceTitle: 'Performance — higher throughput, fuller GPUs',
      performanceCost: "Training-scale multimodal data preparation, offline captioning, auto-labeling, quality scoring, embedding, deduplication, and historical reprocessing are all bottlenecked on throughput and GPU utilization. That's where the bill is.",
      seeBenchmarks: 'See the benchmarks',
      efficientTitle: 'Efficient heterogeneous execution',
      efficientCopy: 'overlap media decode, GPU captioning, auto-labeling, embedding, and IO asynchronously, so expensive accelerators stay fed.',
      streamingTitle: 'Streaming + backpressure + dynamic batching',
      streamingCopy: 'push large media and sensor objects through continuously, no OOM.',
      distributedTitle: 'Distributed on Ray',
      distributedCopy: 're-run PB of history as one scalable graph, not a multi-system, multi-day job.',
      simplicityTitle: 'Simplicity — one engine, no glue code',
      simplicityCost: 'Today the pipeline scatters file selection, media decoding, model inference, quality filters, embeddings, deduplication, and dataset packaging across separate jobs and glue code.',
      readCode: 'Read the code',
      oneEngineTitle: 'One engine, one graph',
      oneEngineCopy: 'DuckDB-compatible SQL + Python UDFs + AI functions + Ray execution, with a single output.',
      duckdbTitle: 'DuckDB-compatible API',
      duckdbCopy: 'low migration cost from existing Ray, Spark, or Daft pipelines.',
      wholePipelineTitle: 'The whole raw-data to release pipeline',
      wholePipelineCopy: 'fits in one readable code window without separate orchestration glue.',
      representative: 'Representative code',
      codeTitle: 'The training-data release pipeline in one graph.',
      codeLead: 'File selection, media decoding, GPU captioning or auto-labeling, quality filters, deduplication, embedding, and packaged output stay in one readable pipeline.',
      codeAria: 'Pipeline stages shown in the representative code',
      codeSteps: ['SQL selection', 'Ray GPU UDF', 'SQL quality gate', 'Embedding + release'],
      note: 'CaptionAndScore is your batch UDF for decoding media, running GPU captioning or labeling, and returning stable release columns.',
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
      lead: '用一张 Ray 执行图完成样本选择、GPU caption/标注、SQL 质检去重、caption embedding 和版本化发布。',
      runPipeline: '运行流水线',
      requestDemo: '申请演示',
      why: '为什么选择 Vane',
      faster: '更高吞吐，更简洁的代码',
      performanceTitle: '让训练数据准备跑满 GPU',
      performanceCost: '到训练规模后，离线 caption、自动标注、质量评分、embedding、去重和历史回刷，成本主要取决于 throughput 与 GPU utilization。',
      seeBenchmarks: '查看基准测试',
      efficientTitle: '异构执行，不让 GPU 空等',
      efficientCopy: '多媒体解码、GPU caption、自动标注、embedding 和 IO 异步重叠',
      streamingTitle: 'streaming + backpressure + dynamic batching',
      streamingCopy: '持续推进大型媒体和传感器对象，避免 OOM。',
      distributedTitle: '基于 Ray 分布式执行',
      distributedCopy: 'PB 级历史数据作为一张执行图扩展，而不是拆成跨系统、跑几天的任务。',
      simplicityTitle: '一套引擎，代码简单',
      simplicityCost: '如今，文件选择、媒体解码、模型推理、质量过滤、embeddings、去重和数据集打包通常散落在多个任务和 glue code 之间。',
      readCode: '阅读代码',
      oneEngineTitle: '一个引擎，一张图',
      oneEngineCopy: 'DuckDB 兼容 SQL + Python UDF + AI 函数 + Ray 执行，并产生统一输出。',
      duckdbTitle: 'DuckDB 兼容 API',
      duckdbCopy: '从现有 Ray、Spark 或 Daft 流水线迁移成本低。',
      wholePipelineTitle: '完整的原始数据到发布流水线',
      wholePipelineCopy: '可以放进一个可读代码窗口，不需要额外编排 glue code。',
      representative: '代表性代码',
      codeTitle: '训练数据发布流水线',
      codeLead: '文件选择、媒体解码、GPU caption/自动标注、质量过滤、去重、embedding 和发布打包都在同一条可读流水线里完成。',
      codeAria: '代表性代码中展示的流水线阶段',
      codeSteps: ['SQL 选择', 'Ray GPU UDF', 'SQL 质量门', 'Embedding + 发布'],
      note: 'CaptionAndScore 是你的 batch UDF，用于解码媒体、运行 GPU caption 或标注，并返回稳定的发布列。',
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
