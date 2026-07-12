# Home and Solution Code Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Home, Enterprise Agent, and Training Data marketing snippets with a progressive set of shorter examples that together show SQL, Python UDFs, AI Functions, and local-to-Ray execution.

**Architecture:** Keep the current page structures and `CodeWindow` component. Home remains the minimal SQL-first entry point, Enterprise demonstrates a Python UDF registered and called beside `ai_prompt` in SQL, and Training demonstrates a multi-column GPU batch UDF followed by SQL quality/deduplication and `ai_embed` on Ray. Update the existing page checkers before each implementation so they reject the old snippets and verify only the new essential API shape.

**Tech Stack:** React, TypeScript, Docusaurus, Node.js content checks, CSS, Vane Python/SQL API examples

---

### Task 1: Simplify the Home hero example

**Files:**
- Modify: `scripts/home-content-check.mjs:110-125`
- Modify: `src/pages/Home.tsx:15-32,127-188,199-223`
- Modify: `src/index.css:292-304,3057-3060`

- [ ] **Step 1: Update the Home check to describe the new example**

Replace the Home hero assertions at the end of `scripts/home-content-check.mjs` with:

```js
assert.match(heroCode, /con\.sql\([\s\S]*read_parquet/, 'Homepage hero should load a relation through the public connection SQL API')
assert.match(heroCode, /embeddings = con\.sql\([\s\S]*SELECT id,[\s\S]*ai_embed\([\s\S]*text,[\s\S]*struct_pack\([\s\S]*provider := 'openai'[\s\S]*model := 'text-embedding-3-small'[\s\S]*\) AS embedding[\s\S]*FROM read_parquet\('documents\/\*\.parquet'\)/, 'Homepage hero should show the shortest SQL-first document embedding path')
assert.doesNotMatch(heroCode, /configure\(runner=|\.select\(|vane\.ai\.embed\(/, 'Homepage hero should keep runner configuration and Python Expression syntax out of the minimal path')
assert.match(home, /<CodeWindow filename="embed_documents\.py" running code=\{HERO_CODE\} \/>/, 'Homepage hero should use a filename that matches the document embedding example')
assert.match(home, /Runs locally by default\. Add[\s\S]*vane\.configure\(runner="ray"\)[\s\S]*to run the same pipeline on Ray\./, 'Homepage should explain the local-to-Ray switch outside the code block')
assert.match(home, /默认在本地运行。增加[\s\S]*vane\.configure\(runner="ray"\)[\s\S]*即可让同一条流水线运行在 Ray 上。/, 'Homepage should localize the local-to-Ray explanation')
assert.match(css, /\.home-hero-code\s*\{[\s\S]*margin-top:\s*40px[\s\S]*\.home-hero-code-note\s*\{/, 'Homepage should keep the code note visually attached to the code window')
assert.match(heroCode, /embeddings\.write_parquet\("embeddings\.parquet"\)/, 'Homepage hero should write the embedding relation to an explicit Parquet file')
assertExplicitParquetFileWrites(heroCode, 'Homepage hero code')
assert.throws(
  () => assertExplicitParquetFileWrites('rel.write_parquet("output/")', 'Homepage mutation'),
  /should not end in a slash/,
  'Homepage output guard should reject a trailing-slash directory',
)
assert.throws(
  () => assertExplicitParquetFileWrites('rel.write_parquet("output")', 'Homepage mutation'),
  /should name a \.parquet file/,
  'Homepage output guard should reject an extensionless destination',
)
assert.doesNotMatch(heroCode, /from vane\.ai import describe|\bdescribe\(|vane\.read\(|\.write\(/, 'Homepage hero should not use fictional convenience APIs')
```

- [ ] **Step 2: Run the Home check and verify that the old page fails**

Run:

```bash
node scripts/home-content-check.mjs
```

Expected: FAIL because the old snippet still contains `vane.configure(runner="ray")`, uses `media/*.parquet`, and renders `multimodal.py` without the local-to-Ray note.

- [ ] **Step 3: Replace the Home code constant**

Replace `HERO_CODE` in `src/pages/Home.tsx` with:

```tsx
const HERO_CODE = `<span class="k">import</span> vane

con <span class="p">=</span> vane<span class="p">.</span><span class="f">connect</span><span class="p">()</span>

embeddings <span class="p">=</span> con<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"""
    SELECT id,
           ai_embed(
               text,
               struct_pack(
                   provider := 'openai',
                   model := 'text-embedding-3-small'
               )
           ) AS embedding
    FROM read_parquet('documents/*.parquet')
"""</span><span class="p">)</span>

embeddings<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"embeddings.parquet"</span><span class="p">)</span><span class="cur"></span>`
```

- [ ] **Step 4: Add localized runner-switch copy and keep it outside the code**

Add these keys to the English Home copy immediately after `preRelease`:

```tsx
heroCodeLocal: 'Runs locally by default. Add',
heroCodeRay: 'to run the same pipeline on Ray.',
```

Add the Chinese counterparts immediately after its `preRelease`:

```tsx
heroCodeLocal: '默认在本地运行。增加',
heroCodeRay: '即可让同一条流水线运行在 Ray 上。',
```

Replace the existing standalone `CodeWindow` with:

```tsx
<div className="home-hero-code">
  <CodeWindow filename="embed_documents.py" running code={HERO_CODE} />
  <p className="home-hero-code-note">
    {copy.heroCodeLocal} <code>vane.configure(runner="ray")</code> {copy.heroCodeRay}
  </p>
</div>
```

- [ ] **Step 5: Style the Home code wrapper without changing the page layout**

Replace `.home-hero-grid > .term` near the hero styles with:

```css
.home-hero-code {
  min-width: 0;
  margin-top: 40px;
}
.home-hero-code .term { width: 100%; }
.home-hero-code-note {
  margin: 12px 4px 0;
  color: var(--ink-3);
  font-size: 12.5px;
  line-height: 1.5;
}
.home-hero-code-note code {
  color: var(--ink);
  font-size: 0.95em;
}
```

Replace the mobile rule `.home-hero-grid > .term { margin-top: 0; }` with:

```css
.home-hero-code { margin-top: 0; }
```

- [ ] **Step 6: Run the Home check**

Run:

```bash
node scripts/home-content-check.mjs
```

Expected: PASS with no output.

- [ ] **Step 7: Commit the Home change**

```bash
git add scripts/home-content-check.mjs src/pages/Home.tsx src/index.css
git commit -m "feat: simplify homepage Vane example"
```

### Task 2: Show a Python SQL alias beside `ai_prompt` on the Enterprise page

**Files:**
- Modify: `scripts/enterprise-use-case-check.mjs:53-79,116-127`
- Modify: `src/pages/EnterpriseAgentUseCase.tsx:13-47,221-227,321-345`

- [ ] **Step 1: Replace old Enterprise snippet expectations**

In `mustIncludeInPage`, replace the code-specific entries from the input path through the old example lead with:

```js
  "read_parquet('claims/*.parquet')",
  '@vane.func(return_dtype="VARCHAR")',
  'def policy_check(text):',
  'vane.attach_function(',
  'parameters=["VARCHAR"]',
  'policy_check(text) AS rule_hit',
  'ai_prompt(',
  'struct_pack(',
  "provider := 'openai'",
  "model := 'gpt-4o-mini'",
  "system_message := 'Find missing claim evidence.'",
  'AS ai_finding',
  'source_uri',
  'findings.write_parquet("audit_findings.parquet")',
  'Register a Python policy rule once, then call it beside ai_prompt in SQL. Business IDs and source references stay on every audit row.',
```

Replace the old Chinese example-lead entry with:

```js
  'Python 规则注册一次后即可在 SQL 中与 ai_prompt 并排调用；业务 ID 和来源引用始终保留在每条审核结果中。',
```

Replace the core `auditCode` projection assertion with:

```js
assert.match(auditCode, /@vane\.func\(return_dtype="VARCHAR"\)[\s\S]*def policy_check\(text\):/, 'enterprise code should define a typed Python policy UDF')
assert.match(auditCode, /vane\.attach_function\([\s\S]*policy_check,[\s\S]*parameters=\["VARCHAR"\],[\s\S]*connection=con,[\s\S]*\)/, 'enterprise code should register the Python UDF as a SQL alias')
assert.match(auditCode, /SELECT claim_id, document_id,[\s\S]*policy_check\(text\) AS rule_hit,[\s\S]*ai_prompt\([\s\S]*AS ai_finding,[\s\S]*source_uri[\s\S]*FROM read_parquet\('claims\/\*\.parquet'\)/, 'enterprise SQL should call the Python rule and AI Function in one auditable projection')
assert.match(auditCode, /findings\.write_parquet\("audit_findings\.parquet"\)/, 'enterprise code should finish with one explicit Parquet output')
assert.doesNotMatch(auditCode, /docs = con\.sql|reviewed = con\.sql|final = con\.sql|\.to_table\(/, 'enterprise code should not retain the old temporary relation chain')
assert.doesNotMatch(auditCode, /audit_json|Return JSON/, 'enterprise SQL sample should not promise schema-validated JSON without validation')
```

- [ ] **Step 2: Run the Enterprise check and verify that the old page fails**

Run:

```bash
node scripts/enterprise-use-case-check.mjs
```

Expected: FAIL because the old example defines no `vane.func`, no SQL alias, and still contains `docs`, `reviewed`, `final`, and `to_table()` stages.

- [ ] **Step 3: Replace `AUDIT_CODE`**

Use this complete code in `src/pages/EnterpriseAgentUseCase.tsx`:

```tsx
const AUDIT_CODE = `import vane

@vane.func(return_dtype="VARCHAR")
def policy_check(text):
    return "missing_signature" if "missing signature" in text.lower() else None

con = vane.connect()
vane.attach_function(
    policy_check,
    parameters=["VARCHAR"],
    connection=con,
)

findings = con.sql("""
    SELECT claim_id, document_id,
           policy_check(text) AS rule_hit,
           ai_prompt(
               text,
               struct_pack(
                   provider := 'openai',
                   model := 'gpt-4o-mini',
                   system_message := 'Find missing claim evidence.'
               )
           ) AS ai_finding,
           source_uri
    FROM read_parquet('claims/*.parquet')
""")

findings.write_parquet("audit_findings.parquet")`
```

- [ ] **Step 4: Align the Enterprise explanation and diagram labels with the new columns**

Replace the English and Chinese `exampleLead` values with:

```tsx
exampleLead: 'Register a Python policy rule once, then call it beside ai_prompt in SQL. Business IDs and source references stay on every audit row.',
```

```tsx
exampleLead: 'Python 规则注册一次后即可在 SQL 中与 ai_prompt 并排调用；业务 ID 和来源引用始终保留在每条审核结果中。',
```

Replace the diagram stage/output constants and their comment with:

```tsx
const PIPELINE_STAGES_EN = ['Python rule', 'SQL AI review', 'audit rows']
const PIPELINE_STAGES_ZH = ['Python 规则', 'SQL AI 审查', '审核结果']
// The output labels mirror AUDIT_CODE so the diagram and code tell the same story.
const AUDIT_OUTPUTS_EN = ['rule hit', 'AI finding', 'source URI']
const AUDIT_OUTPUTS_ZH = ['规则命中', 'AI 发现', '来源 URI']
```

- [ ] **Step 5: Run the Enterprise check**

Run:

```bash
node scripts/enterprise-use-case-check.mjs
```

Expected: PASS with no output.

- [ ] **Step 6: Commit the Enterprise change**

```bash
git add scripts/enterprise-use-case-check.mjs src/pages/EnterpriseAgentUseCase.tsx
git commit -m "feat: clarify enterprise SQL UDF example"
```

### Task 3: Compress the Training Data pipeline while keeping Ray and GPU execution visible

**Files:**
- Modify: `scripts/training-use-case-check.mjs:72-90,132-140`
- Modify: `src/pages/TrainingUseCase.tsx:16-64,207-253`

- [ ] **Step 1: Update the Training checker for the shortened pipeline**

In `mustIncludeInPage`, replace the five code-comment entries and the old input/note/output entries with:

```js
  'CaptionAndScore',
  'release_schema',
  "read_parquet('s3://training-corpus/*.parquet')",
  'labeled.to_table("labeled")',
  'quality_score >= 0.8',
  'QUALIFY row_number() OVER',
  'PARTITION BY content_hash',
  'ai_embed(',
  'caption_embedding',
  'CaptionAndScore is your GPU batch UDF. Vane reuses it across Ray actors; remove the runner configuration to execute the same pipeline locally.',
  'CaptionAndScore 是你的 GPU batch UDF。Vane 会在 Ray actors 中复用它；删除 runner 配置即可让同一条流水线在本地执行。',
  's3://dataset-releases/mm-v42/part-00000.parquet',
```

Replace the `captionCall` and `releaseQuery` assertion block with:

```js
const captionCall = pipelineCode.match(/labeled = raw\.map_batches\(([\s\S]*?)\n\)/)?.[0] ?? ''
assert.match(captionCall, /CaptionAndScore/, 'training actor stage should bind CaptionAndScore')
assert.match(captionCall, /gpus=1/, 'CaptionAndScore should use the public gpus resource parameter')
assert.match(captionCall, /actor_number=[1-9]\d*/, 'CaptionAndScore should declare a positive actor pool')
assert.doesNotMatch(captionCall, /execution_backend=|batch_size=/, 'training marketing code should let the Ray runner infer the backend and omit tuning details')
const releaseQuery = pipelineCode.match(/release = con\.sql\("""([\s\S]*?)"""\)/)?.[0] ?? ''
assert.match(releaseQuery, /SELECT id, uri,[\s\S]*caption,[\s\S]*ai_embed\([\s\S]*caption,[\s\S]*provider := 'transformers'[\s\S]*\) AS caption_embedding[\s\S]*FROM labeled[\s\S]*WHERE quality_score >= 0\.8[\s\S]*QUALIFY row_number\(\) OVER[\s\S]*PARTITION BY content_hash/, 'training code should combine quality gating, deduplication, and SQL embedding in one release query')
assert.doesNotMatch(pipelineCode, /curated =|curated\.to_table|FROM curated|vane\.ai\.embed\(|\.embed_text\(/, 'training marketing code should remove the second materialization and lead with SQL ai_embed')
```

- [ ] **Step 2: Run the Training check and verify that the old page fails**

Run:

```bash
node scripts/training-use-case-check.mjs
```

Expected: FAIL because the old snippet still specifies `execution_backend` and `batch_size`, materializes `curated`, and has no combined `QUALIFY` release query.

- [ ] **Step 3: Replace `PIPELINE_CODE`**

Use this complete code in `src/pages/TrainingUseCase.tsx`:

```tsx
const PIPELINE_CODE = `import vane

vane.configure(runner="ray")
con = vane.connect()

raw = con.sql("""
    SELECT id, uri, media_type, content_hash
    FROM read_parquet('s3://training-corpus/*.parquet')
    WHERE split = 'train'
""")

labeled = raw.map_batches(
    CaptionAndScore,
    schema=release_schema,
    gpus=1,
    actor_number=4,
)
labeled.to_table("labeled")

release = con.sql("""
    SELECT id, uri, caption, quality_score,
           ai_embed(
               caption,
               struct_pack(
                   provider := 'transformers',
                   model := 'sentence-transformers/all-MiniLM-L6-v2'
               )
           ) AS caption_embedding
    FROM labeled
    WHERE quality_score >= 0.8
    QUALIFY row_number() OVER (
        PARTITION BY content_hash
        ORDER BY quality_score DESC
    ) = 1
""")

release.write_parquet("s3://dataset-releases/mm-v42/part-00000.parquet")`
```

- [ ] **Step 4: Update the Training note to explain actor reuse and the local switch**

Replace the English and Chinese `note` values with:

```tsx
note: 'CaptionAndScore is your GPU batch UDF. Vane reuses it across Ray actors; remove the runner configuration to execute the same pipeline locally.',
```

```tsx
note: 'CaptionAndScore 是你的 GPU batch UDF。Vane 会在 Ray actors 中复用它；删除 runner 配置即可让同一条流水线在本地执行。',
```

- [ ] **Step 5: Run the Training check**

Run:

```bash
node scripts/training-use-case-check.mjs
```

Expected: PASS with no output.

- [ ] **Step 6: Commit the Training change**

```bash
git add scripts/training-use-case-check.mjs src/pages/TrainingUseCase.tsx
git commit -m "feat: simplify training data pipeline example"
```

### Task 4: Run integrated static and production verification

**Files:**
- Verify: `src/pages/Home.tsx`
- Verify: `src/pages/EnterpriseAgentUseCase.tsx`
- Verify: `src/pages/TrainingUseCase.tsx`
- Verify: `src/index.css`

- [ ] **Step 1: Run all three page checks together**

Run:

```bash
node scripts/home-content-check.mjs
node scripts/enterprise-use-case-check.mjs
node scripts/training-use-case-check.mjs
```

Expected: each command exits 0 with no output.

- [ ] **Step 2: Run TypeScript checking**

Run:

```bash
pnpm typecheck
```

Expected: exit 0 with no TypeScript errors.

- [ ] **Step 3: Build the production site**

Run:

```bash
pnpm build
```

Expected: Docusaurus reports a successful English and Chinese production build and exits 0.

- [ ] **Step 4: Confirm the three routes on the local review server**

If port 4328 is not already serving this worktree, run `env PORT=4328 pnpm dev` in a persistent session. Then run:

```bash
curl -I http://127.0.0.1:4328/
curl -I http://127.0.0.1:4328/use-cases/enterprise-agent
curl -I http://127.0.0.1:4328/use-cases/training
```

Expected: all three responses report HTTP 200.

- [ ] **Step 5: Inspect desktop and narrow-screen rendering**

Capture the three routes at a desktop width and the Home route at a narrow width. Confirm:

- the Home note remains directly below its code window;
- no code block clips outside its container;
- Enterprise visibly contains `policy_check`, `ai_prompt`, and the source fields in one code window;
- Training visibly presents selection, one GPU UDF stage, one release query, and one writer without a second intermediate relation;
- no Docs or Docs Examples files changed.

- [ ] **Step 6: Check the final diff and worktree state**

Run:

```bash
git diff --check
git status --short
git diff 1e95041 -- docs/data/examples
```

Expected: `git diff --check` has no output, the worktree contains no uncommitted implementation files, and the Docs Examples diff from the approved-design commit contains no changes.
