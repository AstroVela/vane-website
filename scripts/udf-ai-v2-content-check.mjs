import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')
const stripTags = (value) => value.replace(/<[^>]+>/g, '')

const assertOrdered = (source, labels, message) => {
  let cursor = -1

  for (const label of labels) {
    const next = source.indexOf(label, cursor + 1)
    assert.ok(next > cursor, `${message}: expected ${label} after the previous item`)
    cursor = next
  }
}

const section = (source, heading, nextHeading) => {
  const start = source.indexOf(heading)
  assert.notEqual(start, -1, `missing section ${heading}`)
  const end = nextHeading ? source.indexOf(nextHeading, start + heading.length) : source.length
  assert.ok(end > start, `invalid section boundary for ${heading}`)
  return source.slice(start, end)
}

const assertEntryTemplate = (source, entries, labels, message) => {
  entries.forEach((entry, index) => {
    const next = entries[index + 1]
    const body = section(source, `#### \`${entry}\``, next ? `#### \`${next}\`` : undefined)
    assertOrdered(body, labels, `${message}: ${entry}`)
  })
}

const paths = {
  udfReference: 'docs/data/reference/udf-api.mdx',
  aiReference: 'docs/data/reference/ai-api.mdx',
  udfReferenceZh: 'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/reference/udf-api.mdx',
  aiReferenceZh: 'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/reference/ai-api.mdx',
}

for (const path of Object.values(paths)) {
  assert.ok(existsSync(path), `${path} should exist`)
}

const udfReference = read(paths.udfReference)
const aiReference = read(paths.aiReference)
const udfReferenceZh = read(paths.udfReferenceZh)
const aiReferenceZh = read(paths.aiReferenceZh)
const udfConcept = read('docs/data/concepts/udfs.mdx')
const aiConcept = read('docs/data/concepts/ai-functions.mdx')
const architecture = read('docs/data/concepts/architecture.mdx')
const executionModel = read('docs/data/concepts/execution-model.mdx')
const sqlVsPython = read('docs/data/concepts/sql-vs-python.mdx')
const customUdfs = read('docs/data/guides/custom-python-udfs.mdx')
const aiGuide = read('docs/data/guides/ai-functions.mdx')
const embeddingsGuide = read('docs/data/guides/embeddings-at-scale.mdx')
const gpuGuide = read('docs/data/guides/gpu-inference.mdx')
const quickstart = read('docs/data/quickstart/quickstart.mdx')
const overview = read('docs/data/index.mdx')
const registry = read('src/docs/registry.ts')
const sidebar = read('src/docs/sidebar.data.json')
const localeLabels = read('i18n/zh-CN/docusaurus-plugin-content-docs-data/current.json')

const publicApiCorpus = [
  udfReference,
  aiReference,
  udfConcept,
  aiConcept,
  architecture,
  executionModel,
  sqlVsPython,
  customUdfs,
  aiGuide,
  embeddingsGuide,
  gpuGuide,
  quickstart,
].join('\n')

const udfSqlEntries = [
  'vane.attach_function',
  'registered_alias(...args)',
  'vane.detach_function',
]
const udfPythonEntries = [
  'vane.col',
  'vane.lit',
  'vane.sql_expr',
  'vane.func',
  'vane.func.batch',
  'vane.cls',
  'vane.cls.batch',
]
const udfRelationEntries = ['rel.map_batches', 'rel.flat_map', 'rel.map']
const referenceLabels = [
  '**Purpose**',
  '**Signature**',
  '**Parameters**',
  '**Returns**',
  '**Behavior and data contract**',
  '**Minimal example**',
  '**Restrictions and errors**',
  '**Related pages**',
]
const referenceLabelsZh = [
  '**用途**',
  '**签名**',
  '**参数**',
  '**返回值**',
  '**行为与数据契约**',
  '**最小示例**',
  '**限制与错误**',
  '**相关页面**',
]

assertOrdered(
  udfReference,
  ['## Expression API', '### SQL Entry Point (Recommended)', '### Python Entry Point', '## Relation API'],
  'UDF reference',
)
assertOrdered(
  udfReferenceZh,
  ['## Expression API', '### SQL 入口（推荐）', '### Python 入口', '## Relation API'],
  'Chinese UDF reference',
)
assert.doesNotMatch(udfReference, /three (parallel |complementary )?(APIs|API surfaces|surfaces)/i)
assert.doesNotMatch(udfReferenceZh, /三(?:个|种)(?:并列|平行|互补)?(?:的)?(?: API|API|接口|表面)/)

assert.match(
  udfReference,
  /signatures[\s\S]*parameters[\s\S]*returns[\s\S]*(?:restrictions|constraints)/i,
  'UDF reference should define its signature-and-restriction lookup role',
)
assert.match(
  udfReference,
  /(?:complete|end-to-end) tasks?[\s\S]*\/docs\/data\/guides\/custom-python-udfs/i,
  'UDF reference should link complete tasks to the Guide',
)
assert.match(
  udfReference,
  /(?:execution|design)[\s\S]*\/docs\/data\/concepts\/udfs/i,
  'UDF reference should link execution and design explanations to Concepts',
)
assert.match(
  udfReferenceZh,
  /签名[\s\S]*参数[\s\S]*返回值[\s\S]*(?:限制|约束)/,
  'Chinese UDF reference should define its signature-and-restriction lookup role',
)
assert.match(
  udfReferenceZh,
  /(?:完整|端到端)任务[\s\S]*\/zh-CN\/docs\/data\/guides\/custom-python-udfs/,
  'Chinese UDF reference should link complete tasks to the Guide',
)
assert.match(
  udfReferenceZh,
  /(?:执行|设计)[\s\S]*\/zh-CN\/docs\/data\/concepts\/udfs/,
  'Chinese UDF reference should link execution and design explanations to Concepts',
)

assertEntryTemplate(
  section(udfReference, '### SQL Entry Point (Recommended)', '### Python Entry Point'),
  udfSqlEntries,
  referenceLabels,
  'UDF SQL entry point',
)
assertEntryTemplate(
  section(udfReference, '### Python Entry Point', '## Relation API'),
  udfPythonEntries,
  referenceLabels,
  'UDF Python entry point',
)
assertEntryTemplate(
  section(udfReference, '## Relation API', '## Shared UDF Constraints'),
  udfRelationEntries,
  referenceLabels,
  'UDF Relation API',
)
assertEntryTemplate(
  section(udfReferenceZh, '### SQL 入口（推荐）', '### Python 入口'),
  udfSqlEntries,
  referenceLabelsZh,
  'Chinese UDF SQL entry point',
)
assertEntryTemplate(
  section(udfReferenceZh, '### Python 入口', '## Relation API'),
  udfPythonEntries,
  referenceLabelsZh,
  'Chinese UDF Python entry point',
)
assertEntryTemplate(
  section(udfReferenceZh, '## Relation API', '## UDF 共有限制'),
  udfRelationEntries,
  referenceLabelsZh,
  'Chinese UDF Relation API',
)

for (const name of [
  'vane.col',
  'vane.lit',
  'vane.sql_expr',
  'vane.func',
  'vane.func.batch',
  'vane.cls',
  'vane.cls.batch',
  'vane.attach_function',
  'vane.detach_function',
  'vane.ai.embed',
  'vane.ai.prompt',
  'ai_prompt',
  'ai_embed',
]) {
  assert.match(publicApiCorpus, new RegExp(escapeRegExp(name)), `public docs should include ${name}`)
}

for (const phrase of [
  'SELECT projection',
  'row_preserving=True',
  'actor_number=1',
  'query-scoped',
  'actor-local',
  'ephemeral',
  'not checkpointed',
  'not exactly-once',
]) {
  assert.match(udfReference, new RegExp(escapeRegExp(phrase)), `UDF reference should include "${phrase}"`)
}

assert.match(udfReference, /WHERE[\s\S]*GROUP BY[\s\S]*HAVING[\s\S]*CASE[\s\S]*COALESCE/, 'UDF reference should document unsupported expression positions')
assert.match(udfReference, /local subprocess[\s\S]*does not reserve[\s\S]*GPU/i, 'UDF reference should document local GPU non-reservation')
assert.match(aiReference, /return_format[\s\S]*image_columns[\s\S]*relation/i, 'AI reference should keep relation-only prompt capabilities explicit')
assert.match(aiReference, /foldable constant|constant `STRUCT`|constant options/i, 'AI reference should document constant SQL options')
assert.match(aiReference, /environment variable[\s\S]*(credential|API key)/i, 'AI reference should route SQL credentials through worker environment variables')
for (const type of ['OpenAIProviderOptions', 'GoogleProviderOptions', 'VLLMProviderOptions']) {
  assert.match(aiReference, new RegExp(type), `AI reference should document ${type}`)
}

assert.match(udfReferenceZh, /查询作用域[\s\S]*actor 内[\s\S]*(临时|非持久)/, 'Chinese UDF reference should explain the state scope')
assert.match(aiReferenceZh, /环境变量[\s\S]*(凭据|API key)/, 'Chinese AI reference should explain credential handling')

assert.doesNotMatch(udfConcept, /exposes three relation-level UDF APIs/i, 'UDF concept should not claim a relation-only API surface')
assert.doesNotMatch(aiConcept, /turn common model operations into relation methods/i, 'AI concept should not claim a relation-only API surface')
assert.doesNotMatch(aiGuide, /append_column\(/, 'AI guide should not default to manual Arrow recombination')
assert.doesNotMatch(quickstart, /append_column\(/, 'Quickstart should not default to manual Arrow recombination')
assert.match(aiGuide, /vane\.ai\.(embed|prompt)[\s\S]*\.alias\(/, 'AI guide should demonstrate expression projection')
assert.match(quickstart, /vane\.ai\.prompt[\s\S]*\.alias\("ai_review_note"\)/, 'Quickstart should preserve source columns with an AI expression')
assert.match(embeddingsGuide, /vane\.ai\.embed[\s\S]*vane\.col[\s\S]*\.alias\("embedding"\)/, 'Embedding guide should demonstrate expression embedding')

for (const [path, kind] of [
  ['docs/data/guides/multimodal-ingest.mdx', 'udf'],
  ['docs/data/guides/multimodal-pipeline.mdx', 'udf'],
  ['docs/data/guides/structured-transformation.mdx', 'udf'],
  ['docs/data/guides/performance-tuning.mdx', 'udf'],
  ['docs/data/deploy/single-node.mdx', 'udf'],
  ['docs/data/deploy/ray-cluster.mdx', 'udf'],
  ['docs/data/deploy/sizing.mdx', 'udf'],
  ['docs/data/quickstart/what-is-vane-data.mdx', 'udf'],
  ['docs/data/contributing/development.mdx', 'udf'],
]) {
  const source = read(path)
  assert.match(source, new RegExp(`/docs/data/reference/${kind}-api`), `${path} should link to the ${kind.toUpperCase()} API reference`)
}

assert.match(gpuGuide, /vane\.ai\.prompt[\s\S]*VLLMProviderOptions/, 'GPU guide should show expression-mode vLLM prompting')
assert.match(gpuGuide, /return_format[\s\S]*image_columns[\s\S]*relation/i, 'GPU guide should retain relation-mode guidance for advanced prompts')

assert.match(overview, /\/docs\/data\/reference\/udf-api/, 'Docs overview should link the UDF reference')
assert.match(overview, /\/docs\/data\/reference\/ai-api/, 'Docs overview should link the AI reference')
assert.match(registry, /'reference\/udf-api'[\s\S]*'reference\/ai-api'/, 'Docs registry should include both references')
assert.match(registry, /Reference:\s*'API 参考'/, 'Custom docs UI should localize the Reference group')
assert.match(sidebar, /"group": "Reference"[\s\S]*"reference\/udf-api"[\s\S]*"reference\/ai-api"/, 'Sidebar should include the Reference group')
assert.match(localeLabels, /category\.Reference[\s\S]*API 参考/, 'Docusaurus locale labels should translate the Reference group')

const home = stripTags(read('src/pages/Home.tsx'))
const enterprise = stripTags(read('src/pages/EnterpriseAgentUseCase.tsx'))
const training = stripTags(read('src/pages/TrainingUseCase.tsx'))
const useCases = stripTags(read('src/pages/useCasesData.ts'))

assert.match(home, /vane\.ai\.(prompt|embed)/, 'Homepage hero should use a real AI expression API')
assert.match(home, /vane\.col\(/, 'Homepage hero should use public expression helpers')
assert.doesNotMatch(home, /from vane\.ai import describe|vane\.read\(/, 'Homepage hero should reject fictional APIs')
assert.match(enterprise, /ai_prompt\(/, 'Enterprise use case should demonstrate SQL ai_prompt')
assert.doesNotMatch(enterprise, /append_column\(/, 'Enterprise use case should not manually recombine AI output')
assert.match(training, /vane\.ai\.embed|ai_embed\(/, 'Training use case should use the v2 embedding surface')
assert.match(useCases, /vane\.ai\.(embed|prompt)|ai_(embed|prompt)\(/, 'Use-case cards should include v2 AI APIs')

assert.doesNotMatch(publicApiCorpus, /vane\.function\b/, 'Public docs should use the final vane.func name')
assert.doesNotMatch(publicApiCorpus, /_duckdb\._VaneUDF|_create_vane_|expression_udf=true/, 'Public docs should not expose internal protocol symbols')

console.log('UDF/AI API v2 content contract passed.')

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
