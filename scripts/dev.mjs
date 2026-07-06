#!/usr/bin/env node
import http from 'node:http'
import net from 'node:net'
import process from 'node:process'
import { spawn } from 'node:child_process'

const HOST = process.env.HOST ?? 'localhost'
const PUBLIC_PORT = Number(process.env.PORT ?? 3000)
const EN_PORT = Number(process.env.VANE_DEV_EN_PORT ?? PUBLIC_PORT + 1)
const ZH_PORT = Number(process.env.VANE_DEV_ZH_PORT ?? PUBLIC_PORT + 2)
const EN_WS_PATH = '/__vane_dev_ws/en'
const ZH_WS_PATH = '/__vane_dev_ws/zh-CN'

const DOCUSAURUS_BIN = 'node_modules/@docusaurus/core/bin/docusaurus.mjs'
const children = new Set()

function log(message) {
  process.stdout.write(`${message}\n`)
}

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exit(1)
}

async function assertPortAvailable(port, label) {
  await new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', () => reject(new Error(`${label} port ${port} is already in use.`)))
    server.once('listening', () => {
      server.close(resolve)
    })
    server.listen(port, HOST)
  })
}

function spawnDocusaurus({ locale, port, generatedDir, webSocketPath }) {
  const args = [DOCUSAURUS_BIN, 'start', '--host', HOST, '--port', String(port), '--no-open']
  if (locale) args.push('--locale', locale)

  const child = spawn(process.execPath, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      DOCUSAURUS_GENERATED_FILES_DIR_NAME: generatedDir,
      VANE_DEV_WEBSOCKET_PATH: webSocketPath,
    },
  })
  children.add(child)

  const prefix = locale ?? 'en'
  child.stdout.on('data', (chunk) => process.stdout.write(prefixLines(prefix, chunk)))
  child.stderr.on('data', (chunk) => process.stderr.write(prefixLines(prefix, chunk)))
  child.on('exit', (code, signal) => {
    children.delete(child)
    if (shuttingDown) return
    shutdown(code ?? (signal ? 1 : 0))
  })
}

function prefixLines(prefix, chunk) {
  return String(chunk)
    .split(/(?<=\n)/)
    .map((line) => (line.trim() ? `[${prefix}] ${line}` : line))
    .join('')
}

function proxyRequest(targetPort, req, res) {
  const proxy = http.request(
    {
      hostname: HOST,
      port: targetPort,
      method: req.method,
      path: req.url,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers)
      proxyRes.pipe(res)
    },
  )

  proxy.on('error', (error) => {
    res.writeHead(502, {'content-type': 'text/plain; charset=utf-8'})
    res.end(`Dev server is not ready: ${error.message}\n`)
  })

  req.pipe(proxy)
}

function proxyUpgrade(targetPort, req, socket, head) {
  const upstream = net.connect(targetPort, HOST, () => {
    upstream.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`)
    for (const [name, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) upstream.write(`${name}: ${item}\r\n`)
      } else if (typeof value !== 'undefined') {
        upstream.write(`${name}: ${value}\r\n`)
      }
    }
    upstream.write('\r\n')
    upstream.write(head)
    upstream.pipe(socket)
    socket.pipe(upstream)
  })

  upstream.on('error', () => socket.destroy())
  socket.on('error', () => upstream.destroy())
}

function targetFor(url = '/') {
  if (url.startsWith('/zh-CN/') || url === '/zh-CN' || url.startsWith(ZH_WS_PATH)) return ZH_PORT
  return EN_PORT
}

let shuttingDown = false
function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) child.kill('SIGTERM')
  process.exit(code)
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown())
}

await Promise.all([
  assertPortAvailable(PUBLIC_PORT, 'public'),
  assertPortAvailable(EN_PORT, 'English locale'),
  assertPortAvailable(ZH_PORT, 'Chinese locale'),
]).catch((error) => fail(error instanceof Error ? error.message : String(error)))

spawnDocusaurus({
  port: EN_PORT,
  generatedDir: '.tmp-docusaurus-dev/en',
  webSocketPath: EN_WS_PATH,
})
spawnDocusaurus({
  locale: 'zh-CN',
  port: ZH_PORT,
  generatedDir: '.tmp-docusaurus-dev/zh-CN',
  webSocketPath: ZH_WS_PATH,
})

const server = http.createServer((req, res) => proxyRequest(targetFor(req.url), req, res))
server.on('upgrade', (req, socket, head) => proxyUpgrade(targetFor(req.url), req, socket, head))
server.listen(PUBLIC_PORT, HOST, () => {
  log(`Vane dev server is running at: http://${HOST}:${PUBLIC_PORT}/`)
  log(`English locale: http://${HOST}:${PUBLIC_PORT}/docs/data`)
  log(`Chinese locale: http://${HOST}:${PUBLIC_PORT}/zh-CN/docs/data`)
})
