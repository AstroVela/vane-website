import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createJiti} from 'jiti'
const load = createJiti(import.meta.url)
const {PlaybackController} = load('../src/components/showcase/playback.ts')
const {initialHeroState, heroReducer, canRotate} = load('../src/components/showcase/state.ts')
class Media {paused = true; async play() {this.paused = false} pause() {this.paused = true}}
test('only one media owner plays; automatic requests do not interrupt manual playback', async () => {
  const controller = new PlaybackController(), video = new Media(), audio = new Media()
  controller.register('video', video); controller.register('audio', audio)
  await controller.play('video', 'auto'); await controller.play('audio', 'manual')
  assert.equal(video.paused, true); assert.equal(audio.paused, false)
  assert.equal(await controller.play('video', 'auto'), false)
  controller.pauseAll(); assert.equal(audio.paused, true)
})
test('explicit pause survives automatic events; manual play resumes', async () => {
  const controller = new PlaybackController(), media = new Media(); controller.register('main', media)
  await controller.play('main', 'auto'); controller.pause('main', true)
  assert.equal(await controller.play('main', 'auto'), false)
  assert.equal(await controller.play('main', 'manual'), true)
})
test('a pending play cannot restart an unregistered media element', async () => {
  const controller = new PlaybackController(), media = new Media(); let resolve
  media.play = () => new Promise(r => {resolve = () => {media.paused = false; r()}})
  const unregister = controller.register('main', media), pending = controller.play('main', 'auto')
  unregister(); resolve(); assert.equal(await pending, false); assert.equal(media.paused, true)
})
test('selecting evidence stops rotation; returning to a type remembers selection without replaying it', () => {
  let state = initialHeroState()
  state = heroReducer(state, {type: 'select', media: 'video', insight: 'blending'})
  const epoch = state.selectionEpoch
  assert.equal(state.rotationMode, 'manual'); assert.equal(state.requestedInsight, 'blending')
  state = heroReducer(state, {type: 'select', media: 'image', insight: 'caption'})
  state = heroReducer(state, {type: 'select', media: 'video'})
  assert.equal(state.selectedInsight.video, 'blending'); assert.equal(state.requestedInsight, undefined)
  assert.ok(state.selectionEpoch > epoch); assert.equal(canRotate(state), false)
})
test('rotation is suspended by hover, focus, modal, audible media and hidden documents', () => {
  const ready = {...initialHeroState(), visible: true}
  assert.equal(canRotate(ready), true)
  for (const values of [{hovered: true}, {focusWithin: true}, {modalOpen: true}, {audible: true}, {visible: false}, {documentVisible: false}]) {
    const blocked = heroReducer(ready, {type: 'environment', values})
    assert.equal(canRotate(blocked), false); assert.equal(heroReducer(blocked, {type: 'rotate'}).activeMedia, 'video')
  }
  assert.equal(heroReducer(ready, {type: 'rotate'}).activeMedia, 'image')
})
