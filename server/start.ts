import {createServer,type IncomingMessage,type ServerResponse} from 'node:http'
import {isIP} from 'node:net'
import {resolve} from 'node:path'
import {Readable} from 'node:stream'
import {pipeline} from 'node:stream/promises'
import {SQLiteDemoDatabase} from './sqlite.ts'
import {staticAssets} from './assets.ts'
import router from './router.ts'
import {demoReady,json,maintainDemoRequests} from './demoRequests.ts'
import type {Env} from './types.ts'

const production=process.env.NODE_ENV==='production'
const port=Number(process.env.WEBSITE_PORT??4328),host=process.env.WEBSITE_HOST??'127.0.0.1'
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('WEBSITE_PORT must be a valid port')
if(production&&!process.env.DEMO_SITE_URL)throw new Error('Set DEMO_SITE_URL to the public HTTPS origin for production')
const site=new URL(process.env.DEMO_SITE_URL??`http://127.0.0.1:${port}`)
if(!['http:','https:'].includes(site.protocol)||site.username||site.password||site.pathname!=='/'||production&&site.protocol!=='https:')throw new Error('DEMO_SITE_URL must be an origin (HTTPS in production)')
const databasePath=resolve(process.env.DEMO_DB_PATH??'.local-data/demo.sqlite')
process.umask(0o077)
const database=new SQLiteDemoDatabase(databasePath)
const env:Env={
  ASSETS:staticAssets(process.env.WEBSITE_BUILD_DIR??'build',production),DEMO_DB:database,DEMO_MODE:production?'production':'local',
  DEMO_RETENTION_DAYS:process.env.DEMO_RETENTION_DAYS??'90',RESEND_API_KEY:process.env.RESEND_API_KEY,
  DEMO_FROM:process.env.DEMO_FROM,DEMO_TO:process.env.DEMO_TO??'pulse@astrovela.ai',DEMO_RATE_LIMIT_SECRET:process.env.DEMO_RATE_LIMIT_SECRET,
}
const pending=new Set<Promise<unknown>>()
const ctx={waitUntil(promise:Promise<unknown>) {const tracked=promise.catch(()=>{console.error('demo_background_task_failed')}).finally(()=>pending.delete(tracked));pending.add(tracked)}}
const allowedHosts=new Set([site.host,...(production?[]:[`127.0.0.1:${port}`,`localhost:${port}`])])

async function webRequest(incoming:IncomingMessage):Promise<Request|Response> {
  if(!allowedHosts.has(incoming.headers.host??''))return json({error:'invalid_host'},403)
  const url=new URL(incoming.url??'/',site)
  if(url.origin!==site.origin)return json({error:'invalid_origin'},403)
  const headers=new Headers()
  for(const [key,value] of Object.entries(incoming.headers))if(value!=null)headers.set(key,Array.isArray(value)?value.join(','):value)
  const remote=incoming.socket.remoteAddress??'unknown'
  const proxyAddress=incoming.headers['x-real-ip']
  const trusted=process.env.DEMO_TRUST_PROXY==='1'&&['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote)&&typeof proxyAddress==='string'&&isIP(proxyAddress)
  headers.set('X-Vane-Client-IP',trusted?proxyAddress:remote)
  // An actual socket address replaces any client-provided forwarding headers.
  const method=incoming.method??'GET'
  let body:Buffer|undefined
  if(!['GET','HEAD'].includes(method)) {
    if(Number(headers.get('Content-Length'))>16384){incoming.resume();return json({error:'too_large'},413)}
    const chunks:Buffer[]=[];let size=0
    for await(const chunk of incoming.iterator({destroyOnReturn:false})) {
      size+=chunk.length
      if(size>16384){incoming.resume();return json({error:'too_large'},413)}
      chunks.push(chunk)
    }
    body=Buffer.concat(chunks)
  }
  const origin=headers.get('Origin')
  if(!production&&origin===`http://localhost:${port}`)headers.set('Origin',site.origin)
  return new Request(url,{method,headers,body:body?new Uint8Array(body):undefined})
}
async function send(response:Response,outgoing:ServerResponse) {
  outgoing.writeHead(response.status,Object.fromEntries(response.headers))
  if(response.body)await pipeline(Readable.fromWeb(response.body as Parameters<typeof Readable.fromWeb>[0]),outgoing)
  else outgoing.end()
}
const server=createServer({maxHeaderSize:8192,requestTimeout:10000},(incoming,outgoing)=>{
  void(async()=>{const request=await webRequest(incoming);await send(request instanceof Response?request:await router.fetch(request,env,ctx),outgoing)})().catch(()=>{
    if(outgoing.destroyed)return
    console.error('website_request_failed')
    if(!outgoing.headersSent){outgoing.writeHead(500,{'Content-Type':'application/json'});outgoing.end('{"error":"service_unavailable"}')}
    else outgoing.destroy()
  })
})
server.headersTimeout=10000
server.listen(port,host,()=>{
  console.log(`Vane website: http://${host}:${port}`)
  console.log(`SQLite: ${databasePath}`)
  console.log(production?(demoReady(env)?'Production mode: request reception and email notifications configured.':'Production mode: request form unavailable until notification settings are configured.'):'Local preview: requests are saved; no email is sent.')
})
const maintenance=setInterval(()=>ctx.waitUntil(maintainDemoRequests(env)),300000)
maintenance.unref()
ctx.waitUntil(maintainDemoRequests(env))
for(const signal of ['SIGINT','SIGTERM'] as const)process.once(signal,()=>{
  clearInterval(maintenance)
  server.close(()=>{void Promise.allSettled([...pending]).then(()=>database.close())})
})
