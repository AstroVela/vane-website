import {useLocation} from '@docusaurus/router'
import MarketingLayout from '../components/MarketingLayout'
import HeroShowcase from '../components/showcase/HeroShowcase'
import Button from '../components/Button'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {solutions} from '../content/solutions'
export default function SolutionDetail() {
  const {pathname} = useLocation(), solution = solutions.find(s => pathname.endsWith('/' + s.id)) ?? solutions[0]
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={solution.task[locale]} description={solution.summary[locale]}>
    <section className="marketing-product-hero"><div className="wrap"><div className="solution-heading"><span className="product-badge">Vane Context</span><h1 className="h1">{solution.title[locale]}</h1><p className="lead">{solution.summary[locale]}</p><div className="marketing-actions"><Button solid to={'/demo?source=solution&scenario=' + solution.id + '&media=' + solution.media} arrow>{t('Request Demo', '预约演示')}</Button><Link to="/docs/context">{t('Integration overview', '接入概览')} →</Link></div></div><div className="solution-showcase"><HeroShowcase key={solution.id} withCopy={false} initialMedia={solution.media} readQuery /></div></div></section>
    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Useful details, with a way back to the source.', '可用的细节，找得到出处。')}</h2><p>{t('Each media type stands on its own. Inspect the understanding against the original.', '每种资料分别展示理解，通过原始素材核对结果。')}</p></div><div className="capability-rows compact-rows">{[
      [t('Video actions and scenes', '视频动作与场景'), t('Locate the drink preparation and blending in the camping video.', '定位露营视频中的饮品准备与搅拌动作。'), '?media=video'],
      [t('Objects and words in an image', '图片中的对象与文字'), t('Inspect the blender, ingredients and smoothie caption in the original first frame.', '核对原始首帧中的搅拌杯、食材与奶昔标题。'), '?media=image'],
      [t('Spoken product expressions', '口头表达'), t('Listen to the advertising narrator’s own words about portability and a morning routine.', '听广告旁白关于便携性与早餐场景的原话。'), '?media=audio'],
    ].map(([title, body, query]) => <div className="capability-row" key={title}><div><h3>{title}</h3><p>{body}</p></div><Link to={'/solutions/video-research' + query}>{t('Inspect example', '核对示例')} →</Link></div>)}</div></div></section>
    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Use the result in your application.', '把结果用到你的应用中。')}</h2><p>{t('Retrieve relevant evidence, analyze selected content and keep references with the result.', '检索相关证据，分析选中内容，将来源引用与结果一并保留。')}</p></div><div className="solution-steps">{[
      [t('Describe the information needed', '说明资料需求'), t('Your application submits its question, reference image or analysis request.', '应用提交问题、参考图片或分析要求。')],
      [t('Get usable context', '获得可用上下文'), t('Receive relevant content, structured understanding and source locators.', '获取相关内容、结构化理解与来源定位。')],
      [t('Inspect the source', '核对来源'), t('Your users can inspect the exact footage, image or spoken phrase.', '用户可回到具体画面、图片或语句核对。')],
    ].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div><div className="marketing-actions"><Link to="/docs/context/integration">{t('Read integration contracts', '阅读接入契约')} →</Link></div></div></section>
    <section className="section marketing-final-cta"><div className="wrap"><h2 className="h2">{t('See what your own data can do.', '看看你的资料能做到什么。')}</h2><div className="marketing-actions"><Button solid to={'/demo?source=solution&scenario=' + solution.id} arrow>{t('Request Demo', '预约演示')}</Button></div></div></section>
  </MarketingLayout>
}
