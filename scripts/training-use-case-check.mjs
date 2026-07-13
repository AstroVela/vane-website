import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync('src/pages/TrainingUseCase.tsx', 'utf8')
const routes = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')

assert.match(routes, /routePath\('\/solutions\/training'\)/)
assert.match(page, /const PIPELINE_CODE = `[^`]*import vane[\s\S]*con\.sql\([\s\S]*map_batches\([\s\S]*ai_embed\([\s\S]*write_parquet\(/)
assert.match(page, /actor_number\s*=\s*[1-9]\d*/)
assert.match(page, /TRAINING_DESIGN_PARTNER_MAILTO/)
assert.doesNotMatch(`${page}\n${routes}`, /\/use-cases(?:\/|\b)/)

console.log('Training solution content check passed.')
