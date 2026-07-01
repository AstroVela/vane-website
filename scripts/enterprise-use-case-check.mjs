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
const css = readFileSync('src/index.css', 'utf8')

const mustIncludeInPage = [
  'Enterprise Multimodal Data Infrastructure — Vane',
  'Turn messy multimodal business materials — PDFs, images, video, scans, forms, spreadsheets, logs, and documents — into auditable facts. One pipeline for files, models, and rules.',
  'messy materials → auditable facts for enterprise PDFs, images, video, forms, spreadsheets, logs, and documents.',
  'Enterprise Multimodal Data Infrastructure',
  'Turn messy multimodal business materials into auditable facts.',
  'PDFs, images, video, scans, forms, spreadsheets, logs, and documents — Vane extracts evidence, runs rules, and returns auditable insights, evidence, and recommendations.',
  'PDFs · images · video · scans · forms · spreadsheets · logs · documents',
  'messy materials',
  'auditable facts',
  'PDF',
  'scan',
  'image',
  'form',
  'sheet',
  'log',
  'insights',
  'evidence',
  'recommendations',
  "The hard part isn't calling a model — it's rebuilding the evidence chain.",
  'Today that chain is stitched across OCR scripts, temp files, model calls, SQL jobs, and review tools.',
  'BEFORE — a fragmented chain',
  'AFTER — one pipeline',
  'scattered systems',
  'missing provenance',
  'One pipeline for files, models, and rules',
  'File extraction, model inference, SQL rules, and review outputs run as one pipeline.',
  'Every insight comes with evidence',
  'Each insight carries its proof — source file, chunk, quote, confidence, triggering rule, and review status.',
  'Scale without rewriting',
  'Claims evidence pipeline',
  'photos, scanned forms, estimates',
  'files → extraction → model → SQL → insight, in one execution plan',
  'extract_document(media_type, uri)',
  "prompt('Extract fields as JSON; keep quote and confidence', doc)",
  "read_files('claims/CLM-POC-001/*')",
  'provenance()',
  'recommended_review',
  'fact.confidence < 0.8',
  'Runs on public / synthetic proxy data',
  'python -m vane_examples.claims_evidence',
  'insights · evidence · recommendations',
  'Turn a claim packet — photos, scanned forms, estimates — into insights, evidence, and recommendations.',
  'Have PDFs, images, video, logs, and documents to turn into auditable facts?',
  'EnterpriseContextAnimation',
  'Run the example pipeline',
  'Become a design partner',
]

for (const text of mustIncludeInPage) {
  assert.match(page, new RegExp(escapeRegExp(text)), `${pagePath} should include "${text}"`)
}

const motifCount = page.match(/<Motif/g)?.length ?? 0
assert.ok(motifCount >= 3, 'motif should be rendered at least three times')

const codeWindowCount = page.match(/<CodeWindow/g)?.length ?? 0
assert.equal(codeWindowCount, 1, 'enterprise page should contain exactly one CodeWindow')

assert.match(component, /Multimodal context pipeline/, 'enterprise context animation should use the approved title')
assert.match(component, /PDFs, images, video, audio, forms, spreadsheets, logs, and documents/, 'enterprise context animation should describe broad multimodal inputs')
assert.match(component, /contract\.pdf/, 'enterprise context animation should include broad enterprise document examples')
assert.match(component, /inspection photo/, 'enterprise context animation should include image input')
assert.match(component, /video frame/, 'enterprise context animation should include video input')
assert.match(component, /call audio/, 'enterprise context animation should include audio input')
assert.match(component, /system log/, 'enterprise context animation should include log input')
assert.match(component, /eca-media-grid|eca-waveform|eca-log-lines|eca-video-strip/, 'enterprise context animation should render input-specific document details, not generic cards only')
assert.match(component, /Vane multimodal compute/, 'enterprise context animation should center Vane compute')
assert.match(component, /Parse documents[\s\S]*Decode media[\s\S]*Normalize tables[\s\S]*Parse logs\/events[\s\S]*Evidence units[\s\S]*Structured signals[\s\S]*Apply rules & package/, 'enterprise context animation should show the approved 4-to-2-to-1 multimodal DAG')
assert.match(component, /className:\s*'parse-docs'/, 'enterprise context animation should namespace the Parse documents node class to avoid global docs styles')
assert.doesNotMatch(component, /className:\s*'docs'/, 'enterprise context animation should not use a generic docs class for a DAG node')
assert.match(component, /edge-docs-evidence[\s\S]*edge-media-evidence[\s\S]*edge-tables-signals[\s\S]*edge-logs-signals[\s\S]*edge-evidence-package[\s\S]*edge-signals-package/, 'enterprise context animation should use only fan-in DAG edges')
assert.match(component, /eca-dag-token[\s\S]*token-docs[\s\S]*token-media[\s\S]*token-tables[\s\S]*token-logs[\s\S]*token-evidence[\s\S]*token-signals/, 'enterprise context animation should use ordered tokens on the converging DAG edges')
assert.match(component, /insights[\s\S]*evidence[\s\S]*recommendations/, 'enterprise context animation should output insights, evidence, and recommendations')
assert.match(component, /Agent-ready outputs/, 'enterprise context animation should include the richer right-side output panel')
assert.match(component, /Context received[\s\S]*Evidence checked[\s\S]*Recommendation prepared/, 'enterprise context animation should show the agent-ready trace without becoming an agent decision app')
assert.doesNotMatch(component, /<span className=\{`eca-dag-node \$\{node\.className\}`\} key=\{node\.label\}>lineage<\/span>|label:\s*'lineage'|lineage kept/, 'enterprise context animation should not model lineage as a DAG node')
assert.match(css, /\.enterprise-context-animation/, 'enterprise context animation styles should be present')
assert.match(css, /--enterprise-context-duration:\s*9s/, 'enterprise context animation should use a compact 9s loop')
assert.match(css, /height:\s*560px/, 'enterprise context animation should close the empty space after removing the internal header, package, and value strip')
assert.match(css, /\.eca-input-world\s*\{[\s\S]*top:\s*44px;[\s\S]*\.eca-output-world\s*\{[\s\S]*top:\s*44px;/, 'enterprise context animation should align the output label and panel with the messy materials label')
assert.match(css, /\.eca-vane-world\s*\{[\s\S]*left:\s*388px;[\s\S]*top:\s*108px;[\s\S]*width:\s*375px;[\s\S]*height:\s*345px;/, 'enterprise context animation should shrink the Vane box to three quarters and keep clear gutters')
assert.match(css, /\.eca-vane-mark\s*\{[\s\S]*z-index:\s*30;[\s\S]*opacity:\s*1;[\s\S]*background:\s*rgba\(251,250,246,0\.92\);/, 'enterprise context animation should keep the Vane mark opaque and above the DAG')
assert.match(css, /\.eca-dag-lines\s*\{[\s\S]*z-index:\s*7;[\s\S]*width:\s*375px;[\s\S]*height:\s*345px;/, 'enterprise context animation should keep DAG edges above the Vane mark')
assert.match(css, /\.eca-dag-nodes\s*\{[\s\S]*position:\s*absolute;[\s\S]*inset:\s*0;[\s\S]*z-index:\s*10;/, 'enterprise context animation should place all DAG labels above the Vane mark as one layer')
assert.match(css, /\.eca-dag-node\s*\{[\s\S]*width:\s*104px;[\s\S]*height:\s*52px;[\s\S]*color:\s*rgba\(21,23,30,0\.68\);[\s\S]*white-space:\s*normal;[\s\S]*overflow-wrap:\s*normal;/, 'enterprise context animation should keep long DAG labels visible inside compact pale boxes')
assert.doesNotMatch(css, /\.eca-dag-node\s*\{[\s\S]*animation:\s*ecaNodeFocus/, 'enterprise context animation should keep DAG node colors constant')
assert.match(css, /\.eca-dag-node\.parse-docs\s*\{ left:\s*10px; top:\s*38px;[\s\S]*\.eca-dag-node\.media\s*\{ left:\s*10px; top:\s*103px;[\s\S]*\.eca-dag-node\.tables\s*\{ left:\s*10px; top:\s*168px;[\s\S]*\.eca-dag-node\.logs\s*\{ left:\s*10px; top:\s*233px;[\s\S]*\.eca-dag-node\.evidence\s*\{ left:\s*141px; top:\s*70px;[\s\S]*\.eca-dag-node\.signals\s*\{ left:\s*141px; top:\s*200px;[\s\S]*\.eca-dag-node\.package\s*\{ left:\s*257px; top:\s*135px;/, 'enterprise context animation should place the remaining DAG elements inside the smaller Vane box')
assert.doesNotMatch(css, /\.eca-dag-node\.docs\b/, 'enterprise context animation should not style a generic docs class that can collide with site-level docs styles')
assert.match(css, /\.eca-dag-token\s*\{[\s\S]*z-index:\s*11;[\s\S]*opacity:\s*0\.44;[\s\S]*animation:\s*ecaDagTokenPath\s*2\.13s\s*linear\s*infinite;/, 'enterprise context animation should keep pale DAG tokens above the Vane mark and moving 1.5x faster')
assert.doesNotMatch(css, /@keyframes ecaDagTokenPath\s*\{[^}]*opacity:/, 'enterprise context animation should keep token color constant over time')
assert.doesNotMatch(css, /@keyframes ecaNodeFocus|box-shadow:\s*0 0 0 2px rgba\(79,138,96,0\.09\)/, 'enterprise context animation should remove time-varying node highlight')
assert.match(css, /ecaDagTokenPath|ecaAgentPanelReveal/, 'enterprise context animation should keep ordered DAG motion and panel reveal layers')
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
assert.doesNotMatch(page, /Claims, compliance and document review|claims teams|compliance teams|document review teams|Run the claims pipeline|Have a stack of claims|Enterprise Multimodal Agent Infrastructure|WHERE confidence < 0\.8|finding \+ evidence|review task|case summary|claim summary|review_tasks|evidence · review · summary|Every finding comes with evidence|auditable findings|SQL → finding/, 'enterprise page should not include superseded claims-first copy outside the demo')

assert.match(routes, /path:\s*'\/use-cases\/enterprise-agent'[\s\S]*EnterpriseAgentUseCase\.tsx/, 'enterprise-agent route should render EnterpriseAgentUseCase.tsx')
assert.match(footer, /The multimodal engine for AI pipelines and agents\./, 'Footer should use the unified Vane positioning')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
