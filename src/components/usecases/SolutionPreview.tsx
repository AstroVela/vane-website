import {ArrowRightIcon, CheckIcon} from '@radix-ui/react-icons'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {useSiteLocale} from '../../siteI18n'
import {solutionPages} from '../../content/solutionPages'
import type {AgentUseCase} from '../../content/useCases'
import {assetFor} from '../../content/showcases'
import {PumpDrawing} from './EquipmentExperience'
import {BackpackDrawing} from './CommerceExperience'
import {SampleLabel} from './SolutionShared'
import '../../solutionPages.css'

export default function SolutionPreview({scenario, compact = false}: {scenario: AgentUseCase; compact?: boolean}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const detail = solutionPages[scenario.id], poster = useBaseUrl(assetFor('comp_001').posterUrl!)
  return <div className={'solution-preview preview-' + scenario.id + (compact ? ' case-experience case-compact' : '')} data-case={scenario.id}>
    <div className="solution-preview-top"><span>VANE CONTEXT</span><SampleLabel /></div>
    <div className="solution-preview-art" aria-hidden="true">
      {scenario.id === 'meeting-intelligence' && <div className="preview-meeting"><div className="preview-record"><span>{t('MEETING · JUNE 3', '会议 · 6 月 3 日')}</span><strong>20</strong><i>{t('Conditional plan', '附条件的原计划')}</i></div><ArrowRightIcon /><div className="preview-record"><span>{t('EMAIL · JUNE 12', '邮件 · 6 月 12 日')}</span><strong>24</strong><i>{t('Proposed change', '提出的调整建议')}</i></div></div>}
      {scenario.id === 'customer-support' && <div className="preview-support"><div><span>{t('ORDER', '订单地址')}</span><b>8B</b></div><span className="preview-discrepancy">≠</span><div><span>{t('DELIVERY RECORD', '配送记录')}</span><b>8D</b></div></div>}
      {scenario.id === 'equipment-diagnosis' && <div className="preview-equipment"><PumpDrawing active /><div className="preview-sensor"><span>10:42:10</span><strong>4.8 <small>mm/s RMS</small></strong><svg viewBox="0 0 180 44"><path d="M0 38L25 37L50 35L80 30L100 18L130 13L155 6L180 4" stroke="currentColor" strokeWidth="2" fill="none" /></svg></div></div>}
      {scenario.id === 'personal-work' && <div className="preview-draft"><span>{t('TO NORTHSTAR', '致 NORTHSTAR')}</span><p>{t('Phase one is complete.', '一期功能已完成。')}<sup>1</sup></p><p>{t('Testing starts after API approval.', '接口方案确认后开始测试。')}<sup>2</sup></p><div><span>{t('Current fact', '当前事实')}</span><span>{t('Open condition', '待确认条件')}</span></div></div>}
      {scenario.id === 'marketing-campaigns' && <div className="preview-marketing"><img src={poster} alt="" width="720" height="1280" loading="lazy" /><div><span>COMP_001 / 00:05–00:07</span><strong>{t('A use moment worth borrowing.', '可借鉴的使用时刻。')}</strong><p>{t('Outdoor setting. Visible action. A reference your agent can follow.', '户外场景，可见动作，Agent 可以续读的原始依据。')}</p></div></div>}
      {scenario.id === 'commerce-sales' && <div className="preview-commerce"><div><BackpackDrawing variant="A" /><span>A-20 · 690 g</span></div><div><BackpackDrawing variant="B" /><span>B-24 · 980 g</span></div></div>}
    </div>
    <div className="solution-preview-body"><span className="solution-label">{t('Useful context, ready for your agent', 'Agent 可以直接使用的背景')}</span><h3>{detail.previewTitle[locale]}</h3><ul>{detail.previewFacts.map(fact => <li key={fact.en}><CheckIcon aria-hidden="true" /><span>{fact[locale]}</span></li>)}</ul><div className="solution-preview-source">{detail.previewSource[locale]}</div></div>
  </div>
}
