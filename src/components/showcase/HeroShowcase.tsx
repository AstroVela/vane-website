import {useCallback, useEffect, useId, useMemo, useReducer, useRef, useState} from 'react'
import {useHistory} from '@docusaurus/router'
import {ArrowRightIcon, PlayIcon, PauseIcon, VideoIcon, ImageIcon, SpeakerLoudIcon, Crosshair2Icon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../../siteI18n'
import {track} from '../../analytics'
import Button from '../Button'
import {Link} from '../../router'
import {assetFor, insightFor, showcaseFor, showcases} from '../../content/showcases'
import type {MediaKind} from '../../content/types'
import {useMediaPlayback} from './MediaPlaybackProvider'
import MediaPreview from './MediaPreview'
import {locatorLabel} from './locator'
import {canRotate, heroReducer, initialHeroState, mediaKinds} from './state'

export type HeroShowcaseHandle = {select: (kind: MediaKind, insight?: string) => void}
type Props = {withCopy?: boolean; initialMedia?: MediaKind; autoRotate?: boolean; readQuery?: boolean; onController?: (controller: HeroShowcaseHandle | null) => void}
const icons = {video: VideoIcon, image: ImageIcon, audio: SpeakerLoudIcon}
export default function HeroShowcase({withCopy = true, initialMedia = 'video', autoRotate = withCopy, readQuery = withCopy, onController}: Props) {
  const locale = useSiteLocale(), history = useHistory(), playback = useMediaPlayback(), id = useId()
  const [state, dispatch] = useReducer(heroReducer, undefined, () => initialHeroState(initialMedia, autoRotate))
  const [positions] = useState(() => new Map<string, number>())
  const [hoveredInsight, setHoveredInsight] = useState<string>()
  const [announce, setAnnounce] = useState('')
  const [rotationReady, setRotationReady] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const showcase = showcaseFor(state.activeMedia), asset = assetFor(showcase.assetId)
  const selected = state.selectedInsight[state.activeMedia]
  const request = useMemo(() => state.requestedInsight ? {epoch: state.selectionEpoch, locator: insightFor(state.requestedInsight).locators[0]} : undefined, [state.requestedInsight, state.selectionEpoch])
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  const onAudible = useCallback((audible: boolean) => dispatch({type: 'environment', values: {audible}}), [])
  const onModal = useCallback((modalOpen: boolean) => dispatch({type: 'environment', values: {modalOpen}}), [])
  const onInteract = useCallback(() => dispatch({type: 'mode', mode: 'manual'}), [])
  const onProgress = (position: number) => {positions.set(asset.id, position)}

  const select = useCallback((kind: MediaKind, insight?: string) => {
    playback.pauseAll(); setHoveredInsight(undefined)
    dispatch({type: 'select', media: kind, insight})
    if (readQuery) {
      const url = new URL(window.location.href)
      url.searchParams.set('media', kind)
      history.replace({pathname: url.pathname, search: url.search, hash: url.hash, state: history.location.state})
    }
    setAnnounce(showcaseFor(kind).label[locale])
    track(insight ? 'hero_reference_open' : 'hero_media_select', {locale, media: kind, source: 'manual', insight: insight ?? ''})
  }, [history, locale, playback, readQuery])
  useEffect(() => {onController?.({select}); return () => onController?.(null)}, [onController, select])
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const query = new URLSearchParams(window.location.search)
      const media = query.get('media')
      if (readQuery && mediaKinds.includes(media as MediaKind)) dispatch({type: 'select', media: media as MediaKind})
      if (!autoRotate || window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) dispatch({type: 'mode', mode: 'manual'})
      setRotationReady(true)
    })
    const observer = new IntersectionObserver(entries => dispatch({type: 'environment', values: {visible: entries[0].isIntersecting && entries[0].intersectionRatio >= .5}}), {threshold: [.0, .5]})
    if (stageRef.current) observer.observe(stageRef.current)
    const update = () => dispatch({type: 'environment', values: {documentVisible: !document.hidden}})
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => {if (motion.matches) {playback.pauseAll(); dispatch({type: 'mode', mode: 'manual'})}}
    document.addEventListener('visibilitychange', update); motion.addEventListener('change', onMotion)
    return () => {cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener('visibilitychange', update); motion.removeEventListener('change', onMotion); playback.pauseAll()}
  }, [autoRotate, playback, readQuery])
  useEffect(() => {
    if (!rotationReady || !canRotate(state)) return
    const timer = setTimeout(() => {
      playback.pauseAll(); setHoveredInsight(undefined)
      dispatch({type: 'rotate'})
      track('hero_media_select', {locale, media: mediaKinds[(mediaKinds.indexOf(state.activeMedia) + 1) % mediaKinds.length], source: 'auto'})
    }, 8000)
    return () => clearTimeout(timer)
  }, [locale, playback, rotationReady, state])

  const types = <div className="hero-type-controls"><div className="media-type-switch" role="tablist" aria-label={t('Media type', '资料类型')} ref={tabsRef}>{showcases.map((s, i) => {
    const Icon = icons[s.kind]
    return <button key={s.kind} type="button" role="tab" id={id + '-' + s.kind} aria-selected={state.activeMedia === s.kind} aria-controls={id + '-panel'} tabIndex={state.activeMedia === s.kind ? 0 : -1} onClick={() => select(s.kind)} onKeyDown={e => {
      const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1
      if (next >= 0) {e.preventDefault(); select(mediaKinds[next]); tabsRef.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()}
    }}><Icon aria-hidden="true" />{s.label[locale]}</button>
  })}</div>{withCopy && <button type="button" className="rotation-control" onClick={() => dispatch({type: 'mode', mode: state.rotationMode === 'auto' ? 'manual' : 'auto'})} aria-label={state.rotationMode === 'auto' ? t('Pause switching', '暂停切换') : t('Enable automatic switching', '自动切换')}>{state.rotationMode === 'auto' ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}</button>}</div>
  return <div className={'hero-experience' + (withCopy ? ' with-hero-copy' : ' inline-showcase')} data-media={state.activeMedia} data-rotation={state.rotationMode}
    onMouseEnter={() => dispatch({type: 'environment', values: {hovered: true}})} onMouseLeave={() => dispatch({type: 'environment', values: {hovered: false}})}
    onFocusCapture={e => dispatch({type: 'environment', values: {focusWithin: (e.target as HTMLElement).matches(':focus-visible')}})} onBlurCapture={e => {if (!e.currentTarget.contains(e.relatedTarget as Node | null)) dispatch({type: 'environment', values: {focusWithin: false}})}}>
    {withCopy ? <div className="hero-copy"><h1 className="h1">{locale === 'en' ? <>Turn your <span key={showcase.kind}>{showcase.headlineWord[locale]}</span>,<br />into context for AI.</> : <>把你的「<span key={showcase.kind}>{showcase.headlineWord[locale]}</span>」，<br />变成 AI 可用的上下文。</>}</h1>
      <p className="lead hero-subtitle" key={showcase.kind}>{showcase.subtitle[locale]}</p>{types}
      <div className="marketing-actions"><Button solid to={'/demo?source=home&media=' + state.activeMedia} arrow onClick={() => track('context_demo_click', {product: 'context', locale, media: state.activeMedia})}>{t('Request Demo', '预约演示')}</Button><Link to="/products/context">{t('Explore Vane Context', '了解 Vane Context')}<ArrowRightIcon aria-hidden="true" /></Link></div>
    </div> : types}
    <div className={'showcase-stage stage-' + showcase.kind} ref={stageRef} id={id + '-panel'} role="tabpanel" aria-labelledby={id + '-' + showcase.kind} tabIndex={0}>
      <div className="stage-heading"><span>{asset.title[locale]}</span><span>{t('Understanding & evidence', '理解与依据')}</span></div>
      <div className={'stage-content content-' + showcase.kind} key={showcase.kind}>
        <MediaPreview asset={asset} epoch={state.selectionEpoch} request={request} selected={selected} preview={hoveredInsight} initialPosition={positions.get(asset.id) ?? 0} loadEnabled={rotationReady} autoPreview={withCopy && state.rotationMode === 'auto'} visible={state.visible} onProgress={onProgress} onInteract={onInteract} onAudible={onAudible} onModal={onModal} />
        <div className="insight-list"><p className="showcase-summary">{showcase.summary[locale]}</p>{showcase.insightIds.map(insightId => {
          const insight = insightFor(insightId)
          return <button type="button" key={insight.id} className={'insight-item' + (selected === insight.id ? ' selected' : '')} aria-pressed={selected === insight.id} onClick={() => select(showcase.kind, insight.id)}
            onMouseEnter={() => {if (showcase.kind === 'image') setHoveredInsight(insight.id)}} onMouseLeave={() => setHoveredInsight(undefined)} onFocus={() => {if (showcase.kind === 'image') setHoveredInsight(insight.id)}} onBlur={() => setHoveredInsight(undefined)}>
            <span className="insight-title">{insight.title[locale]}</span><span className="insight-explanation">{insight.explanation[locale]}</span>
            {insight.sourceExcerpt && <span className="source-quote" lang={insight.sourceExcerpt.language}>“{insight.sourceExcerpt.text}”</span>}
            {locale === 'zh-CN' && insight.translation && <span className="source-translation">{insight.translation[locale]}</span>}
            <span className="evidence-link"><Crosshair2Icon aria-hidden="true" />{locatorLabel(insight.locators[0], locale)}<ArrowRightIcon aria-hidden="true" /></span>
          </button>
        })}</div>
      </div><p className="showcase-footnote">{t('Interactive example · curated understanding', '交互示例 · 预设理解结果')}</p>
    </div><span className="sr-only" aria-live="polite">{announce}</span>
  </div>
}
