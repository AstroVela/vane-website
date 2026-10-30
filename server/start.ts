import {createServer, type IncomingMessage, type ServerResponse} from 'node:http'
import {Readable} from 'node:stream'
import {pipeline} from 'node:stream/promises'
import {staticAssets} from './assets.ts'

const port = Number(process.env.WEBSITE_PORT ?? 4328), host = process.env.WEBSITE_HOST ?? '127.0.0.1'
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('WEBSITE_PORT must be a valid port')
const site = new URL(`http://${host}:${port}`)
const allowedHosts = new Set([site.host, `127.0.0.1:${port}`, `localhost:${port}`])
const assets = staticAssets(process.env.WEBSITE_BUILD_DIR ?? 'build')

function webRequest(incoming: IncomingMessage): Request | Response {
  if (!allowedHosts.has(incoming.headers.host ?? '')) return new Response('Invalid host', {status: 403})
  const url = new URL(incoming.url ?? '/', site)
  if (url.origin !== site.origin) return new Response('Invalid origin', {status: 403})
  const method = incoming.method ?? 'GET'
  if (!['GET', 'HEAD'].includes(method)) {
    incoming.resume()
    return new Response('Method not allowed', {status: 405, headers: {Allow: 'GET, HEAD'}})
  }
  const headers = new Headers()
  for (const [key, value] of Object.entries(incoming.headers)) if (value != null) headers.set(key, Array.isArray(value) ? value.join(',') : value)
  return new Request(url, {method, headers})
}
async function send(response: Response, outgoing: ServerResponse) {
  outgoing.writeHead(response.status, Object.fromEntries(response.headers))
  if (response.body) await pipeline(Readable.fromWeb(response.body as Parameters<typeof Readable.fromWeb>[0]), outgoing)
  else outgoing.end()
}
const server = createServer({maxHeaderSize: 8192, requestTimeout: 10000}, (incoming, outgoing) => {
  void (async () => {const request = webRequest(incoming); await send(request instanceof Response ? request : await assets.fetch(request), outgoing)})().catch(() => {
    if (outgoing.destroyed) return
    console.error('website_request_failed')
    if (!outgoing.headersSent) {outgoing.writeHead(500, {'Content-Type': 'text/plain'}); outgoing.end('Website unavailable')}
    else outgoing.destroy()
  })
})
server.headersTimeout = 10000
server.listen(port, host, () => console.log(`Vane static website: http://${host}:${port}`))
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.once(signal, () => server.close())
