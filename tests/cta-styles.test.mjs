import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const siteStyles = readFileSync('src/index.css', 'utf8')

test('Chinese CTA headings have enough room at the desktop font-size cap', () => {
  assert.match(
    siteStyles,
    /\.cta \.h2:lang\(zh\)\s*\{[^}]*max-width:\s*680px/s,
  )
})

test('outlined buttons keep the ink palette and no link underline on hover', () => {
  assert.match(
    siteStyles,
    /\.btn:hover\s*\{[^}]*color:\s*var\(--ink\);[^}]*text-decoration:\s*none/s,
  )
})

test('solid buttons keep paper-colored text on hover', () => {
  assert.match(
    siteStyles,
    /\.btn-solid:hover\s*\{[^}]*color:\s*var\(--paper\)/s,
  )
})
