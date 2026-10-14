import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react'
import {ArrowRightIcon, FileTextIcon, ReaderIcon, SpeakerLoudIcon, VideoIcon, ImageIcon, Crosshair2Icon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../../siteI18n'
import type {AgentUseCase} from '../../content/useCases'
import {meetingExamples, supportExamples, personalExamples, equipmentExamples, commerceExamples, type ExampleSource, type ExampleObservation} from '../../content/useCaseExamples'
import {assetFor, insightFor} from '../../content/showcases'
import MediaPreview from '../showcase/MediaPreview'
import {locatorLabel} from '../showcase/locator'

function EvidenceReader({sources}: {sources: ExampleSource[]}) {
  const locale = useSiteLocale(), [selected, setSelected] = useState(0)
  const source = sources[selected]
  return <div className="case-evidence">
    <div className="case-evidence-links" role="group" aria-label={locale === 'en' ? 'Source evidence' : '来源依据'}>{sources.map((item, i) => <button type="button" key={i} aria-pressed={selected === i} onClick={() => setSelected(i)}><FileTextIcon aria-hidden="true" />{item.name[locale]}</button>)}</div>
    <div className="case-source-excerpt" aria-live="polite"><span>{source.locator[locale]}</span><blockquote>{source.excerpt[locale]}</blockquote></div>
  </div>
}

function ObservationExample({kind, items}: {kind: 'meeting' | 'support' | 'personal'; items: ExampleObservation[]}) {
  const locale = useSiteLocale(), [selected, setSelected] = useState(kind === 'support' ? 1 : 0), id = useId()
  const item = items[selected]
  const labels = {meeting: ['Select a remark', '选择一句发言'], support: ['Inspect the case timeline', '查看案件时间线'], personal: ['Explore the personal archive', '查看个人积累']}
  return <div className={'case-observations observations-' + kind}>
    <div className="case-observation-list" role="group" aria-label={labels[kind][locale === 'en' ? 0 : 1]}>{items.map((option, i) => <button type="button" key={i} className="case-observation" aria-pressed={selected === i} aria-controls={id} onClick={() => setSelected(i)}><span className="case-marker">{option.marker}</span><span>{option.label[locale]}</span><ArrowRightIcon aria-hidden="true" /></button>)}</div>
    <div className="case-finding" id={id}><span className="value-label">{locale === 'en' ? 'Context for the agent' : 'Agent 获得的上下文'}</span><p className="case-finding-text" aria-live="polite">{item.finding[locale]}</p><EvidenceReader key={selected} sources={item.sources} /></div>
  </div>
}

function EquipmentExample() {
  const locale = useSiteLocale(), [selected, setSelected] = useState(1), id = useId()
  const sample = equipmentExamples[selected], t = (en: string, zh: string) => locale === 'en' ? en : zh
  const points = equipmentExamples.map((p, i) => `${24 + i * 136},${100 - p.vibration * 10}`).join(' ')
  return <div className="case-equipment">
    <div className="case-signal-heading"><strong>{t('Vibration', '振动')} <small>mm/s</small></strong><span>{sample.time}</span></div>
    <svg className="case-signal-chart" viewBox="0 0 320 130" role="img" aria-label={t('Illustrative vibration readings: 1.4, 4.1 and 6.8 millimeters per second.', '演示振动读数：每秒 1.4、4.1 和 6.8 毫米。')}>
      {[2,4,6].map(v => <g key={v}><line x1="24" x2="302" y1={100-v*10} y2={100-v*10} className="signal-guide" /><text x="4" y={104-v*10}>{v}</text></g>)}
      <polyline points={points} fill="none" className="signal-line" />
      <line x1={24+selected*136} x2={24+selected*136} y1="18" y2="106" className="signal-cursor" />
      {equipmentExamples.map((p, i) => <g key={p.time}><circle cx={24+i*136} cy={100-p.vibration*10} r={selected===i?5:3} /><text x={24+i*136} y="125" textAnchor="middle">{p.time.slice(3)}</text></g>)}
    </svg>
    <label className="case-time-slider" htmlFor={id}><span>{t('Move through the incident', '拖动查看异常前后')}</span><input id={id} type="range" min="0" max="2" step="1" value={selected} aria-valuetext={sample.time} onChange={e => setSelected(Number(e.target.value))} /></label>
    <div className="case-signal-readings" aria-live="polite"><div><VideoIcon aria-hidden="true" /><span>{t('Video observation', '视频观察')}</span><p>{sample.visual[locale]}</p></div><div><SpeakerLoudIcon aria-hidden="true" /><span>{t('Sound observation', '声音观察')}</span><p>{sample.sound[locale]}</p></div><div><ReaderIcon aria-hidden="true" /><span>{t('Sensor readings', '传感器读数')}</span><p><span className="case-reading-value">{sample.vibration} mm/s</span><span className="case-reading-value">{sample.current} A</span></p></div></div>
    <div className="case-finding"><p className="case-finding-text" aria-live="polite">{sample.finding[locale]}</p><details className="case-source-detail" key={selected}><summary>{t('Inspect the aligned records', '查看对齐的记录')}<Crosshair2Icon aria-hidden="true" /></summary><p>{sample.source[locale]}</p></details></div>
  </div>
}

function CommerceExample() {
  const locale = useSiteLocale(), [selected, setSelected] = useState(0), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const item = commerceExamples[selected]
  return <div className="case-commerce">
    <div className="case-choice-row" role="group" aria-label={t('Compare a requirement', '选择比较需求')}>{commerceExamples.map((entry, i) => <button type="button" key={entry.id} aria-pressed={selected===i} onClick={() => setSelected(i)}>{entry.label[locale]}</button>)}</div>
    <div className="case-comparison" aria-live="polite">{[t('Travel model', '轻装款'), t('Larger model', '大容量款')].map((name,i) => <div key={name}><span className="value-label">{t('Example product', '示例商品')}</span><h3>{name}</h3><p>{item.values[i][locale]}</p></div>)}</div>
    <div className="case-finding"><span className="value-label">{t('Context for the agent', 'Agent 获得的上下文')}</span><p className="case-finding-text" aria-live="polite">{item.conclusion[locale]}</p><details className="case-source-detail" key={selected}><summary>{t('Inspect the product evidence', '查看商品依据')}<Crosshair2Icon aria-hidden="true" /></summary><p>{item.source[locale]}</p></details></div>
  </div>
}

const marketingItems = [{asset: 'comp_001', insight: 'blending', icon: VideoIcon}, {asset: 'comp_005', insight: 'caption', icon: ImageIcon}, {asset: 'comp_008', insight: 'portable', icon: SpeakerLoudIcon}]
const noop = () => {}
function MarketingExample() {
  const locale = useSiteLocale(), [selection, setSelection] = useState({index: 0, epoch: 0, play: false}), [visible, setVisible] = useState(false)
  const container = useRef<HTMLDivElement>(null), item = marketingItems[selection.index], sourceAsset = assetFor(item.asset), insight = insightFor(item.insight)
  const asset = useMemo(() => sourceAsset.kind === 'video' ? {...sourceAsset, posterUrl: '/showcase/marketing/comp_001-blending.a20b043d09b6.webp'} : sourceAsset, [sourceAsset])
  const request = useMemo(() => selection.play ? {epoch: selection.epoch, locator: insight.locators[0]} : undefined, [selection.play, selection.epoch, insight])
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), {threshold: 0})
    if (container.current) observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  return <div className="case-marketing" ref={container}>
    <div className="case-choice-row" role="group" aria-label={t('Choose creative material', '选择创作资料')}>{marketingItems.map((entry,i) => {const Icon=entry.icon; return <button type="button" key={entry.asset} aria-pressed={selection.index===i} onClick={() => setSelection(s=>({index:i,epoch:s.epoch+1,play:false}))}><Icon aria-hidden="true" />{[t('A useful shot', '动作镜头'),t('Visual detail', '画面信息'),t('Original words', '旁白表达')][i]}</button>})}</div>
    <div className={'case-marketing-result result-' + asset.kind}>
      <MediaPreview key={asset.id} asset={asset} selected={insight.id} epoch={selection.epoch} request={request} initialPosition={insight.locators[0].kind === 'time' ? insight.locators[0].start : 0} loadEnabled={false} autoPreview={false} visible={visible} onProgress={noop} onInteract={noop} onAudible={noop} onModal={noop} />
      <div className="case-finding"><span className="value-label">{t('Material for the creative brief', '交给创作 Agent 的资料')}</span><h3>{insight.title[locale]}</h3><p>{insight.explanation[locale]}</p><span className="case-source-name">{asset.title[locale]}</span>
        {asset.kind !== 'image' ? <button className="case-reference-button" type="button" onClick={() => setSelection(s=>({...s,epoch:s.epoch+1,play:true}))}><Crosshair2Icon aria-hidden="true" />{locatorLabel(insight.locators[0],locale)}<ArrowRightIcon aria-hidden="true" /></button> : <p className="case-reference-hint">{t('Select the image to inspect the highlighted words.', '点击图片，放大核对标出的文字区域。')}</p>}
      </div>
    </div>
    <p className="case-example-note">{t('Sources are independent works. Narration is a quoted claim; product performance and campaign results need their own evidence.', '各媒体独立引用。旁白属于原话，产品性能与投放效果还需对应资料核实。')}</p>
  </div>
}

export default function CaseExperience({scenario, compact = false}: {scenario: AgentUseCase; compact?: boolean}) {
  const locale = useSiteLocale()
  let content: ReactNode
  switch (scenario.id) {
    case 'meeting-intelligence': content = <ObservationExample kind="meeting" items={meetingExamples} />; break
    case 'customer-support': content = <ObservationExample kind="support" items={supportExamples} />; break
    case 'equipment-diagnosis': content = <EquipmentExample />; break
    case 'personal-work': content = <ObservationExample kind="personal" items={personalExamples} />; break
    case 'commerce-sales': content = <CommerceExample />; break
    case 'marketing-campaigns': content = <MarketingExample />; break
  }
  return <div className={'case-experience' + (compact ? ' case-compact' : '')} data-case={scenario.id}>
    <div className="case-experience-heading"><span>{scenario.name[locale]}</span><span>{scenario.id === 'marketing-campaigns' ? (locale === 'en' ? 'Curated media example' : '预设理解示例') : (locale === 'en' ? 'Illustrative scenario' : '场景示例 · 演示数据')}</span></div>
    <p className="case-example-task">{scenario.task[locale]}</p>
    {content}
  </div>
}
