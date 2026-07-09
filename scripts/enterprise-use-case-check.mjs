import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/EnterpriseAgentUseCase.tsx'
const componentPath = 'src/components/EnterpriseContextAnimation.tsx'
const routesPath = 'src/plugins/vaneRoutes.ts'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)
assert.ok(existsSync(componentPath), `${componentPath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const component = readFileSync(componentPath, 'utf8')
const routes = readFileSync(routesPath, 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')
const siteLinks = readFileSync('src/siteLinks.ts', 'utf8')
const css = readFileSync('src/index.css', 'utf8')

const mustIncludeInPage = [
  'Enterprise Multimodal Data Infrastructure — Vane',
  'Use Vane Data to keep parsed document rows, media references, SQL rules, explicit UDF stages, and model-assisted review in one auditable relation workflow.',
  'Keep source rows, rules, model output, and source references together for enterprise review workflows.',
  'Enterprise Multimodal Data Infrastructure',
  'Turn messy multimodal business materials into auditable facts.',
  'Bring parsed document rows, media references, tables, logs, and model outputs into one pipeline. Use SQL for deterministic checks, explicit UDF stages for extraction, and model-assisted review where it belongs.',
  'document rows · media refs · tables · logs · model outputs',
  'messy materials',
  'auditable facts',
  'insights',
  'evidence',
  'recommendations',
  "The hard part isn't calling a model — it's rebuilding the evidence chain.",
  'Today that chain is stitched across OCR scripts, temp files, model calls, SQL jobs, and review tools.',
  'BEFORE — a fragmented chain',
  'AFTER — one pipeline',
  'scattered systems',
  'lost source references',
  'source rows → auditable outputs, as one relation pipeline.',
  'Compose SQL, UDFs, and model review as relations',
  'Start with parsed rows and source metadata, then add SQL rules, explicit UDF stages, and model-assisted review without splitting the workflow across separate jobs.',
  'parsed rows',
  'SQL rules',
  'UDF stages',
  'relation pipeline',
  'Make source references part of the output',
  'AI Function 会返回配置好的输出列，显式保留文档 ID、规则命中、审计 JSON 和来源 URI。',
  'review row',
  'Move to Ray after local validation',
  'Validate locally first, then switch runner and UDF backends when distribution helps. The relation shape stays stable; worker storage, dependencies, and credentials still matter.',
  'local sample',
  'Ray runner',
  'same relation shape',
  'Insurance document audit pattern',
  'Parsed document table',
  'document_id',
  'source_uri',
  'model review',
  'audit rows',
  'insurance_document_audit.py',
  'from pydantic import BaseModel',
  'class AuditResult(BaseModel):',
  'import vane',
  'const AUDIT_CODE',
  'const INSURANCE_AUDIT_DOC',
  '/docs/data/examples/insurance-document-audit',
  "read_parquet('data/insurance_documents/*.parquet')",
  "when lower(text) like '%missing signature%' then 'missing_signature'",
  'audit_only = docs.prompt(',
  'system_message="Audit the insurance document for missing evidence. Return JSON."',
  'return_format=AuditResult',
  'output_column="audit_json"',
  'docs_table = docs.to_arrow_table()',
  'audit_table = audit_only.to_arrow_table()',
  'if docs_table.num_rows != audit_table.num_rows:',
  'raise ValueError("model output row count changed")',
  'final = con.sql("""',
  'select claim_id, document_id, document_type, rule_hit, audit_json, source_uri',
  'from audited join rule_hits using (document_id, claim_id, document_type, source_uri)',
  'source_uri',
  'Start from parsed claim documents and source references, then apply deterministic rules and optional model review in one auditable relation.',
  'Have document rows, media references, logs, or model outputs to turn into auditable facts?',
  'Run the pipeline',
  'Request a demo',
  '企业多模态Agent — Vane',
  '把分散的业务材料整理成可复核的证据链',
  '从繁杂的多模态文件到Agent的业务决策',
  '一个SQL流水线统筹文档、图片、视频、表格、日志处理和模型推理，Agent决策可信可追溯',
  '运行示例',
  '可信决策',
  '为Agent构建从多模态文件到可信决策和可追溯的证据链',
  '以一条关系语义的SQL流水线，从多模数据变成可信决策',
  '模型推理',
  'UDF 计算',
  '证据追溯',
  '本地运行',
  '从本地运行，简单快速的切换到 Ray 分布式运行',
  '把来源引用保留到最终结果里',
  '从本地执行，快速切换到 Ray 扩展',
  '保险审核流水线',
  '从理赔申请和原始理赔材料出发，在一条SQL流水线里完成非结构数据处理、模型推理和规则检查。',
  '原始材料',
  '业务洞察',
  '决策建议',
  '证据链',
  '文件处理',
  '有文档、视频、图片、日志等多模数据需要转变为Agent可信决策吗？',
  '申请演示',
]

for (const text of mustIncludeInPage) {
  assert.match(page, new RegExp(escapeRegExp(text)), `${pagePath} should include "${text}"`)
}

const motifCount = page.match(/<Motif/g)?.length ?? 0
assert.ok(motifCount >= 2, 'motif should be rendered in the hero and problem flow')

const codeWindowCount = page.match(/<CodeWindow/g)?.length ?? 0
assert.equal(codeWindowCount, 1, 'enterprise page should contain exactly one CodeWindow')
assert.doesNotMatch(page, /enterprise-honesty|Vane Data does not ship a dedicated insurance workflow\.|This example shows the SQL and Relation API shape, not a production decision system\.|OCR, parsing, and policy-system extraction happen upstream or in explicit UDF stages\.|Vane Data 不自带专用保险工作流。|这个示例展示的是 SQL 和 Relation API 的形态，而不是生产决策系统。|OCR、解析和保单系统抽取发生在上游或显式 UDF 计算。/, 'enterprise page should not render or retain the explanatory note box copy in either locale')

assert.match(page, /<section className="intro enterprise-hero">\s*<div className="wrap enterprise-hero-grid">\s*<div className="enterprise-hero-copy">[\s\S]*<h1 className="h1 enterprise-hero-title">\{copy\.heading\}<\/h1>[\s\S]*<p className="lead enterprise-hero-lead">[\s\S]*<div className="enterprise-hero-actions">\s*<Button solid to=\{INSURANCE_AUDIT_DOC\} arrow>\{copy\.runPipeline\}<\/Button>\s*<Button href=\{ENTERPRISE_DESIGN_PARTNER_MAILTO\} arrow>\{copy\.requestDemo\}<\/Button>\s*<\/div>\s*<div className="enterprise-hero-meta">[\s\S]*<div className="enterprise-hero-art">\s*<EnterpriseContextAnimation \/>\s*<\/div>/, 'enterprise hero should match the training two-column copy/action + right-rail visual pattern')
assert.doesNotMatch(page, /function HeroDiagram|<HeroDiagram \/>|enterprise-hero-diagram/, 'enterprise page should replace the old hero mini diagram with the context animation')
assert.doesNotMatch(page, /<Divider \/>\s*<EnterpriseContextAnimation \/>\s*<Divider \/>/, 'enterprise page should remove the standalone Context pipeline section')
assert.doesNotMatch(page, /solution-hero-media|className="enterprise-audience"|extract_document\(media_type, uri\)|provenance\(\)|OCR \/ parse|recommended_review|fact\.confidence < 0\.8|source file, chunk, quote, confidence|<span>extract<\/span>|python -m vane_examples|claims_evidence\.sql|function RunTerminal|const CLAIMS_CODE|prompt\('Audit this document for missing evidence\. Return JSON\.', text\)|rule_hit IS NOT NULL|Runs on public \/ synthetic proxy data|Claims evidence pipeline|missing provenance|One pipeline for parsed files, models, and rules|One pipeline for source rows, models, and rules|Keep evidence beside each output|Scale without rewriting|business logic unchanged|same pipeline|Every insight comes with evidence|Run the example pipeline|Read the docs/, 'enterprise page should not imply built-in OCR/provenance helpers, runnable example modules, SQL scalar prompt helpers, old hero layout, or overclaim local-to-Ray / evidence behavior')

assert.doesNotMatch(component, /import Eyebrow|<section className="section enterprise-context-animation"|enterprise-context-animation|<div className="wrap"|<div className="shead"|Context pipeline|<h2 className="h2">Multimodal context pipeline<\/h2>/, 'enterprise context animation should render as a hero visual, not a standalone section')
assert.match(component, /contract\.pdf/, 'enterprise context animation should include broad enterprise document examples')
assert.match(component, /inspection photo/, 'enterprise context animation should include image input')
assert.match(component, /video frame/, 'enterprise context animation should include video input')
assert.match(component, /call audio/, 'enterprise context animation should include audio input')
assert.match(component, /system log/, 'enterprise context animation should include log input')
assert.match(component, /eca-media-grid|eca-waveform|eca-log-lines|eca-video-strip/, 'enterprise context animation should render input-specific document details, not generic cards only')
assert.match(component, /<strong>Vane<\/strong>/, 'enterprise context animation should keep one central Vane mark')
assert.doesNotMatch(component, /DAG_NODES|Parse documents|Decode media|Normalize tables|Parse logs\/events|Evidence units|Structured signals|Apply rules & package|className:\s*'parse-docs'|edge-docs-evidence|eca-dag|token-docs|token-media|token-tables|token-logs|token-evidence|token-signals|Vane multimodal compute/, 'enterprise context animation should remove all middle DAG nodes, edges, moving DAG tokens, and helper copy')
assert.match(component, /insights[\s\S]*evidence[\s\S]*recommendations/, 'enterprise context animation should output insights, evidence, and recommendations')
assert.match(component, /document · rule · source URI/, 'enterprise context animation should describe evidence using the documented output/source-reference shape')
assert.match(component, /Agent-ready outputs/, 'enterprise context animation should include the richer right-side output panel')
assert.doesNotMatch(component, /Context received|Evidence checked|Recommendation prepared|eca-agent-trace/, 'enterprise context animation should remove the right-side trace copy')
assert.doesNotMatch(component, /<span className=\{`eca-dag-node \$\{node\.className\}`\} key=\{node\.label\}>lineage<\/span>|label:\s*'lineage'|lineage kept/, 'enterprise context animation should not model lineage as a DAG node')
assert.match(css, /\.enterprise-hero-grid\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*520px;[\s\S]*align-items:\s*center;/, 'enterprise hero should use a training-like two-column desktop layout')
assert.match(css, /\.enterprise-hero-art\s*\{[\s\S]*--enterprise-context-scale:\s*0\.8125;[\s\S]*height:\s*calc\(330px \* var\(--enterprise-context-scale\)\);[\s\S]*\.enterprise-hero-art \.enterprise-context-stage\s*\{[\s\S]*right:\s*0;[\s\S]*top:\s*-8px;[\s\S]*width:\s*640px;[\s\S]*transform:\s*scale\(var\(--enterprise-context-scale\)\);[\s\S]*transform-origin:\s*top right;/, 'enterprise hero should reserve a scaled right rail for the context animation')
assert.match(css, /\.enterprise-hero-title\s*\{[\s\S]*max-width:\s*760px;[\s\S]*font-size:\s*clamp\(34px,\s*4\.6vw,\s*52px\);[\s\S]*\.enterprise-hero-meta\s*\{[\s\S]*display:\s*flex;[\s\S]*flex-wrap:\s*wrap;[\s\S]*\.enterprise-hero-actions\s*\{[\s\S]*display:\s*flex;/, 'enterprise hero layout classes should define title width, meta row, and actions')
assert.match(page, /HOW_CARDS\.map\(\(card, index\)[\s\S]*enterprise-how-head[\s\S]*enterprise-how-step">STEP \{String\(index \+ 1\)\.padStart\(2, '0'\)\}[\s\S]*enterprise-how-viz-wrap/, 'enterprise how cards should render as numbered process cards')
assert.match(css, /\.enterprise-how-card\s*\{[\s\S]*display:\s*flex;[\s\S]*flex-direction:\s*column;[\s\S]*overflow:\s*hidden;[\s\S]*\.enterprise-how-head\s*\{[\s\S]*flex-direction:\s*column;[\s\S]*border-bottom:\s*1\.5px solid var\(--line-2\);[\s\S]*\.enterprise-how-step\s*\{[\s\S]*gap:\s*9px;[\s\S]*font-family:\s*var\(--font-pixel\);[\s\S]*\.enterprise-how-step::after\s*\{[\s\S]*background:\s*var\(--line-2\);[\s\S]*\.enterprise-how-viz-wrap\s*\{[\s\S]*background-size:\s*34px 34px, 34px 34px, auto;/, 'enterprise how cards should use a designed numbered process layout')
assert.match(css, /@media \(max-width: 900px\)\s*\{[\s\S]*\.enterprise-hero-grid,[\s\S]*grid-template-columns:\s*1fr;[\s\S]*\.enterprise-hero-art\s*\{[\s\S]*justify-content:\s*center;/, 'enterprise hero should stack cleanly on tablet and mobile widths')
assert.doesNotMatch(css, /\.solution-hero-media/, 'enterprise hero should not keep the old centered-below media selector')
assert.doesNotMatch(css, /\.enterprise-audience\s*\{/, 'enterprise hero should remove the redundant audience-only style')
assert.match(css, /\.enterprise-context-stage\s*\{[\s\S]*width:\s*min\(100%,\s*640px\);[\s\S]*height:\s*330px;/, 'enterprise context animation should restore the previous hero-right stage size')
assert.match(css, /\.eca-input-world\s*\{[\s\S]*left:\s*18px;[\s\S]*top:\s*24px;[\s\S]*width:\s*185px;[\s\S]*\.eca-output-world\s*\{[\s\S]*right:\s*18px;[\s\S]*top:\s*24px;[\s\S]*width:\s*190px;/, 'enterprise context animation should restore the previous left and right rail sizes')
assert.match(css, /\.eca-source-card\s*\{[\s\S]*width:\s*112px;[\s\S]*min-height:\s*74px;/, 'enterprise context animation should restore the previous input card scale')
assert.match(css, /\.eca-pdf\s*\{ left:\s*5px; top:\s*4px;[\s\S]*\.eca-image\s*\{ left:\s*63px; top:\s*30px;[\s\S]*\.eca-video\s*\{ left:\s*18px; top:\s*92px;[\s\S]*\.eca-audio\s*\{ left:\s*75px; top:\s*121px;[\s\S]*\.eca-sheet\s*\{ left:\s*3px; top:\s*180px;[\s\S]*\.eca-log\s*\{ left:\s*82px; top:\s*198px;/, 'enterprise context animation should restore the previous overlapping input-card composition')
assert.match(css, /\.eca-vane-world\s*\{[\s\S]*left:\s*calc\(50% - 55px\);[\s\S]*top:\s*116px;[\s\S]*width:\s*110px;[\s\S]*height:\s*76px;/, 'enterprise context animation should center the compact Vane box between the rails')
assert.match(css, /\.eca-vane-mark\s*\{[\s\S]*z-index:\s*30;[\s\S]*opacity:\s*1;[\s\S]*background:\s*rgba\(251,250,246,0\.96\);/, 'enterprise context animation should keep the central Vane mark opaque')
assert.match(component, /className="eca-static-arrows"[\s\S]*id="eca-arrow-head"[\s\S]*className="eca-static-arrow arrow-input"[\s\S]*className="eca-static-arrow arrow-output"/, 'enterprise context animation should use two static arrows through Vane')
assert.match(css, /\.eca-static-arrows\s*\{[\s\S]*width:\s*100%;[\s\S]*height:\s*100%;[\s\S]*\.eca-static-arrow\s*\{[\s\S]*marker-end:\s*url\(#eca-arrow-head\);/, 'enterprise context animation should style static arrow connectors')
assert.doesNotMatch(component, /eca-motion-line|eca-motion-dot|<circle className="eca-motion-dot/, 'enterprise context animation should remove moving connector dots and old line elements')
assert.doesNotMatch(css, /--enterprise-context-duration|animation:\s*[^;]*eca|@keyframes eca|stroke-dasharray:\s*7 8|\.eca-motion-line|\.eca-motion-dot/, 'enterprise context animation should be a static frame with no eca animation or dashed connector styles')
assert.doesNotMatch(css, /\.enterprise-context-animation|\.eca-dag|ecaDagTokenPath|ecaNodeFocus|box-shadow:\s*0 0 0 2px rgba\(79,138,96,0\.09\)/, 'enterprise context animation styles should remove the standalone section and all DAG-specific styles')
assert.match(css, /var\(--paper-2\)/, 'enterprise context animation should use the site paper palette')
assert.doesNotMatch(css, /\.eca-vane-core::before|\.eca-vane-core::after|ecaCorePulse|radial-gradient\(circle at 50% 44%/, 'enterprise context animation should remove faint decorative elements inside the Vane box')
assert.doesNotMatch(component, /eca-dag-columns|eca-dag-column-label|<span className="eca-dag-column-label|<span>files<\/span>|<span>models<\/span>|<span>rules<\/span>|streaming|batched inference|trace metadata|eca-compute-lanes|eca-tech-chips/, 'enterprise context animation should remove the requested middle helper labels and their frames')
assert.doesNotMatch(css, /\.eca-dag-columns|\.eca-dag-column-label|\.eca-compute-lanes|\.eca-tech-chips/, 'enterprise context animation styles should remove the requested helper frames')
assert.doesNotMatch(component, /messy materials → Vane → auditable facts|<h3>Multimodal context pipeline<\/h3>|one execution graph for files, models, rules, and provenance|agent-ready context|Vane Output|Context Package|<span>facts<\/span>|source evidence|triggering rules|provenance|High-throughput multimodal processing|Agent-ready context package|Auditable facts|eca-stage-head|eca-package-world|eca-context-package|eca-value-strip/, 'enterprise context animation should remove the requested internal copy and its frames')
assert.doesNotMatch(component, /eca-fragments|frag-quote|frag-frame|frag-row|frag-log|eca-flow-pulses|eca-pulse|pulse-a|pulse-b|pulse-c/, 'enterprise context animation should remove the visually noisy fragment and pulse layer')
assert.doesNotMatch(css, /\.eca-stage-head|\.eca-package-world|\.eca-context-package|\.eca-package-grid|\.eca-value-strip|ecaValueGlow|ecaFragmentDrift|\.eca-fragments|\.eca-flow-pulses|\.eca-pulse/, 'enterprise context animation styles should remove the requested internal frames and noisy DAG motion')
assert.doesNotMatch(component, /citation-return|Citation return|Needs review|Confidence 0\.72|EOC p\.12|Claim line 2|claim files|policy PDFs|claims data|Agent Decision/, 'enterprise context animation should remove claims-only decision and citation-return copy')
assert.doesNotMatch(css, /citation-return|color-scheme:\s*dark|neon|box-shadow:\s*0 28px 90px/, 'enterprise context animation styles should not bring over the dark demo treatment or citation return')

assert.doesNotMatch(page, /What You Get|Not a verdict|WhatYouGetDiagram|enterprise-object-diagram/, 'enterprise page should not include the What You Get section')
assert.doesNotMatch(page, /Claims, compliance and document review|claims teams|compliance teams|document review teams|Run the claims pipeline|Run the example pipeline|Have a stack of claims|Enterprise Multimodal Agent Infrastructure|WHERE confidence < 0\.8|finding \+ evidence|review task|case summary|claim summary|review_tasks|evidence · review · summary|Every finding comes with evidence|auditable findings|SQL → finding/, 'enterprise page should not include superseded claims-first copy outside the demo')

assert.match(routes, /path:\s*routePath\('\/use-cases\/enterprise-agent'\)[\s\S]*EnterpriseAgentUseCase\.tsx/, 'enterprise-agent route should render EnterpriseAgentUseCase.tsx')
assert.match(footer, /The multimodal engine for AI pipelines and agents\./, 'Footer should use the unified Vane positioning')
assert.match(page, /ENTERPRISE_DESIGN_PARTNER_MAILTO/, 'enterprise page should use the centralized enterprise design partner mailto')
assert.match(siteLinks, /ENTERPRISE_DESIGN_PARTNER_MAILTO/, 'siteLinks should define the enterprise design partner mailto')
assert.doesNotMatch(page, /hello@vane\.ai|DESIGN_PARTNER_HREF/, 'enterprise page should not hardcode the old design partner mailto')
assert.doesNotMatch(page, /to="\/docs\/examples\/insurance-document-audit"/, 'enterprise page should use the canonical data docs route for the insurance document audit example')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
