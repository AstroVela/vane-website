import assert from 'node:assert/strict'
import {readFileSync, existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {createJiti} from 'jiti'
const {showcaseAssets: assets, showcaseInsights: insights, showcases, imageRegions} = createJiti(import.meta.url)('../src/content/showcases.ts')
const manifest = JSON.parse(readFileSync('public/showcase/marketing/media-manifest.json'))
const unique = (items, kind) => assert.equal(new Set(items.map(i => i.id)).size, items.length, 'Duplicate ' + kind + ' ID')
unique(assets, 'asset'); unique(insights, 'insight'); unique(imageRegions, 'region')
assert.deepEqual(assets.map(a => a.kind).sort(), ['audio', 'image', 'video'])
function localized(value) {
  if (!value || typeof value !== 'object') return
  if ('en' in value) {assert.ok(value.en.trim()); assert.ok(value['zh-CN']?.trim())}
  Object.values(value).forEach(localized)
}
for (const entry of manifest.assets) {
  const file = 'public/showcase/marketing/' + entry.file, bytes = readFileSync(file)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, 'Media checksum changed: ' + entry.file)
  assert.equal(bytes.length, entry.bytes)
}
for (const asset of assets) {
  localized(asset)
  for (const url of [asset.url, asset.posterUrl].filter(Boolean)) {assert.match(url, /^\/showcase\/marketing\/[\w.-]+$/); assert.ok(existsSync('public' + url))}
  const metadata = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height', '-of', 'json', 'public' + asset.url]))
  if (asset.kind !== 'image') assert.ok(Math.abs(Number(metadata.format.duration) - asset.duration) < .15)
  if (asset.kind === 'video') assert.ok(metadata.streams.some(s => s.codec_name === 'h264'))
  for (const preview of asset.previews ?? []) {
    assert.ok(existsSync('public' + preview.url))
    const info = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height', '-of', 'json', 'public' + preview.url]))
    assert.ok(Math.abs(Number(info.format.duration) - asset.duration) < .15)
    assert.ok(info.streams.some(s => s.codec_name === 'h264' && s.width === preview.width && s.height === preview.height))
    const audioHash = file => execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-map', '0:a:0', '-c:a', 'copy', '-f', 'hash', '-hash', 'sha256', '-'], {encoding: 'utf8'}).trim()
    assert.equal(audioHash('public' + preview.url), audioHash('public' + asset.url), 'Preview must preserve the original audio')
  }
  if (asset.kind === 'image') assert.ok(metadata.streams.some(s => s.width === asset.width && s.height === asset.height))
  if (asset.kind === 'audio') {assert.ok(metadata.streams.some(s => s.codec_name === 'aac')); assert.equal(asset.waveform.length, 96); assert.ok(asset.waveform.every(h => h > 0 && h <= 1))}
}
for (const region of imageRegions) {
  assert.equal(region.assetId, 'comp_005')
  assert.ok(region.x >= 0 && region.y >= 0 && region.width > 0 && region.height > 0 && region.x + region.width <= 1 && region.y + region.height <= 1)
}
for (const showcase of showcases) {
  localized(showcase)
  const asset = assets.find(a => a.id === showcase.assetId)
  assert.equal(asset.kind, showcase.kind)
  for (const id of showcase.insightIds) {
    const insight = insights.find(i => i.id === id); assert.ok(insight); localized(insight); assert.ok(insight.locators.length)
    for (const locator of insight.locators) {
      assert.equal(locator.assetId, asset.id, 'Evidence must refer to the displayed media')
      if (locator.kind === 'time') assert.ok(locator.start >= 0 && locator.end > locator.start && locator.end <= asset.duration)
      else {assert.equal(asset.kind, 'image'); assert.ok(locator.regionIds.length); locator.regionIds.forEach(id => assert.ok(imageRegions.some(r => r.id === id && r.assetId === asset.id)))}
    }
  }
}
console.log('Showcase checked: 3 real media sources, codecs, checksums, image regions, evidence bounds and bilingual content.')
