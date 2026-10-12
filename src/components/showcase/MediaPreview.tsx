import {useEffect, useId, useRef, useState, type CSSProperties} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {useSiteLocale} from '../../siteI18n'
import type {Locator, ShowcaseAsset} from '../../content/types'
import {formatTime, sourceTime, posterFor} from './locator'
import {useMediaPlayback} from './MediaPlaybackProvider'

export function ImageModal({src, alt, onClose}: {src: string; alt: string; onClose: () => void}) {
  const ref = useRef<HTMLDialogElement>(null)
  const locale = useSiteLocale()
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    ref.current?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {document.body.style.overflow = overflow; trigger?.focus()}
  }, [])
  return <dialog className="media-modal" ref={ref} aria-label={alt} onCancel={e => {e.preventDefault(); onClose()}} onClick={e => {if (e.target === e.currentTarget) onClose()}}>
    <button className="media-modal-close" type="button" onClick={onClose} autoFocus>{locale === 'en' ? 'Close' : '关闭'} ×</button>
    <img src={src} alt={alt} />
  </dialog>
}
export default function MediaPreview({asset, locator, autoPreview = false}: {asset: ShowcaseAsset; locator: Locator; autoPreview?: boolean}) {
  const locale = useSiteLocale()
  const playback = useMediaPlayback()
  const id = useId()
  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [enlarged, setEnlarged] = useState(false)
  const [position, setPosition] = useState(0)
  const [retry, setRetry] = useState(0)
  const mediaUrl = useBaseUrl(asset.previewUrl)
  const poster = useBaseUrl(posterFor(asset,locator))
  const pageUrl = useBaseUrl(locator.kind === 'pdf_page' ? asset.pageImages?.[locator.page] ?? asset.posterUrl : asset.posterUrl)
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  const start = locator.kind === 'time_range' ? sourceTime(asset, locator.startMs) : 0
  const end = locator.kind === 'time_range' ? sourceTime(asset, locator.endMs) : (asset.durationMs ?? 0) / 1000
  const duration = Math.max(0, end - start)
  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    return playback.register(id, media)
  }, [id, playback])
  useEffect(() => {
    const media = mediaRef.current
    if (!media || asset.modality !== 'video' || !autoPreview) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dataSaver = (navigator as Navigator & {connection?: {saveData: boolean}}).connection?.saveData
    let visible = false
    const update = () => {
      if (visible && !document.hidden && !motion.matches && !dataSaver) {if (!playback.isManual(id)) {media.muted = true; void playback.play(id, 'auto')}}
      else playback.pause(id)
    }
    const observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting; update()}, {threshold: .3})
    observer.observe(media)
    document.addEventListener('visibilitychange', update)
    motion.addEventListener('change', update)
    return () => {observer.disconnect(); document.removeEventListener('visibilitychange', update); motion.removeEventListener('change', update); playback.pause(id)}
  }, [asset.modality, autoPreview, id, playback])
  useEffect(() => {
    // A static HTML resource can fail before React hydrates and attaches onError.
    const frame=requestAnimationFrame(()=>{
      const image=imageRef.current
      if(mediaRef.current?.error || image?.complete && !image.naturalWidth) setFailed(true)
    })
    return ()=>cancelAnimationFrame(frame)
  }, [retry])
  const initialize = () => {
    const media = mediaRef.current
    if (!media) return
    if (start >= 0 && start < media.duration && end <= media.duration + .15) {media.currentTime = start; setPosition(0)}
    else setFailed(true)
  }
  const toggle = () => {
    const media = mediaRef.current
    if (!media) return
    if (!media.paused) {playback.pause(id, true); return}
    if (media.currentTime < start || media.currentTime >= end - .05) media.currentTime = start
    media.muted = asset.modality === 'video'
    void playback.play(id, 'manual')
  }
  const timeUpdate = () => {
    const media = mediaRef.current
    if (!media) return
    setPosition(Math.max(0, media.currentTime - start))
    if (media.currentTime >= end - .025) {
      if (asset.modality === 'video' && !playback.isManual(id)) media.currentTime = start
      else {playback.pause(id, true); media.currentTime = start}
    }
  }
  const sharedMedia = {ref: mediaRef, src: mediaUrl, preload: 'metadata' as const, onLoadedMetadata: initialize,
    onPlay: () => setPlaying(true), onPause: () => {setPlaying(false); playback.stopped(id)}, onTimeUpdate: timeUpdate, onError: () => setFailed(true)}
  return <div className={'media-preview media-' + asset.modality} data-modality={asset.modality}>
    {asset.modality === 'video' && <video {...sharedMedia} poster={poster} playsInline muted aria-label={asset.alt[locale]} />}
    {asset.modality === 'audio' && <div className="audio-stage"><span className="audio-stage-eyebrow">{t('AUDIO EXCERPT', '音频片段')}</span>
      <div className="waveform" aria-hidden="true">{(asset.waveform ?? []).map((height, i) => <i key={i} style={{'--height': height + '%', opacity: duration > 0 && i / (asset.waveform?.length ?? 1) < position / duration ? 1 : .35} as CSSProperties} />)}</div>
      <h3>{asset.title[locale]}</h3><p>{asset.transcript?.[locale]}</p><audio {...sharedMedia} aria-label={asset.alt[locale]} />
    </div>}
    {(asset.modality === 'image' || asset.modality === 'pdf') && <button type="button" className="image-stage-button" onClick={() => {playback.pauseAll(); setEnlarged(true)}} aria-label={t('Enlarge image', '放大查看')}><img ref={imageRef} key={retry} src={asset.modality === 'pdf' ? pageUrl : mediaUrl} onError={()=>setFailed(true)} alt={asset.alt[locale]} fetchPriority="high"/><span className="enlarge-hint">↗ {t('Enlarge', '放大查看')}</span></button>}
    {failed && <div className="media-error" role="status"><span>{t('Media is temporarily unavailable. You can still read the analysis.', '媒体暂时无法播放，仍可阅读分析内容。')}</span><button type="button" onClick={() => {setFailed(false); setRetry(n=>n+1); mediaRef.current?.load()}}>{t('Retry', '重试')}</button></div>}
    {(asset.modality === 'video' || asset.modality === 'audio') && <div className="media-controls">
      <button type="button" onClick={toggle} aria-label={playing ? t('Pause', '暂停') : t('Play excerpt', '播放片段')}>{playing ? 'Ⅱ' : '▶'}</button>
      <span>{formatTime(position * 1000)}</span><input type="range" min={0} max={duration} step={.05} value={Math.min(position, duration)} aria-label={t('Excerpt progress', '片段进度')} onChange={e => {const value = Number(e.target.value); if (mediaRef.current) mediaRef.current.currentTime = start + value; setPosition(value)}}/><span>{formatTime(duration * 1000)}</span>
    </div>}
    {enlarged && <ImageModal src={asset.modality === 'pdf' ? pageUrl : mediaUrl} alt={asset.alt[locale]} onClose={() => setEnlarged(false)} />}
  </div>
}
