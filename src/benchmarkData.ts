export type BenchmarkWorkloadId = 'document' | 'image' | 'audio' | 'video'
export type BenchmarkBatchSize = number | 'not-set' | null

export type BenchmarkElapsedResult = {
  id: BenchmarkWorkloadId
  rayDataSeconds: number
  vaneSeconds: number
  daftSeconds: number | null
}

export type BenchmarkResult = BenchmarkElapsedResult & {
  batchSizes: {
    rayData: BenchmarkBatchSize
    vaneData: BenchmarkBatchSize
    daft: BenchmarkBatchSize
  }
}

export const BENCHMARK_ENVIRONMENT = {
  cpuCores: 36,
  memoryGb: 64,
  gpu: '2080 Ti',
  gpuMemoryGb: 22,
} as const

export const BENCHMARK_ENGINE_NAMES = {
  vaneData: 'Vane Data',
  rayData: 'Ray Data',
  daft: 'Daft',
} as const

export const BENCHMARK_RESULTS = [
  { id: 'document', rayDataSeconds: 127, vaneSeconds: 86.092, daftSeconds: 413, batchSizes: { rayData: 320, vaneData: 2560, daft: 20 } },
  { id: 'image', rayDataSeconds: 1767.11, vaneSeconds: 1147, daftSeconds: null, batchSizes: { rayData: 100, vaneData: 100, daft: null } },
  { id: 'audio', rayDataSeconds: 2363.08, vaneSeconds: 2312, daftSeconds: null, batchSizes: { rayData: 128, vaneData: 128, daft: null } },
  { id: 'video', rayDataSeconds: 6922, vaneSeconds: 7603, daftSeconds: 8322, batchSizes: { rayData: 32, vaneData: 32, daft: 'not-set' } },
] as const satisfies readonly BenchmarkResult[]

export const DEFAULT_BATCH_BENCHMARK_RESULTS = [
  { id: 'document', rayDataSeconds: 209, vaneSeconds: 187, daftSeconds: 732.99 },
  { id: 'image', rayDataSeconds: 2036, vaneSeconds: 1188, daftSeconds: null },
  { id: 'audio', rayDataSeconds: 2880, vaneSeconds: 2638, daftSeconds: null },
  { id: 'video', rayDataSeconds: 6922, vaneSeconds: 7603, daftSeconds: 8322 },
] as const satisfies readonly BenchmarkElapsedResult[]

export const VANE_FASTER_THAN_RAY_COUNT = BENCHMARK_RESULTS.filter(
  ({ vaneSeconds, rayDataSeconds }) => vaneSeconds < rayDataSeconds,
).length

export function runtimeChangePercent(seconds: number, baselineSeconds: number) {
  return ((seconds / baselineSeconds) - 1) * 100
}

export function formatRuntimeChange(changePercent: number) {
  return `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`
}

export function formatSeconds(seconds: number) {
  return `${Number.isInteger(seconds) ? seconds : seconds.toFixed(2)} s`
}

export function formatBatchSize(batchSize: BenchmarkBatchSize) {
  if (batchSize === null) return ''
  return batchSize === 'not-set' ? 'batch size not set' : `batch size ${batchSize}`
}
