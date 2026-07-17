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
  status: 'Available now' | 'Coming soon'
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
    summary: 'Turn images, video, audio, documents, tables, and sensor logs into filtered, labeled, deduplicated training dataset releases — with lineage and reproducible runs.',
    summaryZh: '把图像、视频、音频、文档、表格和传感器日志加工成可发布、可追溯、可复现的训练数据集。',
    cta: 'Explore',
    ctaZh: '查看',
    href: '/solutions/training',
    icon: 'multimodal',
  },
  {
    title: 'Enterprise Multimodal Agent',
    titleZh: '企业多模态 Agent',
    status: 'Available now',
    statusZh: '现已可用',
    summary: 'Turn PDFs, images, video, logs, forms, spreadsheets, and documents into auditable facts and agent-ready context — in SQL.',
    summaryZh: '把 PDF、图片、视频、日志、表单等转化成可信可追溯的Agent决策',
    cta: 'Explore',
    ctaZh: '查看',
    href: '/solutions/enterprise-agent',
    icon: 'retrieval',
  },
  {
    title: 'Embodied AI — RL post-training',
    titleZh: '具身智能 — RL 后训练',
    status: 'Coming soon',
    statusZh: '即将推出',
    summary: 'Clean and re-score rollout trajectories and reward shards at training speed — and reproduce any run.',
    summaryZh: '以训练速度清洗和重新评分 rollout 轨迹与奖励分片，并可复现任意一次运行。',
    cta: 'Join the waitlist',
    ctaZh: '加入等待列表',
    href: DESIGN_PARTNER_MAILTO,
    icon: 'generation',
  },
  {
    title: 'Edge AI Agent',
    titleZh: '边缘 AI Agent',
    status: 'Coming soon',
    statusZh: '即将推出',
    summary: 'Filter and preprocess multimodal data on the edge, with one semantics from device to cloud.',
    summaryZh: '在边缘侧过滤并预处理多模态数据，让设备到云端保持同一套语义。',
    cta: 'Join the waitlist',
    ctaZh: '加入等待列表',
    href: DESIGN_PARTNER_MAILTO,
    icon: 'preprocessing',
  },
]

const FEATURED_SCENARIOS = SCENARIOS.filter((scenario) => scenario.status === 'Available now')
const UPCOMING_SCENARIOS = SCENARIOS.filter((scenario) => scenario.status === 'Coming soon')

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

function ScenarioSoonCard({ scenario, locale }: { scenario: (typeof SCENARIOS)[number]; locale: ReturnType<typeof useSiteLocale> }) {
  return (
    <Box as="a" href={scenario.href} flat className="scenario-soon-card">
      <div className="scenario-soon-head">
        <span className="ic"><PixelIcon name={scenario.icon} size={12} /></span>
        <h3>{pickLocale(locale, scenario.title, scenario.titleZh)}</h3>
        <span className="status-pill soon">{pickLocale(locale, scenario.status, scenario.statusZh)}</span>
      </div>
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
      heroLead: 'Unifies multimodal data, intelligence, and continuous learning with Python and SQL interfaces, seamlessly scaling from local environments to Ray clusters.',
      getStarted: 'Get Started',
      chooseWorkload: 'Choose your workload',
      useCases: 'Use Cases',
      workloadsTitle: 'Four real-world AI workloads.',
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
      heroLead: '通过 Python 和 SQL 接口统一多模态数据处理、智能计算与持续学习，并从本地环境无缝扩展到 Ray 集群。',
      getStarted: '开始使用',
      chooseWorkload: '选择你的工作负载',
      useCases: '用例',
      workloadsTitle: '多模态 AI 场景',
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
      <Nav ctaReveal />
      <a id="top" />

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid home-hero-grid">
          <div>
            <Eyebrow style={{ marginBottom: 20 }}>Vane</Eyebrow>
            <h1 className="h1 hero-h1">
              {copy.heroTitle}
            </h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: 540 }}>
              {copy.heroLead}
            </p>
            <div style={{ display: 'flex', gap: 20, marginTop: 34, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button solid to="/docs" arrow>{copy.getStarted}</Button>
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
          </div>
        </div>
      </section>

      {/* FOUR SCENARIOS */}
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
            {FEATURED_SCENARIOS.map((scenario) => (
              <ScenarioCard scenario={scenario} locale={locale} key={scenario.title} />
            ))}
          </div>
          <div className="scenario-soon-grid">
            {UPCOMING_SCENARIOS.map((scenario) => (
              <ScenarioSoonCard scenario={scenario} locale={locale} key={scenario.title} />
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
