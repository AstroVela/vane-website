import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)
const {
  BENCHMARK_RESULTS,
  DEFAULT_BATCH_BENCHMARK_RESULTS,
  BENCHMARK_ENVIRONMENT,
  benchmarkEngines,
  formatSeconds,
  runtimeChangePercent,
} = await jiti.import('../src/benchmarkData.ts')
const homeSource = readFileSync('src/pages/Home.tsx', 'utf8')
const benchmarkPageSource = readFileSync('src/pages/Benchmarks.tsx', 'utf8')
const previewSource = readFileSync('src/components/BenchmarkPreview.tsx', 'utf8')
const dataProductSource = readFileSync('src/pages/DataProduct.tsx', 'utf8')
const scopeSource = readFileSync('src/components/BenchmarkScopeNote.tsx', 'utf8')

function rows(results) {
  return results.map(({ id, vaneLocalSeconds, vaneRaySeconds, rayDataSeconds, daftSeconds }) =>
    [id, vaneLocalSeconds, vaneRaySeconds, rayDataSeconds, daftSeconds])
}

test('tuned results preserve all retested values and the previous Daft results', () => {
  assert.deepEqual(rows(BENCHMARK_RESULTS), [
    ['document', 101.76, 106.81, 215.24, 413],
    ['image', 661.20, 653.36, 1831.16, null],
    ['audio', 2132.67, 2177.74, 2110.56, null],
    ['video', 6938.71, 7141.23, 7035.15, 8322],
  ])
})

test('default results preserve all retested values and the previous Daft results', () => {
  assert.deepEqual(rows(DEFAULT_BATCH_BENCHMARK_RESULTS), [
    ['document', 198.51, 211.49, 299.21, 732.99],
    ['image', 661.54, 699.38, 1839.03, null],
    ['audio', 2288.67, 2279.10, 2141.49, null],
    ['video', 6935.88, 7150.87, 7061.62, 8322],
  ])
})

test('the four engine columns stay distinct, ordered, and retain OOM as missing time', () => {
  assert.deepEqual(benchmarkEngines(BENCHMARK_RESULTS[1]), [
    { id: 'vaneLocal', label: 'Vane Local', seconds: 661.20 },
    { id: 'vaneRay', label: 'Vane Ray', seconds: 653.36 },
    { id: 'rayData', label: 'Ray Data', seconds: 1831.16 },
    { id: 'daft', label: 'Daft', seconds: null },
  ])
  assert.equal(formatSeconds(661.2), '661.20 s')
  assert.equal(formatSeconds(2279.1), '2279.10 s')
})

test('headline speedups use tuned Ray Data as baseline and identify the measured mode', () => {
  const document = BENCHMARK_RESULTS.find(({ id }) => id === 'document')
  const image = BENCHMARK_RESULTS.find(({ id }) => id === 'image')
  assert.equal((document.rayDataSeconds / document.vaneLocalSeconds).toFixed(2), '2.12')
  assert.equal((image.rayDataSeconds / image.vaneRaySeconds).toFixed(2), '2.80')
  assert.equal(runtimeChangePercent(document.vaneLocalSeconds, document.rayDataSeconds).toFixed(1), '-52.7')
  assert.equal(runtimeChangePercent(image.vaneRaySeconds, image.rayDataSeconds).toFixed(1), '-64.3')
})

test('audio regressions and near-parity video results are preserved in both configurations', () => {
  for (const results of [BENCHMARK_RESULTS, DEFAULT_BATCH_BENCHMARK_RESULTS]) {
    const audio = results.find(({ id }) => id === 'audio')
    const video = results.find(({ id }) => id === 'video')
    assert.ok(runtimeChangePercent(audio.vaneLocalSeconds, audio.rayDataSeconds) > 0)
    assert.ok(runtimeChangePercent(audio.vaneRaySeconds, audio.rayDataSeconds) > 0)
    assert.ok(runtimeChangePercent(video.vaneLocalSeconds, video.rayDataSeconds) < 0)
    assert.ok(runtimeChangePercent(video.vaneRaySeconds, video.rayDataSeconds) > 0)
  }
})

test('benchmark provenance distinguishes the Ray retest from historical Daft results', () => {
  assert.equal(BENCHMARK_ENVIRONMENT.rayVersion, '2.58.0')
  assert.equal(BENCHMARK_ENVIRONMENT.cpuCores, 36)
  assert.equal(BENCHMARK_ENVIRONMENT.memoryGb, 64)
  assert.equal(BENCHMARK_ENVIRONMENT.gpuMemoryGb, 22)
  assert.match(scopeSource, /retained from the previous run and were not retested/)
  assert.match(scopeSource, /Daft 沿用历史测试，本轮未重测/)
  assert.match(scopeSource, /ray-data-daft-benchmarking-multimodal-ai-workloads/)
  assert.match(benchmarkPageSource, /href=\{BENCHMARK_WORKFLOW_URL\}/)
  assert.match(benchmarkPageSource, /Ray Data has the lowest audio elapsed time/)
  assert.doesNotMatch(benchmarkPageSource, /Ray upgrade caused|升级导致/)
})

test('the current home, Data product, and detail pages share the retested results', () => {
  for (const source of [homeSource, dataProductSource, benchmarkPageSource]) {
    assert.match(source, /<BenchmarkPreview/)
    assert.doesNotMatch(source, /vaneSeconds|batchSizes\.vaneData|3\.1[×x]|A100/)
  }
  assert.match(previewSource, /benchmarkEngines\(result\)/)
  assert.match(previewSource, /<BenchmarkHighlights locale=\{locale\}/)
  assert.match(benchmarkPageSource, /<BenchmarkHighlights locale=\{locale\}/)
  assert.match(benchmarkPageSource, /<MarketingLayout data/)
})

test('Daft provenance stays in the methodology without labels beneath engine names', () => {
  assert.doesNotMatch(previewSource, /previous:|copy\.previous|<small>.*(?:previous run|历史测试)/)
  assert.doesNotMatch(benchmarkPageSource, /copy\.previous|previous:|<small>.*(?:previous run|历史测试)/)
  assert.match(scopeSource, /Daft results are retained from the previous run/)
})
