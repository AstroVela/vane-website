import test from 'node:test'
import assert from 'node:assert/strict'
import {CONVEYOR_CYCLE_MS,SCENE,GATE_AT,PICKUP_AT,CARD_HEIGHT,CROUCH_MS,FLIGHT_MS,LAND_MS,CARRIER_HEIGHT,CARRIER_SCALE,CROUCH_DEPTH,packetPose,carrierPose} from '../src/components/contextConveyorMotion.ts'

test('only original sources are visible before the gate, and only findings emerge on its right',()=>{
 for(let t=0;t<CONVEYOR_CYCLE_MS;t+=20)for(let i=0;i<4;i++){
  const {source,result}=packetPose(t,i)
  if(source.opacity>0)assert.ok(source.x+source.width-source.clipRight<=SCENE.gateLeft+1e-8)
  if(result.opacity>0&&result.clipLeft>0)assert.ok(result.x+result.clipLeft>=SCENE.gateRight-1e-8)
 }
})

test('a visible crouch plants the feet before card and carrier take off together',()=>{
 for(let i=0;i<4;i++){
  const offset=i*CONVEYOR_CYCLE_MS/4,standing=packetPose(offset+PICKUP_AT,i)
  const low=packetPose(offset+PICKUP_AT+CROUCH_MS*.72,i)
  assert.equal(low.action,'crouch')
  assert.ok(low.result.y-standing.result.y>CROUCH_DEPTH-1)
  for(let age=PICKUP_AT;age<PICKUP_AT+CROUCH_MS;age+=10){
   const packet=packetPose(offset+age,i),carrier=carrierPose(packet,'result')
   assert.ok(Math.abs(carrier.y+carrier.footY*carrier.scale-SCENE.bottom-CARRIER_HEIGHT*CARRIER_SCALE)<1e-8)
   assert.ok(Math.abs(carrier.y-(packet.result.y+CARD_HEIGHT*packet.result.scale))<1e-8)
  }
  const airborne=packetPose(offset+PICKUP_AT+CROUCH_MS+FLIGHT_MS*.5,i)
  assert.equal(airborne.action,'jump')
  assert.ok(airborne.result.y<standing.result.y-300)
  const landing=packetPose(offset+PICKUP_AT+CROUCH_MS+FLIGHT_MS+LAND_MS*.5,i)
  assert.equal(landing.deposit,true)
  assert.equal(packetPose(offset+PICKUP_AT+CROUCH_MS+FLIGHT_MS+LAND_MS+1,i).result.opacity,0)
 }
})

test('carriers stay under the same card throughout the arc, and the entire loop is continuous',()=>{
 for(let i=0;i<4;i++){
  let previous=packetPose(0,i)
  for(let t=10;t<CONVEYOR_CYCLE_MS+500;t+=10){
   const next=packetPose(t,i)
   for(const part of ['source','result']){
    if(previous[part].opacity>.01&&next[part].opacity>.01){
     assert.ok(Math.abs(next[part].x-previous[part].x)<25)
     assert.ok(Math.abs(next[part].y-previous[part].y)<45)
    }
    const carrier=carrierPose(next,part)
    assert.ok(Math.abs(carrier.x+70-next[part].x-next[part].width/2)<1e-8)
    assert.ok(Math.abs(carrier.y-next[part].y-next[part].height*next[part].scale)<1e-8)
    assert.equal(carrier.opacity,next[part].opacity)
    assert.equal(carrier.scale,next[part].scale*.25)
    for(const value of [carrier.x,carrier.y,carrier.scale,carrier.headX,carrier.headY])assert.ok(Number.isFinite(value))
    for(const value of [carrier.body,carrier.arms,carrier.leftLeg,carrier.rightLeg])assert.ok(!/NaN|Infinity/.test(value))
   }
   previous=next
  }
 }
 assert.equal(packetPose(GATE_AT+1,0).source.opacity,0)
 assert.equal(packetPose(GATE_AT-1,0).result.opacity,0)
 assert.equal(packetPose(1000,0).source.y,SCENE.bottom-CARD_HEIGHT)
 assert.ok(Math.abs(packetPose(2000,0).source.x-packetPose(1000,0).source.x-144)<1e-8)
 assert.ok(Math.abs(packetPose(7000,0).result.x-packetPose(6000,0).result.x-175)<1e-8)
})
