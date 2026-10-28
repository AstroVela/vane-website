import {demoBusinessIdentity, emailPattern, validateDemo} from '../src/demoContract.ts'
import type {Env, ExecutionContext} from './types.ts'

const MAX_BODY_BYTES = 16384
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
type RequestRow = {request_id: string; payload_hash: string; name: string; email: string; company: string; need: string; notes: string; modalities: string; locale: string; source: string; scenario: string; attempts: number; created_at: number}
export const json = (value: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(value), {status, headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers}})
export function retentionDays(env: Env) {const value = Number(env.DEMO_RETENTION_DAYS ?? 90); return Number.isInteger(value) && value >= 1 && value <= 365 ? value : 90}
export function demoReady(env: Env) {return Boolean(env.DEMO_DB && (env.DEMO_MODE === 'local' || (env.RESEND_API_KEY && env.DEMO_FROM && env.DEMO_RATE_LIMIT_SECRET)))}
async function sha256(value: string) {return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(v => v.toString(16).padStart(2, '0')).join('')}
async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) throw new Error('too_large')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('invalid_json')
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {const {done, value} = await reader.read(); if (done) break; size += value.length; if (size > MAX_BODY_BYTES) {await reader.cancel(); throw new Error('too_large')} chunks.push(value)}
  } finally {reader.releaseLock()}
  const joined = new Uint8Array(size)
  let offset = 0; for (const chunk of chunks) {joined.set(chunk, offset); offset += chunk.length}
  try {return JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(joined))} catch {throw new Error('invalid_json')}
}
export async function handleDemoRequest(request: Request, env: Env, ctx: ExecutionContext) {
  if (request.method !== 'POST') return json({error:'method_not_allowed'}, 405, {Allow:'POST'})
  const origin = request.headers.get('Origin')
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') return json({error:'invalid_origin'}, 403)
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json({error:'invalid_content_type'}, 415)
  const key = request.headers.get('Idempotency-Key') ?? ''
  if (!uuidPattern.test(key)) return json({error:'invalid_idempotency_key'}, 400)
  let input: unknown
  try {input = await readBody(request)} catch (e) {return json({error: e instanceof Error ? e.message : 'invalid_json'}, e instanceof Error && e.message === 'too_large' ? 413 : 400)}
  const {payload, fieldErrors} = validateDemo(input)
  if (!payload) return json({error:'invalid_fields', field_errors: fieldErrors}, 400)
  if (!demoReady(env) || !env.DEMO_DB) return json({error:'service_unavailable'}, 503)
  const db = env.DEMO_DB, now = Date.now()
  try {
    const hash = await sha256(demoBusinessIdentity(payload))
    const existing = await db.prepare('SELECT request_id, payload_hash FROM demo_requests WHERE idempotency_key = ?').bind(key).first<RequestRow>()
    if (existing) return existing.payload_hash === hash ? json({request_id:existing.request_id,status:'received'}) : json({error:'idempotency_conflict'},409)
    const bucket = Math.floor(now / 600000) * 600000
    const address = request.headers.get('X-Vane-Client-IP') ?? 'local'
    const ipHash = await sha256((env.DEMO_RATE_LIMIT_SECRET ?? 'local-preview-only') + ':' + bucket + ':' + address)
    const rate = await db.prepare('INSERT INTO demo_rate_limits (ip_hash, window_start, hits) VALUES (?, ?, 1) ON CONFLICT(ip_hash, window_start) DO UPDATE SET hits = hits + 1 RETURNING hits').bind(ipHash,bucket).first<{hits: number}>()
    if (rate && rate.hits > 10) return json({error:'rate_limited'},429, {'Retry-After':String(Math.ceil((bucket+600000-now)/1000))})
    const id = crypto.randomUUID()
    const saved = await db.prepare('INSERT INTO demo_requests (request_id, idempotency_key, payload_hash, name, email, company, need, notes, modalities, locale, source, scenario, created_at, next_attempt_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(idempotency_key) DO NOTHING')
      .bind(id,key,hash,payload.name,payload.email,payload.company,payload.need,payload.notes,JSON.stringify(payload.modalities),payload.locale,payload.source,payload.scenario,now,now).run()
    if (!saved.success) return json({error:'service_unavailable'},503)
    const row = await db.prepare('SELECT request_id, payload_hash FROM demo_requests WHERE idempotency_key = ?').bind(key).first<RequestRow>()
    if (!row) return json({error:'service_unavailable'},503)
    if (row.payload_hash !== hash) return json({error:'idempotency_conflict'},409)
    ctx.waitUntil(notifyDue(env, row.request_id).catch(() => {}))
    return json({request_id:row.request_id,status:'received'}, row.request_id === id ? 201 : 200)
  } catch {return json({error:'service_unavailable'},503)}
}
const delays = [60000,300000,900000,3600000,21600000,21600000]
export async function notifyDue(env: Env, requestId?: string, send: typeof fetch = fetch) {
  if (!env.DEMO_DB || env.DEMO_MODE === 'local' || !env.RESEND_API_KEY || !env.DEMO_FROM) return
  const db = env.DEMO_DB, now = Date.now()
  const due = requestId
    ? await db.prepare('SELECT request_id FROM demo_requests WHERE request_id = ? AND notified_at IS NULL AND attempts < 6 AND next_attempt_at <= ?').bind(requestId,now).all<{request_id:string}>()
    : await db.prepare('SELECT request_id FROM demo_requests WHERE notified_at IS NULL AND attempts < 6 AND next_attempt_at <= ? ORDER BY next_attempt_at LIMIT 25').bind(now).all<{request_id:string}>()
  for (const item of due.results) {
    const claimTime=Date.now()
    const row = await db.prepare('UPDATE demo_requests SET lease_until = ?, attempts = attempts + 1 WHERE request_id = ? AND notified_at IS NULL AND attempts < 6 AND next_attempt_at <= ? AND (lease_until IS NULL OR lease_until <= ?) RETURNING *').bind(claimTime+60000,item.request_id,claimTime,claimTime).first<RequestRow>()
    if (!row) continue
    let errorCode: string
    try {
      const to = env.DEMO_TO ?? 'pulse@astrovela.ai'
      if (!emailPattern.test(to)) throw new Error('invalid_recipient')
      const response = await send('https://api.resend.com/emails', {method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'vane-demo-'+row.request_id},
        body:JSON.stringify({from:env.DEMO_FROM,to:[to],reply_to:row.email,subject:'Vane Context demo request · '+row.request_id,
          text:['Request: '+row.request_id,'Name: '+row.name,'Email: '+row.email,'Team: '+row.company,'Data: '+row.modalities,'Locale: '+row.locale,'Source: '+row.source,'Scenario: '+row.scenario,'','Need:',row.need,'','Notes:',row.notes].join('\n')}),
        signal:AbortSignal.timeout(15000)})
      if (response.ok) {await db.prepare('UPDATE demo_requests SET notified_at = ?, lease_until = NULL, last_error_code = NULL WHERE request_id = ? AND attempts = ?').bind(Date.now(),row.request_id,row.attempts).run(); continue}
      errorCode = 'provider_http_' + response.status
    } catch {errorCode = 'notification_unavailable'}
    await db.prepare('UPDATE demo_requests SET lease_until = NULL, next_attempt_at = ?, last_error_code = ? WHERE request_id = ? AND attempts = ? AND notified_at IS NULL').bind(Date.now()+delays[Math.min(row.attempts-1,delays.length-1)],errorCode,row.request_id,row.attempts).run()
  }
}
export async function maintainDemoRequests(env: Env) {
  if (!env.DEMO_DB) return
  const now = Date.now()
  await env.DEMO_DB.prepare('DELETE FROM demo_requests WHERE created_at < ?').bind(now-retentionDays(env)*86400000).run()
  await env.DEMO_DB.prepare('DELETE FROM demo_rate_limits WHERE window_start < ?').bind(now-1200000).run()
  await notifyDue(env)
}
