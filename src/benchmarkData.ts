export type BenchmarkWorkloadId = 'document' | 'image' | 'audio' | 'video'

export type BenchmarkElapsedResult = {
  id: BenchmarkWorkloadId
  rayDataSeconds: number
  vaneLocalSeconds: number
  vaneRaySeconds: number
  daftSeconds: number | null
}

export const BENCHMARK_ENVIRONMENT = {
  cpuCores: 36,
  memoryGb: 64,
  gpu: '2080 Ti',
  gpuMemoryGb: 22,
  gpuMemoryModified: true,
  rayVersion: '2.58.0',
} as const

export const BENCHMARK_ENGINE_NAMES = {
  vaneLocal: 'Vane Local',
  vaneRay: 'Vane Ray',
  rayData: 'Ray Data',
  daft: 'Daft',
} as const

// Vane and Ray Data: latest supplied retest, using Ray 2.58.0.
// Daft: retained from the previous run; null records an observed OOM.
// Per-engine batch sizes were not supplied for this retest. Do not reuse old settings.
export const BENCHMARK_RESULTS = [
  { id: 'document', vaneLocalSeconds: 101.76, vaneRaySeconds: 106.81, rayDataSeconds: 215.24, daftSeconds: 413 },
  { id: 'image', vaneLocalSeconds: 661.20, vaneRaySeconds: 653.36, rayDataSeconds: 1831.16, daftSeconds: null },
  { id: 'audio', vaneLocalSeconds: 2132.67, vaneRaySeconds: 2177.74, rayDataSeconds: 2110.56, daftSeconds: null },
  { id: 'video', vaneLocalSeconds: 6938.71, vaneRaySeconds: 7141.23, rayDataSeconds: 7035.15, daftSeconds: 8322 },
] as const satisfies readonly BenchmarkElapsedResult[]

export const DEFAULT_BATCH_BENCHMARK_RESULTS = [
  { id: 'document', vaneLocalSeconds: 198.51, vaneRaySeconds: 211.49, rayDataSeconds: 299.21, daftSeconds: 732.99 },
  { id: 'image', vaneLocalSeconds: 661.54, vaneRaySeconds: 699.38, rayDataSeconds: 1839.03, daftSeconds: null },
  { id: 'audio', vaneLocalSeconds: 2288.67, vaneRaySeconds: 2279.10, rayDataSeconds: 2141.49, daftSeconds: null },
  { id: 'video', vaneLocalSeconds: 6935.88, vaneRaySeconds: 7150.87, rayDataSeconds: 7061.62, daftSeconds: 8322 },
] as const satisfies readonly BenchmarkElapsedResult[]

export function benchmarkEngines(result: BenchmarkElapsedResult) {
  return [
    { id: 'vaneLocal', label: BENCHMARK_ENGINE_NAMES.vaneLocal, seconds: result.vaneLocalSeconds },
    { id: 'vaneRay', label: BENCHMARK_ENGINE_NAMES.vaneRay, seconds: result.vaneRaySeconds },
    { id: 'rayData', label: BENCHMARK_ENGINE_NAMES.rayData, seconds: result.rayDataSeconds },
    { id: 'daft', label: BENCHMARK_ENGINE_NAMES.daft, seconds: result.daftSeconds },
  ] as const
}

export function runtimeChangePercent(seconds: number, baselineSeconds: number) {
  return ((seconds / baselineSeconds) - 1) * 100
}

export function formatSeconds(seconds: number) {
  return `${seconds.toFixed(2)} s`
}
