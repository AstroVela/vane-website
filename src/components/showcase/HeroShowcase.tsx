import {useEffect, useReducer, useRef} from 'react'
import {useHistory} from '@docusaurus/router'
import {useSiteLocale} from '../../siteI18n'
import {Link} from '../../router'
import {track} from '../../analytics'
import {showcaseAssets, showcaseReferences, showcaseScenarios} from '../../content/showcases'
import {MediaPlaybackProvider, useMediaPlayback} from './MediaPlaybackProvider'
import MediaPreview, {ImageModal} from './MediaPreview'
import RelatedResult from './RelatedResult'
import {locatorLabel} from './locator'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {initialShowcaseState,showcaseReducer} from './state'

function Showcase({initialScenario = 'usage-demo', initialResult, readQuery = true}: {initialScenario?: string; initialResult?:string; readQuery?: boolean}) {
  const locale = useSiteLocale()
  const history = useHistory()
  const [state, dispatch] = useReducer(showcaseReducer, initialScenario, id=>({...initialShowcaseState(id),selections:initialResult?{[id]:initialResult}:{}}))
  const stageRef=useRef<HTMLDivElement>(null)
  const playback = useMediaPlayback()
  const scenario = showcaseScenarios.find(s => s.id === state.scenarioId) ?? showcaseScenarios[0]
  const result = scenario.results.find(r => r.id === state.selections[scenario.id]) ?? scenario.results.find(r => r.id === scenario.defaultResultId) ?? scenario.results[0]
  const reference = showcaseReferences.find(r => r.id === state.referenceId)
  const asset = showcaseAssets.find(a => a.id === (reference?.assetId ?? result.assetId))!
  const locator = reference?.locator ?? result.locator
  const referenceImage = showcaseAssets.find(a => a.id === scenario.referenceImageAssetId)
  const referenceImageUrl = useBaseUrl(referenceImage?.previewUrl ?? '')
  const originalUrl=useBaseUrl(asset.originalUrl ?? asset.previewUrl)
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  useEffect(() => {
    if (!readQuery) return
    const query = new URLSearchParams(window.location.search)
    const found = showcaseScenarios.find(s => s.id === query.get('scenario'))
    if (!found) return
    const foundResult = found.results.find(r => r.id === query.get('result'))
    const frame = requestAnimationFrame(() => dispatch({type: 'initialize', scenario: found.id, result: foundResult?.id}))
    return () => cancelAnimationFrame(frame)
  }, [readQuery])
  useEffect(() => () => playback.pauseAll(), [playback])
  const updateUrl = (scenarioId: string, resultId?: string) => {
    if (!readQuery) return
    const url = new URL(window.location.href)
    url.searchParams.set('scenario', scenarioId)
    if (resultId) url.searchParams.set('result', resultId); else url.searchParams.delete('result')
    history.replace({pathname:url.pathname,search:url.search,hash:url.hash,state:history.location.state})
  }
  const selectScenario = (id: string) => {playback.pauseAll(); dispatch({type: 'scenario', id}); updateUrl(id, state.selections[id]); track('hero_scenario_select', {locale, scenario: id})}
  const selectResult = (id: string) => {playback.pauseAll(); dispatch({type: 'result', id}); updateUrl(scenario.id, id); track('hero_result_select', {locale, scenario: scenario.id, result: id})}
  const openReference = (id: string) => {playback.pauseAll(); dispatch({type: 'reference', id}); requestAnimationFrame(()=>{stageRef.current?.focus({preventScroll:true});stageRef.current?.scrollIntoView({block:'nearest',behavior:'auto'})}); track('hero_reference_open', {locale, scenario: scenario.id, result: result.id})}
  return <div className="showcase" data-scenario={scenario.id} data-result={result.id}>
    <div className="showcase-tabs" role="group" aria-label={t('Choose an example task', '选择示例任务')}>{showcaseScenarios.map((s, i) => <button type="button" key={s.id} aria-pressed={s.id === scenario.id} onClick={() => selectScenario(s.id)}><span className="task-number">0{i + 1}</span>{s.label[locale]}<span className="task-arrow">↗</span></button>)}</div>
    <div className="showcase-question"><span className="question-mark">⌕</span>{referenceImage && <button type="button" className="reference-image" onClick={() => dispatch({type: 'image', open: true})} aria-label={t('Enlarge query image', '放大参考图')}><img src={referenceImageUrl} alt={referenceImage.alt[locale]}/></button>}<span>{scenario.question[locale]}</span><span className="example-label">{t('Example collection', '示例资料库')} · Luma Go</span></div>
    <div className="showcase-grid">
      <div className="result-stage" ref={stageRef} tabIndex={-1} aria-label={t('Selected content','当前内容')}>
        <div className="result-stage-header"><span><i className="result-dot"/>{reference ? t('SOURCE EVIDENCE', '原始依据') : t('MATCHED CONTENT', '匹配内容')}</span><span>{asset.modality.toUpperCase()} · {locatorLabel(locator, locale)}</span></div>
        <MediaPreview key={asset.id + JSON.stringify(locator)} asset={asset} locator={locator} autoPreview={!reference && asset.modality === 'video'}/>
        <div className="source-strip"><span>{asset.title[locale]}</span>{reference ? <button type="button" onClick={() => {playback.pauseAll(); dispatch({type: 'reference'})}}>← {t('Back to result', '返回结果')}</button> : <button type="button" onClick={() => openReference(result.referenceIds[0])}>{t('View source', '查看依据')} ↗</button>}</div>
        {reference && <div className="reference-excerpt">{reference.excerpt && <p>“{reference.excerpt[locale]}”</p>}<a href={originalUrl + (locator.kind==='pdf_page'?'#page='+locator.page:'')} target="_blank" rel="noreferrer">{t('Open source file','打开原始文件')} ↗</a></div>}
      </div>
      <aside className="related-results" aria-label={t('Related results', '相关结果')}><div className="related-heading">{t('More relevant content', '更多相关内容')}<span>02</span></div>{scenario.results.filter(r => r.id !== result.id).map(r => <RelatedResult key={r.id} result={r} asset={showcaseAssets.find(a => a.id === r.assetId)!} onSelect={() => selectResult(r.id)}/>)}</aside>
    </div>
    <div className="result-summary"><div aria-live="polite"><strong>{result.title[locale]}</strong><p>{result.summary[locale]}</p></div><button type="button" className="analysis-toggle" aria-expanded={state.analysisOpen} aria-controls="showcase-analysis" onClick={() => {dispatch({type: 'analysis'}); if (!state.analysisOpen) track('hero_analysis_open', {locale, scenario: scenario.id, result: result.id})}}>{state.analysisOpen ? t('Hide analysis', '收起分析') : t('View analysis', '查看内容分析')}<span>{state.analysisOpen ? '−' : '+'}</span></button></div>
    {state.analysisOpen && <div className="analysis-panel" id="showcase-analysis"><div className="analysis-heading"><span>{t('CONTENT ANALYSIS', '内容分析')}</span><span>{t('With references to the source', '每条要点均可回到依据')}</span></div><ol>{result.analysis.map((point, i) => <li key={i}><span className="analysis-index">0{i + 1}</span><div><p>{point.text[locale]}</p><div className="analysis-citations">{point.referenceIds.map(id => {const ref = showcaseReferences.find(r => r.id === id)!; return <button type="button" key={id} className={state.referenceId === id ? 'active' : ''} onClick={() => openReference(id)}>↗ {ref.label[locale]}</button>})}</div></div></li>)}</ol><Link to={'/demo?source=home&scenario=' + scenario.id} onClick={() => track('context_demo_click', {product: 'context', locale, scenario: scenario.id})}>{t('See this working with your use case', '针对你的场景预约演示')} →</Link></div>}
    <div className="showcase-footnote"><span>{t('Illustrative example · authored media and results', '示例案例 · 预设素材与结果')}</span><span>VIDEO / IMAGE / AUDIO / PDF</span></div>
    {state.referenceImageOpen && referenceImage && <ImageModal src={referenceImageUrl} alt={referenceImage.alt[locale]} onClose={() => dispatch({type: 'image', open: false})}/>}
  </div>
}
export default function HeroShowcase(props: {initialScenario?: string; initialResult?:string; readQuery?: boolean}) {return <MediaPlaybackProvider><Showcase {...props}/></MediaPlaybackProvider>}
