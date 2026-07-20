import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync('src/pages/EnterpriseAgentUseCase.tsx', 'utf8')
const routes = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')

assert.match(routes, /routePath\('\/solutions\/enterprise-agent'\)/)
assert.match(page, /const AUDIT_CODE = `[^`]*import vane[\s\S]*attach_function\([\s\S]*con\.sql\([\s\S]*ai_prompt\([\s\S]*write_parquet\(/)
assert.match(page, /ENTERPRISE_DESIGN_PARTNER_MAILTO/)
assert.match(
  page,
  /\/docs\/data\/tutorials\/use-cases\/claims-disposition/,
)
assert.doesNotMatch(`${page}\n${routes}`, /['"`]\/use-cases(?:\/|\b)/)

console.log('Enterprise solution content check passed.')
