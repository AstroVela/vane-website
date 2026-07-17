import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/UseCases.tsx'
const dataPath = 'src/pages/useCasesData.ts'
const siteLinksPath = 'src/siteLinks.ts'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)
assert.ok(existsSync(dataPath), `${dataPath} should exist`)
assert.ok(existsSync(siteLinksPath), `${siteLinksPath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const data = readFileSync(dataPath, 'utf8')
const siteLinks = readFileSync(siteLinksPath, 'utf8')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripHighlighting(code) {
  return code.replace(/<[^>]*>/g, '')
}

function extractUseCase(id) {
  const records = [...data.matchAll(/^\s*id:\s*'([^']+)'/gm)]
  const index = records.findIndex((record) => record[1] === id)
  assert.notEqual(index, -1, `useCasesData should define ${id}`)
  const start = records[index].index
  const end = records[index + 1]?.index ?? data.length
  const block = data.slice(start, end)
  const code = block.match(/code:\s*`([\s\S]*?)`,\s*\n\s*}/)?.[1] ?? ''
  assert.ok(code, `${id} should define a code sample`)
  return { block, code: stripHighlighting(code) }
}

const mustIncludeInPage = [
  'AI pipeline use cases — Vane',
  'Explore Vane use cases for multimodal AI pipelines: embeddings, semantic search, deduplication, image pipelines, generation, structured multimodal output, and voice analytics.',
  'AI pipelines Vane is built for',
  'Web Text to Embeddings',
  'Semantic Search',
  'Text Deduplication',
  'Image Pipelines',
  'Image Generation',
  'Multimodal Structured Output',
  'Voice AI Analytics',
  'Vane AI 工作流用例',
  'Vane 适合哪些 AI 工作流',
  '网页抓取记录需要经过解码、语言过滤、分块、嵌入和写出，同时保留稳定的来源 ID。',
  '语义搜索',
  '语音 AI 分析',
]

for (const text of mustIncludeInPage) {
  assert.match(page + data, new RegExp(escapeRegExp(text)), `${pagePath} / ${dataPath} should include "${text}"`)
}

assert.match(page, /import Head from '@docusaurus\/Head'/, 'UseCases page should import Head')
assert.match(page, /<Head>[\s\S]*<title>\{copy\.title\}<\/title>[\s\S]*content=\{copy\.description\}[\s\S]*<meta property="og:title" content=\{copy\.title\} \/>[\s\S]*<meta property="og:description" content=\{copy\.ogDescription\} \/>[\s\S]*<\/Head>/, 'UseCases page should render localized page metadata')
assert.match(page, /import \{ vaneSourceFileUrl \} from '\.\.\/siteLinks'/, 'UseCases page should import the canonical source URL helper')
assert.match(page, /<Button sm href=\{vaneSourceFileUrl\(u\.example\)\} target="_blank" rel="noreferrer" arrow>/, 'Open example should link to the rendered canonical script')
assert.doesNotMatch(page, /<Button sm to="\/docs" arrow>\{copy\.openExample\}<\/Button>/, 'Open example should not route to the generic docs entry')
assert.match(siteLinks, /vaneSourceFileUrl = \(path: string\) => `\$\{GITHUB_URL\}\/blob\/main\/\$\{path\}`/, 'Canonical source links should follow the public main branch')
assert.doesNotMatch(page, /See all examples/, 'UseCases page should not render a See all examples CTA')
assert.doesNotMatch(data, /summary:\s*string|^\s*summary:/m, 'Use cases should not carry an unused summary field')

const canonicalExamples = {
  embeddings: 'common_crawl.py',
  search: 'llms_red_pajamas.py',
  dedupe: 'minhash_dedupe.py',
  images: 'querying_images.py',
  imagegen: 'image_generation.py',
  multimodal: 'multimodal_structured_outputs.py',
  voice: 'voice_ai_analytics.py',
}

const useCaseIds = [...data.matchAll(/^\s*id:\s*'/gm)]
assert.equal(useCaseIds.length, Object.keys(canonicalExamples).length, 'UseCases data should define the seven canonical examples')

for (const [id, filename] of Object.entries(canonicalExamples)) {
  const { block, code } = extractUseCase(id)
  const examplePath = `examples/${filename}`
  assert.match(block, new RegExp(`filename: '${escapeRegExp(filename)}'`), `${id} should name its canonical script`)
  assert.match(block, new RegExp(`example: '${escapeRegExp(examplePath)}'`), `${id} should name its canonical script path`)
  assert.match(code, new RegExp(`python ${escapeRegExp(examplePath)}`), `${id} should show a copyable canonical command`)
  assert.doesNotMatch(code, /execution_backend|actor_number|vane\.configure|VANE_RUNNER|--runner|--execution-backend/, `${id} should rely on the default Ray runner and backend`)
}

for (const id of ['embeddings', 'search', 'dedupe', 'images', 'imagegen', 'voice']) {
  assert.doesNotMatch(extractUseCase(id).code, /--source|--limit/, `${id} should rely on the script's bounded defaults`)
}

for (const flowName of [
  'WARC rows',
  'LSH candidates',
  'AnalyzeRedRegionsBatch',
  'GenerateImageFromTextBatch',
  'VLM with image',
  'subtitle rows',
]) {
  assert.match(data, new RegExp(escapeRegExp(flowName)), `UseCases data should describe the canonical ${flowName} flow`)
}

assert.doesNotMatch(
  data,
  /ai_embed\(|DetectFeatures|\bDiffusion\b|flat_map|execution_backend|actor_number|vane\.configure\(|VANE_RUNNER/,
  'UseCases data should not reintroduce APIs or execution overrides that are absent from the canonical scripts',
)

console.log('Solutions content check passed.')
