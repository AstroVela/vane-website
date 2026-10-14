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
import TaskContextExperience from '../components/TaskContextExperience'
import UseCaseExplorer from '../components/usecases/UseCaseExplorer'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'

export default function ContextProduct() {
  const anchors = useBrokenLinks()
  for (const id of ['architecture', 'sources', 'knowledge', 'tasks', 'cost', 'integration', 'management', 'solutions']) anchors.collectAnchor(id)
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={t('Vane Context: useful context, less repeated work', 'Vane Context：让 Agent 以更低的持续成本用好企业资料')} description={t('Find relevant media, understand it on demand and reuse source knowledge. Deliver focused, verifiable context to your applications and agents.', '按需理解多模态资料、复用来源知识，向应用和 Agent 交付精简、可核验的上下文，减少重复处理与维护投入。')}>
    <section className="marketing-product-hero context-product-hero"><div className="wrap product-hero-grid"><div><span className="product-badge">{t('Commercial product', '商业产品')}</span><h1 className="h1">{t('Useful context.', '让企业资料，')}<br/>{t('Less repeated work.', '持续服务 Agent。')}</h1><p className="lead">{t('Understand media on demand, reuse knowledge and give agents focused answers with original evidence.', '按需理解多模态资料，复用已有知识，为 Agent 准备必要信息与原始依据。')}</p><div className="marketing-actions"><Button solid to="/demo?source=product-context" arrow>{t('Request Demo', '预约演示')}</Button><Link to="/docs/context">{t('Integration overview', '接入概览')}<ArrowRightIcon/></Link></div></div><HeroShowcase withCopy={false} readQuery={false}/></div></section>
    <section className="section marketing-section" id="architecture"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Enterprise data. Usable agent context.', '从企业全域数据，到 Agent 可用的上下文。')}</h2><p>{t('Connect, prepare, investigate and reuse. Keep people involved throughout the lifecycle.', '接入、准备、按需理解与复用，人的管理贯穿整个过程。')}</p></div><ContextArchitecture/></div></section>
    <section className="section marketing-section" id="sources"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Connect content to its business meaning.', '让文件内容与业务数据，在同一数据空间中关联起来。')}</h2><p>{t('Files, media, relational records and semantic definitions can inform the same task.', '文件、媒体、结构化记录与语义定义，共同服务同一个业务任务。')}</p></div><ContextDataExperience/></div></section>
    <section className="section marketing-section" id="knowledge"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Prepare the basics. Deepen what matters.', '提前准备基础理解，围绕任务补足深度知识。')}</h2><p>{t('Maintain source knowledge as data changes. Online requests retrieve relevant parts, analyze gaps and publish reusable findings.', '随着资料变化持续维护知识。在线请求检索相关内容、补足理解，并沉淀可复用结果。')}</p></div><div id="cost"><ContextKnowledgeCycle/></div><div className="context-task-detail" id="tasks"><h3>{t('Explore a complete agent handoff.', '查看一次完整的 Agent 上下文交付。')}</h3><TaskContextExperience/></div></div></section>
    <section className="section marketing-section" id="integration"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Connect your agent. Give it a way to use your data.', '接入现有 Agent，让它知道如何使用你的数据。')}</h2><p>{t('MCP provides callable tools. The Skill explains how to request, reuse and inspect context.', 'MCP 提供可调用的工具，Skill 说明如何请求、复用和核验上下文。')}</p></div><AgentIntegration/></div></section>
    <section className="section marketing-section" id="management"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('See the evidence. Understand the process.', '每一份理解都有依据，每一次处理都可以追踪。')}</h2><p>{t('Verify sources, manage definitions, follow processing and inspect usage from a shared product workspace.', '在同一产品工作区中核验资料、管理定义、追踪处理和查看用量。')}</p></div><ProductManagement/></div></section>
    <section className="section marketing-section" id="solutions"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Complete solutions for the work ahead.', '围绕 Agent 任务，交付完整的数据与上下文方案。')}</h2><p>{t('From data and tailored parsing to business semantics and Agent Skills. Explore six agent scenarios.', '从数据接入与定制解析，到业务语义与 Agent Skill，了解六大应用场景。')}</p></div><UseCaseExplorer/><Link className="arrow-link" to="/solutions">{t('Explore all six solutions', '查看全部六大场景方案')}<ArrowRightIcon aria-hidden="true"/></Link></div></section>
  </MarketingLayout>
}
