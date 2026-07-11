import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')
const stripTags = (value) => value.replace(/<[^>]+>/g, '')

const markdownLines = (source) => {
  const lines = []
  let offset = 0
  let inFence = false

  for (const rawLine of source.split('\n')) {
    const text = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine

    if (/^\s*```/.test(text)) {
      inFence = !inFence
    } else if (!inFence) {
      lines.push({ text, offset })
    }

    offset += rawLine.length + 1
  }

  return lines
}

const fencedCodeBlocks = (source) => {
  const blocks = []
  let current = null

  for (const rawLine of source.split('\n')) {
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine
    if (/^\s*```/.test(line)) {
      if (current) {
        current.push(line)
        blocks.push(current.join('\n'))
        current = null
      } else {
        current = [line]
      }
    } else if (current) {
      current.push(line)
    }
  }

  assert.equal(current, null, 'unclosed fenced code block')
  return blocks
}

const exactLineIndex = (source, line, from = 0) =>
  markdownLines(source).find(({ text, offset }) => text === line && offset >= from)?.offset ?? -1

const assertOrdered = (source, labels, message) => {
  let cursor = -1

  for (const label of labels) {
    const next = exactLineIndex(source, label, cursor + 1)
    assert.ok(next > cursor, `${message}: expected exact line ${label} after the previous item`)
    cursor = next
  }
}

const section = (source, heading, nextHeading) => {
  const start = exactLineIndex(source, heading)
  assert.notEqual(start, -1, `missing exact section heading ${heading}`)
  const end = nextHeading ? exactLineIndex(source, nextHeading, start + heading.length) : source.length
  assert.ok(end > start, `invalid section boundary for ${heading}`)
  return source.slice(start, end)
}

const assertReferenceIntroduction = (source, firstHeading, requirements, message) => {
  const end = exactLineIndex(source, firstHeading)
  assert.notEqual(end, -1, `${message}: missing exact first heading ${firstHeading}`)
  const introduction = source.slice(0, end)

  for (const requirement of requirements) {
    assert.ok(
      introduction.includes(requirement),
      `${message}: introduction should include exact text ${requirement}`,
    )
  }
}

const assertEntryTemplate = (source, entries, labels, message) => {
  const expectedHeadings = entries.map((entry) => `#### \`${entry}\``)
  const actualHeadings = markdownLines(source)
    .map(({ text }) => text)
    .filter((line) => /^#### /.test(line))
  assert.deepEqual(actualHeadings, expectedHeadings, `${message}: expected exact level-four entry headings`)

  entries.forEach((entry, index) => {
    const next = entries[index + 1]
    const body = section(source, `#### \`${entry}\``, next ? `#### \`${next}\`` : undefined)
    const actualLabels = markdownLines(body)
      .map(({ text }) => text)
      .filter((line) => /^\*\*[^*]+\*\*$/.test(line))
    assert.deepEqual(actualLabels, labels, `${message}: ${entry} should use the exact entry template`)
  })
}

const assertApiModels = (source, models, message) => {
  const actualModels = markdownLines(source)
    .map(({ text }) => text)
    .filter((line) => /^## [^#].*\bAPI\b/.test(line))
  assert.deepEqual(actualModels, models, `${message}: expected only the canonical top-level API models`)
}

const assertExactSignatures = (source, signatures, message) => {
  for (const signature of signatures) {
    assert.match(source, new RegExp(escapeRegExp(signature)), `${message} should include exact signature ${signature}`)
  }
}

const assertExampleSetup = (source, entry, next, setupPattern, message) => {
  const body = section(source, `#### \`${entry}\``, next ? `#### \`${next}\`` : undefined)
  assert.match(
    body,
    /\*\*Minimal example\*\*[\s\S]*```python\nimport vane[\s\S]*con = vane\.connect\(\)/,
    `${message} should define imports and a connection in its minimal example`,
  )
  assert.match(body, setupPattern, `${message} should define and preserve the setup its example uses`)
}

const assertNoInternalSymbols = (source, message) => {
  assert.doesNotMatch(source, /vane\.function\b/, `${message} should use the final vane.func name`)
  assert.doesNotMatch(
    source,
    /_duckdb|_create_vane_|expression_udf=true/,
    `${message} should not expose internal protocol symbols`,
  )
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
const overviewZh = read('i18n/zh-CN/docusaurus-plugin-content-docs-data/current/index.mdx')
const registry = read('src/docs/registry.ts')
const sidebar = read('src/docs/sidebar.data.json')
const localeLabels = read('i18n/zh-CN/docusaurus-plugin-content-docs-data/current.json')
const packageJson = read('package.json')

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
const aiSqlEntries = ['ai_prompt', 'ai_embed']
const aiPythonEntries = ['vane.ai.prompt', 'vane.ai.embed']
const aiRelationEntries = ['rel.prompt', 'rel.embed_text', 'rel.classify_text']
const aiExactSignatures = [
  'ai_prompt(messages VARCHAR [, options CONSTANT]) -> VARCHAR',
  'ai_embed(text VARCHAR [, options CONSTANT]) -> FLOAT[] | FLOAT[N]',
  'vane.ai.prompt(messages, *, provider="openai", model=None, provider_options=None, prompt_options=None, system_message=None) -> Expression',
  'vane.ai.embed(text, *, provider="openai", model=None, provider_options=None, embedding_options=None, dimensions=None, normalize=None) -> Expression',
  'rel.prompt(column, *, image_columns=None, provider="openai", model=None, provider_options=None, prompt_options=None, system_message=None, return_format=None, use_chat_completions=True, output_column="response", execution_backend=None, **options) -> Relation',
  'rel.embed_text(column, *, provider=None, model=None, dimensions=None, output_column="embedding", max_chunk_chars=None, chunk_overlap_chars=200, execution_backend=None, **options) -> Relation',
  'rel.classify_text(column, *, labels, provider=None, model=None, output_column="label", execution_backend=None, **options) -> Relation',
]
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
const udfIntroductionRequirements = [
  'public UDF signatures, parameters, returns, and call restrictions',
  'For complete tasks, use the [Custom Python UDFs Guide](/docs/data/guides/custom-python-udfs).',
  'For execution semantics and design reasons, see [UDF Concepts](/docs/data/concepts/udfs).',
]
const udfIntroductionRequirementsZh = [
  '公开 UDF 的签名、参数、返回值和调用限制',
  '完整任务请参阅[自定义 Python UDF 指南](/zh-CN/docs/data/guides/custom-python-udfs)',
  '执行语义和设计原因请参阅 [UDF 概念](/zh-CN/docs/data/concepts/udfs)',
]
const aiIntroductionRequirements = [
  'public AI Function signatures, parameters, returns, and call restrictions',
  'For complete tasks, use the [AI Functions Guide](/docs/data/guides/ai-functions).',
  'For execution semantics and design reasons, see [AI Function Concepts](/docs/data/concepts/ai-functions).',
  'Vane has two AI API models.',
]
const aiIntroductionRequirementsZh = [
  '公开 AI Function 的签名、参数、返回值和调用限制',
  '完整任务请参阅 [AI Function 指南](/zh-CN/docs/data/guides/ai-functions)',
  '执行语义和设计原因请参阅 [AI Function 概念](/zh-CN/docs/data/concepts/ai-functions)',
  'Vane 有两种 AI API 模型。',
]
const aiOptionContracts = [
  ['OpenAIProviderOptions', 'base_url=None, api_key=None, organization=None, timeout=None, concurrency=None, max_api_concurrency=None'],
  ['OpenAIPromptOptions', 'use_chat_completions=None, max_output_tokens=None, max_tokens=None, temperature=None, on_error=None'],
  ['OpenAIEmbeddingOptions', 'encoding_format="float", on_error=None'],
  ['AnthropicProviderOptions', 'api_key=None, base_url=None, timeout=None, max_retries=None, concurrency=None, max_api_concurrency=None'],
  ['AnthropicPromptOptions', 'max_tokens=None, temperature=None, top_p=None, top_k=None, stop_sequences=None, on_error=None'],
  ['GoogleProviderOptions', 'api_key=None, concurrency=None, max_api_concurrency=None'],
  ['GooglePromptOptions', 'max_output_tokens=None, temperature=None, top_p=None, top_k=None, on_error=None'],
  ['GoogleEmbeddingOptions', 'task_type=None, title=None, on_error=None'],
  ['VLLMProviderOptions', 'engine_args=None, concurrency=None, gpus_per_actor=None'],
  ['VLLMPromptOptions', 'generate_args=None, max_tokens=None, temperature=None, on_error=None'],
]

assert.throws(
  () => assertOrdered(
    '### Expression API\n## Relation API',
    ['## Expression API', '## Relation API'],
    'heading-level probe',
  ),
  /expected exact line/,
  'heading guards should reject a wrong heading level',
)
assert.throws(
  () => assertEntryTemplate(
    '#### `probe`\n**One**\n**Unexpected**\n**Two**',
    ['probe'],
    ['**One**', '**Two**'],
    'entry-template probe',
  ),
  /exact entry template/,
  'entry-template guards should reject extra bold-only labels',
)
assert.throws(
  () => assertApiModels(
    '## Expression API\n## SQL API\n## Relation API',
    ['## Expression API', '## Relation API'],
    'API-model probe',
  ),
  /canonical top-level API models/,
  'API-model guards should reject an extra top-level API model',
)
assert.throws(
  () => assertReferenceIntroduction(
    [
      'This Reference is lookup material for public UDF signatures, parameters, returns, and call restrictions.',
      '## Expression API',
      ...udfIntroductionRequirements.slice(1),
    ].join('\n'),
    '## Expression API',
    udfIntroductionRequirements,
    'reference-introduction probe',
  ),
  /introduction should include exact text/,
  'Reference role guards should reject Guide and Concept links that occur only after the introduction',
)
assert.throws(
  () => assertReferenceIntroduction(
    [
      'This Reference is lookup material for public AI Function signatures, parameters, returns, and call restrictions.',
      '## Expression API',
      ...aiIntroductionRequirements.slice(1),
    ].join('\n'),
    '## Expression API',
    aiIntroductionRequirements,
    'AI reference-introduction probe',
  ),
  /introduction should include exact text/,
  'AI Reference role guards should reject Guide and Concept links that occur only after the introduction',
)
assert.throws(
  () => assert.deepEqual(
    fencedCodeBlocks('```python\nvalue = 1\n```'),
    fencedCodeBlocks('```python\nvalue = 2\n```'),
    'bilingual API references should contain identical fenced code blocks',
  ),
  /identical fenced code blocks/,
  'bilingual code guards should reject a changed translated example',
)
assert.throws(
  () => assertExactSignatures(
    aiExactSignatures[4].replace('use_chat_completions=True', 'use_chat_completions=False'),
    [aiExactSignatures[4]],
    'signature mutation probe',
  ),
  /exact signature/,
  'signature guards should reject a changed Relation default',
)
assert.throws(
  () => assertExampleSetup(
    [
      '#### `ai_prompt`',
      '**Minimal example**',
      '```python',
      'import vane',
      'con = vane.connect()',
      'result = con.sql("SELECT messages, ai_prompt(messages) FROM prompt_source")',
      '```',
    ].join('\n'),
    'ai_prompt',
    undefined,
    /CREATE TEMP TABLE prompt_source[\s\S]*SELECT[\s\S]*document_id,[\s\S]*messages,[\s\S]*ai_prompt/,
    'stable-column mutation probe',
  ),
  /define and preserve/,
  'example guards should reject an SQL projection that drops its stable ID and source setup',
)
assert.throws(
  () => assertNoInternalSymbols('请调用 _duckdb 内部 builder', 'internal-symbol mutation probe'),
  /internal protocol symbols/,
  'internal-symbol guards should reject internal API exposure in translated prose',
)

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
assertApiModels(udfReference, ['## Expression API', '## Relation API'], 'UDF reference')
assertApiModels(udfReferenceZh, ['## Expression API', '## Relation API'], 'Chinese UDF reference')
assertOrdered(
  udfReference,
  ['### SQL Entry Point (Recommended)', '**Registered-object compatibility**', '#### `vane.attach_function`'],
  'UDF registered-object compatibility placement',
)
assertOrdered(
  udfReferenceZh,
  ['### SQL 入口（推荐）', '**注册对象兼容矩阵**', '#### `vane.attach_function`'],
  'Chinese UDF registered-object compatibility placement',
)
assert.equal(
  markdownLines(udfReference).filter(({ text }) => text === '**Registered-object compatibility**').length,
  1,
  'UDF reference should contain one shared registered-object compatibility block',
)
assert.equal(
  markdownLines(udfReferenceZh).filter(({ text }) => text === '**注册对象兼容矩阵**').length,
  1,
  'Chinese UDF reference should contain one shared registered-object compatibility block',
)
assert.doesNotMatch(udfReference, /three (parallel |complementary )?(APIs|API surfaces|surfaces)/i)
assert.doesNotMatch(udfReferenceZh, /三(?:个|种)(?:并列|平行|互补)?(?:的)?(?: API|API|接口|表面)/)

assertReferenceIntroduction(
  udfReference,
  '## Expression API',
  udfIntroductionRequirements,
  'UDF reference',
)
assertReferenceIntroduction(
  udfReferenceZh,
  '## Expression API',
  udfIntroductionRequirementsZh,
  'Chinese UDF reference',
)

for (const [source, name, sqlHeading, pythonHeading] of [
  [udfReference, 'UDF reference', '### SQL Entry Point (Recommended)', '### Python Entry Point'],
  [udfReferenceZh, 'Chinese UDF reference', '### SQL 入口（推荐）', '### Python 入口'],
]) {
  const sqlEntries = section(source, sqlHeading, pythonHeading)
  const registeredAliasEntry = section(
    sqlEntries,
    '#### `registered_alias(...args)`',
    '#### `vane.detach_function`',
  )
  assert.match(
    registeredAliasEntry,
    /10\.0::DOUBLE AS amount/,
    `${name} registered-alias example should type its DOUBLE input explicitly`,
  )
}

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

assertOrdered(
  aiReference,
  ['## Expression API', '### SQL Entry Point (Recommended)', '### Python Entry Point', '## Relation API'],
  'AI reference',
)
assertOrdered(
  aiReferenceZh,
  ['## Expression API', '### SQL 入口（推荐）', '### Python 入口', '## Relation API'],
  'Chinese AI reference',
)
assertApiModels(aiReference, ['## Expression API', '## Relation API'], 'AI reference')
assertApiModels(aiReferenceZh, ['## Expression API', '## Relation API'], 'Chinese AI reference')
assert.doesNotMatch(aiReference, /three (parallel |complementary )?(APIs|API surfaces|surfaces)/i)
assert.doesNotMatch(aiReferenceZh, /三(?:个|种)(?:并列|平行|互补)?(?:的)?(?: API|API|接口|表面)/)
assertReferenceIntroduction(
  aiReference,
  '## Expression API',
  aiIntroductionRequirements,
  'AI reference',
)
assertReferenceIntroduction(
  aiReferenceZh,
  '## Expression API',
  aiIntroductionRequirementsZh,
  'Chinese AI reference',
)
assertEntryTemplate(
  section(aiReference, '### SQL Entry Point (Recommended)', '### Python Entry Point'),
  aiSqlEntries,
  referenceLabels,
  'AI SQL entry point',
)
assertEntryTemplate(
  section(aiReference, '### Python Entry Point', '## Relation API'),
  aiPythonEntries,
  referenceLabels,
  'AI Python entry point',
)
assertEntryTemplate(
  section(aiReference, '## Relation API', '## Shared AI Types and Constraints'),
  aiRelationEntries,
  referenceLabels,
  'AI Relation API',
)
assertEntryTemplate(
  section(aiReferenceZh, '### SQL 入口（推荐）', '### Python 入口'),
  aiSqlEntries,
  referenceLabelsZh,
  'Chinese AI SQL entry point',
)
assertEntryTemplate(
  section(aiReferenceZh, '### Python 入口', '## Relation API'),
  aiPythonEntries,
  referenceLabelsZh,
  'Chinese AI Python entry point',
)
assertEntryTemplate(
  section(aiReferenceZh, '## Relation API', '## AI 共享类型与限制'),
  aiRelationEntries,
  referenceLabelsZh,
  'Chinese AI Relation API',
)
assert.deepEqual(
  fencedCodeBlocks(aiReferenceZh),
  fencedCodeBlocks(aiReference),
  'bilingual AI references should contain identical fenced code blocks',
)

assert.match(aiReference, /^---\ntitle: AI Function API Reference\n---/)
assert.match(aiReferenceZh, /^---\ntitle: AI Function API 参考\n---/)

for (const [source, name] of [
  [aiReference, 'AI reference'],
  [aiReferenceZh, 'Chinese AI reference'],
]) {
  assertOrdered(
    source,
    [
      '#### `ai_prompt`',
      '#### `ai_embed`',
      '#### `vane.ai.prompt`',
      '#### `vane.ai.embed`',
      '#### `rel.prompt`',
      '#### `rel.embed_text`',
      '#### `rel.classify_text`',
    ],
    `${name} API order`,
  )
  assertExactSignatures(source, aiExactSignatures, name)
}

const aiSqlSections = [
  section(aiReference, '### SQL Entry Point (Recommended)', '### Python Entry Point'),
  section(aiReferenceZh, '### SQL 入口（推荐）', '### Python 入口'),
]
for (const sqlSection of aiSqlSections) {
  assert.match(sqlSection, /1 or 2 arguments|1 或 2 个参数/, 'AI SQL entries should document their arity')
  assert.match(sqlSection, /foldable constant/, 'AI SQL entries should require foldable constant options')
  assert.match(sqlSection, /constant `STRUCT`/, 'AI SQL entries should identify the constant STRUCT shape')
  assert.match(sqlSection, /bound once|只绑定一次/, 'AI SQL entries should reject row-varying options')
  assert.match(sqlSection, /SELECT projection/, 'AI SQL entries should document projection-only placement')
  assert.match(sqlSection, /recursively rejects|递归拒绝/, 'AI SQL entries should document recursive credential rejection')
  assert.match(sqlSection, /worker environment variable|worker 环境变量/, 'AI SQL entries should route credentials through worker environment variables')
  for (const option of [
    'actor_number',
    'batch_size',
    'max_retries',
    'max_api_concurrency',
    'num_gpus',
    'gpus_per_actor',
    'on_error',
    'engine_args_json',
    'generate_args_json',
  ]) {
    assert.match(sqlSection, new RegExp(option), `AI SQL entries should document ${option}`)
  }
  assert.match(sqlSection, /Decimal/, 'AI SQL entries should document Decimal normalization')
  assert.match(sqlSection, /non-finite/, 'AI SQL entries should reject non-finite numeric options')
}

for (const [entry, next, setupPattern] of [
  ['ai_prompt', 'ai_embed', /CREATE TEMP TABLE prompt_source[\s\S]*SELECT[\s\S]*document_id,[\s\S]*messages,[\s\S]*ai_prompt/],
  ['ai_embed', 'vane.ai.prompt', /CREATE TEMP TABLE embedding_source[\s\S]*SELECT[\s\S]*document_id,[\s\S]*text,[\s\S]*ai_embed/],
  ['vane.ai.prompt', 'vane.ai.embed', /rel = con\.sql[\s\S]*vane\.col\("document_id"\)[\s\S]*vane\.col\("messages"\)[\s\S]*vane\.ai\.prompt/],
  ['vane.ai.embed', 'rel.prompt', /rel = con\.sql[\s\S]*vane\.col\("document_id"\)[\s\S]*vane\.col\("text"\)[\s\S]*vane\.ai\.embed/],
  ['rel.prompt', 'rel.embed_text', /class Decision\(BaseModel\):[\s\S]*rel = con\.sql[\s\S]*return_format=Decision/],
  ['rel.embed_text', 'rel.classify_text', /rel = con\.sql[\s\S]*rel\.embed_text/],
  ['rel.classify_text', undefined, /rel = con\.sql[\s\S]*rel\.classify_text/],
]) {
  assertExampleSetup(aiReference, entry, next, setupPattern, entry)
}
assert.doesNotMatch(
  section(aiReference, '### SQL Entry Point (Recommended)', '### Python Entry Point'),
  /api_key\s*:=|token\s*:=|password\s*:=|secret\s*:=|authorization\s*:=/i,
  'AI SQL examples should not contain credentials',
)

const relationPromptSections = [
  section(aiReference, '#### `rel.prompt`', '#### `rel.embed_text`'),
  section(aiReferenceZh, '#### `rel.prompt`', '#### `rel.embed_text`'),
]
for (const promptSection of relationPromptSections) {
  for (const capability of ['return_format', 'image_columns', 'output_column', 'use_chat_completions', 'execution_backend']) {
    assert.match(promptSection, new RegExp(capability), `rel.prompt should document ${capability}`)
  }
}

for (const [source, name, sharedHeading] of [
  [aiReference, 'AI reference', '## Shared AI Types and Constraints'],
  [aiReferenceZh, 'Chinese AI reference', '## AI 共享类型与限制'],
]) {
  const shared = section(source, sharedHeading)
  for (const [type, fields] of aiOptionContracts) {
    assert.ok(
      shared.includes(`| \`${type}\` | \`${fields}\` |`),
      `${name} should document exact public fields/defaults for ${type}`,
    )
  }
  assert.match(shared, /provider descriptor/, `${name} should document provider descriptors`)
  assert.match(shared, /active runner/, `${name} should document active-runner backend resolution`)
  assert.match(shared, /not exactly-once|不提供 exactly-once/, `${name} should document non-exactly-once external effects`)
  assert.match(shared, /Ray[\s\S]*(GPU resource|GPU 资源)/, `${name} should document Ray GPU resource requests`)
  assert.match(shared, /local subprocess[\s\S]*(no GPU reservation|GPU reservation)/, `${name} should document local GPU non-reservation`)
}

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
assert.match(overview, /\[UDF API Reference\]\(\/docs\/data\/reference\/udf-api\)/, 'Docs overview should use the final UDF reference title')
assert.match(overview, /\[AI Function API Reference\]\(\/docs\/data\/reference\/ai-api\)/, 'Docs overview should use the final AI reference title')
assert.match(overviewZh, /\[UDF API 参考\]\(\/zh-CN\/docs\/data\/reference\/udf-api\)/, 'Chinese Docs overview should use the final UDF reference title')
assert.match(overviewZh, /\[AI Function API 参考\]\(\/zh-CN\/docs\/data\/reference\/ai-api\)/, 'Chinese Docs overview should use the final AI reference title')
assert.match(registry, /'reference\/udf-api'[\s\S]*'reference\/ai-api'/, 'Docs registry should include both references')
assert.match(registry, /'reference\/ai-api':\s*{[\s\S]*?title:\s*'AI Function API Reference',[\s\S]*?titleZh:\s*'AI Function API 参考'/, 'Docs registry should use the final bilingual AI reference titles')
assert.match(registry, /Reference:\s*'API 参考'/, 'Custom docs UI should localize the Reference group')
assert.match(sidebar, /"group": "Reference"[\s\S]*"reference\/udf-api"[\s\S]*"reference\/ai-api"/, 'Sidebar should include the Reference group')
assert.match(localeLabels, /category\.Reference[\s\S]*API 参考/, 'Docusaurus locale labels should translate the Reference group')
assert.match(packageJson, /"udf-ai-v2:content:check": "node scripts\/udf-ai-v2-content-check\.mjs"/, 'package scripts should register the UDF/AI v2 content check')

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
for (const [source, name] of [
  [aiReference, 'AI reference'],
  [aiReferenceZh, 'Chinese AI reference'],
]) {
  assertNoInternalSymbols(source, name)
}

console.log('UDF/AI API v2 content contract passed.')

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
