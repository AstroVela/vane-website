import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync('src/pages/EnterpriseAgentUseCase.tsx', 'utf8')
const routes = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')

assert.match(routes, /routePath\('\/solutions\/enterprise-agent'\)/)
assert.match(page, /const AUDIO_CODE = `[^`]*audio_file\(file\([\s\S]*transcribe_audio\([\s\S]*ai_embed\(/)
assert.match(page, /DorisStreamLoadSink/)
assert.match(page, /source_uri[\s\S]*start_ms[\s\S]*end_ms/)
assert.match(page, /title: '面向企业 Agent 的多模态数据基础设施/)
assert.match(page, /tutorial’s transcription UDF/)
assert.match(page, /教程中的转写 UDF/)
assert.match(page, /Milvus and Qdrant/)
assert.match(page, /Milvus、Qdrant/)

assert.match(page, /ENTERPRISE_DESIGN_PARTNER_MAILTO/)
assert.match(
  page,
  /\/docs\/data\/tutorials\/use-cases\/audio-support-doris-search/,
)
assert.doesNotMatch(`${page}\n${routes}`, /['"`]\/use-cases(?:\/|\b)/)

console.log('Enterprise solution content check passed.')
