import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'

const read = (path) => readFileSync(path, 'utf8')
const englishDirectory = 'release-notes'
const chineseDirectory = 'i18n/zh-CN/docusaurus-plugin-content-blog-release-notes'
const files = (directory) => readdirSync(directory).filter((file) => file.endsWith('.mdx')).sort()
const metadata = (source, field) => source.match(new RegExp(`^${field}: (.+)$`, 'm'))?.[1]

test('release translations preserve version identity, date, sources, and bounded previews', () => {
  assert.deepEqual(files(chineseDirectory), files(englishDirectory))
  const slugs = new Set()
  for (const file of files(englishDirectory)) {
    const english = read(`${englishDirectory}/${file}`)
    const chinese = read(`${chineseDirectory}/${file}`)
    const slug = metadata(english, 'slug')
    assert.match(slug, /^v\d+\.\d+\.\d+(?:-[\w.-]+)?$/)
    assert.equal(slugs.has(slug), false, `Duplicate release: ${slug}`)
    slugs.add(slug)
    assert.equal(metadata(chinese, 'slug'), slug)
    assert.equal(metadata(chinese, 'date'), metadata(english, 'date'))
    assert.equal(file, `${metadata(english, 'date')}-${slug}.mdx`)
    for (const source of [english, chinese]) {
      assert.equal((source.match(/<!-- truncate -->/g) ?? []).length, 1)
      assert.ok(source.includes(`https://github.com/AstroVela/vane/releases/tag/${slug}`))
      assert.ok(source.includes(`https://github.com/AstroVela/vane/tree/${slug}`))
      assert.doesNotMatch(source, /github\.com\/AstroVela\/vane\/(?:tree|blob)\/main/)
    }
  }
})

test('v0.1.0 preserves the published capability boundaries in both languages', () => {
  const english = read(`${englishDirectory}/2026-08-11-v0.1.0.mdx`)
  const chinese = read(`${chineseDirectory}/2026-08-11-v0.1.0.mdx`)
  assert.match(english, /native vLLM `Prompt` path currently supports text input only/)
  assert.match(chinese, /原生 vLLM `Prompt` 路径目前仅支持文本输入/)
  assert.match(english, /Local Runner is currently experimental/)
  assert.match(chinese, /Local Runner 目前为实验性功能/)
  assert.match(english, /single-GPU machine/)
  assert.match(chinese, /单 GPU 机器/)
  assert.match(english, /not a direct reproduction of the original distributed Ray Data benchmark/)
  assert.match(chinese, /不是对原始分布式 Ray Data benchmark 的直接复现/)
  for (const source of [english, chinese]) {
    assert.ok(source.includes('https://x.com/AstroVelaAI/status/2087045421109801261'))
    assert.doesNotMatch(source, /Turbopuffer|cuDF/)
    assert.match(source, /OpenAI.*Anthropic.*Google/)
    assert.match(source, /SentenceTransformers/)
  }
})

test('all release navigation entries use locale-aware internal links', () => {
  const nav = read('src/components/Nav.tsx')
  const footer = read('src/components/Footer.tsx')
  assert.equal((nav.match(/<Link\b[^>]*to="\/release-notes"/g) ?? []).length, 2)
  assert.equal((footer.match(/<Link\b[^>]*to="\/release-notes"/g) ?? []).length, 1)
  for (const source of [nav, footer]) {
    assert.doesNotMatch(source, /\$\{GITHUB_URL\}\/releases/)
  }
})

test('published runtime releases include v0.2.0 without promoting provider candidates', () => {
  const inventory = files(englishDirectory)
  for (const file of [
    '2026-08-11-v0.1.0.mdx',
    '2026-09-19-v0.2.0.mdx',
  ]) assert.ok(inventory.includes(file), `Missing published release: ${file}`)
  assert.equal(inventory.some((file) => file.includes('native-media')), false)
  const english = read(`${englishDirectory}/2026-09-19-v0.2.0.mdx`)
  const chinese = read(`${chineseDirectory}/2026-09-19-v0.2.0.mdx`)
  for (const source of [english, chinese]) {
    assert.match(source, /vane-extension-native-media/)
    assert.match(source, /vane\.load_installed_extension\("native_media"\)/)
    assert.match(source, /vane-ai==0\.2\.0/)
    assert.match(source, /https:\/\/github\.com\/AstroVela\/vane-extensions/)
  }
  assert.match(english, /fail at bind time with no automatic\s+fallback/)
  assert.match(chinese, /绑定阶段失败，不会自动回退/)
  assert.match(english, /does not include them/)
  assert.match(chinese, /不会包含这些连接器/)
  assert.equal((english.match(/^> \*\*Note:/gm) ?? []).length, 2)
  assert.equal((chinese.match(/^> \*\*说明：/gm) ?? []).length, 2)
  for (const source of [english, chinese]) {
    assert.doesNotMatch(source, /^## Provider/m)
    assert.equal((source.match(/^  - \[(?:Iceberg|Lance|Paimon|DuckLake|Vortex)\]/gm) ?? []).length, 5)
  }
})

test('release layout reserves compact navigation columns only on desktop', () => {
  const styles = read('src/pages.css')
  assert.match(styles, /@media \(min-width: 997px\) \{\s*\.release-notes-page/)
  assert.match(styles, /\.release-notes-page[^{}]+> \.row \{[^}]*grid-template-columns: 200px minmax\(0, 1fr\) 180px/)
  assert.match(styles, /\.release-notes-page[^{}]+> \.col \{[^}]*min-width: 0/)
  assert.match(styles, /\.release-notes-page[^{}]+> main:last-child \{\s*grid-column: 2 \/ -1/)
})

test('release pages retain their style scope through client navigation', () => {
  for (const component of ['ReleaseNotesList', 'ReleaseNotesPost']) {
    assert.match(read(`src/components/${component}.tsx`), /<HtmlClassNameProvider className=[^>]*release-notes-page/)
    assert.ok(read('docusaurus.config.ts').includes(`@site/src/components/${component}.tsx`))
  }
  const styles = read('src/pages.css')
  assert.doesNotMatch(styles, /plugin-id-release-notes/)
  assert.match(styles, /\.release-notes-page aside \{\s*--ifm-color-primary: var\(--accent-strong\)/)
  assert.match(styles, /a\[aria-current='page'\] \{[^}]*border-inline-start-color:[^}]*background:/)
})

test('loose release lists align the first paragraph with the marker', () => {
  const styles = read('src/pages.css')
  assert.match(styles, /\.release-notes-page \.markdown ul\.dl li > p \{[^}]*font-size: inherit;[^}]*line-height: inherit;/)
  assert.match(styles, /\.release-notes-page \.markdown ul\.dl li > p:first-child \{\s*margin-top: 0;/)
})
