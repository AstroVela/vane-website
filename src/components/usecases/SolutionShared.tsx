import {useId, type ReactNode} from 'react'
import {ArrowRightIcon, FileTextIcon, Link2Icon} from '@radix-ui/react-icons'
import FeatureTabs from '../FeatureTabs'
import {useSiteLocale} from '../../siteI18n'
import {type Localized} from '../../content/types'

export type Evidence = {id: string; title: Localized; meta: Localized; quote: Localized; note?: Localized}
export function SampleLabel() {
  const locale = useSiteLocale()
  return <span className="solution-sample">{locale === 'en' ? 'Example scenario' : '场景演示'}</span>
}
export function DemoHeader({name, children}: {name: string; children?: ReactNode}) {
  return <div className="solution-demo-header"><span>{name}</span>{children}<SampleLabel /></div>
}
export function DemoTabs({options, value, onChange, label, children}: {
  options: {id: string; label: string}[]; value: string; onChange: (value: string) => void; label: string; children: ReactNode
}) {
  const id = useId()
  return <><FeatureTabs options={options} value={value} onChange={onChange} label={label} panelId={id} />
    <div id={id} role="tabpanel" aria-labelledby={`${id}-${value}`} tabIndex={0}>{children}</div></>
}
/** Keep an explicitly requested reference in view on a stacked mobile layout. */
export function revealEvidence(trigger: HTMLElement) {
  if (!window.matchMedia('(max-width: 767px)').matches) return
  const demo = trigger.closest('.solution-demo')
  requestAnimationFrame(() => {
    const source = demo?.querySelector<HTMLElement>('.solution-source')
    if (!source) return
    const bounds = source.getBoundingClientRect()
    if (bounds.top >= 90 && bounds.bottom <= innerHeight) return
    source.focus({preventScroll: true})
    source.scrollIntoView({block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})
  })
}
export function SourceButton({source, selected, onClick}: {source: Evidence; selected: boolean; onClick: () => void}) {
  const locale = useSiteLocale()
  return <button type="button" className="solution-source-button" aria-pressed={selected} onClick={event => {onClick(); revealEvidence(event.currentTarget)}}>
    <Link2Icon aria-hidden="true" /><span>{source.title[locale]}</span><ArrowRightIcon aria-hidden="true" />
  </button>
}
export function SourceReader({source, children}: {source: Evidence; children?: ReactNode}) {
  const locale = useSiteLocale()
  return <aside className="solution-source" tabIndex={-1} aria-label={locale === 'en' ? 'Source evidence' : '来源依据'} aria-live="polite">
    <div className="solution-label"><FileTextIcon aria-hidden="true" />{locale === 'en' ? 'Source evidence' : '来源依据'}</div>
    <h4>{source.title[locale]}</h4><span className="solution-meta">{source.meta[locale]}</span>
    {children}<blockquote>{source.quote[locale]}</blockquote>
    {source.note && <p className="solution-footnote">{source.note[locale]}</p>}
  </aside>
}
export function NextAction({children}: {children: ReactNode}) {
  const locale = useSiteLocale()
  return <div className="solution-next"><ArrowRightIcon aria-hidden="true" /><div><span className="solution-label">{locale === 'en' ? 'What your agent does next' : 'Agent 如何继续'}</span><p>{children}</p></div></div>
}
export function Status({children, tone = 'neutral'}: {children: ReactNode; tone?: 'neutral' | 'good' | 'open'}) {
  return <span className={`solution-status status-${tone}`}>{children}</span>
}
