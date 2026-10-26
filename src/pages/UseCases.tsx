import {ArrowRightIcon} from '@radix-ui/react-icons'
import MarketingLayout from '../components/MarketingLayout'
import Button from '../components/Button'
import UseCaseExplorer from '../components/usecases/UseCaseExplorer'
import {Link} from '../router'
import {dataSolutions} from '../content/dataSolutions'
import {agentUseCases, casePagePath} from '../content/useCases'
import {useSiteLocale} from '../siteI18n'

export default function UseCases() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={t('Solutions for agents and multimodal data', 'Agent 与多模态数据解决方案')} description={t('Eight solutions for business agents, multimodal training data and enterprise data pipelines with Vane Context and Vane Data.', '探索六类业务 Agent 场景，以及多模态训练数据与企业数据流水线，共八个解决方案。')}>
    <section className="marketing-product-hero use-cases-hero"><div className="wrap"><span className="product-badge">Vane Context · Vane Data</span><h1 className="h1">{t('From your data to the work ahead.', '从你的数据，到业务与模型的下一步')}</h1><p className="lead">{t('Give business agents useful context with Vane Context. Build training datasets and enterprise data pipelines with Vane Data.', '用 Vane Context 为业务 Agent 提供可用上下文，用 Vane Data 构建训练数据集与企业数据流水线。')}</p><nav className="case-index-links" aria-label={t('Browse use cases', '浏览应用场景')}>{agentUseCases.map(scenario => <Link to={casePagePath(scenario.id)} key={scenario.id}>{scenario.name[locale]}<ArrowRightIcon aria-hidden="true" /></Link>)}{dataSolutions.map(item => <Link to={item.path} key={item.id}>{item.name[locale]}<ArrowRightIcon aria-hidden="true"/></Link>)}</nav></div></section>
    <section className="section marketing-section case-overview-explorer"><div className="wrap"><UseCaseExplorer /></div></section>
    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('One context foundation. Six ways to put it to work.', '同一套上下文能力，进入不同的业务')}</h2></div><div className="case-directory">{agentUseCases.map(scenario => <Link className="case-directory-entry" key={scenario.id} to={casePagePath(scenario.id)}><div><span className="value-label">{scenario.agent}</span><h3>{scenario.name[locale]}</h3></div><p>{scenario.summary[locale]}</p><ArrowRightIcon aria-hidden="true" /></Link>)}</div></div></section>
    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><span className="product-badge">Vane Data</span><h2 className="h2">{t('Build the data your models and agents need.', '构建模型与 Agent 所需的数据')}</h2><p>{t('Two data engineering solutions, from source files to training samples and searchable business records.', '两类数据工程方案，将源文件整理为训练样本与可检索的业务记录。')}</p></div><div className="case-directory data-solution-directory">{dataSolutions.map(item => <Link className="case-directory-entry" key={item.id} to={item.path}><div><span className="value-label">{item.product}</span><h3>{item.name[locale]}</h3></div><p>{item.summary[locale]}</p><ArrowRightIcon aria-hidden="true"/></Link>)}</div></div></section>
    <section className="section marketing-final-cta"><div className="wrap"><h2 className="h2">{t('What is your agent working on?', '你的 Agent 正在处理什么任务？')}</h2><div className="marketing-actions"><Button solid to="/demo?source=solution" arrow>{t('Request Demo', '预约演示')}</Button></div></div></section>
  </MarketingLayout>
}
