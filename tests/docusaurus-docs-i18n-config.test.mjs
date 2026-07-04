import { readFileSync, existsSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const configSource = readFileSync('docusaurus.config.ts', 'utf8')
const routesSource = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')
const sidebarsSource = readFileSync('sidebars.data.ts', 'utf8')
const navSource = readFileSync('src/components/Nav.tsx', 'utf8')
const cssSource = readFileSync('src/index.css', 'utf8')

test('Docusaurus config enables zh-CN locale and the Data docs plugin', () => {
  assert.match(configSource, /locales:\s*\[[^\]]*'en'[^\]]*'zh-CN'[^\]]*\]/s)
  assert.match(configSource, /id:\s*'data'/)
  assert.match(configSource, /path:\s*'docs\/data'/)
  assert.match(configSource, /routeBasePath:\s*'docs\/data'/)
  assert.match(configSource, /sidebarPath:\s*require\.resolve\('\.\/sidebars\.data\.ts'\)/)
})

test('Data docs are owned by content-docs instead of the custom route plugin', () => {
  assert.doesNotMatch(routesSource, /sidebar\.data\.json/)
  assert.doesNotMatch(routesSource, /dataSlugs/)
  assert.doesNotMatch(routesSource, /LIVE_PRODUCTS/)
  assert.match(routesSource, /docsRoute\('\/docs'\)/)
  assert.match(routesSource, /docsRoute\('\/docs\/agent'\)/)
  assert.match(routesSource, /docsRoute\('\/docs\/rl'\)/)
})

test('English and Chinese docs trees use matching English slugs', () => {
  assert.equal(existsSync('docs/data/index.mdx'), true)
  assert.equal(existsSync('docs/data/guides/structured-transformation.mdx'), true)
  assert.equal(
    existsSync(
      'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/guides/structured-transformation.mdx',
    ),
    true,
  )
})

test('Docusaurus sidebar maps custom index slugs to document ids', () => {
  assert.match(sidebarsSource, /slug === 'examples' \? 'examples\/index' : slug/)
})

test('custom navbar preserves the Docusaurus navbar marker for docs TOC code', () => {
  assert.match(navSource, /<header\s+className="nav navbar"/)
})

test('marketing hero background is not overridden by Infima hero styles', () => {
  assert.match(cssSource, /section\.hero\s*{[^}]*background:\s*transparent/s)
})
