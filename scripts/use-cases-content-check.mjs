import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/UseCases.tsx'
const dataPath = 'src/pages/useCasesData.ts'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)
assert.ok(existsSync(dataPath), `${dataPath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const data = readFileSync(dataPath, 'utf8')

function stripHighlighting(code) {
  return code.replace(/<[^>]*>/g, '')
}

function extractUseCaseCode(id) {
  const records = [...data.matchAll(/^\s*id:\s*'([^']+)'/gm)]
  const index = records.findIndex((record) => record[1] === id)
  assert.notEqual(index, -1, `useCasesData should define ${id}`)
  const start = records[index].index
  const end = records[index + 1]?.index ?? data.length
  const block = data.slice(start, end)
  const code = block.match(/code:\s*`([\s\S]*?)`,\s*\n\s*}/)?.[1] ?? ''
  assert.ok(code, `${id} should define a code sample`)
  return stripHighlighting(code)
}

const useCaseCode = Object.fromEntries(
  ['embeddings', 'search', 'dedupe', 'images', 'imagegen', 'multimodal', 'voice'].map((id) => [id, extractUseCaseCode(id)]),
)

const mustIncludeInPage = [
  'AI pipeline use cases — Vane',
  'Explore Vane use cases for multimodal AI pipelines: embeddings, semantic search, deduplication, image pipelines, generation, structured multimodal output, and voice analytics.',
  'Real AI pipeline examples for embeddings, search, deduplication, images, generation, multimodal structured output, and voice analytics.',
  'AI pipelines Vane is built for',
  'Real user scenarios, not just examples.',
  'Web Text to Embeddings',
  'Semantic Search',
  'Text Deduplication',
  'Image Pipelines',
  'Image Generation',
  'Multimodal Structured Output',
  'Voice AI Analytics',
  'Vane AI 工作流用例',
  'Vane 适合哪些 AI 工作流',
  '常见生产场景示例，每个用例都说明问题、流水线、代码、输入输出和适用时机。',
  '查看 Vane 支撑的多模态 AI 工作流用例：embeddings、语义检索、去重、图像处理、批量生成、结构化抽取和语音分析。',
  '要把网页级抓取数据变成可检索语料，通常不能靠临时脚本拼 SQL、分块、GPU embedding 和 Parquet 写出。',
  '语义搜索',
  '语音 AI 分析',
]

for (const text of mustIncludeInPage) {
  assert.match(page + data, new RegExp(escapeRegExp(text)), `${pagePath} / ${dataPath} should include "${text}"`)
}

assert.match(page, /import Head from '@docusaurus\/Head'/, 'UseCases page should import Head')
assert.match(page, /<Head>[\s\S]*<title>\{copy\.title\}<\/title>[\s\S]*<meta[\s\S]*content=\{copy\.description\}[\s\S]*<meta property="og:title" content=\{copy\.title\} \/>[\s\S]*<meta property="og:description" content=\{copy\.ogDescription\} \/>[\s\S]*<\/Head>/, 'UseCases page should render localized page metadata')
assert.doesNotMatch(page, /See all examples/, 'UseCases page should not render a See all examples CTA')
assert.doesNotMatch(data, /summary:\s*string/, 'UseCase type should not include the unused summary field')
assert.doesNotMatch(data, /^\s*summary:/m, 'Use case records should not carry unused summary values')

const useCaseIds = [...data.matchAll(/^\s*id:\s*'/gm)]
assert.equal(useCaseIds.length, 7, 'UseCases data should still define the seven existing use cases')

for (const id of ['embeddings', 'search', 'voice']) {
  assert.match(useCaseCode[id], /ai_embed\([\s\S]*struct_pack\(/, `${id} should lead with the SQL ai_embed expression`)
  assert.doesNotMatch(useCaseCode[id], /vane\.ai\.embed\(|\.embed_text\(/, `${id} should not make the Python embedding spelling primary`)
}
assert.match(useCaseCode.embeddings, /SELECT url, text,[\s\S]*ai_embed\([\s\S]*AS embedding[\s\S]*FROM chunks/i, 'web embedding should retain URL and text beside the SQL embedding')
assert.match(useCaseCode.search, /SELECT id, title, body,[\s\S]*ai_embed\([\s\S]*AS embedding[\s\S]*FROM read_parquet/i, 'semantic search should retain source fields in its SQL embedding projection')
assert.match(useCaseCode.voice, /SELECT id, transcript, summary,[\s\S]*ai_embed\([\s\S]*AS embedding[\s\S]*FROM transcribed/i, 'voice analytics should retain transcript fields beside the SQL embedding')

const searchRetrieval = useCaseCode.search.match(/hits\s*=\s*[\s\S]*$/)?.[0] ?? ''
assert.match(searchRetrieval, /hits\s*=\s*conn\.execute\(/, 'semantic search should use the public parameterized execute API for the query vector')
assert.match(searchRetrieval, /ORDER BY list_cosine_similarity\(embedding, \?::FLOAT\[\]\) DESC LIMIT 10/i, 'semantic search should order by DuckDB list cosine similarity with a typed placeholder')
assert.match(searchRetrieval, /,\s*\[q\]\s*\)\.fetchall\(\)/, 'semantic search should bind q as a parameter and fetch the results')
assert.doesNotMatch(searchRetrieval, /\$q|array_cosine_similarity|conn\.sql\(/, 'semantic search retrieval should not use an unbound named parameter, the wrong array function, or Relation SQL')

assert.match(useCaseCode.multimodal, /\.prompt\([\s\S]*image_columns=[\s\S]*return_format=/, 'Multimodal structured output should use the documented relation prompt surface')

for (const [id, callable] of [['images', 'DetectFeatures'], ['imagegen', 'Diffusion'], ['voice', 'Transcribe']]) {
  const actorCall = useCaseCode[id].match(new RegExp(`\\.map_batches\\(\\s*${callable},([\\s\\S]*?)\\)`))?.[0] ?? ''
  assert.match(actorCall, /execution_backend="ray_actor"/, `${id} ${callable} should explicitly use a Ray actor backend`)
  assert.match(actorCall, /gpus=1/, `${id} ${callable} should use the public gpus parameter`)
  assert.match(actorCall, /actor_number=[1-9]\d*/, `${id} ${callable} should declare a positive actor pool`)
}

for (const [id, code] of Object.entries(useCaseCode)) {
  assert.doesNotMatch(code, /num_gpus=/, `${id} should not use the stale num_gpus parameter`)
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
