import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ChevronLeftIcon, ChevronRightIcon, ZoomInIcon} from '@radix-ui/react-icons'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {useSiteLocale} from '../../siteI18n'
import {assetFor, insightFor, showcaseFor} from '../../content/showcases'
import {evidenceFor, pdfBrief, type UnderstandingMedia} from '../../content/understanding'
import MediaPreview, {ImageModal} from './MediaPreview'
import envelope from '../../../public/showcase/context/audio-envelope.json'

const noop=()=>{}
function PdfSource({selected}: {selected?: string}) {
  const locale=useSiteLocale(), t=(en:string,zh:string)=>locale==='en'?en:zh
  const item=selected?evidenceFor(selected):undefined
  const [page,setPage]=useState(item?.page??1), [zoom,setZoom]=useState(false), [failed,setFailed]=useState(false)
  const src=useBaseUrl(pdfBrief.pages[page-1])
  const regions=item?.page===page && item.region?[{...item.region,id:item.id,assetId:'brief'}]:[]
  return <div className="pdf-source" data-page={page}>
    <div className="pdf-page"><button type="button" aria-label={t('Enlarge page','放大页面')} onClick={()=>setZoom(true)}>
      <img src={src} width={600} height={800} alt={t(`Illustrative campaign brief, page ${page}`,`示例策划文档，第 ${page} 页`)} onLoad={()=>setFailed(false)} onError={()=>setFailed(true)} />
      <span className="image-regions" aria-hidden="true">{regions.map(r=><span className="image-region" key={r.id} style={{left:r.x*100+'%',top:r.y*100+'%',width:r.width*100+'%',height:r.height*100+'%'}} />)}</span>
    </button></div>
    {failed&&<p role="status">{t('Page preview could not load. Try another page.','页面预览暂时无法加载，可尝试切换页面。')}</p>}
    <div className="pdf-controls"><button type="button" disabled={page===1} aria-label={t('Previous page','上一页')} onClick={()=>setPage(v=>v-1)}><ChevronLeftIcon /></button><span>{t('Page','第')} {page} / {pdfBrief.pages.length} {t('','页')}</span><button type="button" disabled={page===pdfBrief.pages.length} aria-label={t('Next page','下一页')} onClick={()=>setPage(v=>v+1)}><ChevronRightIcon /></button><button type="button" onClick={()=>setZoom(true)} aria-label={t('Enlarge page','放大页面')}><ZoomInIcon /></button></div>
    <p className="source-disclosure">{t('Authored example. Planning figures, not campaign results.','自制示例文档。图表为规划数据，不是活动实测。')}</p>
    {zoom&&<ImageModal src={src} alt={t(`Brief, page ${page}`,`简报，第 ${page} 页`)} regions={regions} onClose={()=>setZoom(false)} />}
  </div>
}
export default function UnderstandingSource({media,selected,preview,epoch=0,onProgress=noop}: {media:UnderstandingMedia;selected?:string;preview?:string;epoch?:number;onProgress?:(position:number)=>void}) {
  const ref=useRef<HTMLDivElement>(null), [visible,setVisible]=useState(false)
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.05});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect()},[])
  const stableProgress=useCallback((p:number)=>onProgress(p),[onProgress])
  // A request changes only on an explicit evidence click, not while playback progresses.
  const request=useMemo(()=>selected&&epoch>0&&media!=='pdf'?{epoch,locator:insightFor(selected).locators[0]}:undefined,[selected,media,epoch])
  const asset=useMemo(()=>{if(media==='pdf')return undefined;const source=assetFor(showcaseFor(media).assetId);return media==='audio'?{...source,waveform:envelope}:source},[media])
  return <div className={'understanding-source source-'+media} ref={ref}>
    {media==='pdf'?<PdfSource key={(selected??'pdf')+epoch} selected={selected}/>:<MediaPreview key={media} asset={asset!} epoch={epoch} request={request} selected={selected} preview={preview} initialPosition={0} loadEnabled={visible} autoPreview={false} visible={visible} onProgress={stableProgress} onInteract={noop} onAudible={noop} onModal={noop}/>}
  </div>
}
