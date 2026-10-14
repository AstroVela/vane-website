import {useCallback, useEffect, useId, useRef, useState, type CSSProperties} from 'react'
import {PlayIcon, PauseIcon, SpeakerLoudIcon, SpeakerOffIcon, ZoomInIcon, Cross2Icon, ReloadIcon} from '@radix-ui/react-icons'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {useSiteLocale} from '../../siteI18n'
import type {ImageRegion, Locator, ShowcaseAsset} from '../../content/types'
import {imageRegions, showcaseInsights} from '../../content/showcases'
import {formatTime} from './locator'
import {useMediaPlayback} from './MediaPlaybackProvider'

type Request = {epoch: number; locator: Locator}
type Props = {
  asset: ShowcaseAsset; selected?: string; preview?: string; request?: Request; epoch: number
  initialPosition: number; loadEnabled: boolean; autoPreview: boolean; visible: boolean
  onProgress: (position: number) => void; onInteract: () => void
  onAudible: (audible: boolean) => void; onModal: (open: boolean) => void
}

function RegionOverlay({regions}: {regions: ImageRegion[]}) {
  return <span className="image-regions" aria-hidden="true">{regions.map(r => <span key={r.id} className="image-region" style={{left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.width * 100}%`, height: `${r.height * 100}%`}} />)}</span>
}
export function ImageModal({src, alt, regions, onClose}: {src: string; alt: string; regions: ImageRegion[]; onClose: () => void}) {
  const ref = useRef<HTMLDialogElement>(null)
  const locale = useSiteLocale()
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    const dialog = ref.current
    dialog?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {dialog?.close(); document.body.style.overflow = overflow; trigger?.focus({preventScroll: true})}
  }, [])
  return <dialog ref={ref} className="media-modal" aria-label={alt} onCancel={e => {e.preventDefault(); onClose()}} onClick={e => {if (e.target === e.currentTarget) onClose()}}>
    <button type="button" className="media-modal-close" onClick={onClose} autoFocus><Cross2Icon aria-hidden="true" />{locale === 'en' ? 'Close' : '关闭'}</button>
    <div className="modal-image"><img src={src} alt={alt} /><RegionOverlay regions={regions} /></div>
  </dialog>
}

export default function MediaPreview({asset, selected, preview, request, epoch, initialPosition, loadEnabled, autoPreview, visible, onProgress, onInteract, onAudible, onModal}: Props) {
  const locale = useSiteLocale(), playback = useMediaPlayback(), id = useId()
  const mediaRef = useRef<HTMLMediaElement | null>(null)
  const pending = useRef<Request | undefined>(undefined)
  const currentEpoch = useRef(epoch)
  const clipEnd = useRef<number | undefined>(undefined)
  const resumePosition = useRef(initialPosition)
  const progressRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [position, setPosition] = useState(initialPosition)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(asset.kind === 'image')
  const [enlarged, setEnlarged] = useState(false)
  const [clipCompleted, setClipCompleted] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [retry, setRetry] = useState(0)
  const src = useBaseUrl(asset.url), poster = useBaseUrl(asset.posterUrl ?? '')
  const baseUrl = useBaseUrl('/')
  const setMedia = useCallback((media: HTMLMediaElement | null) => {mediaRef.current = media}, [])
  const loadSource = useCallback(() => {
    const media = mediaRef.current
    if (!media || media.hasAttribute('src')) return
    const displayWidth = Math.min(media.clientWidth, media.clientHeight * (asset.width ?? 1) / (asset.height ?? 1))
    const targetWidth = displayWidth * window.devicePixelRatio
    const variant = asset.previews?.find(p => p.width >= targetWidth) ?? asset.previews?.at(-1)
    media.src = variant ? baseUrl + variant.url.replace(/^\//, '') : src
    media.load()
  }, [asset, baseUrl, src])
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  const duration = asset.duration ?? 0
  const selectedInsight = showcaseInsights.find(i => i.id === (preview ?? selected))
  const regionIds = selectedInsight?.locators.flatMap(l => l.kind === 'image' ? l.regionIds : []) ?? []
  const regions = imageRegions.filter(r => r.assetId === asset.id && regionIds.includes(r.id))

  useEffect(() => {currentEpoch.current = epoch; pending.current = request}, [epoch, request])
  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    const unregister = playback.register(id, media)
    return () => {unregister(); media.removeAttribute('src'); media.load()}
  }, [id, playback])
  useEffect(() => {
    if (!loadEnabled || !visible || asset.kind === 'image') return
    // Let the selected type and first screen paint before starting media requests.
    let frame = 0, idle = 0, timer = 0
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(loadSource, {timeout: 1200})
        else timer = window.setTimeout(loadSource, 100)
      })
    })
    return () => {cancelAnimationFrame(frame); if (idle) window.cancelIdleCallback(idle); clearTimeout(timer)}
  }, [asset.kind, loadEnabled, loadSource, visible])
  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    const update = () => {
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const saveData = (navigator as Navigator & {connection?: {saveData: boolean}}).connection?.saveData
      if (!visible || document.hidden) {playback.pause(id); onAudible(false)}
      else if (autoPreview && asset.kind === 'video' && !motion && !saveData && media.readyState >= 1) {
        media.muted = true
        void playback.play(id, 'auto')
      }
    }
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [asset.kind, autoPreview, id, onAudible, playback, ready, visible])

  useEffect(() => {
    const media = mediaRef.current
    if (!request || request.locator.kind !== 'time' || !media) return
    loadSource()
    if (media.readyState < 1) return
    const requestedEpoch = request.epoch
    media.currentTime = request.locator.start
    resumePosition.current = request.locator.start
    clipEnd.current = request.locator.end
    pending.current = undefined
    let retired = false
    void playback.play(id, 'manual').then(success => {
      if (retired || currentEpoch.current !== requestedEpoch) return
      if (!success) setPlaying(false)
    })
    return () => {retired = true}
  }, [id, loadSource, playback, ready, request])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const media = mediaRef.current
      if (imageRef.current?.complete && !imageRef.current.naturalWidth || media?.error) setFailed(true)
      if (media && media.readyState >= 1) {if (Math.abs(media.currentTime - resumePosition.current) > .025) media.currentTime = resumePosition.current; setPosition(media.currentTime); setReady(true)}
    })
    return () => cancelAnimationFrame(frame)
  }, [retry])

  const onMetadata = () => {
    const media = mediaRef.current
    if (!media) return
    const target = pending.current?.locator
    const nextPosition = target?.kind === 'time' ? target.start : Math.min(resumePosition.current, Math.max(0, media.duration - .05))
    if (Math.abs(media.currentTime - nextPosition) > .025) media.currentTime = nextPosition
    setPosition(media.currentTime)
    setReady(true)
  }
  const updateTime = () => {
    const media = mediaRef.current
    if (!media) return
    const current = media.currentTime
    resumePosition.current = current
    setPosition(current); onProgress(current)
    progressRef.current?.style.setProperty('--progress', `${current / duration * 100}%`)
    if (clipEnd.current !== undefined && current >= clipEnd.current - .025) {playback.pause(id, true); clipEnd.current = undefined; setClipCompleted(true)}
  }
  const play = () => {
    const media = mediaRef.current
    if (!media) return
    onInteract()
    if (!media.paused) {playback.pause(id, true); return}
    loadSource()
    if (media.ended) media.currentTime = 0
    void playback.play(id, 'manual')
  }
  const seek = (value: number) => {
    onInteract(); clipEnd.current = undefined; setClipCompleted(false)
    const media = mediaRef.current
    if (!media) return
    loadSource()
    if (!Number.isFinite(media.duration)) {resumePosition.current = value; setPosition(value); onProgress(value); return}
    media.currentTime = Math.min(value, media.duration); resumePosition.current = media.currentTime; setPosition(media.currentTime); onProgress(media.currentTime)
  }
  const toggleSound = () => {
    onInteract()
    const media = mediaRef.current
    if (!media) return
    media.muted = !media.muted; setMuted(media.muted); onAudible(!media.muted && !media.paused)
  }
  const openImage = () => {onInteract(); playback.pauseAll(); setEnlarged(true); onModal(true)}
  const currentCaption = showcaseInsights.find(i => i.locators.some(l => l.kind === 'time' && l.assetId === asset.id && position >= l.start && position < l.end))
  const audioInsight = currentCaption?.sourceExcerpt ? currentCaption : selectedInsight?.sourceExcerpt ? selectedInsight : showcaseInsights.find(i => i.locators.some(l => l.assetId === asset.id) && i.sourceExcerpt)
  const loadingMedia = !failed && ((!ready && (loadEnabled || Boolean(request) || playing)) || buffering && playing)
  const shared = {preload: 'metadata' as const, ref: setMedia, onLoadedMetadata: onMetadata,
    onPlay: () => {setPlaying(true); setClipCompleted(false); onAudible(asset.kind === 'audio' || !mediaRef.current?.muted)},
    onPause: () => {setPlaying(false); onAudible(false); playback.stopped(id)}, onTimeUpdate: updateTime,
    onWaiting: () => setBuffering(true), onCanPlay: () => setBuffering(false),
    onError: () => setFailed(true), onEnded: () => {setPlaying(false); onAudible(false)}}
  return <div className={'media-preview media-' + asset.kind} data-modality={asset.kind}>
    {asset.kind === 'video' && <div className="portrait-media focus-frame"><video {...shared} poster={poster} muted playsInline aria-label={asset.alt[locale]} /></div>}
    {asset.kind === 'image' && <><div className="portrait-media focus-frame"><button className={'image-stage-button' + (regions.length ? ' has-region' : '')} type="button" onClick={openImage} aria-label={t('Enlarge image', '放大图片')}>
      <img ref={imageRef} key={retry} src={src} width={asset.width} height={asset.height} alt={asset.alt[locale]} onError={() => setFailed(true)} fetchPriority="high" />
      <RegionOverlay regions={regions} />
    </button></div><button type="button" className="image-enlarge" onClick={openImage}><ZoomInIcon aria-hidden="true" />{t('Enlarge image', '放大图片')}</button></>}
    {asset.kind === 'audio' && <div className="audio-stage focus-frame">
      <div className="audio-transcript"><p className="audio-original" lang={audioInsight?.sourceExcerpt?.language}>“{audioInsight?.sourceExcerpt?.text}”</p>{locale === 'zh-CN' && <p className="audio-translation">{audioInsight?.translation?.[locale]}</p>}</div>
      <div className="waveform" ref={progressRef} style={{'--progress': `${position / duration * 100}%`} as CSSProperties}>
        {(asset.waveform ?? []).map((amplitude, i) => <span aria-hidden="true" key={i} style={{'--height': `${amplitude * 100}%`, color: i / (asset.waveform?.length ?? 1) <= position / duration ? 'var(--accent)' : 'var(--line-2)'} as CSSProperties} />)}
        <input className="waveform-seek" type="range" min={0} max={duration} step={.05} value={Math.min(position, duration)} onChange={e => seek(Number(e.target.value))} aria-label={t('Waveform playback position', '波形播放进度')} />
      </div>
      <p className="audio-prompt">{clipCompleted ? <button className="continue-media" type="button" onClick={play}>{t('Continue listening', '继续聆听')}<span aria-hidden="true"> →</span></button> : t('Listen to the exact words behind each insight.', '听听每项理解对应的原话。')}</p><audio {...shared} aria-label={asset.alt[locale]} />
    </div>}
    {asset.kind !== 'image' && <div className="media-controls">
      <button type="button" onClick={play} aria-label={playing ? t('Pause', '暂停') : t('Play', '播放')}>{playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}</button>
      <span className="media-time">{formatTime(position)}</span>
      <input type="range" min={0} max={duration} step={.05} value={Math.min(position, duration)} onChange={e => seek(Number(e.target.value))} aria-label={t('Playback position', '播放进度')} />
      <span className="media-time">{formatTime(duration)}</span>
      {asset.kind === 'video' && <button type="button" onClick={toggleSound} aria-label={muted ? t('Enable sound', '开启声音') : t('Mute', '静音')}>{muted ? <SpeakerOffIcon aria-hidden="true" /> : <SpeakerLoudIcon aria-hidden="true" />}</button>}
    </div>}
    {asset.kind === 'video' && <p className="current-caption">{clipCompleted ? <button type="button" className="continue-media" onClick={play}>{t('Continue watching', '继续观看')}<span aria-hidden="true"> →</span></button> : loadingMedia ? t('Loading media…', '正在加载素材…') : currentCaption?.title[locale] ?? t('Watch the original footage.', '观看原始视频。')}</p>}
    {failed && <div className="media-error" role="status"><p>{t('Unable to load this media. The understanding is still available.', '素材暂时无法加载，仍可阅读理解结果。')}</p><button type="button" onClick={() => {setFailed(false); setRetry(v => v + 1); mediaRef.current?.load()}}><ReloadIcon aria-hidden="true" />{t('Retry', '重试')}</button></div>}
    {enlarged && <ImageModal src={src} alt={asset.alt[locale]} regions={regions} onClose={() => {setEnlarged(false); onModal(false)}} />}
  </div>
}
