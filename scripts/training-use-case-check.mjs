import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/TrainingUseCase.tsx'
const routesPath = 'src/plugins/vaneRoutes.ts'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const routes = readFileSync(routesPath, 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')

const mustIncludeInPage = [
  'Multimodal training data pipelines for AI models — Vane',
  'Prepare images, video, audio, documents, tables, and sensor logs for multimodal model training. Run filtering, captioning, embedding, deduplication, auto-labeling, and dataset release packaging in one Ray-backed pipeline.',
  '3.1x batch inference throughput vs Ray Data. Raw multimodal data to training-ready releases with one distributed pipeline.',
  'Use Case · Multimodal Model Training',
  'From raw multimodal data to training-ready dataset releases.',
  'VLMs, video models, VLA models, and physical AI systems all depend on the same hard data work',
  'select, decode, caption, label, embed, deduplicate, filter, and package multimodal data at training scale',
  'See benchmarks',
  'Run the pipeline',
  'Faster pipelines, in far less code.',
  'Performance — higher throughput, fuller GPUs',
  'Training-scale multimodal data preparation, offline captioning, auto-labeling, quality scoring, embedding, deduplication, and historical reprocessing',
  'Efficient heterogeneous execution',
  'overlap media decode, GPU captioning, auto-labeling, embedding, and IO asynchronously',
  'Streaming + backpressure + dynamic batching',
  'Distributed on Ray',
  'Simplicity — one engine, no glue code',
  'file selection, media decoding, model inference, quality filters, embeddings, deduplication, and dataset packaging',
  'One engine, one graph',
  'DuckDB-compatible API',
  'Measured, and reproducible.',
  'high-throughput batch model inference for captioning, labeling, scoring, and embedding',
  '3.1×',
  '~20× Spark',
  '~2× Daft',
  '~1.2× Ray Data',
  'Representative code',
  's3://training-corpus/*',
  'your-caption-or-label-model',
  'For Physical AI and VLA training, the same pipeline can read camera, lidar, trajectories, actions, calibration, and scene metadata.',
  's3://dataset-releases/mm-v42/',
  'python -m vane_examples.training_data_pipeline',
  'Point your code agent at our docs',
  'Estimate your training-data processing cost.',
  'captioning, auto-labeling, or historical reprocessing bill',
  "let's run the math together",
  'Become a design partner',
]

for (const text of mustIncludeInPage) {
  assert.match(page, new RegExp(escapeRegExp(text)), `${pagePath} should include "${text}"`)
}

assert.match(routes, /path:\s*'\/use-cases\/training'[\s\S]*TrainingUseCase\.tsx/, 'training route should render TrainingUseCase.tsx')
assert.match(footer, /The multimodal engine for AI pipelines and agents\./, 'Footer should use the unified Vane positioning')

assert.doesNotMatch(page, /Training-data pipelines for autonomous driving & physical AI|Autonomous driving data pipelines for drive logs|Use Case · Autonomous Driving \/ Physical AI|From PB-scale drive logs to training-ready datasets|From drive logs to training-ready dataset releases|Bring your data mix and your bill|perception-xl|It is not a drive-log workload|It is not a drive-log benchmark|cut your auto-label GPU bill|drive-log selection, decode, alignment/, 'training page should not include superseded training copy')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
