import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/TrainingUseCase.tsx'
const componentPath = 'src/components/TrainingDataFactoryAnimation.tsx'
const routesPath = 'src/plugins/vaneRoutes.ts'
const imagePath = 'public/img/use-cases/hero-driving-intersection.webp'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)
assert.ok(existsSync(componentPath), `${componentPath} should exist`)
assert.ok(existsSync(imagePath), `${imagePath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const component = readFileSync(componentPath, 'utf8')
const routes = readFileSync(routesPath, 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')
const css = readFileSync('src/index.css', 'utf8')

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
  'training_release.py',
  'TrainingDataFactoryAnimation',
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
assert.match(component, /Execution timeline/, 'training data factory component should use the improved section label')
assert.match(component, /Legacy Pipeline/, 'training data factory component should include the legacy title')
assert.match(component, /Vane Pipeline/, 'training data factory component should include the Vane title')
assert.match(component, /outcome-ledger/, 'training data factory should keep the original outcome ledger')
assert.match(component, /legacy-workflow/, 'training data factory should keep the original legacy DAG layout')
assert.match(component, /vane-dag/, 'training data factory should keep the original Vane DAG layout')
assert.match(component, /vaneLinkPaths/, 'training data factory should allow Vane-specific link geometry')
assert.match(component, /M 394 117 C 384 91 392 61 400 35/, 'Vane ego-pose align to sensor projection link should follow the occupancy arc direction')
assert.match(component, /queue-stack queue-a/, 'training data factory should keep the original queue stack positions')
assert.match(component, /occupancy-pulse pulse-main/, 'training data factory should keep the original moving occupancy pulses')
assert.match(component, /<LegacyPanel \/>[\s\S]*className="divider"[\s\S]*<VanePanel \/>/, 'training data factory component should render Legacy on the left and Vane on the right')
assert.match(component, /IDLE/, 'training data factory component should include GPU IDLE')
assert.match(component, /FULL/, 'training data factory component should include GPU FULL')
assert.match(component, /hero-driving-intersection\.webp/, 'training data factory component should use the optimized driving sample image')
assert.match(css, /--duration:\s*9s/, 'training data factory should run the original timeline as a shorter 9s loop')
assert.match(css, /offset-path:\s*path/, 'training data factory should preserve the original motion path animation')
assert.match(css, /@keyframes occupancyAlongPath/, 'training data factory animation should preserve occupancy path keyframes')
assert.match(css, /--legacy-node-decode-left/, 'training data factory styles should preserve original node coordinate variables')
assert.match(css, /\.training-data-factory/, 'training data factory styles should be present')
assert.match(css, /--hero-top:\s*36px/, 'training data factory should move the hero sample up after removing the internal stage copy')
assert.match(css, /--ledger-top:\s*78px/, 'training data factory should move the outcome ledger up after removing the internal stage copy')
assert.match(css, /--comparison-margin-top:\s*158px/, 'training data factory should keep the comparison aligned without the headline spacer')
assert.match(css, /height:\s*600px/, 'training data factory stage should use a tighter fixed height after removing the internal stage copy')
assert.doesNotMatch(css, /\.tdfa-/, 'training data factory should not use the simplified replacement layout')
assert.doesNotMatch(component, /Autonomous driving data factory|Raw driving multimodal data → model-ready training assets|className="headline"|factory-eyebrow|Data factory animation|message-strip|Queue buildup → steady pipeline occupancy|Stage wait → streaming frames|Idle GPU → balanced pipeline|Ready for training, eval, and replay|large sensor frames stop blocking downstream stages|downstream starts before the full clip finishes|CPU decode and GPU inference stay overlapped/, 'training data factory should remove the internal stage copy, old section label, and bottom message copy')
assert.doesNotMatch(css, /\.training-data-factory \.headline|\.training-data-factory \.factory-eyebrow|--eyebrow-left|--eyebrow-top|--eyebrow-font-size|--headline-left|--headline-top|--headline-font-size|--headline-max-width|message-strip|@keyframes msg[1-4]/, 'training data factory styles should remove headline, label, and message-strip-only CSS')

assert.doesNotMatch(page, /Training-data pipelines for autonomous driving & physical AI|Autonomous driving data pipelines for drive logs|Use Case · Autonomous Driving \/ Physical AI|From PB-scale drive logs to training-ready datasets|From drive logs to training-ready dataset releases|Bring your data mix and your bill|perception-xl|It is not a drive-log workload|It is not a drive-log benchmark|cut your auto-label GPU bill|drive-log selection, decode, alignment|drive_release\.py/, 'training page should not include superseded training copy')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
