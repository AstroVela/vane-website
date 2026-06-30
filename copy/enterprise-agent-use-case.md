<!--
================================================================
  文案稿 · 用例页「企业多模态 Agent」 — src/pages/EnterpriseAgentUseCase.tsx
  路由：/use-cases/enterprise-agent
================================================================
  编辑方法：
  • 只修改每个条目【正文】（ID 行下方的文字），不要改 `id` 行、标题(##)、注释。
  • 每个 `### \`id\`` 对应页面上一处文案；保留 id 不变，我据此回填到代码。
  • 列表（- ）请按行修改、不要增删行数/顺序。
  • “messy materials → auditable facts”这条 motif 在页面多处重复出现，是品牌主线，
    若要改请统一改 `motif` 一处，我会同步到所有出现位置。
  • 末尾“代码示例”里的 SQL 可改注释/字符串，请保持结构可运行。
  • 改完把整个文件发回给我即可。
================================================================
-->

# 企业 Agent 用例页文案

## 0. SEO / 分享元信息

### `meta.title` — 浏览器标题
Enterprise Multimodal Agent Infrastructure — Vane

### `meta.description` — 搜索描述
Turn messy multimodal business materials — PDFs, scans, photos, forms, spreadsheets, logs — into auditable facts. One pipeline for files, models and rules.

### `meta.og.title` — 分享标题
Turn messy multimodal business materials into auditable facts.

### `meta.og.description` — 分享描述
messy materials → auditable facts for claims, compliance and document review teams.

---

## 全局主线 Motif（多处重复）

### `motif` — 主线短语（左 → 右）
messy materials → auditable facts

---

## 1. Hero 英雄区

### `hero.eyebrow` — 顶部小标签
Enterprise Multimodal Agent Infrastructure

### `hero.h1` — 主标题
Turn messy multimodal business materials into auditable facts.

### `hero.lead` — 副标题
Claims, compliance and document review — Vane extracts the evidence, runs the rules, and returns auditable findings.

### `hero.audience` — 受众行
claims teams · compliance teams · document review teams · enterprise AI teams

### `hero.btn.run` — 按钮①（实心）
Run the claims pipeline

### `hero.btn.docs` — 按钮②
Read the docs

### `hero.install` — 安装行
$ pip install vane-ai · Apache-2.0

#### 右侧示意图（messy materials → VANE → auditable facts）

### `hero.diagram.inputLabel` — 输入栏标题
messy materials

### `hero.diagram.inputs` — 输入标签（6 个，逐行）
- PDF
- scan
- photo
- form
- sheet
- log

### `hero.diagram.outputLabel` — 输出栏标题
auditable facts

### `hero.diagram.outputs` — 输出标签（3 个，逐行）
- finding + evidence
- review task
- claim summary

---

## 2. The Problem 问题区

### `problem.eyebrow` — 小标签
The Problem

### `problem.h2` — 标题
The hard part isn't calling a model — it's rebuilding the evidence chain.

### `problem.lead` — 副标题
Today that chain is stitched across scattered systems and glue code.

#### 左框 BEFORE（碎片化链路）

### `problem.before.title` — 框标题
BEFORE — a fragmented chain

### `problem.before.steps` — 流程步骤（7 步，逐行）
- Messy Materials
- OCR scripts
- Temp files
- LLM calls
- More scripts
- SQL rules
- Manual review

### `problem.before.footer` — 框底部告警行
⚠ scattered systems · glue code everywhere · missing provenance · hard to debug · poor reproducibility

#### 右框 AFTER（一条流水线）

### `problem.after.title` — 框标题
AFTER — one pipeline

### `problem.after.flow` — 流程节点（逐行，自上而下）
- Messy Materials
- VANE
- Auditable Facts

### `problem.after.outputs` — 节点下方输出说明
evidence · review · summary

> 框底部还会显示 `motif`（见“全局主线 Motif”）

---

## 3. How Vane Works 工作原理区

### `how.eyebrow` — 小标签
How Vane Works

### `how.h2` — 标题
messy materials → auditable facts, as one pipeline.

#### 卡片①

### `how.card.1.title` — 标题
One pipeline for files, models and rules

### `how.card.1.copy` — 描述
File extraction, model inference and SQL rules run as one pipeline.

### `how.card.1.viz` — 图示芯片（逐行；最后一项为高亮结果）
- files
- models
- rules
- one pipeline

#### 卡片②

### `how.card.2.title` — 标题
Every finding comes with evidence

### `how.card.2.copy` — 描述
Each finding carries its proof — explainable and reviewable.

### `how.card.2.viz` — 图示芯片（逐行；第一项为高亮，第二项为证据明细）
- finding
- file · chunk · quote · confidence · rule

#### 卡片③

### `how.card.3.title` — 标题
Scale without rewriting

### `how.card.3.copy` — 描述
Start local, move to distributed — business logic unchanged.

### `how.card.3.viz` — 图示芯片（逐行；最后一项为高亮结果）
- local
- distributed
- same pipeline

---

## 4. Real Example 真实示例区

### `example.eyebrow` — 小标签
Real Example

### `example.h2` — 标题
Claims evidence pipeline

### `example.lead` — 副标题
Turn a claim packet — photos, scanned forms, estimates — into evidence, review tasks and a claim-level summary.

#### 示意图

### `example.diagram.inputLabel` — 输入标题
Claim packet

### `example.diagram.inputNode` — 输入节点
photos · scanned forms · estimates

### `example.diagram.pipeline` — 中间流水线步骤（逐行；最后一项为高亮条）
- extract
- model
- SQL rules
- VANE: one pipeline

### `example.diagram.outputLabel` — 输出标题
Outputs

### `example.diagram.outputs` — 输出节点（逐行）
- evidence
- review tasks
- claim summary

#### 代码下方的 Note

### `example.note.label` — 标签
Note

### `example.note.text` — 说明
Runs on public / synthetic proxy data — it shows the pipeline shape, not a production decision system. Plug in your own OCR / VLM / LLM along the same interface.

### `example.btn.run` — 按钮
Run the claims pipeline

> SQL 代码窗口见末尾“代码示例 · claims_evidence.sql”

---

## 5. Run It 运行区

### `run.eyebrow` — 小标签
Run It

### `run.h2` — 标题
Three commands to inspect the pipeline shape.

### `run.terminal.line1` — 终端第①行
$ pip install vane-ai

### `run.terminal.line2` — 终端第②行
$ python -m vane_examples.claims_evidence

### `run.terminal.line3` — 终端第③行（输出 + 括注）
→ evidence · review_tasks · claim_summary (runs CPU-only)

---

## 6. CTA 收尾区

> 顶部 kicker 显示 `motif`（见“全局主线 Motif”）

### `cta.title` — 标题
Have a stack of claims to turn into auditable facts?

### `cta.btn.run` — 按钮①（实心）
Run the claims pipeline

### `cta.btn.partner` — 按钮②
Become a design partner

---

## 7. 页脚（与首页共享，非首页版本只显示这句简介）

### `footer.tagline` — 简介
The multimodal-native data engine for AI workloads.

---

## 8. 代码示例 · claims_evidence.sql

> 可改注释/字符串文案，请保持 SQL 结构可运行。

```sql
-- files → extraction → model → SQL → finding, in one execution plan
WITH evidence AS (
  SELECT claim_id, file_id,
         extract_document(media_type, uri)                  AS doc,  -- OCR / parse
         prompt('Extract claim fields as JSON; keep the quote', doc) AS fact  -- model, in SQL
  FROM read_files('claims/CLM-POC-001/*')                           -- files
)
SELECT claim_id, fact,
       provenance()   AS evidence,      -- file · chunk · quote · confidence
       'needs_review' AS status         -- SQL rule → finding
FROM evidence
WHERE confidence < 0.8;
```
