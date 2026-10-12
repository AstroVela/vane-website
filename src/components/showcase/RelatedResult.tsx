import {useEffect, useId, useRef} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import type {ShowcaseAsset, ShowcaseResult} from '../../content/types'
import {useSiteLocale} from '../../siteI18n'
import {useMediaPlayback} from './MediaPlaybackProvider'
import {locatorLabel, sourceTime,posterFor} from './locator'
export default function RelatedResult({asset, result, onSelect}: {asset: ShowcaseAsset; result: ShowcaseResult; onSelect: () => void}) {
  const locale = useSiteLocale()
  const poster = useBaseUrl(posterFor(asset,result.locator))
  const videoUrl = useBaseUrl(asset.previewUrl)
  const ref = useRef<HTMLVideoElement>(null)
  const playback = useMediaPlayback()
  const id = useId()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {if (ref.current) return playback.register(id, ref.current)}, [id, playback])
  useEffect(() => {
    const stopHidden=()=>{if(document.hidden){clearTimeout(timer.current);playback.pause(id)}}
    const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){clearTimeout(timer.current);playback.pause(id)}})
    const element=ref.current
    if(element)observer.observe(element)
    document.addEventListener('visibilitychange',stopHidden)
    return ()=>{clearTimeout(timer.current);observer.disconnect();document.removeEventListener('visibilitychange',stopHidden)}
  }, [id,playback])
  const start = () => {
    if (asset.modality !== 'video' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator as Navigator & {connection?: {saveData: boolean}}).connection?.saveData) return
    timer.current = setTimeout(() => {const media = ref.current; if (!media) return; if (result.locator.kind === 'time_range') media.currentTime = sourceTime(asset, result.locator.startMs); void playback.play(id, 'hover')}, 200)
  }
  const stop = () => {clearTimeout(timer.current); playback.pause(id)}
  return <button type="button" className="related-result" onClick={onSelect} onMouseEnter={start} onMouseLeave={stop}>
    <span className="related-thumbnail">{asset.modality === 'video' ? <video ref={ref} src={videoUrl} poster={poster} muted playsInline preload="none" aria-hidden="true" onPause={() => playback.stopped(id)} onTimeUpdate={() => {if (ref.current && result.locator.kind === 'time_range' && ref.current.currentTime >= sourceTime(asset, result.locator.endMs)) ref.current.currentTime = sourceTime(asset, result.locator.startMs)}}/> : <img src={poster} alt="" loading="lazy" />}
      <span className="media-type">{asset.modality.toUpperCase()}</span><span className="media-location">{locatorLabel(result.locator, locale)}</span>
    </span><span className="related-copy"><strong>{result.title[locale]}</strong><span className="related-match">{result.summary[locale]}</span></span>
  </button>
}
