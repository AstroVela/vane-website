import {useId, useState} from 'react'
import {ArrowRightIcon, ChevronDownIcon} from '@radix-ui/react-icons'
import {agentUseCases, casePagePath, type UseCaseId} from '../../content/useCases'
import {useSiteLocale} from '../../siteI18n'
import {Link} from '../../router'
import CaseExperience from './CaseExperience'

export default function UseCaseExplorer() {
  const locale = useSiteLocale(), [active, setActive] = useState<UseCaseId>('marketing-campaigns'), id = useId()
  return <div className="case-explorer">{agentUseCases.map(scenario => {
    const selected = active === scenario.id
    return <div className={'case-explorer-item' + (selected ? ' is-active' : '')} key={scenario.id}>
      <button className="case-explorer-trigger" type="button" aria-expanded={selected} aria-controls={id+'-'+scenario.id} onClick={() => setActive(scenario.id)}><span>{scenario.name[locale]}</span><ChevronDownIcon aria-hidden="true" /></button>
      <div className="case-explorer-panel" id={id+'-'+scenario.id} hidden={!selected}>{selected && <>
        <CaseExperience key={scenario.id} scenario={scenario} compact />
        <div className="case-explorer-caption"><p>{scenario.summary[locale]}</p><Link className="arrow-link" to={casePagePath(scenario.id)}>{locale === 'en' ? 'Explore this use case' : '了解此场景'}<ArrowRightIcon aria-hidden="true" /></Link></div>
      </>}</div>
    </div>
  })}</div>
}
