import { readFileSync, existsSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const configSource = readFileSync('docusaurus.config.ts', 'utf8')
const routesSource = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')
const docsPageSource = readFileSync('src/pages/Docs.tsx', 'utf8')
const legacySlugsSource = readFileSync('src/docs/legacySlugs.ts', 'utf8')
const sidebarsSource = readFileSync('sidebars.data.ts', 'utf8')
const navSource = readFileSync('src/components/Nav.tsx', 'utf8')
const cssSource = readFileSync('src/index.css', 'utf8')
const readmeSource = readFileSync('README.md', 'utf8')
const dataDocsTranslations = JSON.parse(
  readFileSync('i18n/zh-CN/docusaurus-plugin-content-docs-data/current.json', 'utf8'),
)
const quickstartSource = readFileSync('docs/data/quickstart/quickstart.mdx', 'utf8')
const aiFunctionsSource = readFileSync('docs/data/concepts/ai-functions.mdx', 'utf8')
const chineseQuickstartSource = readFileSync(
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/quickstart/quickstart.mdx',
  'utf8',
)
const chineseAiFunctionsSource = readFileSync(
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/ai-functions.mdx',
  'utf8',
)
const installationSources = [
  readFileSync('docs/data/quickstart/installation.mdx', 'utf8'),
  readFileSync(
    'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/quickstart/installation.mdx',
    'utf8',
  ),
]
const sourceBuildSources = [
  ...installationSources,
  readFileSync('docs/data/contributing/development.mdx', 'utf8'),
  readFileSync(
    'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/contributing/development.mdx',
    'utf8',
  ),
]
const exampleRunnerSources = [
  'docs/data/examples/index.mdx',
  'docs/data/examples/training-data-pipeline.mdx',
  'docs/data/examples/tender-compliance-check.mdx',
  'docs/data/examples/multimodal-data-lake.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/examples/index.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/examples/training-data-pipeline.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/examples/tender-compliance-check.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/examples/multimodal-data-lake.mdx',
].map((file) => readFileSync(file, 'utf8'))
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
  assert.match(
    docsPageSource,
    /import useDocusaurusContext from '@docusaurus\/useDocusaurusContext'/,
  )
  assert.match(docsPageSource, /const dataTo = useBaseUrl\(dataDocPath\(resolveLegacyDocSlug\(slug\) \?\? slug\)\)/)
  assert.match(docsPageSource, /function RedirectFallback\(\{to\}: \{to: string\}\)/)
  assert.match(docsPageSource, /<meta httpEquiv="refresh" content=\{`0;url=\$\{to\}`\} \/>/)
  assert.match(docsPageSource, /const canonical = new URL\(to, siteConfig\.url\)\.toString\(\)/)
  assert.match(docsPageSource, /<meta name="robots" content="noindex,follow" \/>/)
  assert.match(docsPageSource, /<link rel="canonical" href=\{canonical\} \/>/)
  assert.match(docsPageSource, /<RedirectFallback to=\{dataTo\} \/>/)
  assert.match(docsPageSource, /<Redirect to=\{to\} \/>/)
  assert.match(docsPageSource, /Open current page/)
  assert.match(docsPageSource, /打开当前页面/)
  assert.doesNotMatch(docsPageSource, /Open overview|打开概览/)
})

test('removed deployment pages redirect to the consolidated deployment guide', () => {
  for (const legacySlug of ['single-node', 'ray-cluster', 'sizing']) {
    assert.match(
      legacySlugsSource,
      new RegExp(`'deploy/${legacySlug}':\\s*'deploy/deployment'`),
    )
  }
})

test('Operations sidebar category is localized in Chinese Data docs', () => {
  assert.equal(
    dataDocsTranslations['sidebar.dataSidebar.category.Operations']?.message,
    '运维',
  )
  assert.equal(dataDocsTranslations['sidebar.dataSidebar.category.Deploy'], undefined)
})

test('Quickstart input can cross the default Ray runner boundary', () => {
  for (const source of [quickstartSource, chineseQuickstartSource]) {
    assert.match(source, /documents\s*=\s*con\.values\(/)
    assert.doesNotMatch(source, /CREATE TABLE documents/)
  }
})

test('OpenAI examples use a valid API root', () => {
  for (const source of [aiFunctionsSource, chineseAiFunctionsSource]) {
    assert.equal(source.match(/https:\/\/api\.openai\.com\/v1/g)?.length, 4)
    assert.doesNotMatch(source, /api\.example\.com/)
    assert.match(source, /^pip install vane-ai openai$/m)
    assert.match(source, /OPENAI_API_KEY="<your-token>"/)
    assert.match(source, /OPENAI_BASE_URL="https:\/\/provider\.example\/v1"/)
  }
})

test('public installation commands use the base vane-ai package', () => {
  for (const source of [
    quickstartSource,
    chineseQuickstartSource,
    aiFunctionsSource,
    chineseAiFunctionsSource,
    ...installationSources,
  ]) {
    assert.match(source, /^pip install vane-ai$/m)
    assert.doesNotMatch(source, /vane-ai\[all\]/)
  }
})

test('installation and examples describe Ray as the default runner', () => {
  for (const source of installationSources) {
    assert.match(source, /runner="local"/)
    assert.doesNotMatch(source, /runner="ray"/)
  }
  for (const source of exampleRunnerSources) {
    assert.doesNotMatch(source, /vane\.configure\(runner="ray"\)/)
  }
})

test('source builds pin and preinstall native dependencies without editable or toolchain builds', () => {
  for (const source of sourceBuildSources) {
    assert.doesNotMatch(source, /pip install -e/)
    assert.doesNotMatch(source, /(?:export\s+|cmake\.define\.)CMAKE_TOOLCHAIN_FILE/)
    assert.doesNotMatch(source, /\.\.\/vcpkg/)
    assert.match(source, /git clone https:\/\/github\.com\/microsoft\/vcpkg\.git \.cache\/vcpkg/)
    assert.match(source, /git -C \.cache\/vcpkg checkout 44819aa2a6c10e56065e2b0330e7d6c89d1d2574/)
    assert.match(source, /\.cache\/vcpkg\/bootstrap-vcpkg\.sh -disableMetrics/)
    assert.match(source, /\.cache\/vcpkg\/vcpkg install --x-install-root="\$PWD\/vcpkg_installed"/)
    assert.match(source, /SKBUILD_BUILD_DIR=/)
    assert.match(source, /SKBUILD_CMAKE_BUILD_TYPE=Release/)
    assert.match(source, /python -m pip install \. --no-build-isolation -v/)
  }
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
  assert.match(navSource, /star:\s*'Star'/)
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
  assert.equal(existsSync('docs/data/concepts/ai-functions.mdx'), true)
  assert.equal(
    existsSync(
      'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/concepts/ai-functions.mdx',
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

test('README describes the current deployment documentation', () => {
  assert.match(readmeSource, /deploy\/\s+runner configuration and Ray deployment material/)
  assert.doesNotMatch(readmeSource, /single-node, Ray cluster, and sizing material/)
})
