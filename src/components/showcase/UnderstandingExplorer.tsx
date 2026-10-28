import {useCallback,useEffect,useId,useRef,useState} from 'react'
import {useHistory} from '@docusaurus/router'
import {ArrowRightIcon,Crosshair2Icon,VideoIcon,ImageIcon,SpeakerLoudIcon,FileTextIcon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../../siteI18n'
import {activeInsightAt, insightFor} from '../../content/showcases'
import {evidence,evidenceFor,fields,mediaLabels,questions,summaries,understandingMedia,type UnderstandingMedia} from '../../content/understanding'
import {locatorLabel} from './locator'
import {useMediaPlayback} from './MediaPlaybackProvider'
import UnderstandingSource from './UnderstandingSource'

const icons={video:VideoIcon,image:ImageIcon,audio:SpeakerLoudIcon,pdf:FileTextIcon}
const modes=['overview','questions','fields'] as const
export default function UnderstandingExplorer() {
  const locale=useSiteLocale(),t=(en:string,zh:string)=>locale==='en'?en:zh,id=useId(),history=useHistory(),playback=useMediaPlayback()
  const [media,setMedia]=useState<UnderstandingMedia>('video'),[mode,setMode]=useState<typeof modes[number]>('overview'),[question,setQuestion]=useState(0)
  const [selected,setSelected]=useState<string>(),[hover,setHover]=useState<string>(),[epoch,setEpoch]=useState(0),[playing,setPlaying]=useState<string>()
  const typeRef=useRef<HTMLDivElement>(null),modeRef=useRef<HTMLDivElement>(null),sourceRef=useRef<HTMLDivElement>(null),resultRef=useRef<HTMLDivElement>(null)
  useEffect(()=>{const frame=requestAnimationFrame(()=>{const q=new URLSearchParams(window.location.search),kind=q.get('media') as UnderstandingMedia,insight=q.get('insight');if(understandingMedia.includes(kind)){setMedia(kind);if(evidence.some(e=>e.id===insight&&e.media===kind)){setSelected(insight!);setPlaying(insight!);setEpoch(1)}}});return()=>cancelAnimationFrame(frame)},[])
  const updateQuery=(kind:UnderstandingMedia,insight?:string)=>{const q=new URLSearchParams(history.location.search);q.set('media',kind);if(insight)q.set('insight',insight);else q.delete('insight');history.replace({...history.location,search:q.toString()})}
  const changeMedia=(kind:UnderstandingMedia)=>{playback.pauseAll();setMedia(kind);setSelected(undefined);setHover(undefined);setPlaying(undefined);setQuestion(0);setEpoch(v=>v+1);updateQuery(kind)}
  const select=(reference:string)=>{setSelected(reference);setPlaying(reference);setEpoch(v=>v+1);updateQuery(media,reference);if(window.innerWidth<768)requestAnimationFrame(()=>sourceRef.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}))}
  const onProgress=useCallback((position:number)=>{
    if(media==='pdf'||media==='image')return
    setPlaying(activeInsightAt(media==='video'?'comp_001':'comp_008',position,evidence.filter(e=>e.media===media).map(e=>e.id)))
  },[media])
  const active = media==='video'||media==='audio' ? playing : selected

  const label=(reference:string)=>{const e=evidenceFor(reference);return e.media==='pdf'?t(`Page ${e.page}`,`第 ${e.page} 页`):locatorLabel(insightFor(reference).locators[0],locale)}
  const cite=(reference:string)=> <button type="button" className="understanding-citation" onClick={()=>select(reference)} aria-label={evidenceFor(reference).title[locale]+', '+label(reference)}><Crosshair2Icon aria-hidden="true"/>{label(reference)}<ArrowRightIcon aria-hidden="true"/></button>
  const currentQuestion=questions[media][question]
  const list=evidence.filter(e=>e.media===media)
  return <div className="understanding-explorer" data-media={media} data-mode={mode}>
    <div className="understanding-types" role="tablist" aria-label={t('Media type','资料类型')} ref={typeRef}>{understandingMedia.map((kind,i)=>{const Icon=icons[kind];return <button type="button" role="tab" key={kind} id={id+'-'+kind} aria-controls={id+'-source'} aria-selected={media===kind} tabIndex={media===kind?0:-1} onClick={()=>changeMedia(kind)} onKeyDown={event=>{const n=event.key==='ArrowRight'?(i+1)%4:event.key==='ArrowLeft'?(i+3)%4:event.key==='Home'?0:event.key==='End'?3:-1;if(n>=0){event.preventDefault();changeMedia(understandingMedia[n]);typeRef.current?.querySelectorAll<HTMLButtonElement>('button')[n]?.focus()}}}><Icon aria-hidden="true"/>{mediaLabels[kind][locale]}</button>})}</div>
    <div className="brand-sheet"><div className="understanding-frame" role="tabpanel" id={id+'-source'} aria-labelledby={id+'-'+media}>
      <div className="understanding-original" ref={sourceRef}><div className="understanding-label"><span>{t('Original source','原始资料')}</span><span>{media==='pdf'?t('Example brief','示例简报'):media==='video'?'comp_001':media==='image'?'comp_005':'comp_008'}</span></div>
        <UnderstandingSource key={media} media={media} selected={selected} preview={hover} epoch={epoch} onProgress={onProgress}/>
        {selected&&<button type="button" className="source-return" onClick={()=>resultRef.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>{t('Back to results','返回分析结果')}<ArrowRightIcon aria-hidden="true"/></button>}
      </div>
      <div className="understanding-results" ref={resultRef}>
        <div className="understanding-modes" role="tablist" aria-label={t('Explore understanding','探索理解结果')} ref={modeRef}>{modes.map((m,i)=><button type="button" role="tab" key={m} id={id+'-'+m} aria-controls={id+'-result'} aria-selected={mode===m} tabIndex={mode===m?0:-1} onClick={()=>{setMode(m);setHover(undefined)}} onKeyDown={event=>{const n=event.key==='ArrowRight'?(i+1)%3:event.key==='ArrowLeft'?(i+2)%3:event.key==='Home'?0:event.key==='End'?2:-1;if(n>=0){event.preventDefault();setMode(modes[n]);modeRef.current?.querySelectorAll<HTMLButtonElement>('button')[n]?.focus()}}}>{[t('Analyze','内容分析'),t('Ask questions','内容问答'),t('Extract data','信息提取')][i]}</button>)}</div>
        <div className="understanding-result-body" role="tabpanel" id={id+'-result'} aria-labelledby={id+'-'+mode} tabIndex={0} key={media+mode}>
          {mode==='overview'&&<><p className="understanding-summary">{summaries[media][locale]}</p><div className={'understanding-findings findings-'+media}>{list.map(e=><button type="button" className={'understanding-finding'+(active===e.id?' selected':'')+(playing===e.id?' playing':'')} key={e.id} aria-pressed={active===e.id} onClick={()=>select(e.id)} onMouseEnter={()=>setHover(e.id)} onMouseLeave={()=>setHover(undefined)} onFocus={()=>setHover(e.id)} onBlur={()=>setHover(undefined)}><span className="finding-meta"><span>{e.channel[locale]}</span><span>{label(e.id)} <ArrowRightIcon aria-hidden="true"/></span></span><strong>{e.title[locale]}</strong><span className="finding-detail">{e.detail[locale]}</span>{e.quote&&<span className="finding-quote">“{e.quote}”</span>}</button>)}</div></>}
          {mode==='questions'&&<><div className="understanding-questions" role="group" aria-label={t('Example questions','示例问题')}>{questions[media].map((q,i)=><button type="button" key={i} aria-pressed={question===i} onClick={()=>setQuestion(i)}>{q.question[locale]}</button>)}</div><div className="understanding-answer" key={question}><span className="answer-label">{t('Answer with citations','带来源的回答')}</span><p>{currentQuestion.answer[locale]}</p><div className="answer-sources">{currentQuestion.evidence.map(reference=><div key={reference}><span>{evidenceFor(reference).title[locale]}</span>{cite(reference)}</div>)}</div></div></>}
          {mode==='fields'&&<><p className="understanding-summary">{t('Extract structured fields with a citation for each value.','按字段提取信息，并保留对应来源。')}</p><dl className="understanding-fields">{fields[media].map(f=><div key={f.key}><dt>{f.label[locale]}</dt><dd>{f.value[locale]}{cite(f.evidence)}</dd></div>)}</dl><details className="understanding-json"><summary>{t('View structured result','查看结构化结果')}</summary><pre><code>{JSON.stringify({example:true,fields:fields[media].map(f=>({name:f.key,value:f.value[locale],source:f.evidence,locator:evidenceFor(f.evidence).media==='pdf'?{page:evidenceFor(f.evidence).page}:insightFor(f.evidence).locators[0]}))},null,2)}</code></pre></details></>}
        </div><p className="understanding-hint"><Crosshair2Icon aria-hidden="true"/>{t('Select a result to view its source.','点击结果，查看对应来源。')}</p>
      </div>
    </div></div><p className="understanding-disclosure">{t('Interactive examples use prepared results to demonstrate analysis across different media types.','交互演示使用预设结果，分别展示不同类型素材的分析能力。')}</p>
  </div>
}
