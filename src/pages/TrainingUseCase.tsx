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
import Mark from '../components/Mark'
import { pickLocale, useSiteLocale } from '../siteI18n'
import { TRAINING_DESIGN_PARTNER_MAILTO } from '../siteLinks'
import { Link } from '../router'

const PIPELINE_CODE = `from pathlib import Path

import vane

con = vane.connect()
assets = Path("quickstart-images").resolve()
files = vane.from_files(
    [str(assets / f"{name}.png") for name in ("large", "medium", "small")],
    connection=con,
)
images = con.sql("SELECT image_file(file) AS source FROM files")
metadata = con.sql("""
    SELECT source, image_file_metadata(source) AS info
    FROM images
""")
samples = con.sql("""
    SELECT source.url AS source_uri,
           info.width AS source_width,
           info.height AS source_height,
           encode_image(
               resize(decode_image_file(source, 'RGB'), 224, 224),
               'PNG'
           ) AS image_bytes
    FROM metadata
    WHERE info.width >= 300
""")
samples.write_parquet("training-image-samples.parquet")`

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
      aria: 'Five raw modalities — image, video, audio, text, and sensor — converging through the Vane engine into prepared training data',
      ops: <>decode · caption<br />score · embed</>,
      source: 'raw · multimodal',
      release: 'dataset release',
    },
    {
      aria: '五种原始模态：图像、视频、音频、文本和传感器，通过 Vane 引擎汇聚成处理后的训练数据',
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
        <span className="thg-engine-mark"><Mark size={40} /></span>
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
      ogDescription: 'Raw multimodal data to training-ready releases with one Ray-backed distributed pipeline.',
      eyebrow: 'Use Case · Multimodal Model Training',
      heading: 'From raw multimodal data to training-ready dataset releases.',
      lead: 'Use native file, image, audio, and video types to prepare training data with SQL and Python. Add model labeling, embedding, quality filters, and deduplication, then write to files or lake formats and scale from local execution to Ray clusters.',
      runPipeline: 'Try the quickstart',
      requestDemo: 'Request a demo',
      why: 'Why Vane',
      faster: 'Faster pipelines, in far less code.',
      performanceTitle: 'Performance — Overlap CPU, GPU, and I/O work',
      performanceCost: 'From data preparation to embedding, pipeline efficiency matters. Vane coordinates processing and data movement across heterogeneous resources.',
      seeBenchmarks: 'See the benchmarks',
      efficientTitle: 'Efficient heterogeneous execution',
      efficientCopy: 'Overlap CPU processing, GPU inference, data movement, and I/O asynchronously, enabling heterogeneous resources to work concurrently instead of waiting on each other.',
      streamingTitle: 'Streaming execution with backpressure & dynamic batching',
      streamingCopy: 'Continuously process large-scale media and sensor data with adaptive batching and flow control, with backpressure to manage memory usage.',
      distributedTitle: 'Ray-Native distributed scaling',
      distributedCopy: 'Scale data preparation from a local runtime to a Ray cluster, with CPU, GPU, and memory requirements declared per processing stage.',
      simplicityTitle: 'Simplicity — Native types, familiar interfaces',
      simplicityCost: 'Multimodal data workflows often require multiple systems and layers of orchestration. Vane unifies data processing, AI inference, and dataset preparation into a single execution graph.',
      readCode: 'Read the code',
      oneEngineTitle: 'Native multimodal processing',
      oneEngineCopy: 'FILE, IMAGEFILE, AUDIOFILE, and VIDEOFILE carry file references. Built-in operations inspect metadata, decode and resize images, resample audio, and extract video frames.',
      duckdbTitle: 'SQL and Python together',
      duckdbCopy: 'Combine SQL quality filters and deduplication with your Python UDFs or AI functions for labeling and embedding, including GPU workloads.',
      wholePipelineTitle: 'Connect training data storage',
      wholePipelineCopy: 'Read and write Lance or Iceberg through separately installed providers, or export Parquet files as in the example below.',
      representative: 'Representative code',
      codeTitle: 'Prepare uniform image samples with native types.',
      codeLead: 'Use the three sample images created in the quickstart. Inspect their dimensions, keep images at least 300 pixels wide, and export two 224 × 224 PNG samples as bytes in Parquet. No model credentials or GPU are needed.',
      codeAria: 'Pipeline stages shown in the representative code',
      codeSteps: ['IMAGEFILE', 'Metadata filter', 'Decode + resize', 'PNG → Parquet'],
      quickstart: 'Create the sample images',
      storage: 'Storage providers:',
      moreTutorials: 'Explore a training-data tutorial',
      ctaTitle: 'Build a reproducible multimodal training-data pipeline.',
      designPartner: 'Become a design partner',
    },
    {
      title: '多模态AI模型训练数据流水线 — Vane',
      description: '为多模态模型训练准备图像、视频、音频、文档、表格和传感器日志。用一条 Ray 支撑的流水线完成筛选、caption、embedding、去重、自动标注和数据集发布。',
      ogDescription: '用一条 Ray 支撑的分布式流水线把原始多模态数据转换为可训练发布版本。',
      eyebrow: '用例 · 多模态模型训练',
      heading: '把原始多模态数据变成可发布的训练数据集',
      lead: '用原生文件、图像、音频和视频类型，通过 SQL 与 Python 准备训练数据。按需加入模型标注、向量化、质量过滤和去重，再写入文件或湖格式，并从本地执行扩展到 Ray 集群。',
      runPipeline: '体验快速开始',
      requestDemo: '申请演示',
      why: '为什么选择 Vane',
      faster: '更高吞吐，更简洁的代码',
      performanceTitle: '高性能：重叠执行 CPU、GPU 与 I/O 工作',
      performanceCost: '从数据准备到向量化，流水线效率至关重要。Vane 协调异构资源上的计算与数据传输。',
      seeBenchmarks: '查看基准测试',
      efficientTitle: '异构执行，不让 GPU 空等',
      efficientCopy: '异步重叠 CPU 处理、GPU 推理、数据传输与 I/O，使异构资源并发工作，避免阶段间等待。',
      streamingTitle: '带背压与动态批处理的流式执行',
      streamingCopy: '通过自适应批处理与流量控制，持续处理大规模媒体和传感器数据；通过背压管理内存占用。',
      distributedTitle: 'Ray 原生分布式扩展',
      distributedCopy: '将数据准备从本地运行扩展到 Ray 集群，并为各处理阶段声明 CPU、GPU 和内存需求。',
      simplicityTitle: '简单易用：原生类型，熟悉的接口',
      simplicityCost: '多模态数据工作流通常需要多套系统和多层编排。Vane 将数据处理、AI 推理与数据集准备统一到一张执行图中。',
      readCode: '阅读代码',
      oneEngineTitle: '原生多模态处理',
      oneEngineCopy: 'FILE、IMAGEFILE、AUDIOFILE 和 VIDEOFILE 承载文件引用。内置算子支持元数据检查、图像解码与缩放、音频重采样和视频抽帧。',
      duckdbTitle: '组合使用 SQL 与 Python',
      duckdbCopy: '用 SQL 做质量过滤与去重，结合自定义 Python UDF 或 AI 函数完成标注和向量化，并按需使用 GPU。',
      wholePipelineTitle: '对接训练数据存储',
      wholePipelineCopy: '通过单独安装的扩展读写 Lance 或 Iceberg，也可以像下方示例一样导出 Parquet 文件。',
      representative: '代表性代码',
      codeTitle: '用原生类型准备统一尺寸的图像样本',
      codeLead: '使用快速开始中生成的三张样例图片，检查尺寸、保留宽度至少 300 像素的图片，并将两张 224 × 224 的 PNG 样本以字节形式写入 Parquet。无需模型密钥或 GPU。',
      codeAria: '代表性代码中展示的流水线阶段',
      codeSteps: ['IMAGEFILE', '元数据筛选', '解码与缩放', 'PNG → Parquet'],
      quickstart: '创建样例图片',
      storage: '存储扩展：',
      moreTutorials: '探索训练数据教程',
      ctaTitle: '构建高效简单的多模态训练数据流水线',
      designPartner: '成为设计伙伴',
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
              <Button solid to="/docs/data/quickstart/quickstart" arrow>{copy.runPipeline}</Button>
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
              <p><Link className="training-link" to="/docs/data/quickstart/quickstart">{copy.quickstart} →</Link></p>
              <p>{copy.storage} <Link to="/docs/data/extensions/lance">Lance</Link> · <Link to="/docs/data/extensions/iceberg">Iceberg</Link></p>
              <div className="training-code-steps" aria-label={copy.codeAria}>
                {copy.codeSteps.map((step) => <span key={step}>{step}</span>)}
              </div>
            </div>
            <div className="training-code-showcase">
              <CodeWindow filename="prepare_training_images.py" code={PIPELINE_CODE} language="python" />
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
            <Button to="/docs/data/tutorials/use-cases/multimodal-training-data">{copy.moreTutorials}</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
