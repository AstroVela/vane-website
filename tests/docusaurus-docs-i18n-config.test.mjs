import { readFileSync, existsSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const configSource = readFileSync('docusaurus.config.ts', 'utf8')
const routesSource = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')
const docsPageSource = readFileSync('src/pages/Docs.tsx', 'utf8')
const sidebarsSource = readFileSync('sidebars.data.ts', 'utf8')
const navSource = readFileSync('src/components/Nav.tsx', 'utf8')
const cssSource = readFileSync('src/index.css', 'utf8')
const readmeSource = readFileSync('README.md', 'utf8')
const packageSource = readFileSync('package.json', 'utf8')
const devScriptSource = readFileSync('scripts/dev.mjs', 'utf8')
const codeWindowSource = readFileSync('src/components/CodeWindow.tsx', 'utf8')
const trainingUseCaseSource = readFileSync('src/pages/TrainingUseCase.tsx', 'utf8')
const docPaginatorSource = readFileSync('src/theme/DocPaginator/index.tsx', 'utf8')

test('Docusaurus config enables zh-CN locale and the Data docs plugin', () => {
  assert.match(configSource, /locales:\s*\[[^\]]*'en'[^\]]*'zh-CN'[^\]]*\]/s)
  assert.match(configSource, /id:\s*'data'/)
  assert.match(configSource, /path:\s*'docs\/data'/)
  assert.match(configSource, /routeBasePath:\s*'docs\/data'/)
  assert.match(configSource, /sidebarPath:\s*require\.resolve\('\.\/sidebars\.data\.ts'\)/)
})

test('Docusaurus docs sidebar allows multiple categories to stay expanded', () => {
  assert.match(configSource, /autoCollapseCategories:\s*false/)
})

test('Data docs are owned by content-docs instead of the custom route plugin', () => {
  assert.doesNotMatch(routesSource, /sidebar\.data\.json/)
  assert.doesNotMatch(routesSource, /dataSlugs/)
  assert.doesNotMatch(routesSource, /LIVE_PRODUCTS/)
  assert.doesNotMatch(routesSource, /\[.*'data'.*\]\.forEach/s)
  assert.match(routesSource, /docsRoute\('\/docs'\)/)
  assert.match(routesSource, /docsRoute\('\/docs\/agent'\)/)
  assert.match(routesSource, /docsRoute\('\/docs\/rl'\)/)
  assert.match(routesSource, /docsRoute\(`\/docs\/data\/\$\{slug\}`\)/)
})

test('custom docs entry and legacy redirects preserve the current locale baseUrl', () => {
  assert.match(routesSource, /const vaneRoutesPlugin: PluginModule = \(context\)/)
  assert.match(routesSource, /localizedPath\(context\.baseUrl, path\)/)
  assert.match(routesSource, /if \(path === '\/'\) return baseUrl/)
  assert.match(docsPageSource, /import useBaseUrl from '@docusaurus\/useBaseUrl'/)
  assert.match(docsPageSource, /const dataTo = useBaseUrl\(dataDocPath\(resolveLegacyDocSlug\(slug\) \?\? slug\)\)/)
  assert.match(docsPageSource, /function RedirectFallback\(\{to\}: \{to: string\}\)/)
  assert.match(docsPageSource, /<meta httpEquiv="refresh" content=\{`0;url=\$\{to\}`\} \/>/)
  assert.match(docsPageSource, /<RedirectFallback to=\{dataTo\} \/>/)
  assert.match(docsPageSource, /<Redirect to=\{to\} \/>/)
})

test('shared code windows localize copy controls for Chinese pages', () => {
  assert.match(codeWindowSource, /useSiteLocale\(\)/)
  assert.match(codeWindowSource, /pickLocale\(/)
  assert.match(codeWindowSource, /aria:\s*'复制代码'/)
  assert.match(codeWindowSource, /copied:\s*'已复制'/)
  assert.match(codeWindowSource, /copy:\s*'复制'/)
  assert.match(codeWindowSource, /running:\s*'运行中'/)
  assert.match(codeWindowSource, /\{copy\.running\}/)
})

test('shared navigation localizes visible short labels for Chinese pages', () => {
  assert.match(navSource, /star:\s*'加星'/)
})

test('docs paginator maps generated metadata titles back to localized docs titles', () => {
  assert.match(docPaginatorSource, /import \{docPageTitle, isDocSlug\} from '..\/..\/docs\/registry'/)
  assert.match(docPaginatorSource, /function localizedTitle/)
  assert.match(docPaginatorSource, /isDocSlug\(slug\)/)
  assert.match(docPaginatorSource, /docPageTitle\(slug, locale\)/)
  assert.match(docPaginatorSource, /localizedTitle\(previous, locale\)/)
  assert.match(docPaginatorSource, /localizedTitle\(next, locale\)/)
})

test('training use-case internal links use locale-aware Link', () => {
  assert.match(trainingUseCaseSource, /import \{ Link \} from '\.\.\/router'/)
  assert.match(trainingUseCaseSource, /<Link className="training-link" to=\{to\}>/)
  assert.match(trainingUseCaseSource, /to="\/benchmarks"/)
  assert.doesNotMatch(trainingUseCaseSource, /<a className="training-link" href=\{href\}/)
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

test('Overview is a direct sidebar page instead of a Docs Home child item', () => {
  assert.match(sidebarsSource, /docsSidebar as DocsSidebarEntry\[\]/)
  assert.match(sidebarsSource, /key:\s*entry\.label/)
  assert.match(sidebarsSource, /docs-data-overview-link/)
  assert.doesNotMatch(sidebarsSource, /label:\s*'Docs Home'/)
})

test('custom navbar preserves the Docusaurus navbar marker for docs TOC code', () => {
  assert.match(navSource, /<header\s+className="nav navbar"/)
})

test('marketing hero background is not overridden by Infima hero styles', () => {
  assert.match(cssSource, /section\.hero\s*{[^}]*background:\s*transparent/s)
})

test('local dev command serves English and Chinese routes through isolated locale servers', () => {
  assert.match(packageSource, /"dev":\s*"node scripts\/dev\.mjs"/)
  assert.match(packageSource, /"dev:en":\s*"docusaurus start"/)
  assert.match(packageSource, /"dev:zh-CN":\s*"docusaurus start --locale zh-CN"/)
  assert.match(devScriptSource, /DOCUSAURUS_GENERATED_FILES_DIR_NAME/)
  assert.match(devScriptSource, /\.tmp-docusaurus-dev\/en/)
  assert.match(devScriptSource, /\.tmp-docusaurus-dev\/zh-CN/)
  assert.match(devScriptSource, /startsWith\('\/zh-CN\/'\)/)
  assert.match(readmeSource, /npm run dev:zh-CN/)
  assert.match(readmeSource, /bilingual dev server/)
  assert.doesNotMatch(navSource, /Run `npm run dev:zh-CN` to preview Chinese routes locally\./)
})
