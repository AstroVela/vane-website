import MarketingLayout from '../components/MarketingLayout'
import HeroShowcase from '../components/showcase/HeroShowcase'
import Button from '../components/Button'
import Box from '../components/Box'
import Eyebrow from '../components/Eyebrow'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {marketingProducts} from '../content/products'
import {solutions} from '../content/solutions'
import {track} from '../analytics'
import {BENCHMARK_RESULTS} from '../benchmarkData'

export default function Home() {
  const locale = useSiteLocale()
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={t('Make your multimodal data usable by AI.', '让 AI 理解你的多模态数据。')} description={t('Find relevant content across video, audio, images and documents—with structured analysis and references to the source.', '从视频、音频、图片与文档中，找到相关内容、获得结构化分析，并回到原始依据。')}>
    <section className="context-home-hero"><div className="wrap">
      <div className="context-hero-copy"><Eyebrow>{t('MULTIMODAL DATA, MEANINGFUL CONTEXT', '多模态数据，可用的上下文')}</Eyebrow>
        <h1 className="h1">{t('Make your multimodal data', '让 AI 理解你的')}{' '}<span>{t('usable by AI.', '多模态数据。')}</span></h1>
        <p className="lead">{t('Search, understand and cite video, audio, images and documents.', '检索视频、音频、图片与文档，理解内容，回到依据。')}</p>
        <div className="marketing-actions"><Button solid to="/demo?source=home" arrow onClick={() => track('context_demo_click', {product: 'context', locale})}>{t('Request Demo', '预约演示')}</Button><Button to="/products/data" arrow>{t('Explore Vane Data', '探索开源引擎 · Vane Data')}</Button></div>
      </div><HeroShowcase/>
    </div></section>
    <section className="section marketing-section"><div className="wrap"><div className="shead"><Eyebrow>{t('WHAT YOUR APPLICATION GETS', '应用真正得到什么')}</Eyebrow><h2 className="h2">{t('Useful results. Traceable evidence.', '找到内容，理解内容，核对依据。')}</h2></div>
      <div className="marketing-three-grid">{[
        [t('Find the right content', '找到相关内容'), t('Search with text, an image or both. Get the relevant clip, page or recording.', '用文字、图片或图文组合检索，直接得到相关片段、页面或录音。'), '⌕'],
        [t('Understand what is there', '获得内容理解'), t('Turn selected media into useful steps, facts and structured analysis.', '把选中的资料整理成操作步骤、事实和结构化分析。'), '≋'],
        [t('Go back to the source', '回到原始依据'), t('Follow a reference to the exact time window, document page or source image.', '沿引用回到对应时间窗、文档页码和原始图片。'), '↗'],
      ].map(([title, body, icon]) => <Box flat className="capability-card" key={title}><span className="capability-symbol">{icon}</span><h3>{title}</h3><p>{body}</p></Box>)}</div>
    </div></section>
    <div className="wrap"><div className="ddiv"/></div>
    <section className="section marketing-section"><div className="wrap"><div className="shead"><Eyebrow>{t('TWO PRODUCTS', '两个产品')}</Eyebrow><h2 className="h2">{t('Choose where to start.', '选择适合你的起点。')}</h2></div>
      <div className="marketing-two-grid">{marketingProducts.map((p, i) => <Box className="product-card" key={p.id}><div className="product-card-top"><span className="product-number">0{i + 1}</span><span className="product-badge">{p.badge[locale]}</span></div><h3>{p.name}</h3><p>{p.description[locale]}</p><ul>{(p.id === 'context' ? [t('Multimodal search & analysis', '多模态检索与分析'), t('Source evidence for apps & agents', '为应用与 Agent 提供引用证据'), t('API, SDK and MCP integration', 'API、SDK 与 MCP 接入')] : [t('Native media types and operators', '原生媒体类型与处理算子'), t('SQL + Python model pipelines', 'SQL + Python 模型处理流水线'), t('Local execution and Ray scaling', '本地运行与 Ray 扩展')]).map(item => <li key={item}>{item}</li>)}</ul><div className="product-card-actions"><Button solid to={p.actionPath} arrow>{p.action[locale]}</Button><Link to={p.path}>{t('Explore product', '了解产品')} ↗</Link></div></Box>)}</div>
    </div></section>
    <section className="section marketing-section" id="scenarios"><div className="wrap"><div className="marketing-section-head"><div><Eyebrow>VANE CONTEXT</Eyebrow><h2 className="h2">{t('See what you can ask.', '看看能完成哪些任务。')}</h2></div><Link to="/solutions">{t('All use cases', '所有应用场景')} →</Link></div>
      <div className="marketing-three-grid">{solutions.filter(s => s.product === 'context').map(s => <Link key={s.id} to={'/solutions/' + s.id} className="solution-card"><img src={s.poster} alt="" loading="lazy"/><div><span className="product-badge">Vane Context</span><h3>{s.task[locale]}</h3><p>{s.summary[locale]}</p><span>{t('Explore use case', '查看场景')} ↗</span></div></Link>)}</div>
    </div></section>
    <div className="wrap"><div className="ddiv"/></div>
    <section className="section marketing-section"><div className="wrap"><div className="marketing-two-grid"><div><Eyebrow>{t('BUILT TO CONNECT', '接入现有系统')}</Eyebrow><h2 className="h2">{t('Fits the way you build.', '融入你现有的应用。')}</h2><p className="lead">{t('Use Context from your application or agent. Use Data when you need to build the underlying pipeline.', '应用和 Agent 通过 Context 获取资料；需要构建底层处理流水线时，使用 Data。')}</p><Link to="/docs">{t('Explore developer resources', '查看开发者资源')} →</Link></div><div className="integration-list">{[
        ['HTTP API / SDK / MCP', t('Connect your application and existing agents.', '接入你的应用与现有 Agent。')],
        [t('Your models and data', '你的模型与资料'), t('Evaluate media types, model requirements and deployment together.', '一起评估资料类型、模型要求和部署方案。')],
        ['Vane Data', t('Explore reproducible media pipelines and published benchmarks.', '查看可复现的媒体处理流水线与已发布的基准测试。')],
      ].map(([title, body], i) => <div key={title}><span>0{i + 1}</span><div><strong>{title}</strong><p>{body}</p></div></div>)}</div></div>
      <div className="data-proof"><span>Vane Data · {t('Published benchmark', '已发布的基准测试')}</span><p>{t('Four media workloads, three data engines. See the environment, batch sizes and measured results.', '四类媒体工作负载、三个数据引擎。查看测试环境、批大小和测量结果。')}</p><div>{BENCHMARK_RESULTS.map(r => <span key={r.id}>{r.id} <b>{r.vaneSeconds}s</b></span>)}</div><Link to="/benchmarks">{t('View Data benchmarks', '查看 Data 基准测试')} ↗</Link></div>
    </div></section>
    <section className="section marketing-final-cta"><div className="wrap"><Eyebrow>{t('MAKE YOUR DATA USEFUL', '让资料真正可用')}</Eyebrow><h2 className="h2">{t('Bring your use case. See the possibilities.', '带着你的场景，看看能做到什么。')}</h2><p>{t('Discuss your data, models and integration with the Vane team.', '与 Vane 团队一起了解你的资料、模型和接入需求。')}</p><div className="marketing-actions"><Button solid to="/demo?source=home" arrow>{t('Request Demo', '预约演示')}</Button><Button to="/docs/data/quickstart/quickstart">{t('Start with Vane Data', '开始使用 Vane Data')}</Button></div></div></section>
  </MarketingLayout>
}
