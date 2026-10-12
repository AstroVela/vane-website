import useBaseUrl from '@docusaurus/useBaseUrl'
import MarketingLayout from '../components/MarketingLayout'
import {Link} from '../router'
import {solutions} from '../content/solutions'
import {useSiteLocale} from '../siteI18n'
function FeaturedSolution({solution}: {solution: typeof solutions[number]}) {
  const locale = useSiteLocale(), image = useBaseUrl(solution.poster)
  return <article className="solution-feature"><img src={image} alt="" loading="lazy" /><div><span className="product-badge">{solution.product === 'context' ? 'Vane Context' : 'Vane Data · Apache-2.0'}</span><h2>{solution.task[locale]}</h2><p>{solution.summary[locale]}</p><Link to={'/solutions/' + solution.id}>{locale === 'en' ? 'Explore use case' : '查看场景'} →</Link></div></article>
}
export default function UseCases() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={t('Put multimodal data to work', '让多模态资料进入实际工作')} description={t('Marketing asset understanding and reproducible multimodal training pipelines.', '营销资料理解与研究，以及可复现的多模态训练数据流水线。')}>
    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h1 className="h1">{t('Put multimodal data to work.', '让多模态资料进入实际工作。')}</h1><p className="lead">{t('Explore what you can understand, find and build.', '看看能够理解、检索和构建什么。')}</p></div><div className="solutions-featured"><FeaturedSolution solution={solutions[0]} /><FeaturedSolution solution={solutions[3]} /></div></div></section>
  </MarketingLayout>
}
