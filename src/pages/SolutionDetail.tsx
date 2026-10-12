import {useLocation} from '@docusaurus/router'
import MarketingLayout from '../components/MarketingLayout'
import HeroShowcase from '../components/showcase/HeroShowcase'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {solutions} from '../content/solutions'
export default function SolutionDetail() {
  const {pathname}=useLocation()
  const solution=solutions.find(s=>pathname.endsWith('/'+s.id))??solutions[0]
  const locale=useSiteLocale(),t=(en:string,zh:string)=>locale==='en'?en:zh
  return <MarketingLayout title={solution.task[locale]} description={solution.summary[locale]}>
    <section className="marketing-product-hero"><div className="wrap"><Eyebrow>VANE CONTEXT / {t('USE CASE','应用场景')}</Eyebrow><h1 className="h1">{solution.title[locale]}</h1><p className="lead">{solution.summary[locale]}</p><div className="marketing-actions"><Button solid to={'/demo?source=solution&scenario='+solution.id} arrow>{t('Request this demo','预约相关演示')}</Button><Button to="/docs/context">{t('Integration overview','接入概览')}</Button></div><div className="product-showcase"><HeroShowcase key={solution.id} initialScenario={solution.scenario} initialResult={solution.id==='audio-evidence'?'audio-briefing':undefined} readQuery={false}/></div></div></section>
    <section className="section marketing-section"><div className="wrap"><Eyebrow>{t('EXAMPLE INPUTS','示例资料')}</Eyebrow><h2 className="h2">{t('One collection, connected evidence.','一套资料，彼此关联的依据。')}</h2><div className="marketing-three-grid example-inputs"><div><img src="/showcase/v1/product-action.webp" alt={t('Example product demonstration','示例产品演示')}/><h3>{t('Product demonstration','产品演示')}</h3><p>VIDEO / IMAGE</p></div><div><img src="/showcase/v1/audio-poster.svg" alt={t('Example product briefing','示例产品介绍')}/><h3>{t('Recorded briefing','介绍录音')}</h3><p>AUDIO / TRANSCRIPT</p></div><div><img src="/showcase/v1/guide-page-2.webp" alt={t('Example guide page','示例说明书页面')}/><h3>{t('Instructions and specifications','操作与规格说明')}</h3><p>PDF / SOURCE PAGE</p></div></div><p className="marketing-note">{t('Luma Go is a fictional product collection created for this showcase. Media and results illustrate product capabilities; it is not a customer case or benchmark.','Luma Go 是为展台创建的示例产品资料库。素材与结果用于展示产品能力，不是客户案例或性能测量。')}</p></div></section>
    <section className="section marketing-section"><div className="wrap"><h2 className="h2">{t('How your application uses it.','你的应用如何使用。')}</h2><div className="integration-list">{[
      [t('Describe the information needed','说明资料需求'),t('Your application or business agent submits the current question or reference image.','应用或业务 Agent 提交当前问题或参考图。')],
      [t('Find relevant evidence','检索相关依据'),t('Context returns ranked content with stable source references.','Context 返回相关内容和稳定的来源引用。')],
      [t('Analyze selected content','分析选中的内容'),t('Request structured details for selected evidence, clips or pages.','针对证据、片段或页面获取结构化细节。')],
      [t('Use and verify the result','使用并核对结果'),t('The business agent completes its work; users can inspect the original evidence.','业务 Agent 完成任务，用户可核对原始依据。')],
    ].map(([title,body],i)=><div key={title}><span>0{i+1}</span><div><strong>{title}</strong><p>{body}</p></div></div>)}</div><p className="lead">{t('Evaluate media types, source access, model support and deployment requirements with the team.','与团队一起评估资料类型、来源访问、模型支持和部署要求。')}</p><Link to="/docs/context">{t('Read the integration contracts','阅读接入契约')} →</Link></div></section>
    <section className="section marketing-final-cta"><div className="wrap"><h2 className="h2">{t('Bring your own use case.','看看你的场景能做到什么。')}</h2><div className="marketing-actions"><Button solid to={'/demo?source=solution&scenario='+solution.id} arrow>{t('Request Demo','预约演示')}</Button></div></div></section>
  </MarketingLayout>
}
