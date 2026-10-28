/** Cards, carriers and the product gate share one native scene and one animation clock. */
export const SCENE = {width:2900,height:1631,bottom:1332,gateLeft:690,gateRight:872}
export const CONVEYOR_CYCLE_MS = 14000
export const GATE_AT = 4400
export const PICKUP_AT = 10240
export const CROUCH_MS = 400
export const FLIGHT_MS = 1040
export const LAND_MS = 300
export const BOXES = [
 {cx:2063,lip:1200,floor:1434},
 {cx:2330,lip:1240,floor:1473},
 {cx:2600,lip:1250,floor:1516},
]
export const SOURCE_WIDTHS = [272,272,360,320]
export const RESULT_WIDTH = 400
export const CARD_HEIGHT = 472
export const CARRIER_HEIGHT = 128
export const CARRIER_SCALE = .25
export const CROUCH_DEPTH = 44*CARRIER_SCALE
const clamp=(n:number)=>Math.max(0,Math.min(1,n))
const ease=(n:number)=>{const x=clamp(n);return x*x*(3-2*x)}
const mix=(a:number,b:number,t:number)=>a+(b-a)*t
export const packetPhase=(time:number,index:number)=>((time-index*CONVEYOR_CYCLE_MS/4)%CONVEYOR_CYCLE_MS+CONVEYOR_CYCLE_MS)%CONVEYOR_CYCLE_MS/CONVEYOR_CYCLE_MS
const resultStart=SCENE.gateRight-RESULT_WIDTH/2
const resultEnd=resultStart+175*(PICKUP_AT-GATE_AT)/1000
const sourceStart=(width:number)=>SCENE.gateLeft+width/2-144*(GATE_AT-500)/1000

export function packetPose(time:number,index:number){
 const phase=packetPhase(time,index),age=phase*CONVEYOR_CYCLE_MS,width=SOURCE_WIDTHS[index],box=index%3
 const sourceX=age<500?mix(-150,sourceStart(width),ease(age/500)):mix(sourceStart(width),SCENE.gateLeft+width/2,clamp((age-500)/(GATE_AT-500)))
 const sourceTop=age<500?mix(714,SCENE.bottom-CARD_HEIGHT,ease(age/500)):SCENE.bottom-CARD_HEIGHT
 const source={x:sourceX-width/2,y:sourceTop,width,height:CARD_HEIGHT,scale:1,opacity:age<GATE_AT?ease(age/100):0,clipRight:Math.max(0,sourceX+width/2-SCENE.gateLeft),clipLeft:0,clipBottom:0}
 const travel=clamp((age-GATE_AT)/(PICKUP_AT-GATE_AT)),q=age-PICKUP_AT,target=BOXES[box]
 let resultX=mix(resultStart,resultEnd,travel),resultTop=SCENE.bottom-CARD_HEIGHT,scale=1,opacity=age>=GATE_AT?1:0,clipBottom=0,crouch=0,flight=0
 let action:'walk'|'crouch'|'jump'|'land'='walk'
 if(q>=0&&q<CROUCH_MS){
  action='crouch'
  // Stay planted while bending, then extend quickly to propel the card and carrier.
  const prepare=q/CROUCH_MS
  crouch=prepare<.72?ease(prepare/.72):1-ease((prepare-.72)/.28)
  resultX=resultEnd+20*ease(prepare)
  resultTop+=CROUCH_DEPTH*crouch
 }else if(q>=CROUCH_MS&&q<CROUCH_MS+FLIGHT_MS){
  action='jump';flight=(q-CROUCH_MS)/FLIGHT_MS
  resultX=mix(resultEnd+20,target.cx,flight)
  resultTop=mix(SCENE.bottom-CARD_HEIGHT,target.lip-CARD_HEIGHT*.3-160,flight)-4*440*flight*(1-flight)
  scale=mix(1,.7,ease((flight-.76)/.24))
 }else if(q>=CROUCH_MS+FLIGHT_MS){
  action='land';flight=1
  const landing=clamp((q-CROUCH_MS-FLIGHT_MS)/LAND_MS)
  resultX=target.cx;scale=.7
  resultTop=mix(target.lip-CARD_HEIGHT*.3-160,target.lip-CARD_HEIGHT*.3,ease(landing))
  opacity=1-ease((landing-.15)/.85)
  clipBottom=Math.max(0,(resultTop+CARD_HEIGHT*scale-target.floor)/scale)
 }
 const result={x:resultX-RESULT_WIDTH/2,y:resultTop,width:RESULT_WIDTH,height:CARD_HEIGHT,scale,opacity,clipRight:0,clipLeft:age<PICKUP_AT?Math.max(0,SCENE.gateRight-(resultX-RESULT_WIDTH/2)):0,clipBottom}
 return {phase,age,box,source,result,step:Math.min(2,Math.floor(travel*3)),progress:travel,action,crouch,flight,carried:action==='jump',deposit:action==='land'&&opacity>0,receiving:q>=CROUCH_MS&&q<CROUCH_MS+FLIGHT_MS+LAND_MS}
}

/** The hands stay at the card edge; feet remain planted during the crouch. */
export function carrierPose(packet:ReturnType<typeof packetPose>,part:'source'|'result'){
 const p=packet[part],action=part==='source'?'walk':packet.action,crouch=part==='source'?0:packet.crouch
 const center=p.x+p.width/2,hipX=73,hipY=82-10*crouch,footY=CARRIER_HEIGHT-CROUCH_DEPTH/CARRIER_SCALE*crouch
 const gait=packet.age/720*Math.PI*2,bob=action==='walk'?Math.sin(gait*2)*1.5:0
 let leftLeg:string,rightLeg:string
 if(action==='walk'){
  const stride=Math.sin(gait)
  leftLeg=`M ${hipX} ${hipY} Q ${70-stride*15} ${103+bob} ${70-stride*25} ${128-Math.max(0,stride)*12} l 10 0`
  rightLeg=`M ${hipX} ${hipY} Q ${70+stride*15} ${103+bob} ${70+stride*25} ${128-Math.max(0,-stride)*12} l 10 0`
 }else if(action==='crouch'){
  leftLeg=`M ${hipX} ${hipY} L ${mix(62,40,crouch)} ${mix(104,78,crouch)} L 53 ${footY} l 11 0`
  rightLeg=`M ${hipX} ${hipY} L ${mix(88,106,crouch)} ${mix(104,78,crouch)} L 88 ${footY} l 11 0`
 }else{
  const tuck=action==='jump'?Math.sin(Math.PI*packet.flight):0
  leftLeg=`M ${hipX} ${hipY} L ${mix(59,40,tuck)} ${mix(102,89,tuck)} L ${mix(48,27,tuck)} ${mix(125,96,tuck)} l 10 0`
  rightLeg=`M ${hipX} ${hipY} L ${mix(89,105,tuck)} ${mix(101,79,tuck)} L ${mix(100,95,tuck)} ${mix(122,101,tuck)} l 10 0`
 }
 const shoulderX=72+crouch*4,shoulderY=50+bob
 const body=`M ${shoulderX} ${shoulderY} Q ${76+crouch*8} ${65+bob} ${hipX} ${hipY}`
 const arms=`M 38 0 Q ${38+crouch*6} ${30+bob} ${shoulderX} ${shoulderY} M 103 0 Q ${102+crouch*5} ${30+bob} ${shoulderX} ${shoulderY}`
 const scale=p.scale*CARRIER_SCALE
 const clipLeft=part==='result'&&packet.age<PICKUP_AT?Math.max(0,(SCENE.gateRight-(center-70*scale))/scale):0
 const clipRight=part==='source'?Math.max(0,(center+70*scale-SCENE.gateLeft)/scale):0
 return {x:center-70,y:p.y+CARD_HEIGHT*p.scale,scale,opacity:p.opacity,clipLeft,clipRight,action,headX:72+crouch*4,headY:27+bob,body,arms,leftLeg,rightLeg,footY}
}
