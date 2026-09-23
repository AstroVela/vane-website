import Head from '@docusaurus/Head'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import HomeHeroExecution from '../components/HomeHeroExecution'
import Cta from '../components/Cta'
import BenchmarkScopeNote from '../components/BenchmarkScopeNote'
import PixelIcon, { type PixelIconName } from '../components/PixelIcon'
import PlatformArchitecture from '../components/PlatformArchitecture'
import { Link } from '../router'
import { pickLocale, useSiteLocale } from '../siteI18n'
import { DESIGN_PARTNER_MAILTO } from '../siteLinks'
import {
  BENCHMARK_ENGINE_NAMES,
  BENCHMARK_ENVIRONMENT,
  BENCHMARK_RESULTS,
  formatBatchSize,
  formatSeconds,
  runtimeChangePercent,
} from '../benchmarkData'

const HOME_BENCHMARK_CHART_MIN_SECONDS = 50
const HOME_BENCHMARK_CHART_MAX_SECONDS = 10000
const HOME_BENCHMARK_CHART_TICKS = [50, 300, 1000, 3000, 10000] as const

function homeBenchmarkBarHeight(seconds: number) {
  const min = Math.log10(HOME_BENCHMARK_CHART_MIN_SECONDS)
  const range = Math.log10(HOME_BENCHMARK_CHART_MAX_SECONDS) - min
  return Math.max(0, Math.min(100, ((Math.log10(seconds) - min) / range) * 100))
}

function homeBenchmarkValueLabel(seconds: number) {
  if (seconds >= 1000) return `${(seconds / 1000).toFixed(2)}k`
  return Number.isInteger(seconds) ? `${seconds}` : seconds.toFixed(2)
}

const SCENARIOS: Array<{
  title: string
  titleZh: string
  status: 'Available now'
  statusZh: string
  summary: string
  summaryZh: string
  cta: string
  ctaZh: string
  href: string
  icon: PixelIconName
}> = [
  {
    title: 'Multimodal Model Training — data pipelines',
    titleZh: '多模态训练数据流水线',
    status: 'Available now',
    statusZh: '现已可用',
    summary: 'Read typed media and lake tables, then filter, label, and deduplicate data for multimodal model training.',
    summaryZh: '读取类型化媒体和湖表，完成筛选、标注与去重，为多模态模型准备训练数据。',
    cta: 'Explore',
    ctaZh: '查看',
    href: '/solutions/training',
    icon: 'multimodal',
  },
  {
    title: 'Data Infrastructure for Enterprise Agents',
    titleZh: '企业 Agent 数据基础设施',
    status: 'Available now',
    statusZh: '现已可用',
    summary: 'Process business files with SQL and model UDFs, then write structured records and embeddings to retrieval and analytics systems.',
    summaryZh: '通过 SQL 和模型 UDF 处理业务文件，将结构化记录与 embedding 写入检索及分析系统。',
    cta: 'Explore',
    ctaZh: '查看',
    href: '/solutions/enterprise-agent',
    icon: 'retrieval',
  },
]

function ScenarioCard({ scenario, locale }: { scenario: (typeof SCENARIOS)[number]; locale: ReturnType<typeof useSiteLocale> }) {
  return (
    <Box as={Link} to={scenario.href} className="scenario-card">
      <div className="scenario-top">
        <span className="ic"><PixelIcon name={scenario.icon} size={20} /></span>
        <span className="status-pill available">{pickLocale(locale, scenario.status, scenario.statusZh)}</span>
      </div>
      <h3>{pickLocale(locale, scenario.title, scenario.titleZh)}</h3>
      <p>{pickLocale(locale, scenario.summary, scenario.summaryZh)}</p>
      <span className="scenario-cta">{pickLocale(locale, scenario.cta, scenario.ctaZh)} <span className="ar">→</span></span>
    </Box>
  )
}

export default function Home() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      heroTitle: 'High-performance, multimodal-native engine for AI workloads.',
      heroLead: 'Process files, images, audio, and video natively with SQL and Python. Connect lake formats, vector databases, and analytics systems, and scale from your machine to Ray clusters.',
      getStarted: 'Get Started',
      release: 'Vane 0.2.0 · What’s new',
      capabilities: 'Native types & connections',
      capabilitiesTitle: 'From media files to usable data.',
      typesTitle: 'Keep media types throughout your pipeline',
      typesCopy: 'FILE, IMAGEFILE, AUDIOFILE, and VIDEOFILE represent file references. Decode and transform media as IMAGE pixels and TENSOR values with built-in operators.',
      typesNote: 'Python media extras provide the default backend; native_media acceleration is optional.',
      typesLink: 'Explore multimodal types',
      connectionsTitle: 'Connect your data stack',
      connectionsCopy: 'Lake and columnar providers: Iceberg, Paimon, DuckLake, Lance, and Vortex. Distributed upserts to Milvus and Qdrant; Arrow batch writes to Doris.',
      connectionsNote: 'Lake and columnar providers are installed separately.',
      connectionsLink: 'Explore data connections',
      heroExample: 'Run the image quickstart',
      chooseWorkload: 'Choose your workload',
      useCases: 'Use Cases',
      workloadsTitle: 'Two real-world AI workloads.',
      workloadsLead: 'From multimodal model training to enterprise data pipelines, real-world AI runs on diverse data. Pick the pipeline that matches your workload.',
      benchmarks: 'Benchmarks',
      proofTitle: 'Multimodal inference benchmarks',
      proofLead: 'Benchmarking multimodal AI pipelines across audio, video, document, and image workloads.',
      comparisonLabel: 'Vane Data vs Ray Data vs Daft · tuned elapsed time',
      environmentLabel: 'Test environment',
      modifiedVram: 'modified VRAM',
      lowerElapsedTime: 'lower',
      higherElapsedTime: 'higher',
      elapsedTime: 'Elapsed time (seconds)',
      logScale: 'Tuned batch sizes · log scale · lower is better',
      chartAria: 'Grouped elapsed-time bars for Vane Data, Ray Data, and Daft across four workloads',
      workloads: {
        document: 'Document',
        image: 'Image',
        audio: 'Audio',
        video: 'Video',
      },
      fullBenchmarks: 'Full benchmarks',
      platform: 'Platform',
      platformTitle: 'A multimodal-native AI engine connecting data, models, and agents.',
      platformLead: 'Unifies data, models, and agents — enabling continuous learning and scalable execution from local devices to Ray clusters.',
      install: 'Install',
      runExample: 'Run an example',
      runExampleCopy: 'Start from the docs examples and adapt the pipeline to your data.',
      buildPoc: 'Build your POC',
      buildPocCopy: 'Use the docs examples and llms.txt files to wire Vane into your stack.',
      readDocs: 'Read the Docs',
      designPartner: 'Become a design partner',
    },
    {
      heroTitle: '面向 AI 工作负载的高性能、多模态原生引擎',
      heroLead: '用 SQL 和 Python 原生处理文件、图像、音频与视频，连接湖格式、向量数据库和分析系统，并从本机扩展到 Ray 集群。',
      getStarted: '开始使用',
      release: 'Vane 0.2.0 · 版本更新',
      capabilities: '原生类型与数据对接',
      capabilitiesTitle: '从媒体文件到可用数据',
      typesTitle: '在流水线中保留媒体类型',
      typesCopy: 'FILE、IMAGEFILE、AUDIOFILE 和 VIDEOFILE 表示文件引用。通过内置算子解码与变换，将媒体处理为 IMAGE 像素和 TENSOR 值。',
      typesNote: 'Python 媒体依赖提供默认后端，native_media 加速扩展可按需安装。',
      typesLink: '了解多模态类型',
      connectionsTitle: '连接现有数据系统',
      connectionsCopy: '湖格式与列式格式：Iceberg、Paimon、DuckLake、Lance、Vortex。向 Milvus、Qdrant 分布式 upsert，向 Doris 写入 Arrow 批次。',
      connectionsNote: '湖格式与列式格式的 provider 需单独安装。',
      connectionsLink: '了解数据对接',
      heroExample: '运行图像快速入门示例',
      chooseWorkload: '选择你的工作负载',
      useCases: '用例',
      workloadsTitle: '两类多模态 AI 场景',
      workloadsLead: '从多模态模型训练到企业数据流水线，真实 AI 工作负载运行在多样化数据之上。选择与你的工作负载匹配的流水线。',
      benchmarks: '基准测试',
      proofTitle: '多模态推理基准测试',
      proofLead: '针对音频、视频、文档和图像工作负载，评测多模态 AI 流水线的推理性能。',
      comparisonLabel: 'Vane Data、Ray Data 与 Daft · batch_size 调优后耗时',
      environmentLabel: '测试环境',
      modifiedVram: '显存改装版',
      lowerElapsedTime: '更低',
      higherElapsedTime: '更高',
      elapsedTime: '端到端耗时（秒）',
      logScale: 'batch_size 调优后 · 对数尺度 · 越低越好',
      chartAria: 'Vane Data、Ray Data 和 Daft 在四类 workload 中的分组耗时柱状图',
      workloads: {
        document: '文档',
        image: '图像',
        audio: '音频',
        video: '视频',
      },
      fullBenchmarks: '完整基准测试',
      platform: '平台',
      platformTitle: '连接数据、模型与 Agent 的多模态原生 AI 引擎',
      platformLead: '统一数据、模型与 Agent，支持持续学习，并将可扩展执行能力从本地设备延伸到 Ray 集群。',
      install: '安装',
      runExample: '运行示例',
      runExampleCopy: '从文档示例开始，并把流水线改造成适配你自己的数据。',
      buildPoc: '构建 POC',
      buildPocCopy: '使用文档示例和 llms.txt 文件，把 Vane 接入你的技术栈。',
      readDocs: '阅读文档',
      designPartner: '成为设计伙伴',
    },
  )
  const brokenLinks = useBrokenLinks()
  brokenLinks.collectAnchor('scenarios')
  brokenLinks.collectAnchor('benchmarks')

  return (
    <>
      <Head>
        <title>{copy.heroTitle} | Vane</title>
        <meta name="description" content={copy.heroLead} />
        <meta property="og:title" content={`${copy.heroTitle} | Vane`} />
        <meta property="og:description" content={copy.heroLead} />
      </Head>
      <Nav ctaReveal />
      <a id="top" />

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid home-hero-grid">
          <div>
            <Eyebrow style={{ marginBottom: 20 }}><Link to="/release-notes/v0.2.0">{copy.release}</Link></Eyebrow>
            <h1 className="h1 hero-h1">
              {copy.heroTitle}
            </h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: 540 }}>
              {copy.heroLead}
            </p>
            <div style={{ display: 'flex', gap: 20, marginTop: 34, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button solid to="/docs/data/quickstart/quickstart" arrow>{copy.getStarted}</Button>
              <Link to="#scenarios" className="hero-textlink">
                {copy.chooseWorkload} <span className="ar">→</span>
              </Link>
            </div>
            <div className="install" style={{ marginTop: 30 }}>
              <span className="c"><span className="p">$</span> pip install vane-ai</span>
              <span>·</span><span>Apache-2.0</span>
            </div>
          </div>
          <div className="home-hero-code">
            <HomeHeroExecution />
            <Link to="/docs/data/quickstart/quickstart" className="scenario-cta">{copy.heroExample} <span className="ar">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.capabilities}</Eyebrow>
            <h2 className="h2">{copy.capabilitiesTitle}</h2>
          </div>
          <div className="scenario-grid">
            <Box as={Link} to="/docs/data/reference/multimodal-data" className="scenario-card">
              <h3>{copy.typesTitle}</h3>
              <p>{copy.typesCopy}</p>
              <p style={{ marginTop: 12 }}>{copy.typesNote}</p>
              <span className="scenario-cta">{copy.typesLink} <span className="ar">→</span></span>
            </Box>
            <Box as={Link} to="/docs/data/extensions" className="scenario-card">
              <h3>{copy.connectionsTitle}</h3>
              <p>{copy.connectionsCopy}</p>
              <p style={{ marginTop: 12 }}>{copy.connectionsNote}</p>
              <span className="scenario-cta">{copy.connectionsLink} <span className="ar">→</span></span>
            </Box>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="section" id="scenarios" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
            <div>
              <Eyebrow>{copy.useCases}</Eyebrow>
              <h2 className="h2" style={{ marginTop: 12 }}>{copy.workloadsTitle}</h2>
              <p className="lead">
                {copy.workloadsLead}
              </p>
            </div>
          </div>
          <div className="scenario-grid">
            {SCENARIOS.map((scenario) => (
              <ScenarioCard scenario={scenario} locale={locale} key={scenario.title} />
            ))}
          </div>
        </div>
      </section>

      {/* BENCHMARKS PREVIEW */}
      <div className="wrap"><div className="ddiv" /></div>
      <section className="section" id="benchmarks" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.benchmarks}</Eyebrow>
            <h2 className="h2">{copy.proofTitle}</h2>
            <p className="lead">
              {copy.proofLead}
            </p>
          </div>
          <div className="calc-grid">
            <Box className="home-benchmark-summary">
              <div className="azt">{copy.comparisonLabel}</div>
              <div className="home-benchmark-environment">
                <span>{copy.environmentLabel}</span>
                <p>
                  <span>{BENCHMARK_ENVIRONMENT.cpuCores} CPU cores · {BENCHMARK_ENVIRONMENT.memoryGb} GB RAM</span>
                  <span>
                    {BENCHMARK_ENVIRONMENT.gpu}
                    {BENCHMARK_ENVIRONMENT.gpuMemoryModified ? ` (${copy.modifiedVram})` : ''}
                    {' · '}{BENCHMARK_ENVIRONMENT.gpuMemoryGb} GB GPU memory
                  </span>
                </p>
              </div>
              <dl className="home-benchmark-results">
                {BENCHMARK_RESULTS.map((result) => {
                  const rayChange = runtimeChangePercent(result.vaneSeconds, result.rayDataSeconds)
                  const daftChange = result.daftSeconds === null
                    ? null
                    : runtimeChangePercent(result.vaneSeconds, result.daftSeconds)
                  return (
                    <div className="home-benchmark-result" key={result.id}>
                      <dt>{copy.workloads[result.id]}</dt>
                      <dd>
                        <span className="home-benchmark-comparison">
                          <span>{BENCHMARK_ENGINE_NAMES.rayData}</span>
                          <strong>
                            {Math.abs(rayChange).toFixed(1)}%
                            <small>{rayChange < 0 ? copy.lowerElapsedTime : copy.higherElapsedTime}</small>
                          </strong>
                        </span>
                        <span className="home-benchmark-comparison">
                          <span>{BENCHMARK_ENGINE_NAMES.daft}</span>
                          {daftChange === null ? (
                            <strong>OOM</strong>
                          ) : (
                            <strong>
                              {Math.abs(daftChange).toFixed(1)}%
                              <small>{daftChange < 0 ? copy.lowerElapsedTime : copy.higherElapsedTime}</small>
                            </strong>
                          )}
                        </span>
                      </dd>
                    </div>
                  )
                })}
              </dl>
              <Button sm to="/benchmarks" arrow>{copy.fullBenchmarks}</Button>
            </Box>
            <Box flat className="home-benchmark-chart">
              <div className="azt">{copy.elapsedTime}</div>
              <div className="home-chart-meta">
                <span>{copy.logScale}</span>
                <div className="home-chart-legend" aria-label="Engines">
                  <span><i className="vane" />{BENCHMARK_ENGINE_NAMES.vaneData}</span>
                  <span><i className="ray" />{BENCHMARK_ENGINE_NAMES.rayData}</span>
                  <span><i className="daft" />{BENCHMARK_ENGINE_NAMES.daft}</span>
                </div>
              </div>
              <div className="home-chart-plot" aria-label={copy.chartAria}>
                <div className="home-chart-axis" aria-hidden="true">
                  {HOME_BENCHMARK_CHART_TICKS.map((seconds) => (
                    <span style={{ bottom: `${homeBenchmarkBarHeight(seconds)}%` }} key={seconds}>
                      {seconds >= 1000 ? `${seconds / 1000}k` : seconds}
                    </span>
                  ))}
                </div>
                <div className="home-chart-area">
                  <div className="home-chart-grid" aria-hidden="true">
                    {HOME_BENCHMARK_CHART_TICKS.map((seconds) => (
                      <i style={{ bottom: `${homeBenchmarkBarHeight(seconds)}%` }} key={seconds} />
                    ))}
                  </div>
                  <div className="home-chart-groups">
                    {BENCHMARK_RESULTS.map((result) => {
                      const engines = [
                        { id: 'vane', label: BENCHMARK_ENGINE_NAMES.vaneData, seconds: result.vaneSeconds, batchSize: result.batchSizes.vaneData },
                        { id: 'ray', label: BENCHMARK_ENGINE_NAMES.rayData, seconds: result.rayDataSeconds, batchSize: result.batchSizes.rayData },
                        { id: 'daft', label: BENCHMARK_ENGINE_NAMES.daft, seconds: result.daftSeconds, batchSize: result.batchSizes.daft },
                      ]
                      return (
                        <div className="home-chart-group" key={result.id}>
                          <div className="home-chart-bars">
                            {engines.map((engine) => {
                              const description = [
                                engine.label,
                                copy.workloads[result.id],
                                engine.seconds === null ? 'OOM' : formatSeconds(engine.seconds),
                                formatBatchSize(engine.batchSize),
                              ].filter(Boolean).join(' · ')
                              const height = engine.seconds === null ? 0 : homeBenchmarkBarHeight(engine.seconds)
                              return (
                                <span className="home-chart-slot" key={engine.id}>
                                  {engine.seconds === null ? (
                                    <span className="home-chart-oom" role="img" aria-label={description} title={description}>OOM</span>
                                  ) : (
                                    <>
                                      <span className="home-chart-value" style={{ bottom: `calc(${height}% + 5px)` }}>
                                        {homeBenchmarkValueLabel(engine.seconds)}
                                      </span>
                                      <span
                                        className={`home-chart-bar ${engine.id}`}
                                        style={{ height: `${height}%` }}
                                        role="img"
                                        aria-label={description}
                                        title={description}
                                      />
                                    </>
                                  )}
                                </span>
                              )
                            })}
                          </div>
                          <span className="home-chart-workload">{copy.workloads[result.id]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <BenchmarkScopeNote locale={locale} />
            </Box>
          </div>
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE */}
      <section className="section architecture-section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.platform}</Eyebrow>
            <h2 className="h2">{copy.platformTitle}</h2>
            <p className="lead">
              {copy.platformLead}
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
              <h3>{copy.install}</h3>
              <p><code>pip install vane-ai</code></p>
            </Box>
            <Box flat className="start-step">
              <span>02</span>
              <h3>{copy.runExample}</h3>
              <p>{copy.runExampleCopy}</p>
            </Box>
            <Box flat className="start-step">
              <span>03</span>
              <h3>{copy.buildPoc}</h3>
              <p>{copy.buildPocCopy}</p>
            </Box>
          </div>
          <Cta>
            <Button solid to="/docs" arrow>{copy.readDocs}</Button>
            <Button href={DESIGN_PARTNER_MAILTO}>{copy.designPartner}</Button>
          </Cta>
        </div>
      </section>

      <Footer home />
    </>
  )
}
