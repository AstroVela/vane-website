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

const assertConceptInvariants = (
  source,
  { mustMatch = [], mustNotMatch = [] } = {},
  message,
) => {
  for (const [pattern, description] of mustMatch) {
    assert.match(source, pattern, `${message} should ${description}`)
  }
  for (const [pattern, description] of mustNotMatch) {
    assert.doesNotMatch(source, pattern, `${message} should not ${description}`)
  }
}

const conceptSection = (source, headingPattern, message) => {
  const lines = markdownLines(source)
  const startIndex = lines.findIndex(({ text }) => headingPattern.test(text))
  assert.notEqual(startIndex, -1, `${message}: missing heading matching ${headingPattern}`)

  const start = lines[startIndex]
  const level = start.text.match(/^#+/)?.[0].length ?? 6
  const next = lines.find(
    ({ text }, index) =>
      index > startIndex &&
      /^#{2,6}\s+/.test(text) &&
      (text.match(/^#+/)?.[0].length ?? 6) <= level,
  )
  return source.slice(start.offset, next?.offset ?? source.length)
}

const assertConceptSchema = (schema) => {
  const locales = ['en', 'zh']
  const headingsByLocale = Object.fromEntries(
    locales.map((locale) => [
      locale,
      markdownLines(schema.sources[locale])
        .map(({ text }) => text)
        .filter((line) => /^#{2,3} /.test(line)),
    ]),
  )
  assert.deepEqual(
    headingsByLocale.en.map((heading) => heading.match(/^#+/)?.[0].length),
    headingsByLocale.zh.map((heading) => heading.match(/^#+/)?.[0].length),
    `${schema.label} should use matching bilingual heading levels`,
  )

  for (const locale of locales) {
    const source = schema.sources[locale]
    const localeSchema = schema.locales[locale]
    const message = `${localeSchema.label} Concepts`
    assertApiModels(source, ['## Expression API', '## Relation API'], message)
    assertConceptRole(source, message)

    let cursor = -1
    for (const sectionSchema of schema.sections) {
      const headingPattern = sectionSchema.heading[locale]
      const heading = markdownLines(source).find(
        ({ text, offset }) => offset > cursor && headingPattern.test(text),
      )
      assert.ok(heading, `${message} should place ${sectionSchema.id} in semantic order`)
      cursor = heading.offset
      assertConceptInvariants(
        conceptSection(source, headingPattern, `${message} ${sectionSchema.id}`),
        sectionSchema.invariants?.[locale],
        `${message} ${sectionSchema.id}`,
      )
    }

    const firstHeading = schema.sections[0].heading[locale]
    const introductionEnd = markdownLines(source).find(({ text }) => firstHeading.test(text))?.offset
    assert.ok(introductionEnd > 0, `${message} should begin with its semantic introduction`)
    assertConceptInvariants(source.slice(0, introductionEnd), localeSchema.intro, `${message} introduction`)
    assertConceptInvariants(source, localeSchema.document, message)
    schema.assertExample(source, message)
  }

  assert.deepEqual(
    fencedCodeBlocks(schema.sources.zh),
    fencedCodeBlocks(schema.sources.en),
    `${schema.label} should contain identical bilingual illustrative snippets`,
  )
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
    /(?:source\.classify_text\(|source\.embed_text\([^)]*\bmax_chunk_chars\s*=|source\.prompt\([^)]*\b(?:return_format|image_columns|output_column|execution_backend)\s*=)/,
    `${message} final example should demonstrate a Relation-only AI capability`,
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
const conceptSchemas = [
  {
    id: 'udf',
    label: 'UDF Concepts',
    sources: { en: udfConcept, zh: udfConceptZh },
    assertExample: assertUdfConceptExampleOrder,
    locales: {
      en: {
        label: 'UDF',
        intro: {
          mustMatch: [
            [/two (?:semantic output|output|semantic) models/i, 'identify exactly two semantic models'],
            [/Expression API[\s\S]*Relation API/i, 'name Expression before Relation'],
            [/(?:not|rather than)[^\n]*(?:three|third)/i, 'reject a third syntax model'],
          ],
        },
        document: {
          mustMatch: [
            [/(?:(?:no direct|does not (?:expose|provide)|is unavailable)[^\n]*SQL[^\n]*(?:Relation|table[- ]functions?))/i, 'reject a direct SQL Relation API'],
            [/(?:signatures?|parameters?|lookup facts?)[^\n]*\(\/docs\/data\/reference\/udf-api\)/i, 'link lookup facts to UDF Reference'],
            [/(?:complete (?:task|workflow)|end-to-end workflow)[^\n]*\(\/docs\/data\/guides\/custom-python-udfs\)/i, 'link complete tasks to the UDF Guide'],
          ],
          mustNotMatch: [
            [/Vane(?: Data)?\s+exposes\s+three\s+relation-level\s+UDF APIs?/i, 'restore the legacy three-relation UDF claim'],
            [/\b(?:has|exposes|provides|offers|defines|uses)\s+three\s+(?:parallel\s+|peer\s+|top-level\s+)?(?:APIs?|models?|surfaces?)/i, 'describe three peer API models'],
            [/\b(?:exposes|provides|supports|has)\s+(?:a\s+)?direct SQL (?:Relation|table[- ]function) API/i, 'claim a direct SQL Relation API'],
          ],
        },
      },
      zh: {
        label: 'Chinese UDF',
        intro: {
          mustMatch: [
            [/两种(?:语义输出|输出|语义)模型/, '指出两种语义模型'],
            [/Expression API[\s\S]*Relation API/, '先介绍 Expression 再介绍 Relation'],
            [/(?:不是|并非|而非)[^\n]*三(?:个|种)/, '否定第三种语法模型'],
          ],
        },
        document: {
          mustMatch: [
            [/(?:不提供|未提供|没有|不可用)[^\n]*SQL[^\n]*(?:Relation|table[- ]function)/, '否定直接的 SQL Relation API'],
            [/(?:签名|参数|查阅信息)[^\n]*\(\/zh-CN\/docs\/data\/reference\/udf-api\)/, '把查阅事实链接到 UDF Reference'],
            [/(?:完整任务|完整工作流|端到端工作流)[^\n]*\(\/zh-CN\/docs\/data\/guides\/custom-python-udfs\)/, '把完整任务链接到 UDF Guide'],
          ],
          mustNotMatch: [
            [/Vane Data\s*(?:暴露|提供)(?:了)?\s*三(?:个|种)\s*relation\s*级别的?\s*UDF API/i, '恢复旧的三个 Relation UDF 声明'],
            [/(?<!不)(?:有|提供|公开|暴露|包含|分为)\s*三(?:个|种)[^。\n]*(?:API|模型|入口|表面)/, '把三种入口写成同级 API 模型'],
            [/(?<!不)(?:提供|公开|支持|具有)[^。\n]*直接的? SQL (?:Relation|table[- ]function) API/, '声称存在直接的 SQL Relation API'],
          ],
        },
      },
    },
    sections: [
      {
        id: 'Expression API',
        heading: { en: /^## .*Expression API/i, zh: /^## .*Expression API/i },
        invariants: {
          en: {
            mustMatch: [
              [/(?:one typed (?:output column|projection result)[^.\n]{0,80}(?:row-preserving|preserves? (?:input )?rows?)|(?:row-preserving|preserves? (?:input )?rows?)[^.\n]{0,80}one typed (?:output column|projection result))/i, 'define the normal typed row-preserving projection'],
              [/row_preserving=False[^.\n]{0,100}(?:change cardinality|change (?:the )?row count)[\s\S]{0,180}(?:sole|only) top-level projection/i, 'limit the Python batch cardinality exception'],
              [/(?:SQL aliases?[^.\n]{0,80}(?:remain|are|stay) row-preserving[^.\n]{0,30}\bv1\b|SQL aliases?[^.\n]{0,80}\bv1\b[^.\n]{0,30}row-preserving)/i, 'keep SQL aliases row-preserving in v1'],
            ],
            mustNotMatch: [[/SQL aliases?[^.\n]{0,80}(?:may|can|are allowed to)[^.\n]{0,30}(?:change cardinality|change (?:the )?row count|drop rows)/i, 'let SQL aliases change cardinality']],
          },
          zh: {
            mustMatch: [
              [/(?:一个有类型|单个有类型)[^。\n]{0,40}(?:输出列|projection)[^。\n]{0,60}(?:保持行数|保留行数)/, '定义通常有类型且保持行数的 projection'],
              [/row_preserving=False[^。\n]{0,80}(?:改变基数|改变行数)[^。\n]{0,120}(?:唯一|单独)[^。\n]{0,20}顶层 projection/, '限定 Python batch 的基数例外'],
              [/(?:SQL alias[^。\n]{0,60}(?:始终|仍然|继续)?保持行数[^。\n]{0,20}v1|SQL alias[^。\n]{0,60}v1[^。\n]{0,20}(?:始终|仍然|继续)?保持行数)/, '保持 SQL alias 在 v1 中的行数'],
            ],
            mustNotMatch: [[/SQL alias[^。\n]{0,80}(?:可以|能够|允许)[^。\n]{0,30}(?:改变基数|改变行数|删除行)/, '允许 SQL alias 改变基数']],
          },
        },
      },
      { id: 'SQL entry point', heading: { en: /^### .*SQL.*(?:Recommended|Default)/i, zh: /^### .*SQL.*(?:推荐|默认)/ } },
      { id: 'Python entry point', heading: { en: /^### .*Python/i, zh: /^### .*Python/i } },
      {
        id: 'Relation API',
        heading: { en: /^## .*Relation API/i, zh: /^## .*Relation API/i },
        invariants: {
          en: { mustMatch: [
            [/(?:table[- ]shaped|table transformation)[^.\n]{0,100}(?:multi(?:ple)?[- ]columns?|several columns)[^.\n]{0,100}(?:cardinality change|changes? cardinality)/i, 'reserve Relation for table shape, multiple columns, and cardinality change'],
            [/(?:no direct|does not (?:expose|provide)|is unavailable)[^.\n]{0,60}\bSQL\b[^.\n]{0,50}\b(?:Relation|table[- ]function) API/i, 'deny a direct SQL Relation API'],
            [/rel\.map_batches[^.\n]{0,100}rel\.flat_map[^.\n]{0,100}rel\.map\b/i, 'name the three public Relation methods'],
            [/rel\.map\b[^.\n]{0,80}row-wise scalar[^.\n]{0,80}(?:not|rather than)[^.\n]{0,40}(?:pandas )?batch/i, 'keep rel.map row-wise scalar rather than batch-shaped'],
          ], mustNotMatch: [[/rel\.map`?\s+(?:is|acts as)\s+(?:a\s+)?(?:pandas )?batch/i, 'describe rel.map as pandas batch processing']] },
          zh: { mustMatch: [
            [/(?:表形|表状|表转换)[^。\n]{0,80}(?:多列|多个列)[^。\n]{0,80}(?:改变基数|基数变化)/, '把 Relation 用于表形、多列和基数变化'],
            [/(?:不提供|未提供|没有|不可用)[^。\n]{0,60}SQL[^。\n]{0,50}(?:Relation|table[- ]function) API/, '否定直接的 SQL Relation API'],
            [/rel\.map_batches[^。\n]{0,100}rel\.flat_map[^。\n]{0,100}rel\.map\b/i, '列出三个公开 Relation 方法'],
            [/rel\.map\b[^。\n]{0,80}逐行 scalar[^。\n]{0,80}(?:不是|而非)[^。\n]{0,40}pandas batch/i, '保持 rel.map 为逐行 scalar 而非 batch 处理'],
          ], mustNotMatch: [[/rel\.map`?\s*(?:是|作为)\s*pandas batch/i, '把 rel.map 写成 pandas batch 处理']] },
        },
      },
      {
        id: 'shared planning and execution',
        heading: { en: /^## .*Planning.*Execution/i, zh: /^## .*规划.*执行/ },
        invariants: {
          en: { mustMatch: [
            [/(?:lazy planning|deferred materialization)(?=[\s\S]{0,300}(?:planned|materialized) projection)(?=[\s\S]{0,300}(?:planned|materialized) table stage)/i, 'preserve the lazy projection/table-stage planning boundary'],
            [/(?:execution|materialization)[^.\n]{0,120}(?:Arrow|Apache Arrow) (?:record )?batches?/i, 'execute typed data through Arrow batches'],
          ] },
          zh: { mustMatch: [
            [/惰性(?:规划|计划)(?=[\s\S]{0,300}(?:规划后|物化后)的? (?:projection|投影))(?=[\s\S]{0,300}(?:规划后|物化后)的?表阶段)/, '保留惰性 projection 与表阶段的规划边界'],
            [/(?:执行|物化)[^。\n]{0,120}(?:Arrow batch|Arrow 批次)/i, '通过 Arrow batch 执行有类型数据'],
          ] },
        },
      },
      {
        id: 'actor reuse and state',
        heading: { en: /^## .*Actor.*(?:State|Mutable)/i, zh: /^## .*Actor.*状态/i },
        invariants: {
          en: {
            mustMatch: [
              [/actor[- ]backed[^.\n]{0,120}(?:reuse|reuses|retain|retains|keep|keeps)[^.\n]{0,80}(?:callable(?: instance)?|function object)[^.\n]{0,100}(?:model[^.\n]{0,60}client|client[^.\n]{0,60}model)/i, 'explain per-actor callable, model, and client reuse'],
              [/vane\.cls(?:[^.\n]{0,40}vane\.cls\.batch)?[^.\n]{0,140}(?:narrower|limited|more tightly scoped)[^.\n]{0,40}mutable[- ]state contract[\s\S]{0,180}(?:\bv1\b[^.\n]{0,100}actor_number\s*=\s*1|actor_number\s*=\s*1[^.\n]{0,100}\bv1\b|(?:one|single) actor(?: instance)?[^.\n]{0,80}(?:one|single) query)/i, 'distinguish the narrower vane.cls state limit'],
            ],
            mustNotMatch: [[/actor[- ]backed[^.\n]{0,120}(?:callable )?reuse\s+(?:is|provides?|creates?|forms?|(?:can|will|does)\s+(?:provide|create|form))\s+(?:a\s+)?(?:durable|persistent|shared) (?:application )?state/i, 'treat general actor reuse as durable state'], [/vane\.cls[\s\S]{0,180}actor_number\s*=\s*(?:0|[2-9]\d*)/i, 'give vane.cls a multi-actor state limit']],
          },
          zh: {
            mustMatch: [
              [/Actor-backed[^。\n]{0,120}(?:复用|重用|保留)[^。\n]{0,80}(?:callable(?: instance)?|可调用对象)[^。\n]{0,100}(?:模型[^。\n]{0,60}客户端|客户端[^。\n]{0,60}模型)/i, '解释 actor 内 callable、模型和客户端的复用'],
              [/vane\.cls(?:[^。\n]{0,40}vane\.cls\.batch)?[^。\n]{0,140}(?:范围更窄|更窄|受限|限制更严)[^。\n]{0,40}(?:可变状态契约|mutable-state contract)[\s\S]{0,180}(?:v1[^。\n]{0,100}actor_number\s*=\s*1|actor_number\s*=\s*1[^。\n]{0,100}v1|(?:一个|单个) actor(?: instance)?[^。\n]{0,80}(?:一次|单次) query)/i, '区分范围更窄的 vane.cls 状态限制'],
            ],
            mustNotMatch: [[/actor-backed[^。\n]{0,120}(?:callable )?复用\s*(?:(?:会|可以|能够)\s*)?(?:是|提供|创建|形成)[^。\n]{0,20}(?:持久|永久|共享)(?:应用)?状态/i, '把一般 actor 复用写成持久状态'], [/vane\.cls[\s\S]{0,180}actor_number\s*=\s*(?:0|[2-9]\d*)/i, '给 vane.cls 多 actor 状态限制']],
          },
        },
      },
      {
        id: 'state, failure, and effects',
        heading: { en: /^## .*State.*Failure.*Effects/i, zh: /^## .*状态.*失败.*副作用/ },
        invariants: {
          en: {
            mustMatch: [
              [/(?:query-scoped|scoped to (?:one|the) query)[^.\n]{0,80}(?:actor-local|local to (?:one|the) actor)[^.\n]{0,80}(?:ephemeral|temporary|non-durable)/i, 'scope mutable state to one query and actor'],
              [/\b(?:not|never|cannot|can't)\b[^.\n]{0,80}\b(?:checkpoint(?:ed|ing)?|restor(?:e|ed|able|ation))\b/i, 'deny checkpoint or restoration'],
              [/\b(?:not|neither|no|without)\b[^.\n]{0,100}\bglobal state\b/i, 'deny global state'],
              [/\b(?:not|neither|no|without)\b[^.\n]{0,100}\bkeyed state\b/i, 'deny keyed state'],
              [/\b(?:not|no|without)\b[^.\n]{0,80}\bexactly-once\b/i, 'deny exactly-once semantics'],
              [/actor loss[^.\n]{0,80}(?:makes|causes)[^.\n]{0,30}(?:the )?query (?:fail|abort)[^.\n]{0,100}(?:rather than|instead of|without)[^.\n]{0,80}(?:(?:rebuild|recreat|restart)[^.\n]{0,30}(?:empty|fresh|initial) state|(?:empty|fresh|initial) state[^.\n]{0,30}(?:rebuild|recreat|restart))/i, 'fail the query instead of recreating empty state'],
              [/(?:no[^.\n]{0,60}(?:stable|deterministic)[^.\n]{0,50}(?:global )?row (?:evaluation )?order|(?:does not|cannot|never) guarantee[^.\n]{0,60}(?:stable )?(?:global )?row (?:evaluation )?order)/i, 'deny stable global row evaluation order'],
              [/(?:external|side) effects?[^.\n]{0,140}(?:\b(?:not|never|cannot|can't)\b[^.\n]{0,60}\b(?:rolled back|transactional)\b|\boutside\b[^.\n]{0,30}\btransactions?\b)/i, 'deny transactional UDF effects'],
            ],
            mustNotMatch: [
              [/\b(?:state|it)\b[^.\n]{0,80}\b(?:is|can be|will be|may be)\s+(?:checkpointed|restored|restorable)\b/i, 'claim state is checkpointed or restorable'],
              [/\b(?:state|it)\b[^.\n]{0,80}\b(?:is|provides?|supports?|offers?)\s+(?:a\s+)?global state\b/i, 'claim state is global'],
              [/\b(?:state|it)\b[^.\n]{0,80}\b(?:is|provides?|supports?|offers?)\s+(?:a\s+)?keyed state\b/i, 'claim state is keyed'],
              [/\b(?:state|it)\b[^.\n]{0,100}\b(?:is|provides?|offers?|supports?|guarantees?|has)\s+(?:an?\s+)?exactly-once\b/i, 'claim exactly-once semantics'],
              [/actor loss\s+(?:automatically\s+|transparently\s+)?(?:(?:rebuilds?|recreates?|restarts?)[^.\n]{0,40}(?:empty|fresh|initial) state|(?:uses? )?(?:empty|fresh|initial) state[^.\n]{0,40}(?:rebuild|recreat|restart))/i, 'transparently recreate empty state after actor loss'],
              [/(?:distributed )?execution\s+(?:has|provides?|guarantees?|uses?)\s+(?:a\s+)?(?:stable|deterministic) (?:global )?row (?:evaluation )?order/i, 'claim stable global row evaluation order'],
              [/(?:external|side) effects?[^.\n]{0,120}(?:\b(?:are|become|remain|will be|can be)\s+(?:fully\s+)?(?:transactional|rolled back)\b|\b(?:participate in|are part of|are covered by|occur inside|happen inside)\s+(?:SQL\s+)?transactions?\b)/i, 'claim UDF effects are transactional or rolled back'],
            ],
          },
          zh: {
            mustMatch: [
              [/(?:(?:query-scoped|限定在(?:单次|一个) query)[^。\n]{0,80}(?:actor-local|(?:单个|一个) actor 内)[^。\n]{0,80}(?:ephemeral|临时|非持久))/i, '把可变状态限定在单次 query 和单个 actor'],
              [/(?:不会|不能|无法|不可|没有|不支持)[^。\n]{0,80}(?:checkpoint|恢复|还原)/i, '否定 checkpoint 或恢复'],
              [/(?:不是|并非|没有|不提供|不支持)[^。\n]{0,100}global state/i, '否定 global state'],
              [/(?:不是|并非|没有|不提供|不支持)[^。\n]{0,100}keyed state/i, '否定 keyed state'],
              [/(?:不提供|不保证|不支持|没有)[^。\n]{0,60}exactly-once/i, '否定 exactly-once 语义'],
              [/actor 丢失[^。\n]{0,80}(?:让|导致|使)[^。\n]{0,30}query (?:失败|中止)[^。\n]{0,100}(?:而不是|而非|不会)[^。\n]{0,80}(?:(?:空状态|初始状态)[^。\n]{0,30}(?:重建|重新创建)|(?:重建|重新创建)[^。\n]{0,30}(?:空状态|初始状态))/i, '让 query 失败而不是重建空状态'],
              [/分布式[^。\n]{0,80}(?:没有|不保证)[^。\n]{0,50}(?:稳定的?)?全局行(?:求值)?顺序/, '否定稳定的全局行求值顺序'],
              [/(?:外部副作用|side effect)[^。\n]{0,140}(?:(?:不会|不能|无法|不被)[^。\n]{0,60}(?:回滚|事务化)|(?:事务之外|不属于[^。\n]{0,30}事务))/i, '否定 UDF 副作用的事务性'],
            ],
            mustNotMatch: [
              [/(?:状态|它)[^。\n]{0,80}(?<!不)(?:会|可以|能够)(?:被)?[^。\n]{0,30}(?:checkpoint|恢复|还原)/i, '声称状态会被 checkpoint 或恢复'],
              [/(?<!不)(?:是|提供|支持|具有)[^。\n]{0,30}global state/i, '声称状态是 global state'],
              [/(?<!不)(?:是|提供|支持|具有)[^。\n]{0,30}keyed state/i, '声称状态是 keyed state'],
              [/(?<!不)(?:提供|保证|支持|具有|是)[^。\n]{0,30}exactly-once/i, '声称提供 exactly-once 语义'],
              [/actor 丢失\s*(?:会|可以|能够)\s*(?:自动|透明地)?\s*(?:(?:用)?(?:空状态|初始状态)[^。\n]{0,20}(?:重建|重新创建)|(?:重建|重新创建)[^。\n]{0,20}(?:空状态|初始状态))/i, '在 actor 丢失后透明重建空状态'],
              [/分布式执行\s*(?:会|可以|能够)?\s*(?:提供|保证|具有)\s*(?:稳定的?|确定的?)?全局行(?:求值)?顺序/, '声称提供稳定的全局行求值顺序'],
              [/(?:外部副作用|side effect)[^。\n]{0,120}(?:(?<!不)(?:会|可以|能够)(?:被)?[^。\n]{0,30}回滚|(?:具有事务性|是事务性的|在 (?:SQL )?事务之?内|(?<!不)属于[^。\n]{0,30}事务))/i, '声称 UDF 副作用会回滚或具有事务性'],
            ],
          },
        },
      },
      { id: 'model choice', heading: { en: /^## .*Choosing.*Model/i, zh: /^## .*选择.*模型/ } },
    ],
  },
  {
    id: 'ai',
    label: 'AI Function Concepts',
    sources: { en: aiConcept, zh: aiConceptZh },
    assertExample: assertAiConceptExampleOrder,
    locales: {
      en: {
        label: 'AI Function',
        intro: { mustMatch: [
          [/two (?:semantic output|output|semantic) models/i, 'identify exactly two semantic models'],
          [/Expression API[\s\S]*Relation API/i, 'name Expression before Relation'],
          [/(?:not|rather than)[^\n]*(?:three|third)/i, 'reject a third syntax model'],
        ] },
        document: {
          mustMatch: [
            [/(?:(?:no direct|does not (?:expose|provide)|is unavailable)[^\n]*SQL[^\n]*(?:Relation|table[- ]functions?))/i, 'reject a direct SQL Relation API'],
            [/(?:signatures?|parameters?|lookup facts?)[^\n]*\(\/docs\/data\/reference\/ai-api\)/i, 'link lookup facts to AI Reference'],
            [/(?:complete (?:task|workflow)|end-to-end workflow)[^\n]*\(\/docs\/data\/guides\/ai-functions\)/i, 'link complete tasks to the AI Guide'],
          ],
          mustNotMatch: [
            [/AI Functions?\s+turn\s+common model operations into relation methods?/i, 'restore the legacy Relation-method AI claim'],
            [/\b(?:has|exposes|provides|offers|defines|uses)\s+three\s+(?:parallel\s+|peer\s+|top-level\s+)?(?:APIs?|models?|surfaces?)/i, 'describe three peer API models'],
            [/\b(?:exposes|provides|supports|has)\s+(?:a\s+)?direct SQL (?:Relation|table[- ]function) API/i, 'claim a direct SQL Relation API'],
          ],
        },
      },
      zh: {
        label: 'Chinese AI Function',
        intro: { mustMatch: [
          [/两种(?:语义输出|输出|语义)模型/, '指出两种语义模型'],
          [/Expression API[\s\S]*Relation API/, '先介绍 Expression 再介绍 Relation'],
          [/(?:不是|并非|而非)[^\n]*三(?:个|种)/, '否定第三种语法模型'],
        ] },
        document: {
          mustMatch: [
            [/(?:不提供|未提供|没有|不可用)[^\n]*SQL[^\n]*(?:Relation|table[- ]function)/, '否定直接的 SQL Relation API'],
            [/(?:签名|参数|查阅信息)[^\n]*\(\/zh-CN\/docs\/data\/reference\/ai-api\)/, '把查阅事实链接到 AI Reference'],
            [/(?:完整任务|完整工作流|端到端工作流)[^\n]*\(\/zh-CN\/docs\/data\/guides\/ai-functions\)/, '把完整任务链接到 AI Guide'],
          ],
          mustNotMatch: [
            [/AI Function\s*(?:将|把)\s*常见模型操作\s*(?:封装|转换|变成)(?:为)?\s*relation\s*方法/i, '恢复旧的 Relation 方法 AI 声明'],
            [/(?<!不)(?:有|提供|公开|暴露|包含|分为)\s*三(?:个|种)[^。\n]*(?:API|模型|入口|表面)/, '把三种入口写成同级 API 模型'],
            [/(?<!不)(?:提供|公开|支持|具有)[^。\n]*直接的? SQL (?:Relation|table[- ]function) API/, '声称存在直接的 SQL Relation API'],
          ],
        },
      },
    },
    sections: [
      {
        id: 'Expression API',
        heading: { en: /^## .*Expression API/i, zh: /^## .*Expression API/i },
        invariants: {
          en: { mustMatch: [
            [/Python Expression[^.\n]{0,120}(?:equivalent|same)[^.\n]{0,80}(?:row-preserving|projection)/i, 'keep SQL and Python Expression semantically equivalent'],
            [/one (?:typed )?(?:row-preserving|row preserving) (?:AI |model |output )?(?:column|projection (?:result|output))[^.\n]{0,80}(?:SELECT|projection)/i, 'produce one typed row-preserving projection output'],
          ], mustNotMatch: [[/(?:changing from SQL to Python\s+(?:changes|alters)[^.\n]{0,40}(?:output model|projection semantics)|Python Expression\s+(?:has|uses)\s+(?:a\s+)?different[^.\n]{0,30}(?:output model|projection semantics))/i, 'give Python Expression different semantics']] },
          zh: { mustMatch: [
            [/Python Expression[^。\n]{0,120}(?:语义等价|相同)[^。\n]{0,80}(?:保持行数|projection)/, '保持 SQL 与 Python Expression 语义等价'],
            [/在 `?SELECT`? projection 中[^。\n]{0,60}(?:生成|产生|增加)一个[^。\n]{0,50}(?:保持行数|保留行数)[^。\n]{0,30}(?:AI 列|结果列|projection 结果)/, '生成一个有类型且保持行数的 projection 输出'],
          ], mustNotMatch: [[/(?:从 SQL 改成 Python(?:会|将)改变[^。\n]{0,30}(?:输出模型|projection 语义)|Python Expression(?:具有|使用)不同[^。\n]{0,30}(?:输出模型|projection 语义))/, '让 Python Expression 具有不同语义']] },
        },
      },
      { id: 'SQL entry point', heading: { en: /^### .*SQL.*(?:Recommended|Default)/i, zh: /^### .*SQL.*(?:推荐|默认)/ } },
      { id: 'Python entry point', heading: { en: /^### .*Python/i, zh: /^### .*Python/i } },
      {
        id: 'Relation API',
        heading: { en: /^## .*Relation API/i, zh: /^## .*Relation API/i },
        invariants: {
          en: { mustMatch: [
            [/rel\.embed_text[^.\n]{0,100}(?:built-in )?chunk(?:ing)?[^.\n]{0,60}max_chunk_chars/i, 'keep built-in Relation chunking'],
            [/rel\.classify_text[^.\n]{0,100}(?:built-in )?classification/i, 'keep built-in Relation classification'],
            [/rel\.prompt[^.\n]{0,180}return_format/i, 'keep structured prompt output'],
            [/rel\.prompt[^.\n]{0,180}image_columns/i, 'keep multimodal prompt input'],
            [/rel\.prompt[^.\n]{0,220}(?:output_column|named (?:Relation )?output)/i, 'keep named Relation output'],
            [/Relation methods?(?=[^.\n]{0,180}execution_backend)(?=[^.\n]{0,180}(?:actor_number|actor controls?))/i, 'keep explicit Relation backend and actor controls'],
            [/built-in classification[^.\n]{0,80}requires? Relation API/i, 'identify classification as Relation-only'],
          ] },
          zh: { mustMatch: [
            [/rel\.embed_text[^。\n]{0,100}(?:内置分块[^。\n]{0,60}max_chunk_chars|max_chunk_chars[^。\n]{0,60}内置分块)/i, '保留 Relation 内置分块'],
            [/rel\.classify_text[^。\n]{0,100}内置分类/i, '保留 Relation 内置分类'],
            [/rel\.prompt[^。\n]{0,180}return_format/i, '保留结构化 prompt 输出'],
            [/rel\.prompt[^。\n]{0,180}image_columns/i, '保留多模态 prompt 输入'],
            [/rel\.prompt[^。\n]{0,220}(?:output_column|命名 Relation 输出)/i, '保留命名的 Relation 输出'],
            [/Relation 方法(?=[^。\n]{0,180}execution_backend)(?=[^。\n]{0,180}(?:actor_number|actor 控制))/i, '保留显式 Relation backend 和 actor 控制'],
            [/内置分类[^。\n]{0,80}需要 Relation API/i, '明确分类是 Relation-only 能力'],
          ] },
        },
      },
      {
        id: 'provider and runner lifecycle',
        heading: { en: /^## .*Provider.*Runner.*Lifecycle/i, zh: /^## .*Provider.*Runner.*生命周期/i },
        invariants: {
          en: { mustMatch: [
            [/provider descriptors?[^.\n]{0,80}(?:cross|pass)[^.\n]{0,30}(?:execution[- ]plan|plan(?:ning)?) boundary[\s\S]{0,240}(?:lazily|on demand)[^.\n]{0,50}workers?[^.\n]{0,100}(?:reuse|reused)/i, 'cross the plan boundary and lazily reuse worker resources'],
            [/active runner[^.\n]{0,100}\blocal\b[^.\n]{0,100}\bRay\b/i, 'contrast active-runner local and Ray execution'],
          ] },
          zh: { mustMatch: [
            [/Provider descriptor[^。\n]{0,80}(?:跨越|穿过)[^。\n]{0,30}执行计划[\s\S]{0,240}(?:延迟|按需)[^。\n]{0,50}worker[^。\n]{0,100}复用/i, '说明 descriptor 跨越执行计划并在 worker 延迟复用资源'],
            [/active runner[^。\n]{0,100}local[^。\n]{0,100}Ray/i, '对比 active runner 的 local 与 Ray 执行'],
          ] },
        },
      },
      {
        id: 'credentials and effects',
        heading: { en: /^## .*Credentials.*Effects/i, zh: /^## .*凭据.*副作用/ },
        invariants: {
          en: {
            mustMatch: [
              [/credentials?[^.\n]{0,80}\b(?:belong|live|reside|are stored|must be|should be)\b[^.\n]{0,30}\b(?:in|on)\s+(?:the\s+)?worker(?:-side)?(?:\s+(?:environment|runtime))?\b/i, 'place credentials in the worker environment'],
              [/SQL(?: option)? binding[^.\n]{0,80}(?:rejects?|blocks?|forbids?)[^.\n]{0,50}credential[- ]like/i, 'reject credential-like SQL option fields'],
              [/(?:provider calls?|provider effects?|external effects?)[^.\n]{0,140}\b(?:outside|not part of|not covered by)\b[^.\n]{0,40}\b(?:SQL\s+)?transactions?\b/i, 'place provider effects outside transactions'],
              [/\b(?:not|no|without)\b[^.\n]{0,80}\bexactly-once\b/i, 'deny exactly-once provider calls'],
              [/(?:stable (?:IDs?|identifiers?))[^.\n]{0,120}(?:reviewable|auditable)[^.\n]{0,160}(?:downstream[^.\n]{0,60}(?:idempotent|idempotency)|(?:idempotent|idempotency)[^.\n]{0,60}downstream)/i, 'preserve stable, reviewable, idempotent downstream handling'],
            ],
            mustNotMatch: [
              [/credentials?[^.\n]{0,80}\b(?:do not|don't|must not|should not|cannot|can't)\b[^.\n]{0,50}\bworker(?:-side)?(?:\s+(?:environment|runtime))?\b/i, 'reject credentials in the worker environment'],
              [/credentials?[^.\n]{0,100}\b(?:belong|live|are stored|must be|should be)\b[^.\n]{0,30}\b(?:driver|coordinator|SQL plan)\b/i, 'place credentials on the driver or in SQL'],
              [/provider calls?[^.\n]{0,120}(?:\b(?:are|occur|happen)\s+(?:fully\s+)?(?:inside|within|part of|covered by)\s+(?:SQL\s+)?transactions?\b|\b(?:are|become|remain)\s+(?:fully\s+)?transactional\b|\b(?:can|will|may) be rolled back by (?:SQL\s+)?transactions?\b)/i, 'claim provider calls are transactional or rolled back'],
              [/provider calls?[^.\n]{0,100}\b(?:are|provide|offer|support|guarantee)\s+(?:an?\s+)?exactly-once\b/i, 'claim exactly-once provider calls'],
            ],
          },
          zh: {
            mustMatch: [
              [/凭据[^。\n]{0,30}(?<!不)(?:应放在|应该放在|必须放在|位于|存放在)\s*worker(?:-side)?(?: 环境| 运行时| 侧)?/i, '把凭据放在 worker 环境'],
              [/SQL(?: option)? binding[^。\n]{0,80}(?:拒绝|阻止|禁止)[^。\n]{0,50}(?:类似凭据|凭据类|credential-like)/i, '拒绝类似凭据的 SQL option 字段'],
              [/(?:Provider 调用|外部副作用)[^。\n]{0,120}(?:事务之外|不属于[^。\n]{0,30}事务)/i, '把 Provider 副作用放在事务之外'],
              [/(?:不提供|不保证|不支持|没有)[^。\n]{0,60}exactly-once/i, '否定 exactly-once Provider 调用'],
              [/稳定(?:的)? (?:ID|标识)[^。\n]{0,120}(?:可审查|可审核)[^。\n]{0,160}(?:下游[^。\n]{0,60}幂等|幂等[^。\n]{0,60}下游)/, '保留稳定、可审查且幂等的下游处理'],
            ],
            mustNotMatch: [
              [/凭据[^。\n]{0,40}(?:不应|不应该|不能|不可|不宜)[^。\n]{0,30}worker(?:-side)?(?: 环境| 运行时| 侧)?/i, '否定把凭据放在 worker 环境'],
              [/凭据[^。\n]{0,80}(?<!不)(?:应|可以|能够|必须)[^。\n]{0,30}(?:driver|coordinator|SQL plan)/i, '把凭据放到 driver 或 SQL'],
              [/Provider 调用[^。\n]{0,100}(?:在 (?:SQL )?事务之?内|(?<!不)属于[^。\n]{0,30}事务|(?:会|可以|能够)被[^。\n]{0,30}(?:SQL )?事务回滚|具有事务性|是事务性的)/i, '声称 Provider 调用具有事务性或会被回滚'],
              [/(?:Provider 调用[^。\n]{0,100}(?<!不)(?:提供|保证|支持)[^。\n]{0,30}|Provider 调用(?:是|具有)\s*)exactly-once/i, '声称 Provider 调用提供 exactly-once'],
            ],
          },
        },
      },
      { id: 'model choice', heading: { en: /^## .*Choosing.*Model/i, zh: /^## .*选择.*模型/ } },
    ],
  },
]

const [udfConceptSchema, aiConceptSchema] = conceptSchemas
const udfActorRules = udfConceptSchema.sections.find(({ id }) => id === 'actor reuse and state').invariants
const udfStateRules = udfConceptSchema.sections.find(
  ({ id }) => id === 'state, failure, and effects',
).invariants
const aiEffectsRules = aiConceptSchema.sections.find(
  ({ id }) => id === 'credentials and effects',
).invariants

const highRiskConceptProbes = [
  [udfActorRules.en, 'English UDF actor reuse', 'Actor-backed execution reuses a callable instance, model, and client within each actor. `vane.cls` has the narrower mutable-state contract; in v1 it uses `actor_number=1` across one query. General actor-backed callable reuse does not provide durable application state and cannot create shared state.', ['Actor-backed callable reuse is durable application state.', 'Actor-backed callable reuse provides durable application state.', 'Actor-backed callable reuse creates shared state.', '`vane.cls` uses `actor_number=2` in v1.']],
  [udfActorRules.zh, 'Chinese UDF actor reuse', 'Actor-backed 执行会在 actor 内复用 callable instance、模型与客户端。`vane.cls` 是范围更窄的可变状态契约；在 v1 使用 `actor_number=1`，限于单次 query。一般 actor-backed callable 复用不会创建持久应用状态，也不能提供共享状态。', ['Actor-backed callable 复用是持久应用状态。', 'Actor-backed callable 复用提供持久应用状态。', 'Actor-backed callable 复用创建共享状态。', '`vane.cls` 在 v1 使用 `actor_number=2`。']],
  [udfStateRules.en, 'English UDF state', 'State is scoped to one query, local to one actor, and ephemeral. State cannot be restored after failure. It is neither global state nor keyed state and offers no exactly-once guarantee. Actor loss makes the query fail instead of recreating an actor with empty state. Distributed execution does not guarantee global row evaluation order. External side effects cannot be rolled back by a SQL transaction.', ['State can be restored after failure.', 'State is global state.', 'State is keyed state.', 'State guarantees exactly-once.', 'Actor loss transparently recreates an actor with empty state.', 'Distributed execution guarantees a stable global row evaluation order.', 'External side effects are transactional.']],
  [udfStateRules.zh, 'Chinese UDF state', '状态限定在单次 query、单个 actor 内，并且是临时的。状态不能在失败后恢复。它不是 global state，也不是 keyed state，并且不提供 exactly-once。actor 丢失会导致 query 失败，而不是用空状态重建 actor。分布式执行不保证全局行求值顺序。外部副作用不能由 SQL 事务回滚。', ['状态可以在失败后恢复。', '状态是 global state。', '状态是 keyed state。', '状态提供 exactly-once。', 'actor 丢失会透明地用空状态重建 actor。', '分布式执行保证稳定的全局行求值顺序。', '外部副作用会被事务回滚。']],
  [aiEffectsRules.en, 'English AI effects', 'Credentials live in the worker-side runtime. SQL option binding rejects credential-like fields. Provider calls are external effects outside SQL transactions and provide no exactly-once guarantee. Carry stable IDs, retain reviewable inputs and outputs, and make downstream writes idempotent.', ['Credentials should not live in the worker environment.', 'Credentials belong on the driver.', 'Provider calls are inside SQL transactions.', 'Provider calls can be rolled back by SQL transactions.', 'Provider calls guarantee exactly-once.']],
  [aiEffectsRules.zh, 'Chinese AI effects', '凭据位于 worker 运行时。SQL option binding 拒绝类似凭据的字段。Provider 调用发生在 SQL 事务之外，不提供 exactly-once。保留稳定 ID 和可审查的输入输出，并让下游写入保持幂等。', ['凭据不应放在 worker 环境。', '凭据应放在 driver。', 'Provider 调用在 SQL 事务之内。', 'Provider 调用可以被 SQL 事务回滚。', 'Provider 调用提供 exactly-once。']],
]

for (const [rules, label, accurate, inversions] of highRiskConceptProbes) {
  assert.doesNotThrow(
    () => assertConceptInvariants(accurate, rules, `${label} synonym probe`),
    `${label} guards should accept accurate synonymous wording`,
  )
  for (const inversion of inversions) {
    assert.throws(
      () => assertConceptInvariants(`${accurate} ${inversion}`, rules, `${label} polarity probe`),
      /should not/,
      `${label} guards should reject the inverted claim: ${inversion}`,
    )
  }
}

for (const schema of conceptSchemas) {
  for (const sectionSchema of schema.sections.filter(({ invariants }) => invariants)) {
    for (const locale of ['en', 'zh']) {
      assert.throws(
        () => assertConceptInvariants(`## ${sectionSchema.id}`, sectionSchema.invariants[locale], `${schema.id} ${sectionSchema.id} deletion probe`),
        /should/,
        `${schema.id} ${sectionSchema.id} should reject a retained heading with gutted prose`,
      )
    }
  }
}

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
for (const [heading, label] of [['## 1. Register the alias', 'numeric'], ['## Step 1: Register the alias', 'English'], ['## 第一步：注册 alias', 'Chinese']]) {
  assert.throws(
    () => assertConceptRole(heading, `${label} Concept-step-heading probe`),
    /numbered step heading/,
    `Concept role guards should reject a ${label} numbered step heading`,
  )
}
for (const [source, rules, label, expected] of [
  ['Vane exposes three relation-level UDF APIs.', udfConceptSchema.locales.en.document.mustNotMatch, 'English legacy UDF', /legacy three-relation UDF claim|restore the legacy/],
  ['AI Functions turn common model operations into relation methods.', aiConceptSchema.locales.en.document.mustNotMatch, 'English legacy AI', /legacy Relation-method AI claim|restore the legacy/],
  ['Vane Data 暴露了三个 relation 级别的 UDF API。', udfConceptSchema.locales.zh.document.mustNotMatch, 'Chinese legacy UDF', /旧的三个 Relation UDF 声明/],
  ['Vane Data AI Function 将常见模型操作封装为 relation 方法。', aiConceptSchema.locales.zh.document.mustNotMatch, 'Chinese legacy AI', /旧的 Relation 方法 AI 声明/],
]) {
  assert.throws(
    () => assertConceptInvariants(source, { mustNotMatch: rules }, `${label} probe`),
    expected,
    `Concept guards should reject the exact ${label} claim`,
  )
}
for (const bareCall of ['source.prompt("prompt")', 'source.embed_text("prompt")']) {
  assert.throws(
    () => assertAiConceptExampleOrder(
      [
        '```python',
        'import vane',
        'con = vane.connect()',
        'source = con.sql("SELECT 1 AS document_id, \'prompt\' AS prompt")',
        'reviewed = con.sql("SELECT document_id, prompt, ai_prompt(prompt) FROM source")',
        '```',
        '```python',
        'projected = source.select(vane.ai.prompt(vane.col("prompt")))',
        '```',
        '```python',
        `bare = ${bareCall}`,
        '```',
      ].join('\n'),
      'bare Relation AI mutation probe',
    ),
    /Relation-only AI capability/,
    `AI Concept example guards should reject a bare Relation call: ${bareCall}`,
  )
}

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

for (const schema of conceptSchemas) {
  assertConceptSchema(schema)
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
