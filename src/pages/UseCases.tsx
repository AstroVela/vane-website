import {ArrowRightIcon} from '@radix-ui/react-icons'
import MarketingLayout from '../components/MarketingLayout'
import Button from '../components/Button'
import UseCaseExplorer from '../components/usecases/UseCaseExplorer'
import {Link} from '../router'
import {agentUseCases, casePagePath} from '../content/useCases'
import {useSiteLocale} from '../siteI18n'

export default function UseCases() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={t('Context for six kinds of agents', '为六类 Agent 准备可用上下文')} description={t('Explore meeting intelligence, customer support, equipment diagnosis, personal work, marketing and commerce with Vane Context.', '探索会议智能、客服问题解决、设备诊断、个人工作、营销创作与商品导购场景。')}>
    <section className="marketing-product-hero use-cases-hero"><div className="wrap"><span className="product-badge">Vane Context</span><h1 className="h1">{t('Different tasks.', '不同的任务，')}<br />{t('Context that moves each one forward.', '都需要有依据的上下文。')}</h1><p className="lead">{t('Find your agent’s next task. Explore the material it could receive and the evidence it can follow.', '找到你的 Agent 要完成的任务，看看它能获得什么资料，又如何核对原始依据。')}</p><nav className="case-index-links" aria-label={t('Browse use cases', '浏览应用场景')}>{agentUseCases.map(scenario => <Link to={casePagePath(scenario.id)} key={scenario.id}>{scenario.name[locale]}<ArrowRightIcon aria-hidden="true" /></Link>)}</nav></div></section>
    <section className="section marketing-section case-overview-explorer"><div className="wrap"><UseCaseExplorer /></div></section>
    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('One context foundation. Six ways to put it to work.', '同一套上下文能力，进入不同的业务。')}</h2></div><div className="case-directory">{agentUseCases.map(scenario => <Link className="case-directory-entry" key={scenario.id} to={casePagePath(scenario.id)}><div><span className="value-label">{scenario.agent}</span><h3>{scenario.name[locale]}</h3></div><p>{scenario.summary[locale]}</p><ArrowRightIcon aria-hidden="true" /></Link>)}</div></div></section>
    <section className="section marketing-section"><div className="wrap case-data-link"><div><span className="product-badge">Vane Data</span><h2>{t('Building the data pipeline yourself?', '正在建设自己的数据流水线？')}</h2><p>{t('Explore reproducible processing for multimodal training data with the open source engine.', '用开源引擎构建可复现的多模态训练数据处理流程。')}</p></div><Link className="arrow-link" to="/solutions/training">{t('Explore training data pipelines', '查看训练数据场景')}<ArrowRightIcon aria-hidden="true" /></Link></div></section>
    <section className="section marketing-final-cta"><div className="wrap"><h2 className="h2">{t('What is your agent working on?', '你的 Agent 正在处理什么任务？')}</h2><div className="marketing-actions"><Button solid to="/demo?source=solution" arrow>{t('Request Demo', '预约演示')}</Button></div></div></section>
  </MarketingLayout>
}
