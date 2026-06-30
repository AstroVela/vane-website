import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/EnterpriseAgentUseCase.tsx'
const routesPath = 'src/plugins/vaneRoutes.ts'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const routes = readFileSync(routesPath, 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')

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

assert.doesNotMatch(page, /What You Get|Not a verdict|WhatYouGetDiagram|enterprise-object-diagram/, 'enterprise page should not include the What You Get section')
assert.doesNotMatch(page, /Claims, compliance and document review|claims teams|compliance teams|document review teams|Run the claims pipeline|Have a stack of claims|Enterprise Multimodal Agent Infrastructure|WHERE confidence < 0\.8|finding \+ evidence|review task|case summary|claim summary|review_tasks|evidence · review · summary|Every finding comes with evidence|auditable findings|SQL → finding/, 'enterprise page should not include superseded claims-first copy outside the demo')

assert.match(routes, /path:\s*'\/use-cases\/enterprise-agent'[\s\S]*EnterpriseAgentUseCase\.tsx/, 'enterprise-agent route should render EnterpriseAgentUseCase.tsx')
assert.match(footer, /The multimodal engine for AI pipelines and agents\./, 'Footer should use the unified Vane positioning')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
