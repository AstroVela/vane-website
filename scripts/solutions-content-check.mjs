import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {createJiti} from 'jiti'
const {solutions} = createJiti(import.meta.url)('../src/content/solutions.ts')
assert.deepEqual(solutions.map(s => s.id), ['video-research', 'audio-evidence', 'product-verification', 'training'])
for (const solution of solutions) {
  assert.ok(solution.title.en && solution.title['zh-CN'] && solution.summary.en && solution.summary['zh-CN'])
  assert.ok(existsSync('public' + solution.poster), 'Missing solution media')
  if (solution.product === 'context') {assert.ok(['video', 'audio', 'image'].includes(solution.media)); assert.ok(solution.need.en && solution.need['zh-CN'])}
}
console.log('Solutions checked: one featured marketing use case, retained image/audio paths and Data training.')
