import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const home = readFileSync('src/pages/Home.tsx', 'utf8')
const nav = readFileSync('src/components/Nav.tsx', 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')

assert.match(home, /const HERO_CODE = `/)
assert.match(home, /ai_embed\(/)
assert.match(home, /write_parquet/)
assert.match(home, /\/solutions\/training/)
assert.match(home, /\/solutions\/enterprise-agent/)
assert.match(nav, /\/solutions/)
assert.match(footer, /\/solutions\/training/)
assert.match(footer, /\/solutions\/enterprise-agent/)
assert.doesNotMatch(`${home}\n${nav}\n${footer}`, /\/use-cases(?:\/|\b)/)

console.log('Home content check passed.')
