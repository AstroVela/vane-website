import {useEffect, useId, useRef, useState} from 'react'
import {PlayIcon, ReloadIcon} from '@radix-ui/react-icons'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {useSiteLocale} from '../siteI18n'
import {useMediaPlayback} from './showcase/MediaPlaybackProvider'

const videos = {
  en: {src: '/videos/context/vane-context-overview-en.cf26c9e53bcd.mp4', poster: '/videos/context/vane-context-overview-en.efbf74080c33.webp'},
  'zh-CN': {src: '/videos/context/vane-context-overview-zh-CN.83352cea1c97.mp4', poster: '/videos/context/vane-context-overview-zh-CN.5d4c2d37f17b.webp'},
}

export default function ProductOverviewVideo() {
  const locale = useSiteLocale()
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  const source = useBaseUrl(videos[locale].src)
  const poster = useBaseUrl(videos[locale].poster)
  const playback = useMediaPlayback()
  const id = useId()
  const mediaRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    const unregister = playback.register(id, media)
    return () => {unregister(); media.removeAttribute('src'); media.load()}
  }, [id, playback])

  const start = () => {
    const media = mediaRef.current
    if (!media) return
    // Keep the full video off the network until the visitor asks to watch it.
    if (!media.hasAttribute('src') || failed) {
      media.src = source
      media.load()
    }
    setStarted(true)
    setFailed(false)
    media.focus({preventScroll: true})
    void playback.play(id, 'manual')
  }

  return <section className="section marketing-section product-video-section" id="overview" aria-labelledby="product-video-heading">
    <div className="wrap">
      <div className="section-heading">
        <h2 className="h2" id="product-video-heading">{t('See Vane Context in action.', '看看 Vane Context 如何工作')}</h2>
        <p id="product-video-description">{t('Follow a marketing task from enterprise data to cited context, then see how it supports other agents.', '从一个营销任务出发，了解企业资料如何变成有依据的上下文，并支持更多业务场景。')}</p>
      </div>
      <div className="product-video-frame">
        <video ref={mediaRef} poster={poster} width={1920} height={1080} preload="none" playsInline
          controls={started && !failed} tabIndex={started ? 0 : -1}
          aria-label={t('Vane Context product overview, English, 2 minutes 36 seconds', 'Vane Context 产品介绍，中文，2 分 36 秒')}
          aria-describedby="product-video-description"
          onPlay={() => {if (!playback.isManual(id)) void playback.play(id, 'manual')}}
          onPause={() => playback.stopped(id)} onEnded={() => playback.stopped(id)} onError={() => setFailed(true)}/>
        {(!started || failed) && <button type="button" className="product-video-start" onClick={start}>
          <span className="product-video-play">
            {failed ? <ReloadIcon aria-hidden="true"/> : <PlayIcon aria-hidden="true"/>}
            {failed ? t('Retry playback', '重新播放') : t('Watch the overview', '观看产品介绍')}
            {!failed && <span className="product-video-duration">2:36</span>}
          </span>
        </button>}
      </div>
      {failed && <p className="product-video-error" role="alert">{t('The video could not load. Please try again.', '视频暂时无法加载，请重试。')}</p>}
    </div>
  </section>
}
