import {useLocation} from '@docusaurus/router'
import MarketingLayout from '../components/MarketingLayout'
import HeroShowcase from '../components/showcase/HeroShowcase'
import Button from '../components/Button'
import MarketingDeliverable from '../components/MarketingDeliverable'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {solutions} from '../content/solutions'
export default function SolutionDetail() {
  const {pathname} = useLocation(), solution = solutions.find(s => pathname.endsWith('/' + s.id)) ?? solutions[0]
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={solution.task[locale]} description={solution.summary[locale]}>
    <section className="marketing-product-hero"><div className="wrap"><div className="solution-heading"><span className="product-badge">Vane Context</span><h1 className="h1">{solution.title[locale]}</h1><p className="lead">{solution.summary[locale]}</p><div className="marketing-actions"><Button solid to={'/demo?source=solution&scenario=' + solution.id + '&media=' + solution.media} arrow>{t('Request Demo', '预约演示')}</Button><Link to="/docs/context">{t('Integration overview', '接入概览')} →</Link></div></div><div className="solution-showcase"><HeroShowcase key={solution.id} withCopy={false} initialMedia={solution.media} readQuery /></div></div></section>
    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('A brief your agent can build on.', 'Agent 可以继续使用的资料包。')}</h2><p>{t('Inspect a useful moment, a visual detail and an original statement. Each carries its own source.', '核对可用片段、画面细节和关键原话，每项资料都有独立来源。')}</p></div><MarketingDeliverable /></div></section>
    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Use the result in your application.', '把结果用到你的应用中。')}</h2><p>{t('Retrieve relevant evidence, analyze selected content and keep references with the result.', '检索相关证据，分析选中内容，将来源引用与结果一并保留。')}</p></div><div className="solution-steps">{[
      [t('Describe the information needed', '说明资料需求'), t('Your application submits its question, reference image or analysis request.', '应用提交问题、参考图片或分析要求。')],
      [t('Get usable context', '获得可用上下文'), t('Receive focused findings and source references. Reuse published knowledge when it still applies, and analyze new details when needed.', '获取精简资料与来源引用；已有知识适用时直接复用，需要新细节时再补充分析。')],
      [t('Inspect the source', '核对来源'), t('Use the findings in research or a creative brief, and read the original sources whenever a detail needs checking.', '将资料用于研究与创作，需要核对细节时回到原始片段、图片或语句。')],
    ].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div><div className="marketing-actions"><Link to="/docs/context/integration">{t('Read integration contracts', '阅读接入契约')} →</Link></div></div></section>
    <section className="section marketing-final-cta"><div className="wrap"><h2 className="h2">{t('See what your own data can do.', '看看你的资料能做到什么。')}</h2><div className="marketing-actions"><Button solid to={'/demo?source=solution&scenario=' + solution.id} arrow>{t('Request Demo', '预约演示')}</Button></div></div></section>
  </MarketingLayout>
}
