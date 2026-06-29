import { existsSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const pagePath = 'src/pages/EnterpriseAgentUseCase.tsx'
const routesPath = 'src/plugins/vaneRoutes.ts'

assert.ok(existsSync(pagePath), `${pagePath} should exist`)

const page = readFileSync(pagePath, 'utf8')
const routes = readFileSync(routesPath, 'utf8')

const mustIncludeInPage = [
  'Enterprise Multimodal Agent Infrastructure — Vane',
  'Turn messy multimodal business materials — PDFs, scans, photos, forms, spreadsheets, logs — into auditable facts. One pipeline for files, models and rules.',
  'Enterprise Multimodal Agent Infrastructure',
  'Turn messy multimodal business materials into auditable facts.',
  'Claims, compliance and document review',
  'messy materials',
  'auditable facts',
  'PDF',
  'scan',
  'photo',
  'form',
  'sheet',
  'log',
  'finding + evidence',
  'review task',
  'claim summary',
  "The hard part isn't calling a model — it's rebuilding the evidence chain.",
  'BEFORE — a fragmented chain',
  'AFTER — one pipeline',
  'scattered systems',
  'missing provenance',
  'One pipeline for files, models and rules',
  'Every finding comes with evidence',
  'Scale without rewriting',
  'Claims evidence pipeline',
  'photos, scanned forms, estimates',
  'files → extraction → model → SQL → finding, in one execution plan',
  'extract_document(media_type, uri)',
  "prompt('Extract claim fields as JSON; keep the quote', doc)",
  "read_files('claims/CLM-POC-001/*')",
  'provenance()',
  'needs_review',
  'Runs on public / synthetic proxy data',
  'python -m vane_examples.claims_evidence',
  'evidence · review_tasks · claim_summary',
  'Have a stack of claims to turn into auditable facts?',
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

assert.match(routes, /path:\s*'\/use-cases\/enterprise-agent'[\s\S]*EnterpriseAgentUseCase\.tsx/, 'enterprise-agent route should render EnterpriseAgentUseCase.tsx')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
