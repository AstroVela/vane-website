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

const sectionMatching = (source, headingPattern, nextHeadingPattern) => {
  const lines = markdownLines(source)
  const start = lines.find(({ text }) => headingPattern.test(text))?.offset ?? -1
  assert.notEqual(start, -1, `missing section heading matching ${headingPattern}`)
  const end = nextHeadingPattern
    ? lines.find(({ text, offset }) => offset > start && nextHeadingPattern.test(text))?.offset
    : source.length
  assert.ok(end > start, `invalid section boundary for ${headingPattern}`)
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

const assertEntrySignatures = (
  source,
  entrySignatures,
  signatureLabel,
  parametersLabel,
  message,
) => {
  const entries = [...entrySignatures.keys()]

  entries.forEach((entry, index) => {
    const next = entries[index + 1]
    const body = section(source, `#### \`${entry}\``, next ? `#### \`${next}\`` : undefined)
    const signatureStart = exactLineIndex(body, signatureLabel)
    assert.notEqual(signatureStart, -1, `${message}: ${entry} should contain ${signatureLabel}`)
    const parametersStart = exactLineIndex(
      body,
      parametersLabel,
      signatureStart + signatureLabel.length,
    )
    assert.ok(
      parametersStart > signatureStart,
      `${message}: ${entry} should place ${parametersLabel} after ${signatureLabel}`,
    )

    const signatureRegion = body.slice(signatureStart + signatureLabel.length, parametersStart)
    const blocks = fencedCodeBlocks(signatureRegion)
    assert.equal(blocks.length, 1, `${message}: ${entry} should contain exactly one fenced signature`)
    const language = aiSqlEntries.includes(entry) ? 'sql' : 'python'
    const expected = `\`\`\`${language}\n${entrySignatures.get(entry)}\n\`\`\``
    assert.equal(blocks[0], expected, `${message}: ${entry} should contain its exact fenced signature`)
  })
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

const assertSubstringOrder = (source, values, message) => {
  let cursor = -1

  for (const value of values) {
    const next = source.indexOf(value, cursor + 1)
    assert.ok(next > cursor, `${message}: expected ${value} after the previous item`)
    cursor = next
  }
}

const assertConceptRole = (source, message) => {
  const lines = markdownLines(source)
  const headings = lines
    .map(({ text }) => text)
    .filter((line) => /^#{2,6} /.test(line))
  const catalogHeadings = headings.filter((heading) =>
    /(?:signatures?|parameter(?: catalog)?s?|option fields?|签名|参数(?:目录|清单)?|选项字段)/i.test(
      heading,
    ),
  )
  assert.deepEqual(
    catalogHeadings,
    [],
    `${message} should not contain signature or parameter-catalog headings`,
  )

  const numberedStepHeadings = headings.filter((heading) =>
    /^#{2,6}\s+(?:\d+[.)]\s+|Step\s+\d+\b|第\s*(?:\d+|[一二三四五六七八九十]+)\s*步|步骤\s*(?:\d+|[一二三四五六七八九十]+))/i.test(
      heading,
    ),
  )
  assert.deepEqual(
    numberedStepHeadings,
    [],
    `${message} should not contain a numbered step heading`,
  )

  const tutorialHeadingPattern =
    /^#{2,6}\s+.*(?:tutorial|walkthrough|step[- ]by[- ]step|workflow|教程|分步操作|完整流程|工作流|操作流程)/i
  const hasProceduralTutorial = lines.some(({ text }, index) => {
    if (!tutorialHeadingPattern.test(text)) return false

    const level = text.match(/^#+/)?.[0].length ?? 6
    const end = lines.findIndex(
      ({ text: candidate }, candidateIndex) =>
        candidateIndex > index &&
        /^#{2,6}\s+/.test(candidate) &&
        (candidate.match(/^#+/)?.[0].length ?? 6) <= level,
    )
    const sectionLines = lines.slice(index + 1, end === -1 ? undefined : end)
    return sectionLines.filter(({ text: line }) => /^\s*\d+[.)]\s+/.test(line)).length >= 3
  })
  assert.equal(
    hasProceduralTutorial,
    false,
    `${message} should not contain an end-to-end numbered tutorial`,
  )
}

const assertNoLegacyConceptClaims = (udfSource, aiSource, message) => {
  assert.doesNotMatch(
    udfSource,
    /(?:Vane(?: Data)?\s+exposes\s+three\s+relation-level\s+UDF APIs?|Vane Data\s*(?:暴露|提供)(?:了)?\s*三(?:个|种)\s*relation\s*级别的?\s*UDF API)/i,
    `${message} should reject the legacy three-relation UDF claim`,
  )
  assert.doesNotMatch(
    aiSource,
    /(?:AI Functions?\s+turn\s+common model operations into relation methods?|AI Function\s*(?:将|把)\s*常见模型操作\s*(?:封装|转换|变成)(?:为)?\s*relation\s*方法)/i,
    `${message} should reject the legacy relation-method AI claim`,
  )
}

const assertConceptRoleLinks = (
  source,
  referencePath,
  guidePath,
  referenceCue,
  guideCue,
  message,
) => {
  assert.match(
    source,
    new RegExp(`${referenceCue}[^\\n]*\\(${escapeRegExp(referencePath)}\\)`, 'i'),
    `${message} should send exact signatures to its matching Reference`,
  )
  assert.match(
    source,
    new RegExp(`${guideCue}[^\\n]*\\(${escapeRegExp(guidePath)}\\)`, 'i'),
    `${message} should send complete tasks to its matching Guide`,
  )
}

const assertConceptHeadingParity = (source, translatedSource, semantics, message) => {
  const headings = (value) =>
    markdownLines(value)
      .map(({ text }) => text)
      .filter((line) => /^#{2,3} /.test(line))

  const sourceHeadings = headings(source)
  const translatedHeadings = headings(translatedSource)
  assert.deepEqual(
    sourceHeadings.map((heading) => heading.match(/^#+/)?.[0].length),
    translatedHeadings.map((heading) => heading.match(/^#+/)?.[0].length),
    `${message} should use matching heading levels in both languages`,
  )

  let sourceCursor = -1
  let translatedCursor = -1
  for (const [token, sourcePattern, translatedPattern] of semantics) {
    const nextSource = sourceHeadings.findIndex(
      (heading, index) => index > sourceCursor && sourcePattern.test(heading),
    )
    const nextTranslated = translatedHeadings.findIndex(
      (heading, index) => index > translatedCursor && translatedPattern.test(heading),
    )
    assert.ok(nextSource > sourceCursor, `${message} should place ${token} in semantic order`)
    assert.ok(
      nextTranslated > translatedCursor,
      `${message} should place translated ${token} in semantic order`,
    )
    sourceCursor = nextSource
    translatedCursor = nextTranslated
  }
}

const assertConceptTokens = (source, requirements, message) => {
  for (const [pattern, description] of requirements) {
    assert.match(source, pattern, `${message} should ${description}`)
  }
}

const assertUdfConceptExampleOrder = (source, message) => {
  const blocks = fencedCodeBlocks(source)
  assert.ok(blocks.length >= 3, `${message} should contain the SQL, Python, and Relation snippets`)

  const sqlBlock = blocks[0]
  const relationBlock = blocks.at(-1)
  assert.match(sqlBlock, /```python\nimport vane\b/, `${message} SQL example should import vane`)
  assert.match(sqlBlock, /con = vane\.connect\(\)/, `${message} SQL example should define con`)
  assert.match(sqlBlock, /source = con\.sql\(/, `${message} SQL example should define source`)
  const callable = sqlBlock.match(/def ([a-z_]\w*)\([^)]*\):/)?.[1]
  const alias = sqlBlock.match(/alias="([a-z_]\w*)"/)?.[1]
  assert.ok(callable, `${message} SQL example should define its callable`)
  assert.ok(alias, `${message} SQL example should define its registered alias`)
  assertSubstringOrder(
    sqlBlock,
    [`def ${callable}`, 'vane.attach_function(', 'SELECT', `${alias}(text)`, 'vane.detach_function('],
    `${message} SQL-first UDF path`,
  )
  assert.match(
    sqlBlock,
    new RegExp(`vane\\.detach_function\\("${escapeRegExp(alias)}"`),
    `${message} SQL example should detach the alias it registered`,
  )
  const pythonPattern = new RegExp(`${escapeRegExp(callable)}\\(vane\\.col\\("text"\\)\\)`)
  const pythonIndex = blocks.findIndex((block, index) => index > 0 && pythonPattern.test(block))
  assert.ok(
    pythonIndex > 0 && pythonIndex < blocks.length - 1,
    `${message} should place its Python Expression example between SQL and Relation`,
  )
  assert.match(
    relationBlock,
    /source\.(?:map_batches|flat_map|map)\(/,
    `${message} final example should call the Relation API`,
  )
}

const assertAiConceptExampleOrder = (source, message) => {
  const blocks = fencedCodeBlocks(source)
  assert.ok(blocks.length >= 3, `${message} should contain the SQL, Python, and Relation snippets`)

  const sqlBlock = blocks[0]
  const relationBlock = blocks.at(-1)
  assert.match(sqlBlock, /```python\nimport vane\b/, `${message} SQL example should import vane`)
  assert.match(sqlBlock, /con = vane\.connect\(\)/, `${message} SQL example should define con`)
  assert.match(sqlBlock, /source = con\.sql\(/, `${message} SQL example should define source`)
  assert.match(
    sqlBlock,
    /SELECT[\s\S]*document_id,[\s\S]*prompt,[\s\S]*ai_(?:prompt|embed)\(/,
    `${message} first example should preserve stable source fields around a SQL AI call`,
  )
  assert.doesNotMatch(
    sqlBlock,
    /vane\.ai\.|\brel\.(?:prompt|embed_text|classify_text)\(/,
    `${message} first example should stay on the SQL Expression entry point`,
  )
  const pythonIndex = blocks.findIndex(
    (block, index) => index > 0 && /vane\.ai\.(?:prompt|embed)\(/.test(block),
  )
  assert.ok(
    pythonIndex > 0 && pythonIndex < blocks.length - 1,
    `${message} should place Python Expression AI between SQL and Relation`,
  )
  assert.match(
    relationBlock,
    /source\.(?:prompt|embed_text|classify_text)\(/,
    `${message} final example should use a Relation-only AI capability`,
  )
}

const paths = {
  udfReference: 'docs/data/reference/udf-api.mdx',
  aiReference: 'docs/data/reference/ai-api.mdx',
  udfReferenceZh: 'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/reference/udf-api.mdx',
  aiReferenceZh: 'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/reference/ai-api.mdx',
  udfConcept: 'docs/data/concepts/udfs.mdx',
  aiConcept: 'docs/data/concepts/ai-functions.mdx',
  udfConceptZh: 'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/udfs.mdx',
  aiConceptZh:
    'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/ai-functions.mdx',
}

for (const path of Object.values(paths)) {
  assert.ok(existsSync(path), `${path} should exist`)
}

const udfReference = read(paths.udfReference)
const aiReference = read(paths.aiReference)
const udfReferenceZh = read(paths.udfReferenceZh)
const aiReferenceZh = read(paths.aiReferenceZh)
const udfConcept = read(paths.udfConcept)
const aiConcept = read(paths.aiConcept)
const udfConceptZh = read(paths.udfConceptZh)
const aiConceptZh = read(paths.aiConceptZh)
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
const aiEntrySignatures = new Map([
  ['ai_prompt', 'ai_prompt(messages VARCHAR [, options CONSTANT]) -> VARCHAR'],
  ['ai_embed', 'ai_embed(text VARCHAR [, options CONSTANT]) -> FLOAT[] | FLOAT[N]'],
  ['vane.ai.prompt', 'vane.ai.prompt(messages, *, provider="openai", model=None, provider_options=None, prompt_options=None, system_message=None) -> Expression'],
  ['vane.ai.embed', 'vane.ai.embed(text, *, provider="openai", model=None, provider_options=None, embedding_options=None, dimensions=None, normalize=None) -> Expression'],
  ['rel.prompt', 'rel.prompt(column, *, image_columns=None, provider="openai", model=None, provider_options=None, prompt_options=None, system_message=None, return_format=None, use_chat_completions=True, output_column="response", execution_backend=None, **options) -> Relation'],
  ['rel.embed_text', 'rel.embed_text(column, *, provider=None, model=None, dimensions=None, output_column="embedding", max_chunk_chars=None, chunk_overlap_chars=200, execution_backend=None, **options) -> Relation'],
  ['rel.classify_text', 'rel.classify_text(column, *, labels, provider=None, model=None, output_column="label", execution_backend=None, **options) -> Relation'],
])
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
const aiSharedRuntimeRequirements = [
  'These values are framework fallbacks only when the selected provider descriptor supplies no value for that field.',
  'Provider defaults in the preceding table override these fallbacks.',
  'Each worker needs only the dependencies, model artifacts, network access, and credential environment variables required by the selected provider.',
  'The 30-second exponential-backoff cap and 120-second `Retry-After` cap apply to Vane wrapper retry/backoff.',
  'Provider SDK retry and backoff limits may differ.',
]
const aiSharedRuntimeRequirementsZh = [
  '这些值只是 framework fallback，仅在所选 provider descriptor 没有为对应字段提供值时使用。',
  '上表中的 Provider 默认值会覆盖这些 fallback。',
  '每个 worker 只需要所选 provider 实际要求的相应 dependency、model artifact、network access 和凭据环境变量。',
  '30 秒 exponential-backoff 上限和 120 秒 `Retry-After` 上限仅适用于 Vane wrapper retry/backoff。',
  'Provider SDK 的 retry 和 backoff 限制可能不同。',
]
const udfConceptHeadingSemantics = [
  ['Expression API', /^## .*Expression API/i, /^## .*Expression API/i],
  ['recommended SQL entry point', /^### .*SQL.*(?:Recommended|Default)/i, /^### .*SQL.*(?:推荐|默认)/],
  ['Python entry point', /^### .*Python/i, /^### .*Python/i],
  ['Relation API', /^## .*Relation API/i, /^## .*Relation API/i],
  ['shared planning and execution', /^## .*Planning.*Execution/i, /^## .*规划.*执行/],
  ['actor reuse and state', /^## .*Actor.*(?:State|Mutable)/i, /^## .*Actor.*状态/i],
  ['state, failure, and effects', /^## .*State.*Failure.*Effects/i, /^## .*状态.*失败.*副作用/],
  ['model choice', /^## .*Choosing.*Model/i, /^## .*选择.*模型/],
]
const aiConceptHeadingSemantics = [
  ['Expression API', /^## .*Expression API/i, /^## .*Expression API/i],
  ['recommended SQL entry point', /^### .*SQL.*(?:Recommended|Default)/i, /^### .*SQL.*(?:推荐|默认)/],
  ['Python entry point', /^### .*Python/i, /^### .*Python/i],
  ['Relation API', /^## .*Relation API/i, /^## .*Relation API/i],
  ['provider and runner lifecycle', /^## .*Provider.*Runner.*Lifecycle/i, /^## .*Provider.*Runner.*生命周期/i],
  ['credentials and effects', /^## .*Credentials.*Effects/i, /^## .*凭据.*副作用/],
  ['model choice', /^## .*Choosing.*Model/i, /^## .*选择.*模型/],
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
  () => assertEntrySignatures(
    [
      '#### `rel.prompt`',
      '**Signature**',
      '```python',
      aiEntrySignatures.get('rel.prompt').replace(
        'use_chat_completions=True',
        'use_chat_completions=False',
      ),
      '```',
      '**Parameters**',
      'The wrong signature is inside the entry.',
      '#### `unrelated`',
      '**Signature**',
      '```python',
      aiEntrySignatures.get('rel.prompt'),
      '```',
      '**Parameters**',
    ].join('\n'),
    new Map([['rel.prompt', aiEntrySignatures.get('rel.prompt')]]),
    '**Signature**',
    '**Parameters**',
    'entry-scoped signature mutation probe',
  ),
  /exact fenced signature/,
  'entry-scoped signature guards should reject a wrong Relation default even when the correct signature appears elsewhere',
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
assert.throws(
  () => assertConceptRole('## Parameters\n1. Configure\n2. Run', 'Concept-role probe'),
  /signature or parameter-catalog headings/,
  'Concept role guards should reject a parameter catalog',
)
assert.doesNotThrow(
  () => assertConceptRole('## Design Reasons\n1. Stable rows\n2. Explicit shape\n3. Clear failures', 'Concept-reasons probe'),
  'Concept role guards should allow a non-procedural ordered reasons list',
)
assert.throws(
  () => assertConceptRole('## End-to-End Tutorial\n1. Configure\n2. Run\n3. Write', 'Concept-tutorial probe'),
  /end-to-end numbered tutorial/,
  'Concept role guards should reject an ordered tutorial',
)
assert.throws(
  () => assertConceptRole('## 1. Register the alias', 'Concept-numeric-heading probe'),
  /numbered step heading/,
  'Concept role guards should reject a numeric step heading',
)
assert.throws(
  () => assertConceptRole('## Step 1: Register the alias', 'Concept-step-heading probe'),
  /numbered step heading/,
  'Concept role guards should reject an English numbered step heading',
)
assert.throws(
  () => assertConceptRole('## 第一步：注册 alias', 'Chinese Concept-step-heading probe'),
  /numbered step heading/,
  'Concept role guards should reject a Chinese numbered step heading',
)
assert.throws(
  () => assertNoLegacyConceptClaims(
    'Vane exposes three relation-level UDF APIs.',
    '',
    'English legacy UDF probe',
  ),
  /legacy three-relation UDF claim/,
  'Concept guards should reject the exact legacy English UDF claim',
)
assert.throws(
  () => assertNoLegacyConceptClaims(
    '',
    'AI Functions turn common model operations into relation methods.',
    'English legacy AI probe',
  ),
  /legacy relation-method AI claim/,
  'Concept guards should reject the exact legacy English AI claim',
)
assert.throws(
  () => assertNoLegacyConceptClaims(
    'Vane Data 暴露了三个 relation 级别的 UDF API。',
    '',
    'Chinese legacy UDF probe',
  ),
  /legacy three-relation UDF claim/,
  'Concept guards should reject the legacy Chinese UDF claim',
)
assert.throws(
  () => assertNoLegacyConceptClaims(
    '',
    'Vane Data AI Function 将常见模型操作封装为 relation 方法。',
    'Chinese legacy AI probe',
  ),
  /legacy relation-method AI claim/,
  'Concept guards should reject the legacy Chinese AI claim',
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

for (const [source, name, signatureLabel, parametersLabel] of [
  [aiReference, 'AI reference', '**Signature**', '**Parameters**'],
  [aiReferenceZh, 'Chinese AI reference', '**签名**', '**参数**'],
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
  assertEntrySignatures(source, aiEntrySignatures, signatureLabel, parametersLabel, name)
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

for (const [source, name, sharedHeading, runtimeRequirements] of [
  [aiReference, 'AI reference', '## Shared AI Types and Constraints', aiSharedRuntimeRequirements],
  [aiReferenceZh, 'Chinese AI reference', '## AI 共享类型与限制', aiSharedRuntimeRequirementsZh],
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
  for (const requirement of runtimeRequirements) {
    assert.ok(shared.includes(requirement), `${name} should include exact runtime qualification ${requirement}`)
  }
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

assertNoLegacyConceptClaims(udfConcept, aiConcept, 'English core Concepts')
assertNoLegacyConceptClaims(udfConceptZh, aiConceptZh, 'Chinese core Concepts')

assertConceptHeadingParity(
  udfConcept,
  udfConceptZh,
  udfConceptHeadingSemantics,
  'bilingual UDF Concepts',
)
assertConceptHeadingParity(
  aiConcept,
  aiConceptZh,
  aiConceptHeadingSemantics,
  'bilingual AI Function Concepts',
)

for (const [source, name, introPattern, defaultPattern, noDirectPattern, threeModelPattern] of [
  [
    udfConcept,
    'UDF Concepts',
    /two (?:semantic output|output|semantic) models[\s\S]*Expression API[\s\S]*Relation API[\s\S]*(?:not|rather than)[^\n]*(?:three|third)/i,
    /SQL[\s\S]*(?:recommended|default)[\s\S]*entry point/i,
    /(?:(?:no direct|does not (?:expose|provide)|is unavailable)[^\n]*SQL[^\n]*(?:Relation|table[- ]functions?)|SQL[^\n]*(?:Relation|table[- ]functions?)[^\n]*(?:unavailable|not (?:exposed|provided)))/i,
    /\bthree\s+(?:(?:parallel|peer|complementary|top-level)\s+)*(?:APIs?|API models?|API surfaces?|surfaces?)\b/i,
  ],
  [
    udfConceptZh,
    'Chinese UDF Concepts',
    /两种(?:语义输出|输出|语义)模型[\s\S]*Expression API[\s\S]*Relation API[\s\S]*(?:不是|并非|而非)[^\n]*三(?:个|种)/,
    /SQL[\s\S]*(?:推荐|默认)[\s\S]*入口/,
    /(?:(?:不提供|未提供|没有|不可用)[^\n]*SQL[^\n]*(?:Relation|table[- ]function)|SQL[^\n]*(?:Relation|table[- ]function)[^\n]*(?:不提供|未提供|不可用))/,
    /三(?:个|种)(?:(?:顶层|并列|平行|互补|同级)的?)?\s*(?:API(?:\s*模型|\s*入口|\s*表面)?|接口|入口|模型)/,
  ],
  [
    aiConcept,
    'AI Function Concepts',
    /two (?:semantic output|output|semantic) models[\s\S]*Expression API[\s\S]*Relation API[\s\S]*(?:not|rather than)[^\n]*(?:three|third)/i,
    /SQL[\s\S]*(?:recommended|default)[\s\S]*entry point/i,
    /(?:(?:no direct|does not (?:expose|provide)|is unavailable)[^\n]*SQL[^\n]*(?:Relation|table[- ]functions?)|SQL[^\n]*(?:Relation|table[- ]functions?)[^\n]*(?:unavailable|not (?:exposed|provided)))/i,
    /\bthree\s+(?:(?:parallel|peer|complementary|top-level)\s+)*(?:APIs?|API models?|API surfaces?|surfaces?)\b/i,
  ],
  [
    aiConceptZh,
    'Chinese AI Function Concepts',
    /两种(?:语义输出|输出|语义)模型[\s\S]*Expression API[\s\S]*Relation API[\s\S]*(?:不是|并非|而非)[^\n]*三(?:个|种)/,
    /SQL[\s\S]*(?:推荐|默认)[\s\S]*入口/,
    /(?:(?:不提供|未提供|没有|不可用)[^\n]*SQL[^\n]*(?:Relation|table[- ]function)|SQL[^\n]*(?:Relation|table[- ]function)[^\n]*(?:不提供|未提供|不可用))/,
    /三(?:个|种)(?:(?:顶层|并列|平行|互补|同级)的?)?\s*(?:API(?:\s*模型|\s*入口|\s*表面)?|接口|入口|模型)/,
  ],
]) {
  assertApiModels(source, ['## Expression API', '## Relation API'], name)
  assertConceptRole(source, name)
  const expressionStart = exactLineIndex(source, '## Expression API')
  assert.match(
    source.slice(0, expressionStart),
    introPattern,
    `${name} should open with the canonical two-model explanation`,
  )
  assert.match(
    section(source, '## Expression API', '## Relation API'),
    defaultPattern,
    `${name} should make SQL the recommended default inside Expression API`,
  )
  assert.match(
    source,
    noDirectPattern,
    `${name} should explicitly reject a direct SQL Relation or table-function API`,
  )
  const affirmativeClaims = source
    .split('\n')
    .filter((line) => !/(?:\b(?:does not|do not|not|no|rather than|without)\b|不是|并非|而非|不提供|未提供|没有)/i.test(line))
    .join('\n')
  assert.doesNotMatch(
    affirmativeClaims,
    threeModelPattern,
    `${name} should not describe three peer API models`,
  )
}

for (const [source, referencePath, guidePath, referenceCue, guideCue, name] of [
  [
    udfConcept,
    '/docs/data/reference/udf-api',
    '/docs/data/guides/custom-python-udfs',
    '(?:signatures?|parameters?|lookup facts?)',
    '(?:complete (?:task|workflow)|end-to-end workflow)',
    'UDF Concepts',
  ],
  [
    udfConceptZh,
    '/zh-CN/docs/data/reference/udf-api',
    '/zh-CN/docs/data/guides/custom-python-udfs',
    '(?:签名|参数|查阅信息)',
    '(?:完整任务|完整工作流|端到端工作流)',
    'Chinese UDF Concepts',
  ],
  [
    aiConcept,
    '/docs/data/reference/ai-api',
    '/docs/data/guides/ai-functions',
    '(?:signatures?|parameters?|lookup facts?)',
    '(?:complete (?:task|workflow)|end-to-end workflow)',
    'AI Function Concepts',
  ],
  [
    aiConceptZh,
    '/zh-CN/docs/data/reference/ai-api',
    '/zh-CN/docs/data/guides/ai-functions',
    '(?:签名|参数|查阅信息)',
    '(?:完整任务|完整工作流|端到端工作流)',
    'Chinese AI Function Concepts',
  ],
]) {
  assertConceptRoleLinks(
    source,
    referencePath,
    guidePath,
    referenceCue,
    guideCue,
    name,
  )
}

assertUdfConceptExampleOrder(udfConcept, 'UDF Concepts')
assertUdfConceptExampleOrder(udfConceptZh, 'Chinese UDF Concepts')
assertAiConceptExampleOrder(aiConcept, 'AI Function Concepts')
assertAiConceptExampleOrder(aiConceptZh, 'Chinese AI Function Concepts')
assert.deepEqual(
  fencedCodeBlocks(udfConceptZh),
  fencedCodeBlocks(udfConcept),
  'bilingual UDF Concepts should contain identical illustrative snippets',
)
assert.deepEqual(
  fencedCodeBlocks(aiConceptZh),
  fencedCodeBlocks(aiConcept),
  'bilingual AI Function Concepts should contain identical illustrative snippets',
)

const udfExpressionConcept = sectionMatching(udfConcept, /^## .*Expression API/i, /^## .*Relation API/i)
const udfRelationConcept = sectionMatching(udfConcept, /^## .*Relation API/i, /^## .*Planning.*Execution/i)
const udfReuseConcept = sectionMatching(udfConcept, /^## .*Actor.*(?:State|Mutable)/i, /^## .*State.*Failure.*Effects/i)
const udfStateConcept = sectionMatching(udfConcept, /^## .*State.*Failure.*Effects/i, /^## .*Choosing.*Model/i)
const udfExpressionConceptZh = sectionMatching(udfConceptZh, /^## .*Expression API/i, /^## .*Relation API/i)
const udfRelationConceptZh = sectionMatching(udfConceptZh, /^## .*Relation API/i, /^## .*规划.*执行/)
const udfReuseConceptZh = sectionMatching(udfConceptZh, /^## .*Actor.*状态/i, /^## .*状态.*失败.*副作用/)
const udfStateConceptZh = sectionMatching(udfConceptZh, /^## .*状态.*失败.*副作用/, /^## .*选择.*模型/)

assertConceptTokens(udfExpressionConcept, [
  [/`?SELECT`? projection/i, 'explain projection placement'],
  [/row-preserving/i, 'explain normal row preservation'],
  [/row_preserving=False/i, 'name the Python batch exception'],
  [/change cardinality/i, 'explain that the exception can change cardinality'],
  [/sole top-level projection/i, 'limit the exception to the sole top-level projection'],
  [/SQL aliases?/i, 'cover registered SQL aliases'],
  [/v1/i, 'scope SQL alias row preservation to v1'],
], 'UDF Expression concept')
assertConceptTokens(udfRelationConcept, [
  [/table-shaped/i, 'explain table-shaped output'],
  [/multi-column/i, 'explain multi-column output'],
  [/cardinality/i, 'explain cardinality change'],
  [/rel\.map_batches/i, 'name rel.map_batches'],
  [/rel\.flat_map/i, 'name rel.flat_map'],
  [/rel\.map\b/i, 'name rel.map'],
  [/row-wise scalar/i, 'describe rel.map as row-wise scalar'],
], 'UDF Relation concept')
assertConceptTokens(udfReuseConcept, [
  [/actor-backed/i, 'explain actor-backed reuse'],
  [/callable/i, 'identify callable reuse'],
  [/model/i, 'identify model reuse'],
  [/client/i, 'identify client reuse'],
  [/vane\.cls/i, 'contrast vane.cls'],
  [/(?:narrower|mutable-state)/i, 'identify the narrower mutable-state contract'],
], 'UDF actor-reuse concept')
assertConceptTokens(udfStateConcept, [
  [/query-scoped/i, 'scope state to the query'],
  [/actor-local/i, 'scope state to the actor'],
  [/ephemeral/i, 'mark state ephemeral'],
  [/checkpoint/i, 'reject checkpointing'],
  [/global state/i, 'reject global state'],
  [/keyed state/i, 'reject keyed state'],
  [/exactly-once/i, 'reject exactly-once semantics'],
  [/actor loss/i, 'explain actor loss'],
  [/query fail/i, 'explain query failure'],
  [/external effects/i, 'identify external effects'],
  [/not rolled back/i, 'reject transactional rollback'],
  [/no stable global row order/i, 'reject stable global row order'],
], 'UDF state and failure concept')
assert.match(udfConcept, /Arrow batches/i, 'UDF Concepts should explain Arrow batches')

assertConceptTokens(udfExpressionConceptZh, [
  [/`?SELECT`? projection/i, '解释 projection 位置'],
  [/(?:保持行数|row-preserving)/, '解释通常的行数保持语义'],
  [/row_preserving=False/, '指出 Python batch 例外'],
  [/(?:改变基数|改变行数)/, '说明例外可以改变基数'],
  [/(?:唯一|单独).*顶层 projection/, '限制例外只能作为唯一顶层 projection'],
  [/SQL alias/i, '涵盖注册的 SQL alias'],
  [/v1/i, '把 SQL alias 行数语义限定在 v1'],
], 'Chinese UDF Expression concept')
assertConceptTokens(udfRelationConceptZh, [
  [/(?:表形|表状)/, '解释表形输出'],
  [/多列/, '解释多列输出'],
  [/基数/, '解释基数变化'],
  [/rel\.map_batches/, '提及 rel.map_batches'],
  [/rel\.flat_map/, '提及 rel.flat_map'],
  [/rel\.map\b/, '提及 rel.map'],
  [/逐行 scalar/, '准确描述 rel.map'],
], 'Chinese UDF Relation concept')
assertConceptTokens(udfReuseConceptZh, [
  [/actor-backed/i, '解释 actor-backed 复用'],
  [/callable/i, '提及 callable 复用'],
  [/model/i, '提及 model 复用'],
  [/client/i, '提及 client 复用'],
  [/vane\.cls/i, '对比 vane.cls'],
  [/(?:更窄|可变状态)/, '指出更窄的可变状态契约'],
], 'Chinese UDF actor-reuse concept')
assertConceptTokens(udfStateConceptZh, [
  [/query-scoped/i, '限定 query scope'],
  [/actor-local/i, '限定 actor scope'],
  [/ephemeral/i, '说明状态是临时的'],
  [/checkpoint/i, '否定 checkpoint'],
  [/global state/i, '否定 global state'],
  [/keyed state/i, '否定 keyed state'],
  [/exactly-once/i, '否定 exactly-once'],
  [/actor 丢失/, '解释 actor 丢失'],
  [/query 失败/, '解释 query 失败'],
  [/外部副作用/, '指出外部副作用'],
  [/回滚/, '解释回滚边界'],
  [/没有稳定的全局行顺序/, '否定稳定的全局行顺序'],
], 'Chinese UDF state and failure concept')
assert.match(udfConceptZh, /Arrow batch/i, 'Chinese UDF Concepts should explain Arrow batches')

for (const [source, name, expressionPattern, relationPattern, lifecyclePattern, effectsPattern, requirements] of [
  [aiConcept, 'AI Function Concepts', /^## .*Expression API/i, /^## .*Relation API/i, /^## .*Provider.*Runner.*Lifecycle/i, /^## .*Credentials.*Effects/i, [
    [/Python Expression/i, 'explain Python Expression'],
    [/(?:equivalent|same)/i, 'make Python semantically equivalent'],
    [/row-preserving/i, 'preserve rows in Expression'],
  ]],
  [aiConceptZh, 'Chinese AI Function Concepts', /^## .*Expression API/i, /^## .*Relation API/i, /^## .*Provider.*Runner.*生命周期/i, /^## .*凭据.*副作用/, [
    [/Python Expression/i, '解释 Python Expression'],
    [/(?:等价|相同)/, '说明 Python 语义等价'],
    [/(?:保持行数|row-preserving)/, '说明 Expression 保持行数'],
  ]],
]) {
  const expression = sectionMatching(source, expressionPattern, relationPattern)
  const relation = sectionMatching(source, relationPattern, lifecyclePattern)
  const lifecycle = sectionMatching(source, lifecyclePattern, effectsPattern)
  const effects = sectionMatching(source, effectsPattern, /^## .*(?:Choosing.*Model|选择.*模型)/i)
  assertConceptTokens(expression, requirements, `${name} Expression concept`)
  assertConceptTokens(relation, [
    [/max_chunk_chars/, 'cover built-in chunking'],
    [/classify_text/, 'cover built-in classification'],
    [/return_format/, 'cover structured prompts'],
    [/image_columns/, 'cover multimodal prompts'],
    [/output_column/, 'cover named Relation output'],
    [/execution_backend/, 'cover explicit Relation backends'],
    [/actor_number/, 'cover explicit actor controls'],
    [/(?:built-in classification|内置分类)/i, 'identify the Relation-only example capability'],
    [/(?:requires? Relation API|需要 Relation API)/i, 'require Relation API for that capability'],
  ], `${name} Relation concept`)
  assertConceptTokens(lifecycle, [
    [/provider descriptors?/i, 'explain provider descriptors'],
    [/(?:plan boundary|plan 边界)/i, 'cross the plan boundary'],
    [/(?:lazily|延迟|懒)/i, 'instantiate lazily'],
    [/worker/i, 'instantiate on workers'],
    [/(?:reuse|复用|重用)/i, 'reuse clients or models'],
    [/actor/i, 'scope reuse within actors'],
    [/active runner/i, 'explain active-runner selection'],
    [/local/i, 'explain local execution'],
    [/Ray/i, 'explain Ray execution'],
    [/(?:provider defaults|Provider 默认值)/i, 'leave provider defaults in Reference'],
    [/Reference|参考/i, 'link lifecycle lookup facts to Reference'],
  ], `${name} provider lifecycle concept`)
  assertConceptTokens(effects, [
    [/(?:credentials|凭据)/i, 'place credentials with workers'],
    [/worker (?:environment|环境)/i, 'name the worker environment'],
    [/SQL/i, 'explain the SQL boundary'],
    [/(?:rejects?|拒绝)/i, 'reject SQL credential fields'],
    [/(?:external effects|外部副作用)/i, 'identify external effects'],
    [/(?:transactions?|事务)/i, 'explain transaction boundaries'],
    [/exactly-once/i, 'reject exactly-once calls'],
    [/(?:stable IDs|稳定 ID)/i, 'recommend stable IDs'],
    [/(?:reviewable|可审查)/i, 'recommend reviewable outputs'],
    [/(?:idempotent|幂等)/i, 'recommend idempotent writes'],
  ], `${name} credentials and effects concept`)
}

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
