import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createJiti} from 'jiti'
const {showcaseAssets:assets,showcaseReferences:references,showcaseScenarios:scenarios}=createJiti(import.meta.url)('../src/content/showcases.ts')
const unique=(items,kind)=>assert.equal(new Set(items.map(i=>i.id)).size,items.length,'Duplicate '+kind+' ID')
unique(assets,'asset');unique(references,'reference');unique(scenarios,'scenario')
function localized(value) {
  if(!value||typeof value!=='object')return
  if('en' in value) {assert.ok(value.en.trim(),'Missing English content');assert.ok(value['zh-CN']?.trim(),'Missing Chinese content')}
  Object.values(value).forEach(localized)
}
function assetFor(id) {const found=assets.find(a=>a.id===id);assert.ok(found,'Unknown asset: '+id);return found}
function validLocator(id,locator) {
  const asset=assetFor(id)
  if(locator.kind==='time_range') {
    assert.ok(['video','audio'].includes(asset.modality),'Wrong modality for time locator')
    assert.ok(Number.isInteger(locator.startMs)&&Number.isInteger(locator.endMs))
    assert.ok(locator.startMs>=0&&locator.endMs>locator.startMs&&locator.endMs<=asset.durationMs,'Invalid time bounds: '+id)
  } else if(locator.kind==='pdf_page') {
    assert.equal(asset.modality,'pdf');assert.ok(Number.isInteger(locator.page)&&locator.page>=1&&locator.page<=asset.pageCount)
    assert.ok(asset.pageImages[locator.page])
  } else assert.equal(asset.modality,'image')
}
for(const asset of assets) {
  localized(asset);assert.equal(asset.provenance,'authored-example')
  for(const url of [asset.previewUrl,asset.posterUrl,asset.originalUrl,...Object.values(asset.pageImages??{}),...(asset.posterFrames??[]).map(frame=>frame.url)].filter(Boolean)) {
    assert.match(url,/^\/showcase\/v1\/[\w.-]+$/,'Assets must be local and versioned')
    assert.ok(existsSync('public'+url),'Missing asset: '+url)
  }
  for(const frame of asset.posterFrames??[])assert.ok(Number.isInteger(frame.startMs)&&frame.startMs>=0&&frame.startMs<asset.durationMs)
  if(asset.modality==='audio') {
    assert.ok(asset.waveform.length>=32&&asset.waveform.every(h=>h>=0&&h<=100))
    const buffer=readFileSync('public'+asset.previewUrl)
    assert.equal(buffer.toString('ascii',0,4),'RIFF')
    let rate,align,size
    for(let offset=12;offset+8<buffer.length;) {
      const name=buffer.toString('ascii',offset,offset+4),length=buffer.readUInt32LE(offset+4)
      if(name==='fmt ') {rate=buffer.readUInt32LE(offset+12);align=buffer.readUInt16LE(offset+20)}
      if(name==='data')size=length
      offset+=8+length+(length%2)
    }
    assert.ok(rate&&align&&size);assert.ok(Math.abs(asset.durationMs-size/align/rate*1000)<=2,'Audio duration differs from WAV')
  }
  if(asset.modality==='pdf') {
    const count=[...readFileSync('public'+asset.previewUrl).toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length
    assert.equal(count,asset.pageCount,'PDF page count differs from manifest')
  }
}
for(const ref of references) {localized(ref);validLocator(ref.assetId,ref.locator)}
assert.equal(scenarios.length,3)
for(const scenario of scenarios) {
  localized(scenario);unique(scenario.results,'result');assert.equal(scenario.results.length,3)
  assert.ok(scenario.results.some(r=>r.id===scenario.defaultResultId))
  if(scenario.referenceImageAssetId) assert.equal(assetFor(scenario.referenceImageAssetId).modality,'image')
  for(const result of scenario.results) {
    validLocator(result.assetId,result.locator);assert.ok(result.referenceIds.length>0&&result.analysis.length>0)
    for(const id of [...result.referenceIds,...result.analysis.flatMap(p=>p.referenceIds)])assert.ok(references.some(r=>r.id===id),'Unknown reference: '+id)
  }
}
assert.deepEqual([...new Set(assets.map(a=>a.modality))].sort(),['audio','image','pdf','video'])
console.log('Showcase checked: 3 tasks, 4 modalities, valid media, source bounds and bilingual content.')
