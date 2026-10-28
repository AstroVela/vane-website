import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {createJiti} from 'jiti'
const {solutions} = createJiti(import.meta.url)('../src/content/solutions.ts')
const {agentUseCases, casePagePath, caseDemoPath} = createJiti(import.meta.url)('../src/content/useCases.ts')
const {demoScenarios, demoModalities, validateDemo} = createJiti(import.meta.url)('../src/demoContract.ts')
assert.deepEqual(solutions.map(s => s.id), ['video-research', 'audio-evidence', 'product-verification', 'training'])
for (const solution of solutions) {
  assert.ok(solution.title.en && solution.title['zh-CN'] && solution.summary.en && solution.summary['zh-CN'])
  assert.ok(existsSync('public' + solution.poster), 'Missing solution media')
  if (solution.product === 'context') {assert.ok(['video', 'audio', 'image'].includes(solution.media)); assert.ok(solution.need.en && solution.need['zh-CN'])}
}
assert.equal(agentUseCases.length, 6)
assert.equal(new Set(agentUseCases.map(s => s.id)).size, 6)
for (const scenario of agentUseCases) {
  assert.ok(demoScenarios.includes(scenario.id), 'The demo API must retain the selected use case')
  assert.ok(scenario.modalities.every(m => demoModalities.includes(m)))
  for (const locale of ['en', 'zh-CN']) {
    for (const key of ['name','title','summary','task','audience','action','reuse','update','integration','need']) assert.ok(scenario[key][locale], scenario.id + ': missing ' + key)
    assert.equal(scenario.outputs.length, 3)
    const result = validateDemo({name:'Use case check',email:'test@example.com',company:'Website acceptance',need:scenario.need[locale],modalities:scenario.modalities,locale,source:'solution',scenario:scenario.id})
    assert.equal(result.payload?.scenario, scenario.id)
  }
  assert.equal(casePagePath(scenario.id), '/solutions/' + scenario.id)
  assert.ok(caseDemoPath(scenario.id).includes('scenario=' + scenario.id))
}
console.log('Solutions checked: six localized agent use cases, demo contract and source media.')
