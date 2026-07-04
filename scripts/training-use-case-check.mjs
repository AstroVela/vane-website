import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/TrainingUseCase.tsx'
const componentPath = 'src/components/TrainingDataFactoryAnimation.tsx'
const docsPath = 'docs/data/examples/training-data-pipeline.mdx'
const routesPath = 'src/plugins/vaneRoutes.ts'
const imagePath = 'public/img/use-cases/hero-driving-intersection.webp'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)
assert.ok(existsSync(componentPath), `${componentPath} should exist`)
assert.ok(existsSync(docsPath), `${docsPath} should exist`)
assert.ok(existsSync(imagePath), `${imagePath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const component = readFileSync(componentPath, 'utf8')
const docs = readFileSync(docsPath, 'utf8')
const routes = readFileSync(routesPath, 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')
const siteLinks = readFileSync('src/siteLinks.ts', 'utf8')
const css = readFileSync('src/index.css', 'utf8')
const heroShape = page.match(/function TrainingHeroShape\(\) \{[\s\S]*?\n\}/)?.[0] ?? ''
const heroCss = css.match(/\.training-hero-art[\s\S]*?\.solution-hero-media/)?.[0] ?? ''
const executionCss = css.match(/\.tl-execution\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
const execMainCss = css.match(/\.tl-exec-main\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

const mustIncludeInPage = [
  'Multimodal training data pipelines for AI models — Vane',
  'Prepare images, video, audio, documents, tables, and sensor logs for multimodal model training. Run filtering, captioning, embedding, deduplication, auto-labeling, and dataset release packaging in one Ray-backed pipeline.',
  '3.1x batch inference throughput vs Ray Data. Raw multimodal data to training-ready releases with one distributed pipeline.',
  'Use Case · Multimodal Model Training',
  'From raw multimodal data to training-ready dataset releases.',
  'Prepare multimodal training data with one Ray-backed graph',
  'filter and dedupe in SQL, embed captions, and write a versioned release',
  'converging through the Vane engine into a versioned training-dataset release',
  'raw · multimodal',
  'dataset release',
  'Request a demo',
  'Run the pipeline',
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
  'Representative code',
  'training-code-layout',
  'training-code-copy',
  'training-code-showcase',
  'training-code-steps',
  'training-code-note',
  'SQL selection',
  'Ray GPU UDF',
  'SQL quality gate',
  'Embedding + release',
  '# Select train records from the raw manifest.',
  '# Decode media and run captioning / labeling on Ray actors.',
  '# Filter by quality, dedupe by content hash, then embed captions.',
  '# Publish a versioned training-data release.',
  'CaptionAndScore',
  'release_schema',
  'read_parquet(\'s3://training-corpus/manifest/*.parquet\')',
  'labeled.to_table("labeled")',
  'row_number() over',
  'partition by content_hash',
  'embed_text(',
  'CaptionAndScore is your batch UDF for decoding media, running GPU captioning or labeling, and returning stable release columns.',
  's3://dataset-releases/mm-v42/',
  'Build a reproducible multimodal training-data pipeline.',
  'Become a design partner',
  'Read the docs',
]

for (const text of mustIncludeInPage) {
  assert.match(page, new RegExp(escapeRegExp(text)), `${pagePath} should include "${text}"`)
}

assert.match(routes, /path:\s*'\/use-cases\/training'[\s\S]*TrainingUseCase\.tsx/, 'training route should render TrainingUseCase.tsx')
assert.match(footer, /The multimodal engine for AI pipelines and agents\./, 'Footer should use the unified Vane positioning')
assert.match(page, /TRAINING_DESIGN_PARTNER_MAILTO/, 'training page should use the centralized training design partner mailto')
assert.match(siteLinks, /TRAINING_DESIGN_PARTNER_MAILTO/, 'siteLinks should define the training design partner mailto')
assert.doesNotMatch(page, /hello@vane\.ai|DESIGN_PARTNER_HREF/, 'training page should not hardcode the old design partner mailto')
assert.doesNotMatch(page, /collectAnchor\('benchmark'\)|id="benchmark"|Proof · Performance|Measured, and reproducible\.|training-proof-grid|training-matrix|Full benchmarks/, 'training page should not render the removed proof/performance benchmark section')
assert.doesNotMatch(page, /collectAnchor\('poc'\)|id="poc"|Do a POC|Estimate your training-data processing cost\.|Point your code agent at our docs|Open llms\.txt|training-poc/, 'training page should not render the removed POC card')
assert.match(page, /href="\/benchmarks"[\s\S]*cta="See the benchmarks"/, 'training performance card should link to the standalone benchmarks page')
assert.doesNotMatch(css, /\.training-poc|\.training-poc-actions/, 'training POC-only styles should be removed with the POC card')
assert.doesNotMatch(page, /from vane\.ai import describe|describe\(items|num_gpus|your-caption-or-label-model|read_files\('s3:\/\/training-corpus\/\*'\)|For Physical AI and VLA training/, 'training page code sample should not use the older detailed helper API shape')
assert.match(page, /function TrainingHeroShape\(\)[\s\S]*training-hero-art[\s\S]*thg-stage[\s\S]*training-art-flow[\s\S]*thg-inputs[\s\S]*thg-engine[\s\S]*thg-release/, 'training hero should render the multimodal-inputs → Vane engine → dataset-release pipeline visual')
assert.match(page, /const HERO_MODALITIES[\s\S]*'vision'[\s\S]*'video'[\s\S]*'audio'[\s\S]*'embeddings'[\s\S]*'sensor'/, 'training hero should carry five distinct modalities (image, video, audio, text, sensor)')
assert.match(page, /<PixelIcon name=\{m\.icon\} size=\{15\} \/>/, 'training hero modality chips should reuse the site pixel-bitmap glyph language')
assert.match(page, /className="thg-engine-title">VANE<[\s\S]*thg-engine-ops">decode · caption/, 'training hero engine node should read as the Vane processing stage')
assert.doesNotMatch(heroShape, /training-art-tiles|tile-photo|tile-wave|tile-frame|tile-doc|tile-sensor|training-art-signal|orbit-a|orbit-b/, 'training hero should not render the old scattered modality tiles or bar-chart signal visual')
assert.match(page, /<Button solid to="\/docs\/data\/examples\/training-data-pipeline" arrow>Run the pipeline<\/Button>[\s\S]*<Button href=\{TRAINING_DESIGN_PARTNER_MAILTO\} arrow>Request a demo<\/Button>/, 'training hero should prioritize running the pipeline and requesting a demo')
assert.match(page, /<Button to="\/docs\/data\/examples">Read the docs<\/Button>/, 'training CTA should send docs readers to the examples index')
assert.doesNotMatch(page, /RUN_CODE|collectAnchor\('run-it'\)|id="run-it"|training-run-grid|Start with the training-data example\.|Open the example|Benchmark scripts|filename="run\.sh"|python -m vane_examples\.training_data_pipeline/, 'training page should not render the run-it example module')
assert.doesNotMatch(css, /\.training-run-grid/, 'training run-it-only styles should be removed with the module')
assert.match(css, /\.training-hero-grid\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*486px/, 'training hero should use a two-column layout with a fixed 486px art column on desktop')
assert.match(css, /\.training-hero-art[\s\S]*\.thg-stage[\s\S]*\.training-art-flow[\s\S]*\.thg-inputs[\s\S]*\.thg-chip[\s\S]*\.thg-engine[\s\S]*\.thg-release[\s\S]*\.training-art-label/, 'training hero pipeline background styles should be present')
assert.match(css, /\.thg-stage\s*\{[\s\S]*width:\s*486px[\s\S]*transform:\s*scale\(var\(--thg-scale\)\)/, 'training hero art should scale as one fixed-coordinate stage')
assert.doesNotMatch(heroShape, /training-shape-card|training-shape-row|training-shape-tags|training-art-rail|training-art-scan|training-art-heading|training-art-paths|training-art-node|node-manifest|node-udf|node-gate|Pipeline shape|Raw manifest|SQL filter \/ dedupe|Ray-backed release graph|release build|raw corpus -> mm-v42|SQL selection|Ray GPU UDF|SQL quality gate|Embeddings \+ release|mm-v42 Parquet|One Ray-backed graph turns raw multimodal records into a governed training release\./, 'training hero should not render the old table-like card, technical card map, or abstract graph visual')
assert.doesNotMatch(heroCss, /training-shape-card|training-shape-row|training-shape-tags|training-art-rail|training-art-scan|training-art-heading|training-art-paths|training-art-node|node-manifest|node-udf|node-gate/, 'training hero CSS should not keep old card-map or abstract graph selectors')
assert.match(page, /embed_text\(\s*"caption",[\s\S]*provider="transformers"[\s\S]*execution_backend="ray_actor"/, 'training page should embed captions with the Ray actor backend in the pipeline shape')
assert.match(page, /<div className="training-code-layout">[\s\S]*<div className="training-code-copy">[\s\S]*className="training-code-steps"[\s\S]*className="training-code-note"[\s\S]*<div className="training-code-showcase">[\s\S]*<CodeWindow filename="training_data_release\.py" code=\{PIPELINE_CODE\} language="python" \/>/, 'training representative code should use a text-left code-right layout')
assert.match(css, /\.training-code-layout\s*\{[\s\S]*grid-template-columns:\s*minmax\(280px,\s*0\.78fr\)\s*minmax\(0,\s*1\.22fr\)[\s\S]*\.training-code-copy\s*\{[\s\S]*max-width:\s*520px[\s\S]*\.training-code-showcase\s*\{[\s\S]*min-width:\s*0/, 'training representative code layout styles should give the copy and code balanced desktop columns')
assert.match(css, /@media \(max-width: 900px\)\s*\{[\s\S]*\.training-code-layout,[\s\S]*grid-template-columns:\s*1fr/, 'training representative code layout should stack on tablet and mobile widths')
assert.match(docs, /Full UDF contract[\s\S]*release_schema[\s\S]*class CaptionAndScore/, 'training docs should expand the UDF and schema behind the website sample')
assert.match(docs, /Website code shape[\s\S]*CaptionAndScore[\s\S]*row_number\(\) over[\s\S]*write_parquet\("s3:\/\/dataset-releases\/mm-v42\/"\)/, 'training docs should contain the full website pipeline shape')
assert.match(docs, /gpus=1/, 'training docs should use the current UDF GPU resource parameter')
assert.match(component, /Execution timeline/, 'training data factory component should use the improved section label')
assert.match(component, /Legacy Pipeline/, 'training data factory component should include the legacy title')
assert.match(component, /Vane Pipeline/, 'training data factory component should include the Vane title')
assert.match(component, /serialized waits/, 'legacy lane should use a compact execution-mode label')
assert.match(component, /overlapped streaming/, 'Vane lane should use a compact execution-mode label')
assert.doesNotMatch(component, /outcome-ledger|queue buildup|GPU feed gap|steady occupancy|balanced pipeline/, 'the polished timeline should remove redundant tag rows')
assert.match(component, /const PIPELINE: string\[\]\[\][\s\S]*camera frames[\s\S]*decode frames[\s\S]*time sync[\s\S]*sensor projection[\s\S]*sample embed/, 'the diagram should model the shared pipeline as ordered stage columns')
assert.match(component, /PIPELINE\.map\(\(column, index\)[\s\S]*tl-flow-step[\s\S]*PIPELINE_LABELS\[index\][\s\S]*tl-flow-arrow/, 'the diagram should render the shared pipeline as a columnar flow with arrows')
assert.doesNotMatch(component, /INPUTS\.map|STAGES\.map|STAGES\.length|const INPUTS|const STAGES/, 'the interrupted flat input/stage row implementation should not remain')
assert.match(component, /Same pipeline/, 'the diagram labels the shared pipeline before comparing execution')
assert.match(component, /Legacy and Vane run these same stages; the lanes below compare execution\./, 'the diagram should explain why the shared pipeline is separated from execution lanes')
assert.match(component, /tl-lanes/, 'legacy vs Vane are compared as two aligned execution lanes')
assert.match(component, /sensor projection[\s\S]*sample embed/, 'the shared pipeline lists the multimodal stages')
assert.match(component, /function LegacyExecution[\s\S]*waiting for full clip[\s\S]*<i aria-hidden="true"><span \/><\/i>[\s\S]*CPU decode[\s\S]*tl-gap-dots[\s\S]*GPU infer/, 'legacy execution should show full-clip progress, CPU decode, a feed gap, and delayed GPU inference')
assert.match(component, /function VaneExecution[\s\S]*tl-schedule-flow[\s\S]*stream-a[\s\S]*stream-b[\s\S]*stream-c[\s\S]*stream-d[\s\S]*tl-work-row overlap[\s\S]*CPU decode[\s\S]*dynamic batch[\s\S]*GPU infer/, 'Vane execution should show a fast left-to-right scheduling stream across CPU decode, dynamic batching, and GPU inference')
assert.match(component, /gpuState:\s*'IDLE'[\s\S]*gpuNote:\s*'waiting on CPU stages'[\s\S]*gpuState:\s*'FULL'[\s\S]*gpuNote:\s*'CPU and GPU overlap'/, 'GPU cards should explicitly compare idle legacy utilization against full overlapped Vane utilization')
assert.match(component, /function ExecutionTimeline[\s\S]*tl-execution[\s\S]*LegacyExecution[\s\S]*VaneExecution[\s\S]*GpuCard/, 'the comparison should render lane-specific execution models plus a GPU state card')
assert.doesNotMatch(component, /STAGE_NODES|LINK_PATHS|GraphLinks|GraphInputs|GraphNodes|QueueMarkers|OccupancyMarkers|queue-stack|occupancy-pulse|pipeline-occupancy|sample-overlay|sample-lidar/, 'the compact pass should remove duplicate graph internals and looping decorative motion elements')
assert.doesNotMatch(component, /legacy-workflow|vane-dag|vaneLinkPaths|LegacyPanel|VanePanel|node-decode|node-manifest|tl-exec-rail/, 'the old scattered absolute-positioned DAG implementation and execution rail should not return')
assert.match(component, /IDLE/, 'training data factory component should include GPU IDLE')
assert.match(component, /FULL/, 'training data factory component should include GPU FULL')
assert.match(component, /hero-driving-intersection\.webp/, 'training data factory component should use the optimized driving sample image')
assert.match(css, /\.training-data-factory/, 'training data factory styles should be present')
assert.match(css, /\.tl-board/, 'the diagram uses the new clean board layout')
assert.match(css, /\.tl-pipeline\s*\{[\s\S]*background:\s*rgba\(251,250,246,0\.5\)[\s\S]*\.tl-pipeline-head/, 'the shared pipeline should read as a light reference band')
assert.match(css, /\.tl-sample\s*\{[\s\S]*padding:\s*8px[\s\S]*background:\s*rgba\(251,250,246,0\.72\)[\s\S]*\.tl-sample img\s*\{[\s\S]*height:\s*96px[\s\S]*animation:\s*tlSampleBreath 7s ease-in-out infinite/, 'the sample image should have restrained breathing room and a subtle breathing motion')
assert.match(css, /\.tl-flow-main\s*\{[\s\S]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)[\s\S]*\.tl-flow-step\s*\{[\s\S]*grid-template-rows:\s*auto 1fr[\s\S]*\.tl-flow-arrow/, 'the shared pipeline should use a five-column flow with visible arrows')
assert.match(css, /\.tl-lanes\s*\{[\s\S]*grid-template-columns:\s*1fr 1fr/, 'the execution lanes sit on an aligned two-column grid')
assert.match(css, /\.tl-execution\s*\{[\s\S]*--tl-execution-row-height:\s*132px[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*138px[\s\S]*\.tl-exec-main[\s\S]*\.tl-work-row[\s\S]*\.tl-gpu-card/, 'the execution comparison should use aligned execution work areas with GPU state cards')
assert.doesNotMatch(executionCss, /border:|border-radius:|background:|padding:/, 'execution comparison wrapper should be a pure layout container without the redundant outer frame')
assert.match(css, /\.tl-exec-main\s*\{[\s\S]*height:\s*var\(--tl-execution-row-height\)[\s\S]*animation:\s*tlStageBreath 7\.2s ease-in-out infinite[\s\S]*\.tl-exec-main\.vane\s*\{[\s\S]*animation:\s*none/, 'execution work areas should keep the same height as GPU cards, while Vane uses data-flow motion instead of decorative container breathing')
assert.match(css, /\.tl-work-row\.legacy\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*34px\s*minmax\(0,\s*1fr\)[\s\S]*\.tl-work-row\.overlap\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/, 'legacy should show a visible feed gap while Vane shows three overlapped work blocks')
assert.match(css, /\.tl-hold-status i\s*\{[\s\S]*width:\s*100%[\s\S]*\.tl-hold-status i span\s*\{[\s\S]*transform:\s*scaleX\(0\)[\s\S]*animation:\s*tlWaitBar 9s ease-in-out infinite[\s\S]*\.tl-gap-dots i\s*\{[\s\S]*animation:\s*tlWaitDots 3\.4s ease-in-out infinite/, 'legacy wait bar should use a slower full-width track with an animated 0-to-1 fill')
assert.doesNotMatch(css, /\.tl-work-card::before|\.tl-work-row\.overlap::before|\.tl-schedule-flow::before|\.tl-schedule-flow::after/, 'decorative execution lines should stay removed from work cards and the Vane flow layer')
assert.match(css, /\.tl-schedule-flow\s*\{[\s\S]*top:\s*50%[\s\S]*height:\s*66px[\s\S]*\.tl-schedule-flow i\s*\{[\s\S]*left:\s*-4%[\s\S]*animation:\s*tlStreamPacket 1\.16s linear infinite[\s\S]*\.tl-schedule-flow i\.stream-d\s*\{[\s\S]*--tl-stream-delay:\s*-0\.87s/, 'Vane should use fast left-to-right stream packets without drawing extra guide lines')
assert.match(css, /\.tl-work-card\.batch i\s*\{[\s\S]*animation:\s*tlBatchPulse 2\.25s ease-in-out infinite/, 'Vane dynamic batching should pulse at the scheduling-flow cadence')
assert.match(css, /\.tl-gpu-card\s*\{[\s\S]*animation:\s*tlGpuCardBreath 7\.2s ease-in-out infinite[\s\S]*\.tl-gpu-card\.legacy[\s\S]*--tl-gpu-breath:[\s\S]*\.tl-gpu-card\.vane[\s\S]*--tl-gpu-breath:\s*rgba\(79,138,96,0\.28\)[\s\S]*animation-duration:\s*4\.8s/, 'Vane FULL GPU card should breathe more visibly without changing layout')
assert.match(css, /\.tl-gpu-card\.legacy \.tl-gpu-bars i\s*\{[\s\S]*animation:\s*tlLegacyGpuBars 4\.8s ease-in-out infinite[\s\S]*\.tl-gpu-card\.vane \.tl-gpu-bars i\s*\{[\s\S]*animation:\s*tlVaneGpuBars 1\.8s ease-in-out infinite/, 'GPU bars should show slow legacy idle motion and faster full Vane utilization')
assert.match(css, /@keyframes tlStageBreath[\s\S]*@keyframes tlGpuCardBreath[\s\S]*@keyframes tlLegacyGpuBars[\s\S]*@keyframes tlVaneGpuBars[\s\S]*@keyframes tlWaitBar[\s\S]*@keyframes tlWaitDots[\s\S]*@keyframes tlBatchPulse[\s\S]*@keyframes tlStreamPacket/, 'execution timeline breathing, utilization, and scheduling-flow keyframes should be defined')
assert.match(css, /@keyframes tlWaitBar[\s\S]*0%\s*\{[\s\S]*transform:\s*scaleX\(0\)[\s\S]*72%, 100%\s*\{[\s\S]*transform:\s*scaleX\(1\)/, 'legacy full-clip progress should animate from zero to complete')
assert.doesNotMatch(executionCss, /background-size:|linear-gradient\(var\(--line-2\)|linear-gradient\(90deg/, 'execution boxes should not use a dense grid background')
assert.doesNotMatch(execMainCss, /background-size:|radial-gradient|linear-gradient/, 'execution work areas should avoid decorative grid backgrounds')
assert.doesNotMatch(css, /\.tl-tags|\.tl-tag|\.tl-gpu\s*\{/, 'redundant tag rows and header GPU badges should stay removed')
assert.doesNotMatch(css, /\.tl-segment|\.tl-segments|\.tl-graph|\.tl-graph-canvas|\.tl-graph-links|\.tl-graph-input|\.tl-graph-node|\.tl-queue|\.tl-occupancy|\.tl-runtime|\.tl-wait(?!Bar|Dots)|\.tl-compute|\.tl-batch|\.tl-exec-rail/, 'the comparison should not return to generic segment blocks, duplicate DAG internals, or the old execution rail')
assert.doesNotMatch(css, /--legacy-node-decode-left|--hero-top|--ledger-top|--comparison-margin-top|offset-path|@keyframes occupancyAlongPath|\.factory-stage-scroll/, 'the old coordinate + motion system is removed')
assert.doesNotMatch(css, /\.tdfa-/, 'training data factory should not use the simplified replacement layout')
assert.doesNotMatch(component, /Autonomous driving data factory|Raw driving multimodal data → model-ready training assets|className="headline"|factory-eyebrow|Data factory animation|message-strip|Queue buildup → steady pipeline occupancy|Stage wait → streaming frames|Idle GPU → balanced pipeline|Ready for training, eval, and replay|large sensor frames stop blocking downstream stages|downstream starts before the full clip finishes|CPU decode and GPU inference stay overlapped/, 'training data factory should remove the internal stage copy, old section label, and bottom message copy')
assert.doesNotMatch(css, /\.training-data-factory \.headline|\.training-data-factory \.factory-eyebrow|--eyebrow-left|--eyebrow-top|--eyebrow-font-size|--headline-left|--headline-top|--headline-font-size|--headline-max-width|message-strip|@keyframes msg[1-4]/, 'training data factory styles should remove headline, label, and message-strip-only CSS')

assert.doesNotMatch(page, /Training-data pipelines for autonomous driving & physical AI|Autonomous driving data pipelines for drive logs|Use Case · Autonomous Driving \/ Physical AI|From PB-scale drive logs to training-ready datasets|From drive logs to training-ready dataset releases|Bring your data mix and your bill|perception-xl|It is not a drive-log workload|It is not a drive-log benchmark|cut your auto-label GPU bill|drive-log selection, decode, alignment|drive_release\.py/, 'training page should not include superseded training copy')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
