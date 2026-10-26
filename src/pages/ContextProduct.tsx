import useBrokenLinks from '@docusaurus/useBrokenLinks'
import {ArrowRightIcon} from '@radix-ui/react-icons'
import MarketingLayout from '../components/MarketingLayout'
import HeroShowcase from '../components/showcase/HeroShowcase'
import Button from '../components/Button'
import ContextArchitecture from '../components/ContextArchitecture'
import ContextDataExperience from '../components/ContextDataExperience'
import ContextKnowledgeCycle from '../components/ContextKnowledgeCycle'
import AgentIntegration from '../components/AgentIntegration'
import ProductManagement from '../components/ProductManagement'
import ProductOverviewVideo from '../components/ProductOverviewVideo'
import UseCaseExplorer from '../components/usecases/UseCaseExplorer'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'

export default function ContextProduct() {
  const anchors = useBrokenLinks()
  for (const id of ['overview', 'architecture', 'sources', 'knowledge', 'cost', 'integration', 'management', 'solutions']) anchors.collectAnchor(id)
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={t('Vane Context | Multimodal context for AI agents', 'Vane Context｜AI Agent 的多模态上下文平台')} description={t('Connect enterprise data, analyze multimodal content on demand and reuse knowledge to deliver relevant, traceable context to AI agents.', '连接企业数据，按需分析多模态内容，持续复用知识，为 AI Agent 提供相关、可追溯的上下文。')}>
    <section className="marketing-product-hero context-product-hero"><div className="wrap product-hero-grid"><div><h1 className="h1">{locale === 'en' ? <><span className="hero-title-line">Multimodal context.</span><span className="hero-title-line">Ready for your agents.</span></> : '为 Agent 提供可追溯、可复用的多模态上下文'}</h1><p className="lead">{t('Connect enterprise content and business data. Retrieve, analyze and retain the knowledge each task needs, with less repeated processing and lower context costs.', '接入企业资料与业务数据，围绕任务检索、深入分析并沉淀知识，减少重复处理和上下文成本。')}</p><div className="marketing-actions"><Button solid to="/demo?source=product-context" arrow>{t('Request a demo', '预约演示')}</Button><Link to="/products/context#integration">{t('View integration options', '查看接入方式')}<ArrowRightIcon/></Link></div></div><HeroShowcase withCopy={false} readQuery={false}/></div></section>
    <ProductOverviewVideo key={locale}/>
    <section className="section marketing-section" id="architecture"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('From enterprise data to agent-ready context.', '从企业数据，到 Agent 可用的上下文')}</h2><p>{t('Connect your sources, keep knowledge current and deliver cited context through tools and Skills.', '连接数据源，持续更新知识，通过工具与 Skills 为 Agent 提供有来源的上下文。')}</p></div><ContextArchitecture/></div></section>
    <section className="section marketing-section" id="sources"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Connect multimodal content, business data and semantics.', '连接多模态内容、业务数据与语义层')}</h2><p>{t('Link files, media and tables to business models, relationships and metric definitions so agents can use them in context.', '将文件、媒体和数据表关联到业务模型、关系与指标定义，让 Agent 在同一业务背景下使用数据。')}</p></div><ContextDataExperience/></div></section>
    <section className="section marketing-section" id="knowledge"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Automate data preparation. Analyze on demand.', '基础处理自动完成，深度分析按需进行')}</h2><p>{t('Keep knowledge up to date as data changes. Retrieve what is already known, analyze the missing details and save reusable results.', '持续处理数据变更。任务到来时先检索已有知识，再分析缺失内容，并保存可复用结果。')}</p></div><div id="cost"><ContextKnowledgeCycle/></div></div></section>
    <section className="section marketing-section" id="integration"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('One connection. Tools and Skills, on demand.', '一次连接，按需获取工具与 Skills')}</h2><p>{t('Connect your existing agent through MCP. Discover authorized capabilities and task-specific guidance from the service as you work.', '通过 MCP 接入已有 Agent，在任务中发现授权能力，并按需读取服务指引与场景技能。')}</p></div><AgentIntegration/></div></section>
    <section className="section marketing-section" id="management"><div className="wrap management-layout"><div className="section-heading"><h2 className="h2">{t('Visibility into sources, processing and cost.', '来源、处理过程与成本，清晰可见')}</h2><p>{t('Verify results, manage semantic definitions, track tasks and monitor model usage and costs in one workspace.', '在统一工作台中核验分析结果、管理语义定义、跟踪任务并查看模型用量与成本。')}</p></div><ProductManagement/></div></section>
    <section className="section marketing-section" id="solutions"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Agent solutions built around your business tasks.', '面向业务任务的 Agent 解决方案')}</h2><p>{t('Combine data connections, task-specific processing, a semantic layer and agent skills across six business use cases.', '结合数据接入、场景化解析、语义层与 Agent Skills，为六类业务场景提供完整方案。')}</p></div><UseCaseExplorer/><Link className="arrow-link" to="/solutions">{t('Explore all solutions', '查看全部解决方案')}<ArrowRightIcon aria-hidden="true"/></Link></div></section>
  </MarketingLayout>
}
