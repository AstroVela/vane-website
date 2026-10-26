import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const routes = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')
assert.match(routes, /route\('\/solutions\/enterprise-agent','EnterpriseAgentUseCase'\)/)
const page = readFileSync('src/pages/EnterpriseAgentUseCase.tsx', 'utf8')
assert.match(page, /MarketingLayout/)
assert.match(page, /source_uri/)
assert.match(page, /ai_embed/)
console.log('Enterprise data pipelines are available as a bilingual Vane Data solution.')
