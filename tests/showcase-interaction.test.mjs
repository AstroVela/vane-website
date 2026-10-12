import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createJiti} from 'jiti'
const load=createJiti(import.meta.url)
const {PlaybackController}=load('../src/components/showcase/playback.ts')
const {initialShowcaseState,showcaseReducer}=load('../src/components/showcase/state.ts')
class Media {paused=true;async play(){this.paused=false}pause(){this.paused=true}}
test('manual playback has priority; one media owner plays at a time',async()=>{
  const playback=new PlaybackController(),main=new Media(),related=new Media()
  playback.register('main',main);playback.register('related',related)
  await playback.play('main','auto');await playback.play('related','hover')
  assert.equal(main.paused,true);assert.equal(related.paused,false)
  await playback.play('main','manual');assert.equal(await playback.play('related','hover'),false)
  assert.equal(main.paused,false);assert.equal(related.paused,true)
  await playback.play('main','auto');assert.equal(playback.isManual('main'),true)
})
test('explicit pause survives automatic events; manual play can resume it',async()=>{
  const playback=new PlaybackController(),media=new Media();playback.register('main',media)
  await playback.play('main','auto');playback.pause('main',true)
  assert.equal(await playback.play('main','auto'),false);assert.equal(media.paused,true)
  assert.equal(await playback.play('main','manual'),true)
  playback.pauseAll();assert.equal(media.paused,true)
})
test('a pending play cannot restart an unregistered element',async()=>{
  const playback=new PlaybackController(),media=new Media();let resolve
  media.play=()=>new Promise(r=>{resolve=()=>{media.paused=false;r()}})
  const unregister=playback.register('main',media),pending=playback.play('main','auto')
  unregister();resolve();assert.equal(await pending,false);assert.equal(media.paused,true)
})
test('scenario selection is remembered; source preview keeps result and analysis state',()=>{
  let state=initialShowcaseState()
  state=showcaseReducer(state,{type:'result',id:'audio-briefing'})
  state=showcaseReducer(state,{type:'analysis'})
  state=showcaseReducer(state,{type:'reference',id:'care'})
  assert.equal(state.selections['usage-demo'],'audio-briefing');assert.equal(state.analysisOpen,true)
  state=showcaseReducer(state,{type:'reference'});assert.equal(state.referenceId,undefined)
  state=showcaseReducer(state,{type:'scenario',id:'image-match'});assert.equal(state.analysisOpen,false)
  state=showcaseReducer(state,{type:'scenario',id:'usage-demo'});assert.equal(state.selections['usage-demo'],'audio-briefing')
})
