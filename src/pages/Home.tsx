import {ArrowRightIcon} from '@radix-ui/react-icons'
import useBaseUrl from '@docusaurus/useBaseUrl'
import MarketingLayout from '../components/MarketingLayout'
import ContextConveyor from '../components/ContextConveyor'
import UnderstandingExplorer from '../components/showcase/UnderstandingExplorer'
import UseCaseExplorer from '../components/usecases/UseCaseExplorer'
import Button from '../components/Button'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'

export default function Home(){
 const locale=useSiteLocale(),t=(en:string,zh:string)=>locale==='en'?en:zh
 const photo=useBaseUrl('/showcase/marketing/comp_005-image.b3187abe73e8.webp'),blend=useBaseUrl('/showcase/marketing/comp_001-blending.a20b043d09b6.webp')
 return <MarketingLayout title={t('Multimodal context for your agents','让多模态数据成为 Agent 可用的上下文')} description={t('Understand video, images, audio and documents. Give agents relevant information with original evidence. Explore Vane Context and the open source Vane Data engine.','理解视频、图片、音频与文档，为 Agent 提供相关信息与原始依据。了解 Vane Context 与开源 Vane Data 引擎。')}>
  <section className="workshop-hero"><div className="workshop-heading"><h1 className="h1">{t('Your multimodal data.','让多模态数据，')}<br/><span>{t('Context for your agents.','成为 Agent 可用的上下文。')}</span></h1><p className="lead">{t('Understand video, images, audio and documents. Put relevant information and original evidence in your agent’s hands.','理解视频、图片、音频与文档，围绕任务提供相关信息，并保留原始依据。')}</p><div className="marketing-actions"><Button solid to="/demo?source=home" arrow>{t('Request Demo','预约演示')}</Button><Link to="/products/context">{t('Explore Vane Context','了解 Vane Context')}<ArrowRightIcon aria-hidden="true"/></Link></div></div>
   <ContextConveyor/><div className="workshop-support"><p>{t('Video, images, audio and PDF. Ready for the way your agent works.','视频、图片、音频与 PDF，让原始资料进入 Agent 的实际工作。')}</p></div>
  </section>

  <section className="section marketing-section understanding-section" id="understanding"><div className="wrap"><div className="centered-section-heading"><h2 className="h2">{t('See the understanding.','看懂内容，')}<br/>{t('Follow the evidence.','也能逐项核验。')}</h2><p>{t('Explore what is in the frame, in the sound and on the page. Ask a question or extract information, then inspect its source.','从画面、声音和文档中回答问题、提取信息，每项结果都能追溯来源。')}</p></div><UnderstandingExplorer/><div className="understanding-more"><Link className="arrow-link" to="/products/context#tasks">{t('How agents get the context they need','了解如何为 Agent 准备上下文')}<ArrowRightIcon aria-hidden="true"/></Link></div></div></section>

  <section className="section marketing-section" id="scenarios"><div className="wrap"><div className="centered-section-heading"><h2 className="h2">{t('Context for the work ahead.','为你的 Agent，补齐任务需要的信息。')}</h2><p>{t('Meetings, customer cases, equipment incidents and creative briefs. Find the context that moves your work forward.','从会议背景到设备异常，从客户问题到营销创作，获得相关事实、可用素材与原始依据。')}</p></div><UseCaseExplorer/><Link className="arrow-link" to="/solutions">{t('Explore all use cases','浏览全部应用场景')}<ArrowRightIcon aria-hidden="true"/></Link></div></section>

  <section className="section marketing-section products-section"><div className="wrap"><div className="centered-section-heading"><h2 className="h2">{t('Start with your data and agents.','从你的数据和 Agent 开始。')}</h2><p>{t('Integrate a context service, build with the open source engine, or explore the developer interfaces.','接入上下文服务，用开源引擎构建数据流程，或了解开发者接入方式。')}</p></div>
   <div className="home-entry-grid">
    <article className="home-entry home-entry-context"><span className="product-badge">{t('Commercial product','商业产品')}</span><div className="entry-source-composition"><img src={blend} alt={t('An action reference from the camping video.','露营视频中的操作参考。')} width={480} height={854} loading="lazy"/><img src={photo} alt={t('An original image with visible objects and text.','含可见对象与文字的原始图片。')} width={576} height={1024} loading="lazy"/></div><h3>Vane Context</h3><p>{t('Understand enterprise media, find relevant evidence and prepare usable context. Build on existing knowledge as your agents take on new tasks.','理解企业多模态资料，找到相关依据，准备可用上下文。沉淀已有知识，持续服务 Agent 的新任务。')}</p><div className="marketing-actions"><Button solid to="/demo?source=home" arrow>{t('Request Demo','预约演示')}</Button><Link to="/products/context">{t('Explore product','了解产品')} →</Link></div></article>
    <article className="home-entry home-entry-data"><span className="product-badge">{t('Open source / Apache-2.0','开源 / Apache-2.0')}</span><h3>Vane Data</h3><p>{t('Bring files, model inference and SQL into one data processing workflow. Reuse your Python code and let the engine coordinate execution.','将文件、模型计算与 SQL 纳入统一的数据处理流程，复用 Python 代码，由引擎协调执行。')}</p><code className="entry-query">SELECT source, subject, caption<br/>FROM image_observations<br/>WHERE scene = 'kitchen';</code><div className="marketing-actions"><Link to="/products/data">{t('Explore Vane Data','了解 Vane Data')} →</Link><Link to="/benchmarks">{t('Published benchmarks','查看基准测试')} →</Link></div></article>
    <article className="home-entry"><span className="product-badge">{t('For developers','开发者接入')}</span><h3>{t('Connect your existing agent.','接入你已有的 Agent。')}</h3><div className="entry-methods"><span>API</span><span>SDK</span><span>MCP</span></div><p>{t('Keep your application and choose the interface that fits your workflow.','保留现有应用的工作方式，选择适合你的集成接口。')}</p><div className="marketing-actions"><Link to="/docs/context">{t('Read the integration guide','阅读接入文档')} →</Link><Link to="/docs/data/quickstart/quickstart">{t('Start with Vane Data','开始使用 Vane Data')} →</Link></div></article>
   </div>
  </div></section>
 </MarketingLayout>
}
