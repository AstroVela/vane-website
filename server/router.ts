import {demoReady, handleDemoRequest, json, retentionDays} from './demoRequests.ts'
import type {Env, ExecutionContext} from './types.ts'
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)
    if (url.pathname === '/api/demo-status') {
      if (request.method !== 'GET') return json({error:'method_not_allowed'},405,{Allow:'GET'})
      let available = demoReady(env)
      if (available) {try {await env.DEMO_DB!.prepare('SELECT request_id FROM demo_requests LIMIT 1').first();await env.DEMO_DB!.prepare('SELECT hits FROM demo_rate_limits LIMIT 1').first()} catch {available = false}}
      return json({available,retention_days:retentionDays(env)})
    }
    if (url.pathname === '/api/demo-requests') return handleDemoRequest(request,env,ctx)
    if (url.pathname.startsWith('/api/')) return json({error:'not_found'},404)
    if (/^\/(?:zh-CN\/)?solutions\/enterprise-agent\/?$/.test(url.pathname)) return Response.redirect(url.origin+(url.pathname.startsWith('/zh-CN')?'/zh-CN':'')+'/products/context',301)
    return env.ASSETS.fetch(request)
  }
}
