import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)
const { resolveLinkClickUrl } = await jiti.import('../src/routerUrl.ts')

test('hash-only Link targets resolve against the current page', () => {
  const url = resolveLinkClickUrl({
    href: '/#code',
    to: '#code',
    currentHref: 'https://vane.ai/solutions/training?locale=test',
  })

  assert.equal(url.pathname, '/solutions/training')
  assert.equal(url.search, '?locale=test')
  assert.equal(url.hash, '#code')
})

test('absolute internal Link targets resolve from the site origin', () => {
  const url = resolveLinkClickUrl({
    href: '/benchmarks',
    to: '/benchmarks',
    currentHref: 'https://vane.ai/solutions/training?locale=test',
  })

  assert.equal(url.pathname, '/benchmarks')
  assert.equal(url.search, '')
  assert.equal(url.hash, '')
})
