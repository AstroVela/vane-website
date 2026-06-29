import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/TrainingUseCase.tsx'
const routesPath = 'src/plugins/vaneRoutes.ts'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const routes = readFileSync(routesPath, 'utf8')

const mustIncludeInPage = [
  'Training-data pipelines for autonomous driving & physical AI — Vane',
  'Use Case · Autonomous Driving / Physical AI',
  'From PB-scale drive logs to training-ready datasets.',
  'decode, align, auto-label, dedup, package',
  'See benchmarks',
  'Run the pipeline',
  'Faster pipelines, in far less code.',
  'Performance — higher throughput, fuller GPUs',
  'Continuous PB/EB processing, offline auto-labeling and full historical recompute',
  'Efficient heterogeneous execution',
  'Streaming + backpressure + dynamic batching',
  'Distributed on Ray',
  'Simplicity — one engine, no glue code',
  'One engine, one graph',
  'DuckDB-compatible API',
  'Measured, and reproducible.',
  '3.1×',
  '~20× Spark',
  '~2× Daft',
  '~1.2× Ray Data',
  'Representative code',
  'perception-xl',
  's3://release/v42/',
  'python -m vane_examples.training_data_pipeline',
  'Point your code agent at our docs',
  "let's run the math together",
  'Become a design partner',
]

for (const text of mustIncludeInPage) {
  assert.match(page, new RegExp(escapeRegExp(text)), `${pagePath} should include "${text}"`)
}

assert.match(routes, /path:\s*'\/use-cases\/training'[\s\S]*TrainingUseCase\.tsx/, 'training route should render TrainingUseCase.tsx')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
