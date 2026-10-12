import {useState} from 'react'
import MarketingLayout from '../components/MarketingLayout'
import Eyebrow from '../components/Eyebrow'
import {Link} from '../router'
import {solutions} from '../content/solutions'
import {useSiteLocale} from '../siteI18n'
export default function UseCases() {
  const locale=useSiteLocale(),t=(en:string,zh:string)=>locale==='en'?en:zh
  const [product,setProduct]=useState('all')
  return <MarketingLayout title={t('Put multimodal data to work','让多模态资料进入实际工作')} description={t('Explore multimodal search, recording evidence, product verification and training data pipelines.','了解多模态检索、录音依据、产品核对与训练数据流水线。')}>
    <section className="section marketing-section"><div className="wrap"><Eyebrow>{t('USE CASES','应用场景')}</Eyebrow><h1 className="h1">{t('Put multimodal data to work.','让多模态资料进入实际工作。')}</h1><p className="lead">{t('Explore what you can find, understand and build.','看看能够检索、理解和构建什么。')}</p><div className="marketing-tabs" role="group" aria-label={t('Filter by product','按产品筛选')}>{[['all',t('All','全部')],['context','Vane Context'],['data','Vane Data']].map(([id,label])=><button type="button" key={id} aria-pressed={product===id} onClick={()=>setProduct(id)}>{label}</button>)}</div><div className="marketing-two-grid solutions-grid">{solutions.filter(s=>product==='all'||s.product===product).map(s=><Link className="solution-card" to={'/solutions/'+s.id} key={s.id}><img src={s.poster} alt="" loading="lazy"/><div><span className="product-badge">{s.product==='context'?'Vane Context':t('Vane Data · Open source','Vane Data · 开源')}</span><h2>{s.task[locale]}</h2><p>{s.summary[locale]}</p><span>{t('Explore use case','查看场景')} ↗</span></div></Link>)}</div></div></section>
  </MarketingLayout>
}
