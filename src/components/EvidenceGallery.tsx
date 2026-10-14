import type {CSSProperties, MouseEvent} from 'react'
import {ArrowRightIcon, PlayIcon, SpeakerLoudIcon} from '@radix-ui/react-icons'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {assetFor, imageRegions} from '../content/showcases'
import type {MediaKind} from '../content/types'

/** Selected source excerpts. Links open the corresponding interactive evidence. */
export default function EvidenceGallery({onInspect}: {onInspect?: (kind: MediaKind, insight: string) => void}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const image = useBaseUrl(assetFor('comp_005').url)
  const clip = useBaseUrl('/showcase/marketing/comp_001-blending.a20b043d09b6.webp')
  const textRegion = imageRegions.find(region => region.id === 'text')!
  const inspect = (event: MouseEvent, kind: MediaKind, insight: string) => {
    if (onInspect && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {event.preventDefault(); onInspect(kind, insight)}
  }
  return <div className="evidence-gallery">
    <Link className="gallery-piece gallery-image" to="/?media=image&insight=caption" onClick={event => inspect(event, 'image', 'caption')}>
      <div className="gallery-image-scene"><div className="gallery-image-source focus-frame"><img src={image} alt={t('The original kitchen image, with the caption located.', '原始厨房图片，定位画面中的文字。')} width={576} height={1024} loading="lazy" /><span className="gallery-region" aria-hidden="true" style={{left: textRegion.x * 100 + '%', top: textRegion.y * 100 + '%', width: textRegion.width * 100 + '%', height: textRegion.height * 100 + '%'}} /></div><div className="gallery-image-excerpt"><span className="evidence-link">{t('Words in the image', '画面中的文字')}</span><p lang="nl">Aardbeien +<br />Chocolade smoothie</p><span>{t('Strawberry + chocolate smoothie', '草莓＋巧克力奶昔')}</span></div></div>
      <div className="gallery-caption"><div><h3>{t('Meaning in every detail.', '看懂画面里的细节。')}</h3><p>{t('Objects, scenes and words, grounded in the original image.', '物体、场景与文字，直接定位到原图。')}</p></div><ArrowRightIcon aria-hidden="true" /></div>
    </Link>
    <Link className="gallery-piece gallery-video" to="/?media=video&insight=blending" onClick={event => inspect(event, 'video', 'blending')}>
      <div className="gallery-video-source"><img src={clip} alt={t('The blender running on the camping table.', '露营桌面上正在运行的搅拌机。')} width={480} height={854} loading="lazy" /><PlayIcon aria-hidden="true" /></div><div><span className="evidence-link">00:05–00:07</span><h3>{t('The moment that matters.', '直接找到关键片段。')}</h3><p>{t('Go straight to the blending action.', '从理解结果，一步回到搅拌动作。')}</p><span className="gallery-link">{t('Watch the evidence', '观看依据')}<ArrowRightIcon aria-hidden="true" /></span></div>
    </Link>
    <Link className="gallery-piece gallery-audio" to="/?media=audio&insight=portable" onClick={event => inspect(event, 'audio', 'portable')}>
      <div className="gallery-audio-heading"><SpeakerLoudIcon aria-hidden="true" /><span className="evidence-link">00:03–00:07</span></div><p className="gallery-quote" lang="en">“I can take it anywhere and blend smoothies anytime.”</p><div className="gallery-waveform" aria-hidden="true">{assetFor('comp_008').waveform?.filter((_, i) => i % 2 === 0).map((amplitude, i) => <span key={i} style={{'--height': `${amplitude * 100}%`} as CSSProperties} />)}</div><span className="gallery-link">{t('Hear the original words', '听原话，核对理解')}<ArrowRightIcon aria-hidden="true" /></span>
    </Link>
  </div>
}
