import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/UseCases.tsx'
const dataPath = 'src/pages/useCasesData.ts'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)
assert.ok(existsSync(dataPath), `${dataPath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const data = readFileSync(dataPath, 'utf8')

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

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
