# SQL-First UDF and AI Documentation Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the approved bilingual UDF and AI documentation so it presents Expression API and Relation API as the two API models, recommends the SQL entry point to Expression API first, and gives Reference, Guides, and Concepts distinct jobs.

**Architecture:** Keep the current routes and navigation, but replace the content hierarchy inside the affected pages. Reference pages become uniform lookup catalogs; Guides become SQL-first end-to-end tasks with Python alternatives; Concepts explain the shared execution model and the reasons for the API boundaries. A source-level content contract protects ordering, terminology, bilingual parity, and the explicit exclusion of Docs Examples.

**Tech Stack:** Docusaurus 3, MDX, Node.js `node:assert/strict` content checks, TypeScript/React site build.

---

## Scope and invariants

The implementation source of truth is:

- Design: `docs/superpowers/specs/2026-07-11-api-reference-restructure-design.md`
- API v2 specification: `/home/zhuwei/vane/.worktrees/expression_udf_daidai/docs/udf-ai-api-v2.md`
- Public implementation, when the specification needs confirmation: `/home/zhuwei/vane/.worktrees/expression_udf_daidai/vane/`
- Public behavior tests, when a boundary is ambiguous: `/home/zhuwei/vane/.worktrees/expression_udf_daidai/tests/`

Do not edit either Examples tree:

- `docs/data/examples/`
- `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/examples/`

The baseline commit for proving those trees stayed unchanged is `e0cc6b0`.
Marketing pages, deployment pages, and contributing pages are outside this
restructure. Preserve their existing working-tree changes.

Use these canonical terms throughout:

```text
Expression API
├── SQL entry point (recommended)
└── Python entry point

Relation API
└── specialized Python relation methods
```

Never describe SQL, Expression, and Relation as three parallel APIs. SQL
registration controls such as `vane.attach_function` expose the SQL entry point
to Expression API; they do not form a third model.

Every callable entry in Reference uses this template, in this order:

```md
**Purpose**
**Signature**
**Parameters**
**Returns**
**Behavior and data contract**
**Minimal example**
**Restrictions and errors**
**Related pages**
```

The Chinese template is:

```md
**用途**
**签名**
**参数**
**返回值**
**行为与数据契约**
**最小示例**
**限制与错误**
**相关页面**
```

Use bold labels rather than repeated subheadings so the generated table of
contents remains readable.

### Task 1: Replace the stale three-surface content contract

**Files:**

- Modify: `scripts/udf-ai-v2-content-check.mjs`

- [ ] **Step 1: Add reusable ordering and entry-template helpers**

Add helpers next to `read` and `stripTags`:

```js
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
```

For the registered-alias pseudo-signature, use the heading
`#### \`registered_alias(...args)\`` so it can be checked by the same helper.

- [ ] **Step 2: Replace assertions that encode three parallel surfaces**

Delete these stale expectations:

```js
/Relation API[\s\S]*Expression API[\s\S]*SQL API/
```

Replace them with structural checks for the English UDF Reference. Task 3 adds
the same contract for AI after UDF is green:

```js
for (const [source, name] of [[udfReference, 'UDF reference']]) {
  assertOrdered(
    source,
    ['## Expression API', '### SQL Entry Point (Recommended)', '### Python Entry Point', '## Relation API'],
    name,
  )
  assert.doesNotMatch(source, /three (parallel |complementary )?(APIs|API surfaces|surfaces)/i)
}
```

Add the equivalent Chinese UDF check using:

```js
['## Expression API', '### SQL 入口（推荐）', '### Python 入口', '## Relation API']
```

- [ ] **Step 3: Assert the role statement and UDF entry coverage**

Require both UDF references to state that Reference contains signatures,
parameters, returns, and restrictions, and link complete tasks to Guides and
execution/design explanations to Concepts.

Use `assertEntryTemplate` for this complete English UDF entry list:

```js
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
```

Scope each group before checking its entries so the last entry cannot satisfy a
missing label from a later section:

```js
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
```

Run the same scoped entry lists against Chinese with the Chinese template
labels. The API names and signatures remain untranslated.

- [ ] **Step 4: Preserve existing safety assertions**

Keep the existing checks for public names, projection placement, cardinality,
state lifetime, side effects, GPU behavior, credential handling, generated
navigation, marketing snippets, and forbidden internal symbols. Do not weaken
checks unrelated to the content hierarchy.

- [ ] **Step 5: Run the content contract and verify RED**

Run:

```bash
npm run udf-ai-v2:content:check
```

Expected: FAIL on the new UDF Reference ordering/template assertions because
the current pages do not yet use the canonical hierarchy.

Do not commit yet; Task 2 brings this test back to green.

### Task 2: Rewrite the bilingual UDF API Reference

**Files:**

- Modify: `docs/data/reference/udf-api.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/reference/udf-api.mdx`
- Modify: `scripts/udf-ai-v2-content-check.mjs`
- Modify: `src/docs/registry.ts`

- [ ] **Step 1: Replace the introduction with the Reference contract**

Keep the route and frontmatter. Rename the English title to `UDF API Reference`
and the Chinese title to `UDF API 参考`. Update the matching `title` and
`titleZh` values in `src/docs/registry.ts`; docs lint requires registry and
English frontmatter titles to agree.

The opening paragraph must say, in the page's language:

- this page is for signatures, parameters, returns, and call restrictions;
- complete tasks belong in the Custom Python UDFs Guide;
- execution semantics and design reasons belong in UDF Concepts;
- Expression API is the default, with SQL first; Relation API is for
  table-shaped transformations.

- [ ] **Step 2: Build the SQL entry point under Expression API**

Use this exact hierarchy:

```md
## Expression API

### SQL Entry Point (Recommended)

#### `vane.attach_function`
#### `registered_alias(...args)`
#### `vane.detach_function`

### Python Entry Point
```

Use `SQL 入口（推荐）` and `Python 入口` in Chinese.

For `vane.attach_function`, copy the exact public signature from API v2 spec
section 7.1. Document every parameter and `None`/`False` default, the `None`
return, connection ownership, `replace`, transaction behavior, SQL named
arguments, and preflight errors. The minimal example must define `con`, define a
raw scalar callable, register it, call it in `SELECT`, and clean it up.

For `registered_alias(...args)`, use this SQL signature:

```sql
registered_alias(argument [, ...]) -> declared_return_type
```

State that aliases are connection-scoped, row-preserving in v1, projection
only, composable beside ordinary columns, and unavailable in `WHERE`,
`GROUP BY`, `HAVING`, join conditions, aggregate arguments, `CASE`, `AND`/`OR`,
or `COALESCE`.

For `vane.detach_function`, copy the exact signature from spec section 7.2 and
state that it returns `None` and removes the alias from the specified/default
connection.

Immediately after the SQL entry-point introduction and before the first API
entry, add a bold `**Registered-object compatibility**` / `**注册对象兼容矩阵**`
label and shared lookup table. Placing it before all `####` API headings keeps
it outside every entry's exact eight-field template without inventing another
API. Preserve all six object categories and their exact
required/allowed/forbidden arguments:

- decorated `VaneFunction`;
- raw scalar callable;
- raw batch function;
- zero-argument raw batch callable class;
- instantiated `VaneClassInstance`;
- instantiated `VaneClassBatchInstance`.

- [ ] **Step 3: Give every Python Expression API the same template**

Create one `####` entry for each of:

```text
vane.col
vane.lit
vane.sql_expr
vane.func
vane.func.batch
vane.cls
vane.cls.batch
```

Use the exact signatures and defaults from API v2 spec section 6. Do not group
the three expression constructors into a single undocumented table, and do not
give `vane.func.batch` a special narrative structure.

The minimal example for each API must define its imports, callable/class,
connection or relation, input data, schema, and alias as applicable. Keep it to
one call contract rather than a full task.

Preserve these function-specific restrictions inside the common template:

- eager versus expression dispatch for `vane.func` and batch wrappers;
- positional Expression input and rejected Expression keyword arguments;
- exactly one output column for batch Expression schemas;
- `row_preserving=False` may change cardinality only as the sole top-level
  projection;
- `vane.cls` and `vane.cls.batch` require the exact integer
  `actor_number=1` in v1;
- class state is query-scoped, actor-local, ephemeral, not checkpointed, and
  not exactly-once;
- SQL NULL short-circuit behavior differs from eager Python `None` behavior.

- [ ] **Step 4: Add Relation API last, with the same template**

Use this exact hierarchy:

```md
## Relation API

#### `rel.map_batches`
#### `rel.flat_map`
#### `rel.map`
```

Preserve the currently public Relation signatures and defaults from the Vane
source/docstrings. Explain only their call contracts:

- `rel.map_batches`: Arrow table in/out, declared schema, batch/resource/backend
  controls, multi-column or table-stage output;
- `rel.flat_map`: explicit zero/one/many output rows and declared schema;
- `rel.map`: row-wise scalar callable, required `return_type`, original columns
  plus an appended `value` column, and Relation executor/resource controls.

Do not invent SQL Relation syntax. Each Relation entry's minimal example must
say what capability requires Relation API.

- [ ] **Step 5: End with shared constraints, not a tutorial**

Keep compact lookup sections for:

- supported Expression/SQL output types;
- projection and short-circuit placement;
- row preservation and cardinality;
- state, failure, retries, and external side effects;
- Ray GPU requests versus local GPU visibility;
- Relation `actor_number` versus AI provider `concurrency`.

Put these under the exact English heading `## Shared UDF Constraints` and the
Chinese heading `## UDF 共有限制`. Do not repeat full workflows from the Guide.

- [ ] **Step 6: Run focused verification and verify GREEN**

Run:

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
```

Expected: both PASS. The AI Reference has not yet received the new template
assertions; those are introduced test-first in Task 3. The stale three-surface
assertions remain removed globally.

- [ ] **Step 7: Commit the UDF Reference unit**

```bash
git add scripts/udf-ai-v2-content-check.mjs docs/data/reference/udf-api.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/reference/udf-api.mdx src/docs/registry.ts
git commit -m "docs: restructure UDF reference around SQL expressions"
```

### Task 3: Rewrite the bilingual AI Function API Reference

**Files:**

- Modify: `scripts/udf-ai-v2-content-check.mjs`
- Modify: `docs/data/reference/ai-api.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/reference/ai-api.mdx`
- Modify: `src/docs/registry.ts`

- [ ] **Step 1: Add the AI template assertions and verify RED**

Add these complete entry lists to the content contract:

```js
const aiSqlEntries = ['ai_prompt', 'ai_embed']
const aiPythonEntries = ['vane.ai.prompt', 'vane.ai.embed']
const aiRelationEntries = ['rel.prompt', 'rel.embed_text', 'rel.classify_text']
```

Add the top-level English and Chinese ordering checks at this point, then scope
the three groups before calling `assertEntryTemplate`:

```js
assertOrdered(
  aiReference,
  ['## Expression API', '### SQL Entry Point (Recommended)', '### Python Entry Point', '## Relation API'],
  'AI reference',
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
```

Use `### SQL 入口（推荐）`, `### Python 入口`, Chinese template labels, and the
same untranslated API entry list for the Chinese page. Also assert:

- `ai_prompt` occurs before `vane.ai.prompt`, which occurs before `rel.prompt`;
- `ai_embed` occurs before `vane.ai.embed`, which occurs before
  `rel.embed_text`;
- Relation-only prompt capabilities still include `return_format`,
  `image_columns`, `output_column`, and explicit `execution_backend`;
- the SQL options argument is a foldable constant `STRUCT`;
- credential-like fields are rejected and credentials come from worker
  environment variables.

Run:

```bash
npm run udf-ai-v2:content:check
```

Expected: FAIL on AI Reference hierarchy/template assertions.

- [ ] **Step 2: Replace the introduction with the Reference contract**

Keep the route and frontmatter. Rename the English title to
`AI Function API Reference` and the Chinese title to `AI Function API 参考`.
Update the matching registry `title`/`titleZh` values. Use the same role
statement as UDF Reference, linking full tasks to the AI
Functions Guide and design/execution explanations to AI Function Concepts.

- [ ] **Step 3: Put SQL Expression first**

Use this hierarchy:

```md
## Expression API

### SQL Entry Point (Recommended)

#### `ai_prompt`
#### `ai_embed`

### Python Entry Point

#### `vane.ai.prompt`
#### `vane.ai.embed`

## Relation API

#### `rel.prompt`
#### `rel.embed_text`
#### `rel.classify_text`
```

Use `SQL 入口（推荐）` and `Python 入口` in Chinese.

For SQL entries, use these exact public signatures:

```sql
ai_prompt(messages VARCHAR [, options CONSTANT]) -> VARCHAR
ai_embed(text VARCHAR [, options CONSTANT]) -> FLOAT[] | FLOAT[N]
```

For both entries, document one or two arguments, the first argument's
`VARCHAR` requirement, the foldable constant options requirement, projection
placement, provider/config forwarding, and credential-field rejection. The
minimal examples must define the source relation with `con.sql(...)` before
calling the SQL function.

- [ ] **Step 4: Document Python Expression and Relation calls uniformly**

Copy public signatures and defaults from API v2 spec section 8.

Preserve these distinctions without turning them into separate documentation
styles:

- `vane.ai.embed` defaults to provider `openai`; `dimensions=None` returns
  `FLOAT[]`, `dimensions=N` returns `FLOAT[N]`;
- Expression `vane.ai.prompt` returns one `VARCHAR` projection column and
  rejects Relation-only options;
- `rel.embed_text` defaults to `transformers`, supports built-in character
  chunking, and returns dynamic `FLOAT[]`;
- `rel.classify_text` is Relation-only and returns a `VARCHAR` label;
- `rel.prompt` supports structured/multimodal input, `return_format`, named
  output, and explicit Relation backend selection.

Each minimal example must define imports, `con`, `rel`, source columns, and any
response model it uses. Do not leave `Decision`, `rel`, or provider options
undefined.

- [ ] **Step 5: Keep typed options and lifecycle as shared lookup material**

After the callable entries, retain a compact table with the exact public
dataclass fields/defaults from API v2 spec section 9 for:

```text
OpenAIProviderOptions
OpenAIPromptOptions
OpenAIEmbeddingOptions
AnthropicProviderOptions
AnthropicPromptOptions
GoogleProviderOptions
GooglePromptOptions
GoogleEmbeddingOptions
VLLMProviderOptions
VLLMPromptOptions
```

Retain compact shared restrictions for provider descriptors, lazy worker-side
instantiation, active-runner backend resolution, projection placement,
credentials, retries, side effects, and non-exactly-once behavior. Link to
Concepts for reasons; do not explain the architecture at length here. Put the
table and restrictions under the exact English heading
`## Shared AI Types and Constraints` and the Chinese heading
`## AI 共享类型与限制`.

- [ ] **Step 6: Run focused verification and verify GREEN**

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
```

Expected: both PASS.

- [ ] **Step 7: Commit the AI Reference unit**

```bash
git add scripts/udf-ai-v2-content-check.mjs docs/data/reference/ai-api.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/reference/ai-api.mdx src/docs/registry.ts
git commit -m "docs: restructure AI reference around SQL expressions"
```

### Task 4: Rebuild the two core Concept pages around the semantic model

**Files:**

- Modify: `scripts/udf-ai-v2-content-check.mjs`
- Modify: `docs/data/concepts/udfs.mdx`
- Modify: `docs/data/concepts/ai-functions.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/udfs.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/ai-functions.mdx`

- [ ] **Step 1: Add Concept-role and ordering assertions, then verify RED**

Require each core Concept page, in both languages, to:

- identify exactly two top-level models: Expression API and Relation API;
- introduce SQL Expression before Python Expression and Relation;
- link exact signatures to the matching Reference page;
- link complete tasks to the matching Guide;
- contain no parameter-catalog heading and no end-to-end numbered tutorial;
- contain none of `three surfaces`, `three APIs`, or wording that treats SQL as
  a peer model.

Run `npm run udf-ai-v2:content:check` and expect FAIL on the current ordering.

- [ ] **Step 2: Rewrite UDF Concepts**

Use this narrative order:

1. Expression and Relation are semantic output models.
2. SQL aliases are the recommended entry point for one typed projection
   column.
3. Python Expression is an alternate syntax with the same projection model.
4. Relation UDFs handle multi-column output, complete table stages, and explicit
   cardinality change.
5. Both models share Vane's lazy plan and execution layer.
6. Actor-backed callable reuse is broader than the narrow mutable-state
   contract of `vane.cls`.
7. State, failure, retries, and side effects explain the restrictions.

Use only short illustrative snippets. The SQL snippet must include callable
definition, registration, and alias invocation, but not validation/write steps.
Move signatures, parameter tables, and compatibility matrices to links to UDF
Reference.

- [ ] **Step 3: Rewrite AI Function Concepts**

Use this narrative order:

1. SQL `ai_prompt`/`ai_embed` are the default mental model for row-preserving
   AI enrichment.
2. Python Expression builds the same one-column projection model.
3. Relation AI is required for built-in chunking/classification,
   structured/multimodal prompting, named relation output, or an explicit
   Relation backend.
4. Provider descriptors cross the plan boundary; clients/models are created
   lazily on workers.
5. Credentials belong in worker environments.
6. Provider calls and other side effects are outside SQL transaction and
   exactly-once guarantees.

Use short snippets only. Move option field lists and exact signatures to AI
Reference; move task setup/validation/write flows to Guides.

- [ ] **Step 4: Mirror meaning and hierarchy in Chinese**

Keep the same heading order, diagrams/tables, API names, and capability
boundaries. Translate explanations, not identifiers. Do not imply a direct SQL
Relation/table-function API.

- [ ] **Step 5: Verify and commit**

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
git add scripts/udf-ai-v2-content-check.mjs docs/data/concepts/udfs.mdx docs/data/concepts/ai-functions.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/udfs.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/ai-functions.mdx
git commit -m "docs: explain the two UDF and AI API models"
```

Expected: checks PASS before commit.

### Task 5: Align the related Concept pages

**Files:**

- Modify: `scripts/udf-ai-v2-content-check.mjs`
- Modify: `docs/data/concepts/architecture.mdx`
- Modify: `docs/data/concepts/execution-model.mdx`
- Modify: `docs/data/concepts/sql-vs-python.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/architecture.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/execution-model.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/sql-vs-python.mdx`

- [ ] **Step 1: Add targeted assertions and verify RED**

Require English and Chinese versions to contain, in order:

- SQL Expression entry point;
- Python Expression entry point;
- Relation API for table-shaped work.

Require `sql-vs-python` to explicitly say SQL and Python are entry points to
Expression API, not two mutually exclusive pipeline types. Reject phrases that
say Relation, Expression, and SQL are three complementary surfaces.

Run `npm run udf-ai-v2:content:check`; expect FAIL on the current page order.

- [ ] **Step 2: Update Architecture Concepts**

Describe the public layer in this order:

```text
SQL Expression -> Python Expression -> Relation API -> shared logical/physical execution
```

Explain that registration and AI SQL binding lower to the shared Expression
execution path. Explain that Relation operators own table-shaped contracts.
Keep internal class/function names out of public prose.

- [ ] **Step 3: Update Execution Model Concepts**

Explain projection execution first through registered SQL aliases and SQL AI,
then the Python Expression syntax, then Relation operators. Preserve lazy
planning, materialization, Arrow batch, local/Ray, scheduling, and streaming
explanations. Do not turn this page into a signature catalog.

- [ ] **Step 4: Update SQL vs Python Concepts**

Replace the old language-choice framing with:

- SQL Expression is the recommended default for composable projection work;
- Python Expression is the alternate entry point when callable/configuration
  construction belongs in Python;
- Relation API is the specialized escape hatch for table reshaping,
  cardinality-changing output, built-in chunking/classification, or
  structured/multimodal Relation AI;
- SQL may produce or consume a relation around Relation calls, but no direct
  SQL Relation API exists.

- [ ] **Step 5: Verify and commit**

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
git add scripts/udf-ai-v2-content-check.mjs docs/data/concepts/architecture.mdx docs/data/concepts/execution-model.mdx docs/data/concepts/sql-vs-python.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/architecture.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/execution-model.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/sql-vs-python.mdx
git commit -m "docs: align API choice and execution concepts"
```

Expected: checks PASS before commit.

### Task 6: Make Quickstart and the custom UDF Guide SQL-first

**Files:**

- Modify: `scripts/udf-ai-v2-content-check.mjs`
- Modify: `docs/data/quickstart/quickstart.mdx`
- Modify: `docs/data/guides/custom-python-udfs.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/quickstart/quickstart.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/custom-python-udfs.mdx`

- [ ] **Step 1: Add SQL-first task assertions and verify RED**

For both languages, assert the Quickstart and custom UDF Guide contain this
ordered workflow:

```text
define raw Python callable
vane.attach_function(...)
registered alias inside con.sql("SELECT ...")
validation
write/output
Python Expression alternative
Relation API use cases
```

The first complete custom-UDF workflow must not begin with `rel.map_batches` or
`vane.func`. Assert every SQL alias appearing in a query has an earlier matching
`alias="..."` registration in the same page.

Also replace the current Quickstart assertion that requires
`vane.ai.prompt(...).alias("ai_review_note")` with one requiring SQL
`ai_prompt(...) AS ai_review_note` before any Python AI Expression call.

Run `npm run udf-ai-v2:content:check`; expect FAIL on current workflow order.

- [ ] **Step 2: Restructure Quickstart as the recommended path**

Use this page order:

1. prerequisites;
2. create `con` and a source relation;
3. use SQL to filter/select candidates;
4. define a small raw scalar callable;
5. register it with `vane.attach_function`;
6. call its alias in a SQL projection while preserving source columns;
7. optionally add SQL `ai_prompt` with a constant `struct_pack`;
8. validate IDs, nulls, row count, and schema;
9. write Parquet;
10. link Relation API for table reshaping.

Use a `try/finally` or explicit teardown so `vane.detach_function` is not lost.
All code names must be defined on the page. Do not make `map_batches` or Python
AI Expression the default workflow.

- [ ] **Step 3: Restructure the custom UDF Guide as a complete task**

Start with an end-to-end raw-callable registration task:

```python
import duckdb
import vane

con = duckdb.connect()
con.sql("CREATE TABLE records AS SELECT 1 AS id, '  Alpha  ' AS label")

def normalize_label(value):
    return value.strip().lower()

vane.attach_function(
    normalize_label,
    alias="normalize_label",
    connection=con,
    parameters=["VARCHAR"],
    return_dtype="VARCHAR",
)

result = con.sql("""
    SELECT id, label, normalize_label(label) AS normalized_label
    FROM records
""")
```

Complete the task with validation, output, and detach. Then show Python
Expression as an alternate call form. Put Relation sections last and state the
capability that requires each:

- `rel.map_batches` for multi-column/table-stage Arrow output;
- `rel.flat_map` for explicit one-to-many output;
- `rel.map` for a row-wise scalar callable whose `value` output should be
  appended through the Relation executor with explicit backend/resource
  controls;
- actor-backed Relation callable classes for model/client reuse and GPU
  resource controls.

Do not duplicate every signature; link each name to UDF Reference.

- [ ] **Step 4: Mirror the task structure in Chinese**

Keep code identical except human-readable comments/strings where translation
helps. Ensure heading and example order matches English.

- [ ] **Step 5: Verify and commit**

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
git add scripts/udf-ai-v2-content-check.mjs docs/data/quickstart/quickstart.mdx docs/data/guides/custom-python-udfs.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/quickstart/quickstart.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/custom-python-udfs.mdx
git commit -m "docs: lead UDF tasks with registered SQL expressions"
```

Expected: checks PASS before commit.

### Task 7: Make the AI Functions Guide SQL-first

**Files:**

- Modify: `scripts/udf-ai-v2-content-check.mjs`
- Modify: `docs/data/guides/ai-functions.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/ai-functions.mdx`

- [ ] **Step 1: Add SQL-first AI task assertions and verify RED**

Require both Guide versions to order complete examples as:

```text
SQL ai_prompt / ai_embed
Python vane.ai.prompt / vane.ai.embed
Relation rel.prompt / rel.embed_text / rel.classify_text
```

Require the first SQL projection to retain a stable ID and source text beside
the AI output. Reject `append_column(` and reject undefined response model names.
Run `npm run udf-ai-v2:content:check`; expect FAIL on the current Python-first
guide.

- [ ] **Step 2: Build one complete SQL AI task first**

The primary workflow must:

1. create `con` and source rows with stable IDs;
2. select a reviewable candidate slice;
3. call SQL `ai_prompt` with constant `struct_pack` options;
4. optionally call SQL `ai_embed` in a second projection;
5. keep IDs/source fields beside outputs;
6. validate null/error output and row counts;
7. write a reviewable result.

State that API keys come from worker environment variables and never place a
credential field in SQL options.

- [ ] **Step 3: Add Python Expression as the alternate entry point**

Show the equivalent `rel.select(...)` using `vane.ai.prompt` and/or
`vane.ai.embed`, with `.alias(...)`. Explain only the syntax/configuration
difference; link exact parameters to Reference.

- [ ] **Step 4: Put Relation API last for capabilities that require it**

Use Relation examples only for:

- `return_format` structured responses;
- `image_columns` multimodal input;
- `rel.classify_text`;
- `rel.embed_text` built-in chunking;
- explicit Relation `execution_backend` or Relation actor-pool controls.

Define any Pydantic response model before use. State that Relation helpers may
return configured output columns and source preservation must be planned.

- [ ] **Step 5: Mirror, verify, and commit**

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
git add scripts/udf-ai-v2-content-check.mjs docs/data/guides/ai-functions.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/ai-functions.mdx
git commit -m "docs: lead AI tasks with SQL expressions"
```

Expected: checks PASS before commit.

### Task 8: Reorder the embeddings and GPU Guides

**Files:**

- Modify: `scripts/udf-ai-v2-content-check.mjs`
- Modify: `docs/data/guides/embeddings-at-scale.mdx`
- Modify: `docs/data/guides/gpu-inference.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/embeddings-at-scale.mdx`
- Modify: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/gpu-inference.mdx`

- [ ] **Step 1: Replace Python-first assertions and verify RED**

Change the embeddings assertion from requiring `vane.ai.embed` as the primary
example to requiring `ai_embed` first, followed by `vane.ai.embed`, then
Relation `embed_text` where chunking is needed.

Change the GPU assertion from requiring `vane.ai.prompt` as the primary vLLM
example to requiring SQL `ai_prompt` with constant vLLM options first, followed
by Python Expression and then Relation prompt for advanced controls.

Run `npm run udf-ai-v2:content:check`; expect FAIL on both current page orders.

- [ ] **Step 2: Reorder Embeddings at Scale**

Use this sequence:

1. hosted/default SQL `ai_embed` task;
2. fixed versus dynamic embedding dimensions and validation;
3. batching/concurrency and worker credentials;
4. Python `vane.ai.embed` alternate projection;
5. Relation `rel.embed_text` only for built-in long-text chunking or other
   Relation controls;
6. custom Relation UDF only for table-shaped preprocessing.

Do not claim SQL `ai_embed` provides Relation-only built-in chunking.

- [ ] **Step 3: Reorder GPU Inference**

Use this sequence:

1. SQL `ai_prompt` with `struct_pack(provider := 'vllm', ...)` for basic text
   generation;
2. Python `vane.ai.prompt` for Python-built provider/request options;
3. Relation `rel.prompt` for structured/multimodal input, explicit backend, or
   Relation actor controls;
4. local versus Ray GPU visibility/reservation;
5. actor reuse, grouping, batch/concurrency tuning, validation, and output.

Keep `engine_args_json`/`generate_args_json` only where they are verified public
SQL bridge fields. Do not put credentials in SQL options.

- [ ] **Step 4: Mirror, verify, and commit**

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
git add scripts/udf-ai-v2-content-check.mjs docs/data/guides/embeddings-at-scale.mdx docs/data/guides/gpu-inference.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/embeddings-at-scale.mdx i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/gpu-inference.mdx
git commit -m "docs: make embedding and GPU guides SQL-first"
```

Expected: checks PASS before commit.

### Task 9: Remove direct contradictions from other Concept and Guide pages

**Files:**

- Modify only if a contradiction is found: `docs/data/guides/multimodal-ingest.mdx`
- Modify only if a contradiction is found: `docs/data/guides/multimodal-pipeline.mdx`
- Modify only if a contradiction is found: `docs/data/guides/structured-transformation.mdx`
- Modify only if a contradiction is found: `docs/data/guides/performance-tuning.mdx`
- Modify only if a contradiction is found: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/multimodal-ingest.mdx`
- Modify only if a contradiction is found: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/multimodal-pipeline.mdx`
- Modify only if a contradiction is found: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/structured-transformation.mdx`
- Modify only if a contradiction is found: `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/performance-tuning.mdx`
- Modify: `scripts/udf-ai-v2-content-check.mjs`

- [ ] **Step 1: Add a corpus-level contradiction check**

Read every English and Chinese file under `docs/data/concepts`,
`docs/data/guides`, and their localized mirrors. Reject language that:

- names SQL, Expression, and Relation as three parallel models;
- says every AI/UDF task should start with Relation API;
- claims a direct SQL Relation/table-function entry point;
- uses Relation `concurrency` where the public control is `actor_number`;
- describes `vane.cls` state as global, durable, checkpointed, or exactly-once.

Keep the matchers phrase-specific enough not to reject legitimate discussion of
three syntaxes or provider concurrency.

- [ ] **Step 2: Run the targeted search before editing**

```bash
rg -n -i "three (parallel |complementary )?(apis|api surfaces|surfaces)|relation.*expression.*sql|sql.*relation api|map_batches\([^)]*concurrency|global state|durable state|checkpointed|exactly-once" docs/data/concepts docs/data/guides i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides
```

Expected: either no matches or a short review list. Inspect each match; do not
mechanically replace legitimate warnings such as "not exactly-once".

- [ ] **Step 3: Make only contradiction fixes**

For each confirmed contradiction, change the smallest paragraph/table row. Do
not structurally rewrite these supporting pages. Keep SQL Expression first only
where the page presents a general API choice; keep Relation first when the page
is specifically teaching a Relation-only multimodal/table-shaped task.

Mirror every changed paragraph in Chinese.

- [ ] **Step 4: Verify and commit only files actually changed**

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
```

Expected: both PASS.

Stage `scripts/udf-ai-v2-content-check.mjs` and only the supporting pages changed
in this task, then commit:

```bash
git commit -m "docs: remove stale UDF and AI API model guidance"
```

### Task 10: Verify bilingual structure and undefined-example safety

**Files:**

- Modify: `scripts/udf-ai-v2-content-check.mjs`

- [ ] **Step 1: Add bilingual structural parity assertions**

For each English/Chinese pair in the approved scope, normalize headings to the
tokens `Expression API`, `SQL`, `Python`, and `Relation API`, then assert the
same token order. Do not require translated prose to have identical byte
lengths or paragraph counts.

For Reference, assert identical API entry lists. For Guides, assert identical
primary API call order. For Concepts, assert identical model order.

- [ ] **Step 2: Add placeholder and undefined-name checks**

Reject placeholders such as:

```text
TODO
TBD
your_function_here
example_alias
Decision(...) when class Decision is absent
con.sql(...) when con is absent from the page
rel.select(...) when rel is absent from the page
```

Implement identifier checks narrowly per page/code example to avoid treating a
Concept's deliberately short illustrative snippet as a runnable Guide. Require
complete setup only in Reference minimal examples and Guide task examples.

- [ ] **Step 3: Run all source-content checks**

```bash
npm run udf-ai-v2:content:check
npm run docs:lint
node --test tests/*.test.mjs
```

Expected:

```text
UDF/AI API v2 content contract passed.
docs lint passed
all Node tests pass
```

- [ ] **Step 4: Commit the final contract hardening**

```bash
git add scripts/udf-ai-v2-content-check.mjs
git commit -m "test: lock SQL-first bilingual API documentation"
```

### Task 11: Regenerate derived documentation and perform final verification

**Files:**

- Modify (generated): `docs/manifest.json`
- Modify (generated): `docs/llms.txt`
- Modify (generated): `docs/llms-full.txt`

- [ ] **Step 1: Regenerate documentation artifacts**

```bash
npm run docs:manifest
npm run docs:llms
```

Expected:

```text
wrote docs/manifest.json
wrote docs/llms.txt and docs/llms-full.txt
```

- [ ] **Step 2: Verify generated files are current**

```bash
npm run docs:manifest:check
npm run docs:llms:check
```

Expected: both report that generated files are up to date.

- [ ] **Step 3: Run the full repository verification set**

```bash
npm run docs:lint
npm run udf-ai-v2:content:check
node --test tests/*.test.mjs
npm run home:content:check
npm run enterprise:content:check
npm run training:content:check
npm run solutions:content:check
npm run lint
npm run typecheck
npm run build
```

Expected: every command exits 0; the Docusaurus build produces both English and
Chinese sites without broken links, MDX errors, TypeScript errors, or locale
errors.

- [ ] **Step 4: Prove Docs Examples are unchanged from the approved baseline**

```bash
git diff --exit-code e0cc6b0 -- docs/data/examples i18n/zh-CN/docusaurus-plugin-content-docs-data/current/examples
```

Expected: exit 0 with no output.

- [ ] **Step 5: Review the rendered routes**

With the existing development server at `http://localhost:4328`, review these
routes in English and under `/zh-CN`:

```text
/docs/data/quickstart/quickstart
/docs/data/reference/udf-api
/docs/data/reference/ai-api
/docs/data/concepts/udfs
/docs/data/concepts/ai-functions
/docs/data/concepts/architecture
/docs/data/concepts/execution-model
/docs/data/concepts/sql-vs-python
/docs/data/guides/custom-python-udfs
/docs/data/guides/ai-functions
/docs/data/guides/embeddings-at-scale
/docs/data/guides/gpu-inference
```

Confirm heading hierarchy, table width, code-block wrapping, cross-links,
Chinese terminology, and that the first visible workflow is SQL Expression.

- [ ] **Step 6: Perform the acceptance audit**

Check every item against the approved design:

- only two top-level API models are presented;
- SQL Expression is visibly the recommended default;
- Python Expression is the alternate entry point to the same model;
- Relation API is specialized and no SQL Relation API is invented;
- every public Reference entry has the same documentation template;
- Reference contains lookup facts, Guides contain full tasks, Concepts contain
  execution/design reasoning;
- SQL aliases are registered before use;
- examples define imports, connection, relation, callable, schema/options, and
  response models when required;
- English and Chinese hierarchy/capability boundaries agree;
- marketing, deployment, contributing, and Docs Examples were not changed by
  this restructure.

- [ ] **Step 7: Commit generated artifacts**

```bash
git add docs/manifest.json docs/llms.txt docs/llms-full.txt
git commit -m "docs: regenerate SQL-first documentation artifacts"
```
