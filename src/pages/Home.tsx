import useBrokenLinks from '@docusaurus/useBrokenLinks'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import HomeHeroExecution from '../components/HomeHeroExecution'
import Cta from '../components/Cta'
import PixelIcon, { type PixelIconName } from '../components/PixelIcon'
import PlatformArchitecture from '../components/PlatformArchitecture'
import { Link } from '../router'
import { pickLocale, useSiteLocale } from '../siteI18n'
import { DESIGN_PARTNER_MAILTO } from '../siteLinks'

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
      preRelease: 'pre-release',
      useCases: 'Use Cases',
      workloadsTitle: 'Four real-world AI workloads.',
      workloadsLead: 'From multimodal model training to enterprise data pipelines, real-world AI runs on diverse data. Pick the pipeline that matches your workload.',
      benchmarks: 'Benchmarks',
      proofTitle: 'Multimodal inference benchmarks',
      proofLead: 'Benchmarking multimodal AI pipelines across audio, video, document, and image workloads.',
      throughputVs: 'throughput vs Ray Data, with prefix bucketing on identical hardware.',
      matrix: 'Reproducible matrix',
      matrixCopy: 'Image classification · document embedding · audio transcription · video object detection. Workload-dependent, fully reproducible.',
      fullBenchmarks: 'Full benchmarks',
      throughputTitle: 'Throughput — vLLM batch inference (higher is better)',
      baselineEngines: 'baseline engines',
      platform: 'Platform',
      platformTitle: 'A multimodal-native AI engine connecting data, models, and agents.',
      platformLead: 'Unifies data, models, and agents — enabling continuous learning and scalable execution from local devices to Ray clusters.',
      install: 'Install',
      runExample: 'Run an example',
      runExampleCopy: 'Start from the docs examples and adapt the pipeline to your data.',
      buildPoc: 'Build your POC',
      buildPocCopy: 'Use the references and llms.txt files to wire Vane into your stack.',
      readDocs: 'Read the Docs',
      designPartner: 'Become a design partner',
    },
    {
      heroTitle: '面向 AI 工作负载的高性能、多模态原生引擎',
      heroLead: '通过 Python 和 SQL 接口统一多模态数据处理、智能计算与持续学习，并从本地环境无缝扩展到 Ray 集群。',
      getStarted: '开始使用',
      chooseWorkload: '选择你的工作负载',
      preRelease: '预发布',
      useCases: '用例',
      workloadsTitle: '多模态 AI 场景',
      workloadsLead: '从多模态模型训练到企业数据流水线，真实 AI 工作负载运行在多样化数据之上。选择与你的工作负载匹配的流水线。',
      benchmarks: '基准测试',
      proofTitle: '多模态推理基准测试',
      proofLead: '针对音频、视频、文档和图像工作负载，评测多模态 AI 流水线的推理性能。',
      throughputVs: '在相同硬件上启用前缀分桶后的 throughput vs Ray Data。',
      matrix: '可复现矩阵',
      matrixCopy: '图像分类、文档 embedding、音频转写、视频目标检测。结果取决于工作负载，且完全可复现。',
      fullBenchmarks: '完整基准测试',
      throughputTitle: 'Throughput — vLLM 批量推理（越高越好）',
      baselineEngines: '基线引擎',
      platform: '平台',
      platformTitle: '连接数据、模型与 Agent 的多模态原生 AI 引擎',
      platformLead: '统一数据、模型与 Agent，支持持续学习，并将可扩展执行能力从本地设备延伸到 Ray 集群。',
      install: '安装',
      runExample: '运行示例',
      runExampleCopy: '从文档示例开始，并把流水线改造成适配你自己的数据。',
      buildPoc: '构建 POC',
      buildPocCopy: '使用参考文档和 llms.txt 文件，把 Vane 接入你的技术栈。',
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
              <span>·</span><span>{copy.preRelease}</span><span>·</span><span>Apache-2.0</span>
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
            <Box style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column' }}>
              <div className="azt" style={{ textAlign: 'left' }}>vLLM batch inference · 66K rows · 2× A100</div>
              <div style={{ fontSize: 'clamp(56px,7vw,80px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.95, margin: '14px 0 8px' }}>3.1×</div>
              <div className="mut" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{copy.throughputVs}</div>
              <div className="bm-matrix">
                <div className="azt" style={{ textAlign: 'left', marginBottom: 10 }}>{copy.matrix}</div>
                <div className="bm-matrix-grid">
                  <span><b>~20× vs Spark</b></span>
                  <span><b>~2× vs Daft</b></span>
                  <span><b>~1.2× vs Ray Data</b></span>
                </div>
                <p>{copy.matrixCopy}</p>
              </div>
              <Button sm to="/benchmarks" arrow style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>{copy.fullBenchmarks}</Button>
            </Box>
            <Box className="lat">
              <div className="azt" style={{ textAlign: 'left', marginBottom: 14 }}>{copy.throughputTitle}</div>
              <div className="latrow"><span className="pl">Vane</span><div className="bar"><div className="fillb vane" style={{ width: '100%' }} /></div><span className="val">3.1×</span></div>
              <div className="latrow"><span className="pl">Daft</span><div className="bar"><div className="fillb base" style={{ width: '52%' }} /></div><span className="val mut">1.6×</span></div>
              <div className="latrow"><span className="pl">Ray Data</span><div className="bar"><div className="fillb base" style={{ width: '32%' }} /></div><span className="val mut">1.0×</span></div>
              <div className="leg">
                <span><span className="sw" style={{ background: 'var(--ink)' }} />Vane</span>
                <span><span className="sw base" style={{ background: 'repeating-linear-gradient(45deg,var(--ink-3),var(--ink-3) 2px,transparent 2px,transparent 4px)' }} />{copy.baselineEngines}</span>
              </div>
              <div style={{ marginTop: 14, fontSize: 11.5, color: 'var(--ink-3)' }}>
                66K rows · 2× A100 · prefix bucketing<br /><span className="link">⌥ AstroVela/vane</span>
              </div>
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
