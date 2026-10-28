import {useEffect,useId,useRef,useState} from 'react'
import {Link2Icon,CheckIcon} from '@radix-ui/react-icons'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {useSiteLocale} from '../siteI18n'
import {useMediaPlayback} from './showcase/MediaPlaybackProvider'
import waveform from '../../public/showcase/context/audio-envelope.json'
import brief from '../../public/showcase/context/brief.json'
import {packetPose,carrierPose,PICKUP_AT,CROUCH_MS,FLIGHT_MS} from './contextConveyorMotion'
import './contextConveyor.css'

const kinds=['video','image','audio','pdf'] as const
type Kind=typeof kinds[number]
/** Original media cross the product gate, become cited findings and are delivered to agents. */
export default function ContextConveyor(){
 const locale=useSiteLocale(),base=useBaseUrl('/'),id=useId(),playback=useMediaPlayback()
 const t=(en:string,zh:string)=>locale==='en'?en:zh
 const asset=(s:string)=>base+'showcase/marketing/'+s
 const photo=asset('comp_005-image.b3187abe73e8.webp'),pour=asset('comp_001-pouring.43384a49eeac.webp'),blend=asset('comp_001-blending.a20b043d09b6.webp'),camp=asset('comp_001-poster.45b2669dc293.webp')
 const serving=base+'showcase/context/video-serving.webp'
 const pdf=base+brief.pages[1].slice(1),cover=base+'showcase/context/audio-source-cover.webp'
 const root=useRef<HTMLDivElement>(null),scene=useRef<HTMLDivElement>(null)
 const video=useRef<HTMLVideoElement>(null),resultVideo=useRef<HTMLCanvasElement>(null)
 const elapsed=useRef(900)
 const [visible,setVisible]=useState(false),[hidden,setHidden]=useState(false),[reduced,setReduced]=useState(false)
 const videoId=id+'video',active=visible&&!hidden&&!reduced
 useEffect(()=>{
  const query=matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setReduced(query.matches),visibility=()=>setHidden(document.hidden)
  const raf=requestAnimationFrame(()=>{change();visibility()})
  query.addEventListener('change',change);document.addEventListener('visibilitychange',visibility)
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.08})
  if(root.current)observer.observe(root.current)
  return()=>{cancelAnimationFrame(raf);query.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);observer.disconnect()}
 },[])
 useEffect(()=>{
  if(video.current)return playback.register(videoId,video.current)
 },[videoId,playback])
 useEffect(()=>{
  const stage=scene.current;if(!stage)return
  const inputs=Array.from(stage.querySelectorAll<HTMLElement>('[data-payload]'))
  const results=Array.from(stage.querySelectorAll<HTMLElement>('[data-result]'))
  const sourceShadows=Array.from(stage.querySelectorAll<HTMLElement>('[data-source-shadow]'))
  const resultShadows=Array.from(stage.querySelectorAll<HTMLElement>('[data-result-shadow]'))
  const carriers=Array.from(stage.querySelectorAll<HTMLElement>('[data-carrier]')).map(node=>({
   node,head:node.querySelector<SVGGElement>('[data-head]')!,
   body:node.querySelector<SVGPathElement>('[data-body]')!,arms:node.querySelector<SVGPathElement>('[data-hands]')!,
   legs:[node.querySelector<SVGPathElement>('[data-leg="left"]')!,node.querySelector<SVGPathElement>('[data-leg="right"]')!],
  }))
  const racks=Array.from(stage.querySelectorAll<HTMLElement>('[data-agent-box]'))
  const resize=()=>root.current?.style.setProperty('--scene-scale',String(stage.clientWidth/2900))
  resize();const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(stage)
  const element=video.current,canvas=resultVideo.current,context=canvas?.getContext('2d')
  const allowPlayback=active&&!(navigator as Navigator&{connection?:{saveData:boolean}}).connection?.saveData
  let videoVisible=false,lastAttempt=-Infinity,pending=false,disposed=false
  // Decorative videos have no user pause control. Browser/load/controller pauses must
  // not become permanent explicit pauses; retry while visible, respecting manual media.
  const resume=()=>{
   if(!allowPlayback||!videoVisible||disposed||pending||!element||!element.paused||element.readyState<2)return
   pending=true
   void playback.play(videoId,'auto').finally(()=>{pending=false})
  }
  function draw(time:number){
   let showVideo=false,receiving=-1
   const responses=racks.map(()=>0)
   inputs.forEach((node,i)=>{
    const pose=packetPose(time,i),{source,result}=pose
    const move=(el:HTMLElement,p:typeof source)=>{
     el.style.opacity=String(p.opacity)
     el.style.transform=`translate3d(${p.x}px,${p.y}px,0) scale(${p.scale})`
     el.style.clipPath=`inset(0px ${Math.min(p.width,p.clipRight)}px ${p.clipBottom}px ${Math.min(p.width,p.clipLeft)}px)`
     el.style.visibility=p.opacity>0?'visible':'hidden'
    }
    move(node,source);node.dataset.phase=pose.phase.toFixed(3)
    ;(['source','result'] as const).forEach((part,j)=>{
     const figure=carriers[i*2+j],p=carrierPose(pose,part)
     figure.node.style.transform=`translate3d(${p.x}px,${p.y}px,0) scale(${p.scale})`
     figure.node.style.opacity=String(p.opacity)
     figure.node.style.visibility=p.opacity>0?'visible':'hidden'
     figure.node.style.clipPath=`inset(0px ${Math.min(140,p.clipRight)}px 0px ${Math.min(140,p.clipLeft)}px)`
     figure.node.dataset.action=p.action
     figure.head.setAttribute('transform',`translate(${p.headX},${p.headY})`)
     figure.body.setAttribute('d',p.body);figure.arms.setAttribute('d',p.arms)
     figure.legs[0].setAttribute('d',p.leftLeg);figure.legs[1].setAttribute('d',p.rightLeg)
    })
    if(pose.receiving)receiving=pose.box
    const reaction=(pose.age-PICKUP_AT-CROUCH_MS-FLIGHT_MS)/700
    if(reaction>=0&&reaction<1)responses[pose.box]=Math.sin(Math.PI*reaction)
    const r=results[i];move(r,result);r.dataset.step=String(pose.step);r.dataset.carried=String(pose.carried);r.dataset.deposit=String(pose.deposit);r.dataset.agent=String(pose.box)
    r.style.setProperty('--playhead',String(pose.progress))
    ;[[sourceShadows[i],source],[resultShadows[i],result]].forEach(([shadow,p])=>{
     const el=shadow as HTMLElement,position=p as typeof source
     el.style.transform=`translate3d(${position.x}px,1369px,0) scale(${position.scale})`
     el.style.opacity=String(position.opacity*.13*(position.y>820?1:0))
    })
    if(i===0){
     showVideo=(source.opacity>.02&&source.clipRight<source.width)||(result.opacity>.02&&result.clipLeft<result.width)
     // Both visible video surfaces share the same decoded stream. The result stays
     // live during their overlap without starting a competing player or download.
     if(result.opacity>.02&&canvas&&context&&element&&element.readyState>=2&&element.videoWidth){
      const height=Math.min(element.videoHeight,element.videoWidth*canvas.height/canvas.width)
      context.drawImage(element,0,(element.videoHeight-height)/2,element.videoWidth,height,0,0,canvas.width,canvas.height)
     }
    }
   })
   racks.forEach((node,i)=>{
    node.dataset.receiving=String(receiving===i)
    node.style.setProperty('--agent-response',String(responses[i]))
   })
   stage!.dataset.agent=String(receiving)
   if(showVideo!==videoVisible){videoVisible=showVideo;lastAttempt=-Infinity;if(!showVideo)playback.pause(videoId)}
   if(time-lastAttempt>1000){lastAttempt=time;resume()}
   stage!.dataset.frame=String(Math.floor(time/100))
  }
  draw(elapsed.current)
  if(!active){playback.pause(videoId);return()=>sizeObserver.disconnect()}
  let frame=0,last=performance.now(),painted=0
  const timer=allowPlayback?setTimeout(()=>{
   if(element&&!element.hasAttribute('src')){
    element.src=base+'showcase/marketing/comp_001-preview-360.f4d47ff971a3.mp4';element.load()
   }
   resume()
  },250):undefined
  element?.addEventListener('canplay',resume)
  const tick=(now:number)=>{
   elapsed.current+=Math.min(now-last,80);last=now
   if(now-painted>30){draw(elapsed.current);painted=now}
   frame=requestAnimationFrame(tick)
  }
  frame=requestAnimationFrame(tick)
  return()=>{disposed=true;sizeObserver.disconnect();clearTimeout(timer);cancelAnimationFrame(frame);element?.removeEventListener('canplay',resume);playback.pause(videoId)}
 },[active,base,videoId,playback])
 function wave(){return <div className="assembly-wave" aria-hidden="true">{waveform.map((v,i)=><i key={i} style={{height:(v*100)+'%'}}/>)}<b className="assembly-playhead"/></div>}
 function source(kind:Kind,live=false){
  if(kind==='video')return live?<video ref={video} poster={camp} muted playsInline loop preload="none" aria-hidden="true"/>:<img src={camp} alt=""/>
  if(kind==='image')return <img src={photo} alt=""/>
  if(kind==='pdf')return <img src={pdf} alt="" className="assembly-page"/>
  return <div className="assembly-audio"><img src={cover} alt=""/>{wave()}</div>
 }
 function findings(kind:Kind){
  return <div className={'assembly-folio assembly-folio-'+kind}>
   <div className="assembly-source-stub">{source(kind)}<Link2Icon/></div>
   <div className="assembly-findings">
    {kind==='video'?<><canvas className="assembly-video-evidence" ref={resultVideo} width={360} height={240} style={{backgroundImage:`url(${camp})`}} aria-hidden="true"/><div className="assembly-storyboard">{[pour,blend,serving].map((src,i)=><div key={src} data-shot={i}><img src={src} alt=""/></div>)}</div><div className="assembly-time-track"><i/><i/><i/></div></>:null}
    {kind==='image'?<><div className="assembly-detection"><img src={photo} alt=""/><b className="detect-cup"/><b className="detect-berries"/></div><div className="assembly-objects"><div className="object-cup"><svg viewBox="210 322 105 287" preserveAspectRatio="xMidYMid meet" style={{width:"100%",height:"100%"}}><image href={photo} width="576" height="1024"/></svg></div><div className="object-berries"><svg viewBox="334 550 123 77" preserveAspectRatio="xMidYMid meet" style={{width:"100%",height:"100%"}}><image href={photo} width="576" height="1024"/></svg></div></div></>:null}
    {kind==='audio'?<><div className="assembly-audio-evidence">{wave()}<span/></div><blockquote>I can <mark>take it anywhere</mark> and blend smoothies anytime.</blockquote></>:null}
    {kind==='pdf'?<><div className="assembly-chart-source"><img src={pdf} alt=""/><b/></div><div className="assembly-chart">{[50,30,20].map(n=><div key={n}><i style={{width:n*1.65+'%'}}/><span>{n}%</span></div>)}</div></>:null}
   </div>
   <div className="assembly-citation-line"><i/><Link2Icon/><i/><CheckIcon/></div>
  </div>
 }
 const agents=[0,1,2]
 return <div className="context-conveyor production-line" ref={root} data-running={active}>
  <div className="conveyor-scene production-scene" ref={scene} role="img" aria-label={t('Original video, images, audio and documents travel through Vane Context, become cited understanding and are carried by little figures that crouch and jump into three agent receiving racks.','原始视频、图片、音频与文档经过 Vane Context，变为带依据的理解结果，由小人搬运、起跳，送入三个 Agent 接收架。')}>
   <div className="production-stage">
    <svg className="production-rails" viewBox="0 0 2900 1631" aria-hidden="true">
     <defs><linearGradient id={id+'rail'} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff"/><stop offset=".5" stopColor="#f1f2ee"/><stop offset="1" stopColor="#cdd1cb"/></linearGradient></defs>
     <g transform="translate(0 26)"><g fill="none" stroke="#364136" strokeOpacity=".07" strokeWidth="20"><path d="M95 1368 H1900"/><path d="M105 1402 H1900"/></g>
     <g fill="none" stroke={'url(#'+id+'rail)'} strokeWidth="13" strokeLinecap="round"><path d="M95 1338 H1890 Q1970 1338 2063 1410"/><path d="M105 1370 H1880 Q2080 1370 2330 1450"/><path d="M1880 1370 Q2290 1390 2600 1490"/></g>
     <g fill="#eceee8" stroke="#d4d8d0"><rect x="175" y="1375" width="18" height="30" rx="6"/><rect x="1010" y="1375" width="18" height="30" rx="6"/><rect x="1800" y="1375" width="18" height="30" rx="6"/></g></g>
    </svg>
    {agents.map((_,i)=><div key={i} className={'receiving-back receiving-back-'+i}><i/><i/><i/></div>)}
    {kinds.map(kind=><div key={kind} className="assembly-source-shadow" data-source-shadow={kind}/>)}
    {kinds.map(kind=><div key={kind} className="assembly-result-shadow" data-result-shadow={kind}/>)}
    {kinds.map(kind=><div key={kind} data-payload={kind} className={'assembly-input input-'+kind} aria-hidden="true">{source(kind,true)}</div>)}
    {kinds.map(kind=><div key={kind} className="assembly-result" data-result={kind} aria-hidden="true">{findings(kind)}</div>)}
    {kinds.flatMap(kind=>(['source','result'] as const).map(part=><div key={kind+part} className="media-carrier" data-carrier={kind} data-carrier-part={part} aria-hidden="true">
     <svg viewBox="0 0 140 150" className="carrier-drawing">
      <path data-leg="left" className="carrier-far-limb"/><path data-leg="right"/>
      <path data-body/><path data-hands/>
      <g data-head><circle r="13" className="carrier-head"/><circle cx="5" cy="-2" r="1.4" className="carrier-eye"/><path d="M 3 5 Q 7 8 10 4" className="carrier-smile"/></g>
     </svg>
    </div>))}
    <div className="production-gate" aria-hidden="true">
     <div className="gate-interior"/>
     <img className="gate-shell gate-shell-front" src={base+'showcase/context/production/pillar.avif'} alt=""/>
     <img className="gate-shell gate-shell-rim" src={base+'showcase/context/production/pillar.avif'} alt=""/>
     <div className="gate-sill"/>
     <div className="production-gate-face"><div className="gate-brand"><img src={base+'vane-logo.svg'} alt=""/><span>Vane</span></div></div>
    </div>
    {agents.map(i=><div key={i} className={'receiving-rack receiving-rack-'+i} data-agent-box={i}><div className="rack-leaf rack-leaf-back"/><div className="rack-leaf rack-leaf-front"><div className={'agent-emblem agent-emblem-'+i} aria-hidden="true"><div className="agent-portrait"><i className="agent-antenna"/><div className="agent-head"><div className="agent-eyes"><i/><i/></div><i className="agent-mouth"/></div></div><span className="agent-label">Agent</span></div></div><div className="rack-foot"/></div>)}

   </div>
  </div>
 </div>
}
