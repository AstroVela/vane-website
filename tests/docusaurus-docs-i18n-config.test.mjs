import { readFileSync, existsSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const configSource = readFileSync('docusaurus.config.ts', 'utf8')
const routesSource = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')
const docsPageSource = readFileSync('src/pages/Docs.tsx', 'utf8')
const legacySlugsSource = readFileSync('src/docs/legacySlugs.ts', 'utf8')
const sidebarsSource = readFileSync('sidebars.data.ts', 'utf8')
const dataSidebar = JSON.parse(readFileSync('src/docs/sidebar.data.json', 'utf8'))
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
  readFileSync('docs/data/contributing/development.mdx', 'utf8'),
  readFileSync(
    'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/contributing/development.mdx',
    'utf8',
  ),
]
const deploymentSources = [
  readFileSync('docs/data/deploy/deployment.mdx', 'utf8'),
  readFileSync(
    'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/deploy/deployment.mdx',
    'utf8',
  ),
]
const exampleRunnerSources = [
  'docs/data/tutorials/index.mdx',
  'docs/data/tutorials/examples/common-crawl.mdx',
  'docs/data/tutorials/examples/minhash-dedupe.mdx',
  'docs/data/tutorials/examples/llms-red-pajamas.mdx',
  'docs/data/tutorials/examples/querying-images.mdx',
  'docs/data/tutorials/examples/image-generation.mdx',
  'docs/data/tutorials/examples/voice-ai-analytics.mdx',
  'docs/data/tutorials/examples/multimodal-structured-outputs.mdx',
  'docs/data/tutorials/use-cases/claims-disposition.mdx',
  'docs/data/tutorials/use-cases/enterprise-agent-evidence.mdx',
  'docs/data/tutorials/use-cases/multimodal-training-data.mdx',
  'docs/data/tutorials/use-cases/procurement-compliance-audit.mdx',
  'docs/data/tutorials/use-cases/web-text-deduplication.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/index.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/examples/common-crawl.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/examples/minhash-dedupe.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/examples/llms-red-pajamas.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/examples/querying-images.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/examples/image-generation.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/examples/voice-ai-analytics.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/examples/multimodal-structured-outputs.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/use-cases/claims-disposition.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/use-cases/enterprise-agent-evidence.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/use-cases/multimodal-training-data.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/use-cases/procurement-compliance-audit.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/use-cases/web-text-deduplication.mdx',
].map((file) => readFileSync(file, 'utf8'))
const wheelExampleSources = [
  'docs/data/tutorials/index.mdx',
  'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/index.mdx',
].map((file) => readFileSync(file, 'utf8'))
const packageSource = readFileSync('package.json', 'utf8')
const ciSource = readFileSync('.github/workflows/ci.yml', 'utf8')
const devScriptSource = readFileSync('scripts/dev.mjs', 'utf8')
const codeWindowSource = readFileSync('src/components/CodeWindow.tsx', 'utf8')
const homeSource = readFileSync('src/pages/Home.tsx', 'utf8')
const footerSource = readFileSync('src/components/Footer.tsx', 'utf8')
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

test('renamed tutorial routes preserve the previous examples URLs', () => {
  const redirects = {
    examples: 'tutorials',
    'examples/example-tutorials/common-crawl': 'tutorials/examples/common-crawl',
    'examples/end-to-end-use-cases/enterprise-agent-evidence':
      'tutorials/use-cases/enterprise-agent-evidence',
  }

  for (const [legacySlug, currentSlug] of Object.entries(redirects)) {
    assert.match(
      legacySlugsSource,
      new RegExp(`'?(?:${legacySlug})'?:\\s*'${currentSlug}'`),
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

test('Tutorials sidebar separates examples and use cases', () => {
  const tutorials = dataSidebar.find((entry) => entry.group === 'Tutorials')
  assert.deepEqual(
    tutorials.items.map((entry) => entry.group ?? entry.label),
    ['Overview', 'Examples', 'Use cases'],
  )
  assert.ok(
    tutorials.items[1].items.every((entry) =>
      entry.slug.startsWith('tutorials/examples/'),
    ),
  )
  assert.ok(
    tutorials.items[2].items.every((entry) =>
      entry.slug.startsWith('tutorials/use-cases/'),
    ),
  )
  assert.equal(
    dataDocsTranslations['sidebar.dataSidebar.category.Tutorials']?.message,
    '教程',
  )
  assert.equal(
    dataDocsTranslations['sidebar.dataSidebar.category.Examples']?.message,
    '示例',
  )
  assert.equal(
    dataDocsTranslations['sidebar.dataSidebar.category.Use cases']?.message,
    '端到端用例',
  )
  assert.equal(existsSync('docs/data/tutorials/ray-worker.mdx'), false)
  assert.equal(
    existsSync(
      'i18n/zh-CN/docusaurus-plugin-content-docs-data/current/tutorials/ray-worker.mdx',
    ),
    false,
  )
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
    assert.match(source, /uv pip install vane-ai openai/)
    assert.match(source, /OPENAI_API_KEY="<your-token>"/)
    assert.match(source, /OPENAI_BASE_URL="https:\/\/provider\.example\/v1"/)
  }
})

test('documentation installation commands use uv and the base vane-ai package', () => {
  for (const source of [
    aiFunctionsSource,
    chineseAiFunctionsSource,
    ...installationSources,
  ]) {
    assert.match(source, /uv pip install vane-ai/)
    assert.doesNotMatch(source, /python -m pip install/)
    assert.doesNotMatch(source, /vane-ai\[all\]/)
  }

  assert.equal(homeSource.match(/pip install vane-ai/g)?.length, 2)
  assert.match(footerSource, /pip install vane-ai/)
  for (const source of [homeSource, footerSource]) {
    assert.doesNotMatch(source, /uv pip install vane-ai/)
  }
})

test('quickstart delegates package installation to the installation guide', () => {
  assert.match(quickstartSource, /\[Installation guide\]\(\/docs\/data\/quickstart\/installation\)/)
  assert.match(chineseQuickstartSource, /\[安装指南\]\(\/zh-CN\/docs\/data\/quickstart\/installation\)/)
  for (const source of [quickstartSource, chineseQuickstartSource]) {
    assert.doesNotMatch(source, /(?:pip|uv pip) install vane-ai/)
    assert.doesNotMatch(source, /uv venv/)
  }
})

test('installation uses uv for the base package and optional providers', () => {
  for (const source of installationSources) {
    assert.match(source, /\[uv\]\(https:\/\/docs\.astral\.sh\/uv\/getting-started\/installation\/\)/)
    assert.match(source, /uv venv/)
    assert.match(source, /source \.venv\/bin\/activate/)
    assert.match(source, /uv pip install vane-ai/)
    assert.doesNotMatch(source, /python -m pip install/)
    assert.doesNotMatch(source, /vane-ai\[all\]/)
  }
})

test('quickstart describes Ray as the default runner and deployment documents the local override', () => {
  assert.match(quickstartSource, /Ray is Vane's default runner/)
  assert.match(chineseQuickstartSource, /Ray 是 Vane 的默认 runner/)
  assert.match(deploymentSources[0], /`ray` is the default/)
  assert.match(deploymentSources[1], /`ray` 是默认 runner/)
  for (const source of deploymentSources) {
    assert.match(source, /runner="local"/)
  }
  for (const source of exampleRunnerSources) {
    assert.doesNotMatch(source, /vane\.configure\(runner="ray"\)/)
  }
})

test('wheel-backed examples sparsely check out scripts without package sources', () => {
  for (const source of wheelExampleSources) {
    assert.match(source, /git clone --depth 1 --filter=blob:none --sparse/)
    assert.match(source, /https:\/\/github\.com\/AstroVela\/vane\.git vane-examples/)
    assert.match(source, /cd vane-examples/)
    assert.match(source, /git sparse-checkout set examples/)
    assert.doesNotMatch(source, /^git clone https:\/\/github\.com\/AstroVela\/vane\.git$/m)
    assert.match(source, /`vane\/` and `duckdb\/`|`vane\/` 和 `duckdb\/`/)
  }
})

test('installation links to the relocated source-build guide', () => {
  assert.match(installationSources[0], /\[Development\]\(\/docs\/data\/contributing\/development\)/)
  assert.match(installationSources[1], /\[开发\]\(\/zh-CN\/docs\/data\/contributing\/development\)/)
})

test('source builds use the pinned dependency bootstrap without editable or toolchain builds', () => {
  for (const source of sourceBuildSources) {
    assert.doesNotMatch(source, /pip install -e/)
    assert.doesNotMatch(source, /^uv sync\b/m)
    assert.doesNotMatch(source, /^uv pip install --editable\b/m)
    assert.doesNotMatch(source, /(?:export\s+|cmake\.define\.)CMAKE_TOOLCHAIN_FILE/)
    assert.doesNotMatch(source, /\.\.\/vcpkg/)
    assert.match(source, /uv venv --python 3\.12/)
    assert.match(source, /uv pip install --group build/)
    assert.match(source, /bash scripts\/bootstrap_vcpkg\.sh/)
    assert.match(source, /exact baseline from `vcpkg\.json`|从 `vcpkg\.json` 读取精确 baseline/)
    assert.match(source, /vcpkg_installed/)
    assert.match(source, /SKBUILD_BUILD_DIR=/)
    assert.match(source, /SKBUILD_CMAKE_BUILD_TYPE=Release/)
    assert.match(source, /uv pip install \. --no-build-isolation/)
    assert.match(source, /uv pip install --group test/)
  }
})

test('CI runs the complete Node and documentation check suites', () => {
  assert.match(packageSource, /"test":\s*"node --test tests\/\*\.test\.mjs"/)
  assert.match(ciSource, /- run: npm test/)
  assert.match(ciSource, /npm run docs:lint/)
  assert.match(ciSource, /npm run docs:manifest:check/)
  assert.match(ciSource, /npm run docs:llms:check/)
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
  assert.match(sidebarsSource, /slug === 'tutorials' \? 'tutorials\/index' : slug/)
})

test('Overview is a direct sidebar page instead of a Docs Home child item', () => {
  assert.match(sidebarsSource, /docsSidebar as DocsSidebarEntry\[\]/)
  assert.match(sidebarsSource, /key:\s*entry\.key \?\? entry\.label/)
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
