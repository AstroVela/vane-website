import {useRef,useState} from 'react'
import {ArrowRightIcon,Crosshair2Icon,CheckIcon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../siteI18n'
import {l,type Localized} from '../content/types'
import {evidenceFor} from '../content/understanding'
import {insightFor} from '../content/showcases'
import {locatorLabel} from './showcase/locator'
import {useMediaPlayback} from './showcase/MediaPlaybackProvider'
import UnderstandingSource from './showcase/UnderstandingSource'

type Finding={reference:string;status:'known'|'new';why:Localized}
const tasks:{label:Localized;request:Localized;delivery:Localized;note:Localized;findings:Finding[]}[]=[
 {label:l('Find footage','寻找画面参考'),request:l('Prepare visual references for a campsite drink video. Focus on the setting and visible preparation steps.','为露营主题的饮品短视频准备画面参考，重点寻找使用环境和清晰的制作动作。'),delivery:l('A campsite setting and two useful action windows.','一个露营场景，两段可借鉴的操作片段。'),note:l('Footage supports scene and action references. It does not establish product performance or conversion.','画面可以提供场景与动作参考，不能据此判断产品性能或转化效果。'),findings:[
  {reference:'camping',status:'known',why:l('Establishes the outdoor setting requested by the brief.','对应任务要求的户外露营环境。')},
  {reference:'ingredients',status:'new',why:l('Provides a clear preparation sequence for a storyboard.','为分镜提供清晰的准备动作。')},
  {reference:'blending',status:'new',why:l('Locates the actual product action rather than a generic scene description.','定位产品实际操作，而不是只描述场景。')},
 ]},
 {label:l('Add message references','补充文案参考'),request:l('Keep the outdoor visual reference. Add original advertising lines about portability and everyday use.','保留户外画面参考，补充便携性和日常使用场景的广告原话。'),delivery:l('Reuse the setting. Add two cited narration excerpts.','沿用场景理解，补充两段带引用的旁白。'),note:l('These are independent creative references. Ad statements are not verified product claims.','这些是独立的创作参考。广告原话不代表经过验证的产品结论。'),findings:[
  {reference:'camping',status:'known',why:l('The existing scene understanding remains relevant.','已有场景理解仍与当前任务相关。')},
  {reference:'portable',status:'new',why:l('Supplies the exact language used to express portability.','提供表达便携性的原始说法。')},
  {reference:'morning',status:'new',why:l('Connects the ad message to an everyday routine.','将广告表达与日常使用习惯关联。')},
 ]},
 {label:l('Assemble a reference list','整理参考清单'),request:l('Assemble a concise list of the useful footage and ad lines found so far. Keep sources and the limits of each finding.','整理已有的画面和广告表达，形成精简参考清单，保留每项材料的来源与使用边界。'),delivery:l('A focused handoff using the knowledge already prepared.','利用已有知识，整理当前任务需要的交付。'),note:l('This example reuses the earlier findings. Brand-specific facts and measured campaign results would need additional sources.','本示例复用前面得到的理解。特定品牌事实与活动效果实测仍需要其他资料。'),findings:[
  {reference:'ingredients',status:'known',why:l('A preparation shot already identified in the first request.','复用首次任务已经定位的准备镜头。')},
  {reference:'blending',status:'known',why:l('Retains the product-action reference without reanalyzing it.','保留产品操作参考，无需重复理解同一内容。')},
  {reference:'portable',status:'known',why:l('Carries the original wording and source into the handoff.','将已获得的原话与来源一起交付。')},
 ]},
]
export default function TaskContextExperience(){
 const locale=useSiteLocale(),t=(en:string,zh:string)=>locale==='en'?en:zh,playback=useMediaPlayback()
 const [task,setTask]=useState(0),[selected,setSelected]=useState('camping'),[epoch,setEpoch]=useState(0),[emphasis,setEmphasis]=useState<'all'|'known'|'new'>('all')
 const sourceRef=useRef<HTMLDivElement>(null),deliveryRef=useRef<HTMLDivElement>(null)
 const current=tasks[task],source=evidenceFor(selected),known=current.findings.filter(f=>f.status==='known').length,newCount=current.findings.length-known
 const selectTask=(i:number)=>{playback.pauseAll();setTask(i);setSelected(tasks[i].findings[0].reference);setEpoch(0);setEmphasis('all')}
 const cite=(ref:string)=>{setSelected(ref);setEpoch(n=>n+1);if(innerWidth<768)requestAnimationFrame(()=>sourceRef.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}))}
 return <div className="task-context-experience">
  <div className="task-choices" role="group" aria-label={t('Agent task','Agent 任务')}>{tasks.map((s,i)=><button type="button" key={i} aria-pressed={task===i} onClick={()=>selectTask(i)}>{s.label[locale]}<ArrowRightIcon aria-hidden="true"/></button>)}</div>
  <div className="task-brief"><span>{t('The agent’s request','Agent 的资料需求')}</span><p>{current.request[locale]}</p></div>
  <div className="task-workspace">
   <div className="task-delivery" ref={deliveryRef}><span className="answer-label">{t('Context to use','提供给 Agent 的上下文')}</span><h3>{current.delivery[locale]}</h3>
    <div className="task-findings">{current.findings.map(f=>{const e=evidenceFor(f.reference);return <article key={f.reference} className={(selected===f.reference?'selected ':'')+(emphasis!=='all'&&emphasis!==f.status?'deemphasized':'')} data-origin={f.status}><div className="task-finding-heading"><strong>{e.title[locale]}</strong><span className={'knowledge-origin '+f.status}>{f.status==='known'?t('Existing knowledge','已有知识'):t('Added for this task','本次补充')}</span></div><p>{e.detail[locale]}</p><div className="task-finding-bottom"><details><summary>{t('Why it matters','与任务的关系')}</summary><p>{f.why[locale]}</p></details><button type="button" className="understanding-citation" onClick={()=>cite(f.reference)} aria-label={t('Inspect: ','核验：')+e.title[locale]}><Crosshair2Icon aria-hidden="true"/>{locatorLabel(insightFor(f.reference).locators[0],locale)}<ArrowRightIcon aria-hidden="true"/></button></div></article>})}</div>
    <p className="task-boundary">{current.note[locale]}</p>
   </div>
   <div className="task-source" ref={sourceRef}><div className="understanding-label"><span>{t('Original evidence','原始依据')}</span><span>{source.channel[locale]}</span></div><UnderstandingSource key={task+'-'+source.media} media={source.media} selected={selected} epoch={epoch}/>{epoch>0&&<button type="button" className="source-return" onClick={()=>deliveryRef.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>{t('Back to context','返回上下文')}<ArrowRightIcon aria-hidden="true"/></button>}</div>
  </div>
  <div className="task-reuse-strip"><div role="group" aria-label={t('Highlight knowledge origin','突出知识来源')}><button type="button" aria-pressed={emphasis==='known'} onClick={()=>setEmphasis(emphasis==='known'?'all':'known')}><CheckIcon aria-hidden="true"/>{t('Existing knowledge','已有知识')} <strong>{known}</strong></button><button type="button" aria-pressed={emphasis==='new'} onClick={()=>setEmphasis(emphasis==='new'?'all':'new')}>{t('Added for this task','本次补充')} <strong>{newCount}</strong></button></div><p>{newCount?t('Go deeper only where the request needs more detail.','只为当前需求补充必要的理解。'):t('Use prior findings to prepare a focused handoff.','使用已有理解，整理精简交付。')}</p></div>
  <details className="understanding-json task-json"><summary>{t('View the complete handoff','查看完整交付')}</summary><pre><code>{JSON.stringify({example:true,request:current.request[locale],findings:current.findings.map(f=>({finding:evidenceFor(f.reference).detail[locale],knowledge:f.status,source:insightFor(f.reference).locators[0]})),limits:current.note[locale]},null,2)}</code></pre></details>
  <p className="understanding-disclosure">{t('Illustrative requests and curated results. Knowledge origin shows the example sequence, not a live processing log.','预设任务与理解结果。知识来源表示示例中的使用顺序，不是实时处理日志。')}</p>
 </div>
}
