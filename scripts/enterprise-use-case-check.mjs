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

assert.match(page, /<div className="enterprise-hero-visual">\s*<EnterpriseContextAnimation \/>\s*<\/div>/, 'enterprise page should place the context animation in the hero right rail')
assert.doesNotMatch(page, /function HeroDiagram|<HeroDiagram \/>|enterprise-hero-diagram/, 'enterprise page should replace the old hero mini diagram with the context animation')
assert.doesNotMatch(page, /<Divider \/>\s*<EnterpriseContextAnimation \/>\s*<Divider \/>/, 'enterprise page should remove the standalone Context pipeline section')

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
assert.match(component, /Agent-ready outputs/, 'enterprise context animation should include the richer right-side output panel')
assert.doesNotMatch(component, /Context received|Evidence checked|Recommendation prepared|eca-agent-trace/, 'enterprise context animation should remove the right-side trace copy')
assert.doesNotMatch(component, /<span className=\{`eca-dag-node \$\{node\.className\}`\} key=\{node\.label\}>lineage<\/span>|label:\s*'lineage'|lineage kept/, 'enterprise context animation should not model lineage as a DAG node')
assert.match(css, /\.enterprise-hero-visual\s*\{[\s\S]*display:\s*flex;[\s\S]*justify-content:\s*flex-end;/, 'enterprise hero should reserve the right rail for the scaled animation')
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
assert.doesNotMatch(page, /Claims, compliance and document review|claims teams|compliance teams|document review teams|Run the claims pipeline|Have a stack of claims|Enterprise Multimodal Agent Infrastructure|WHERE confidence < 0\.8|finding \+ evidence|review task|case summary|claim summary|review_tasks|evidence · review · summary|Every finding comes with evidence|auditable findings|SQL → finding/, 'enterprise page should not include superseded claims-first copy outside the demo')

assert.match(routes, /path:\s*'\/use-cases\/enterprise-agent'[\s\S]*EnterpriseAgentUseCase\.tsx/, 'enterprise-agent route should render EnterpriseAgentUseCase.tsx')
assert.match(footer, /The multimodal engine for AI pipelines and agents\./, 'Footer should use the unified Vane positioning')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
