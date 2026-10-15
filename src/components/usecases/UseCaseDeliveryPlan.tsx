import {CheckIcon} from '@radix-ui/react-icons'
import {type UseCaseId} from '../../content/useCases'
import {solutionPages} from '../../content/solutionPages'
import {useSiteLocale} from '../../siteI18n'

export default function UseCaseDeliveryPlan({id}: {id: UseCaseId}) {
  const locale = useSiteLocale(), plan = solutionPages[id]
  return <div className="solution-delivery-grid">
    <ol className="solution-deliverables">{plan.deliverables.map((item, index) => <li key={item.title.en}><span>0{index + 1}</span><div><h3>{item.title[locale]}</h3><p>{item.body[locale]}</p></div></li>)}</ol>
    <div className="solution-outcomes"><span className="solution-label">{locale === 'en' ? 'Verify it with your own data' : '用你的数据验证结果'}</span><h3>{locale === 'en' ? 'A useful result is one you can check.' : '效果，要能具体核验。'}</h3><ul>{plan.checks.map(check => <li key={check.en}><CheckIcon aria-hidden="true" /><span>{check[locale]}</span></li>)}</ul><p>{locale === 'en' ? 'Review the findings, source references, handling steps and usage together with your team.' : '与团队一起核对发现、原始引用、处理过程和实际用量。'}</p></div>
  </div>
}
