import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'

const englishBlogDirectory = 'blog'
const chineseBlogDirectory = 'i18n/zh-CN/docusaurus-plugin-content-blog'
const englishPostPath = 'blog/2026-08-23-ai-workloads-need-a-new-data-engine.mdx'
const chinesePostPath =
  'i18n/zh-CN/docusaurus-plugin-content-blog/2026-08-23-ai-workloads-need-a-new-data-engine.mdx'
const englishMultimodalPostPath =
  'blog/2026-08-31-from-files-to-queryable-data.mdx'
const chineseMultimodalPostPath =
  'i18n/zh-CN/docusaurus-plugin-content-blog/2026-08-31-from-files-to-queryable-data.mdx'
const architectureImageDirectory =
  'public/img/blog/ai-workloads-need-a-new-data-engine'
const englishArchitectureImagePath =
  `${architectureImageDirectory}/vane-data-architecture-en.png`
const chineseArchitectureImagePath =
  `${architectureImageDirectory}/vane-data-architecture-zh-cn.png`
const englishArchitectureImageUrl =
  '/img/blog/ai-workloads-need-a-new-data-engine/vane-data-architecture-en.png'
const chineseArchitectureImageUrl =
  '/img/blog/ai-workloads-need-a-new-data-engine/vane-data-architecture-zh-cn.png'
const englishArchitectureImageSize = ['1880', '837']
const chineseArchitectureImageSize = ['1873', '840']
const multimodalImageDirectory = 'public/img/blog/from-files-to-queryable-data'
const englishMultimodalImagePath =
  `${multimodalImageDirectory}/vane-data-multimodal-pipeline-en.png`
const chineseMultimodalImagePath =
  `${multimodalImageDirectory}/vane-data-multimodal-pipeline-zh-cn.png`
const englishMultimodalImageUrl =
  '/img/blog/from-files-to-queryable-data/vane-data-multimodal-pipeline-en.png'
const chineseMultimodalImageUrl =
  '/img/blog/from-files-to-queryable-data/vane-data-multimodal-pipeline-zh-cn.png'
const multimodalImageSize = ['1800', '766']
const englishProductReviewPostPath = 'blog/2026-09-20-product-category-review.mdx'
const chineseProductReviewPostPath =
  'i18n/zh-CN/docusaurus-plugin-content-blog/2026-09-20-product-category-review.mdx'
const productReviewImageDirectory = 'public/img/blog/product-category-review'
const englishProductReviewImagePath = `${productReviewImageDirectory}/pipeline-en.png`
const chineseProductReviewImagePath = `${productReviewImageDirectory}/pipeline-zh-cn.png`
const englishProductReviewImageUrl = '/img/blog/product-category-review/pipeline-en.png'
const chineseProductReviewImageUrl = '/img/blog/product-category-review/pipeline-zh-cn.png'
const productReviewImageSize = ['2350', '1000']

const configSource = readFileSync('docusaurus.config.ts', 'utf8')
const routesSource = readFileSync('src/plugins/vaneRoutes.ts', 'utf8')
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
const englishBlogPostFilenames = readdirSync(englishBlogDirectory)
  .filter((filename) => filename.endsWith('.mdx'))
  .sort()
const chineseBlogPostFilenames = readdirSync(chineseBlogDirectory)
  .filter((filename) => filename.endsWith('.mdx'))
  .sort()
const localizedBlogDirectories = [
  [englishBlogDirectory, englishBlogPostFilenames],
  [chineseBlogDirectory, chineseBlogPostFilenames],
]
const englishPost = readFileSync(englishPostPath, 'utf8')
const chinesePost = readFileSync(chinesePostPath, 'utf8')
const englishMultimodalPost = readFileSync(englishMultimodalPostPath, 'utf8')
const chineseMultimodalPost = readFileSync(chineseMultimodalPostPath, 'utf8')
const englishProductReviewPost = readFileSync(englishProductReviewPostPath, 'utf8')
const chineseProductReviewPost = readFileSync(chineseProductReviewPostPath, 'utf8')
const chineseBlogOptions = JSON.parse(
  readFileSync('i18n/zh-CN/docusaurus-plugin-content-blog/options.json', 'utf8'),
)
const pageStyles = readFileSync('src/pages.css', 'utf8')

function frontmatterValue(source, key) {
  const value = source.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]
  return value?.replace(/^(["'])(.*)\1$/, '$2')
}

function fencedCode(source) {
  return Array.from(source.matchAll(/^```[^\n]+\n([\s\S]*?)^```$/gm), (match) => match[1])
}

function codeComments(source) {
  return fencedCode(source).flatMap((block) =>
    block.split('\n').filter((line) => /^\s*(?:#|--)\s+\S/.test(line)),
  )
}

test('Docusaurus owns the Blog routes and content directory', () => {
  assert.equal(packageJson.dependencies['@docusaurus/plugin-content-blog'], '^3.10.1')
  assert.match(configSource, /'@docusaurus\/plugin-content-blog'/)
  assert.match(configSource, /path:\s*'blog'/)
  assert.match(configSource, /routeBasePath:\s*'blog'/)
  assert.match(configSource, /blogSidebarCount:\s*0/)
  assert.doesNotMatch(routesSource, /path:\s*routePath\('\/blog'\)/)
  assert.equal(existsSync('src/pages/Blog.tsx'), false)
})

test('Every English Blog post has a matching Chinese translation', () => {
  assert.deepEqual(chineseBlogPostFilenames, englishBlogPostFilenames)
})

test('Localized Blog posts use bounded previews and locale-preserving links', () => {
  for (const [directory, filenames] of localizedBlogDirectories) {
    for (const filename of filenames) {
      const source = readFileSync(directory + '/' + filename, 'utf8')
      const sourcePath = directory + '/' + filename

      assert.equal(
        (source.match(/<!-- truncate -->/g) ?? []).length,
        1,
        sourcePath + ' must have exactly one truncation marker',
      )
      assert.doesNotMatch(
        source,
        /<callout(?:\s|>)/,
        sourcePath + ' must use the registered Callout component',
      )
      assert.doesNotMatch(
        source,
        /https:\/\/vane\.astrovela\.ai\/docs\//,
        sourcePath + ' must use locale-preserving internal documentation links',
      )
    }
  }
})

test('English Blog posts keep fenced code in English', () => {
  for (const filename of englishBlogPostFilenames) {
    const sourcePath = englishBlogDirectory + '/' + filename
    const source = readFileSync(sourcePath, 'utf8')

    assert.doesNotMatch(
      fencedCode(source).join('\n'),
      /\p{Script=Han}/u,
      sourcePath + ' must keep fenced code in English',
    )
  }
})

test('Architecture post translations share one stable localized route', () => {
  assert.equal(
    frontmatterValue(englishPost, 'slug'),
    'ai-workloads-need-a-new-data-engine',
  )
  assert.equal(frontmatterValue(chinesePost, 'slug'), frontmatterValue(englishPost, 'slug'))
  assert.equal(frontmatterValue(chinesePost, 'date'), frontmatterValue(englishPost, 'date'))
  assert.equal(
    frontmatterValue(englishPost, 'title'),
    'Vane Data: How to Turn DuckDB into an AI Multimodal Data Engine',
  )
  assert.equal(
    frontmatterValue(chinesePost, 'title'),
    'Vane Data：如何让 DuckDB 成为 AI 多模态数据引擎',
  )
  for (const source of [englishPost, chinesePost]) {
    assert.equal((source.match(/<!-- truncate -->/g) ?? []).length, 1)
    assert.match(
      source,
      /<p className="blog-body-lead">[\s\S]*?<\/p>\n\n<!-- truncate -->/,
    )
  }
})

test('Architecture post translations use localized images and retain the runnable example', () => {
  const localizedPosts = [
    [
      englishPost,
      englishArchitectureImagePath,
      englishArchitectureImageUrl,
      ...englishArchitectureImageSize,
    ],
    [
      chinesePost,
      chineseArchitectureImagePath,
      chineseArchitectureImageUrl,
      ...chineseArchitectureImageSize,
    ],
  ]

  for (const [source, imagePath, imageUrl, imageWidth, imageHeight] of localizedPosts) {
    assert.equal(existsSync(imagePath), true)
    assert.equal(readFileSync(imagePath).subarray(1, 4).toString('ascii'), 'PNG')
    assert.equal(frontmatterValue(source, 'image'), imageUrl)
    assert.match(source, /<img\s+className="dimg"/)
    assert.match(source, /style=\{\{ width: '100%', height: 'auto' \}\}/)
    assert.ok(source.includes(`src="${imageUrl}"`))
    assert.ok(source.includes(`width="${imageWidth}"`))
    assert.ok(source.includes(`height="${imageHeight}"`))
    assert.match(source, /loading="lazy"/)
    assert.doesNotMatch(source, /<DataArchitecture \/>/)
    assert.match(source, /@vane\.func\(return_dtype="BLOB"\)/)
    assert.match(source, /routes\.write_parquet\("claim_routes\.parquet"\)/)
    assert.match(source, /\[.*\]\(\/docs\/data\/quickstart\/quickstart\)/)
    assert.match(source, /\[.*\]\(\/benchmarks\)/)
    assert.doesNotMatch(source, /vane\.astrovela\.ai/)
  }

  assert.ok(fencedCode(englishPost).length > 0)
  assert.ok(fencedCode(chinesePost).length > 0)
})

test('Multimodal post translations share explicit localized metadata', () => {
  assert.equal(frontmatterValue(englishMultimodalPost, 'slug'), 'from-files-to-queryable-data')
  assert.equal(
    frontmatterValue(chineseMultimodalPost, 'slug'),
    frontmatterValue(englishMultimodalPost, 'slug'),
  )
  assert.equal(
    frontmatterValue(chineseMultimodalPost, 'date'),
    frontmatterValue(englishMultimodalPost, 'date'),
  )
  assert.equal(
    frontmatterValue(englishMultimodalPost, 'title'),
    'Vane Data: From Multimodal Files to Queryable Data',
  )
  assert.equal(
    frontmatterValue(chineseMultimodalPost, 'title'),
    'Vane Data：从多模态文件到可查询数据',
  )
  assert.match(
    frontmatterValue(englishMultimodalPost, 'description'),
    /PDFs, images, audio, and video into queryable Relations/,
  )
  assert.match(
    frontmatterValue(chineseMultimodalPost, 'description'),
    /PDF、图片、音频和视频组织成可查询的 Relation/,
  )
  for (const source of [englishMultimodalPost, chineseMultimodalPost]) {
    const preview = source.split('<!-- truncate -->', 1)[0]
    const previewBody = preview.replace(/^---\n[\s\S]*?\n---\n/, '')
    assert.doesNotMatch(previewBody, /^# /m)
    assert.doesNotMatch(previewBody, /<Callout(?:\s|>)/)
    assert.match(
      previewBody.trim(),
      /^<p className="blog-body-lead">[\s\S]*<\/p>$/,
    )
  }
})

test('Multimodal post translations use localized in-article diagrams', () => {
  const localizedPosts = [
    [englishMultimodalPost, englishMultimodalImagePath, englishMultimodalImageUrl],
    [chineseMultimodalPost, chineseMultimodalImagePath, chineseMultimodalImageUrl],
  ]

  for (const [source, imagePath, imageUrl] of localizedPosts) {
    const preview = source.split('<!-- truncate -->', 1)[0]

    assert.equal(existsSync(imagePath), true)
    assert.equal(readFileSync(imagePath).subarray(1, 4).toString('ascii'), 'PNG')
    assert.match(source, /<img\s+className="dimg"/)
    assert.match(source, /style=\{\{ width: '100%', height: 'auto' \}\}/)
    assert.ok(source.includes(`src="${imageUrl}"`))
    assert.ok(source.includes(`width="${multimodalImageSize[0]}"`))
    assert.ok(source.includes(`height="${multimodalImageSize[1]}"`))
    assert.match(source, /loading="lazy"/)
    assert.match(source, /decoding="async"/)
    assert.equal(preview.includes(imageUrl), false)
  }
})

test('Multimodal post code comments match each locale', () => {
  const englishComments = codeComments(englishMultimodalPost)
  const chineseComments = codeComments(chineseMultimodalPost)

  assert.ok(englishComments.length > 0)
  assert.equal(chineseComments.length, englishComments.length)
  for (const comment of chineseComments) {
    assert.match(comment, /\p{Script=Han}/u)
  }
})

test('Multimodal post translations keep pseudocode, image UDF, and provider contracts', () => {
  const localizedPosts = [
    {
      source: englishMultimodalPost,
      pseudocodeDescription: /uses conceptual pseudocode/,
      providerDescription: /calls `gpt-4o-mini` through the OpenAI Provider/,
      nullDescription: /Prompt stage did not produce a valid structured result/,
      audioPipelineDescription: /uses a sequence of SQL CTEs and a final projection/,
      outputLanguage: 'English',
      quickstart: /\[Vane Data quickstart\]\(\/docs\/data\/quickstart\/quickstart\)/,
    },
    {
      source: chineseMultimodalPost,
      pseudocodeDescription: /用概念性伪代码/,
      providerDescription: /通过 OpenAI Provider 调用 `gpt-4o-mini`/,
      nullDescription: /Prompt 阶段没有生成有效的结构化结果/,
      audioPipelineDescription: /通过一组 SQL CTE 和最终投影/,
      outputLanguage: 'Chinese',
      quickstart:
        /\[Vane Data 快速开始\]\(\/zh-CN\/docs\/data\/quickstart\/quickstart\)/,
    },
  ]

  assert.equal(fencedCode(englishMultimodalPost).length, fencedCode(chineseMultimodalPost).length)
  assert.equal(
    (englishMultimodalPost.match(/^## /gm) ?? []).length,
    (chineseMultimodalPost.match(/^## /gm) ?? []).length,
  )

  for (const {
    source,
    pseudocodeDescription,
    providerDescription,
    nullDescription,
    audioPipelineDescription,
    outputLanguage,
    quickstart,
  } of localizedPosts) {
    const imageCode = fencedCode(source).find((block) =>
      block.includes('def inspect_image(image, minimum_side):'),
    )

    assert.ok(imageCode)
    assert.match(imageCode, /import pyarrow as pa/)
    assert.match(
      imageCode,
      /def inspect_image\(image, minimum_side\):\n\s+return inspect_image_blobs\(image, minimum_side\)/,
    )
    assert.doesNotMatch(imageCode, /\btable\b|blob_column|pass_through/)
    assert.match(source, pseudocodeDescription)
    assert.doesNotMatch(source, /Links to complete examples|完整示例见/)
    assert.match(source, providerDescription)
    assert.doesNotMatch(source, /VISION_MODEL|OPENAI_BASE_URL|Qwen2\.5-VL/)
    assert.match(imageCode, /provider := 'openai'/)
    assert.match(imageCode, /model := 'gpt-4o-mini'/)
    assert.match(source, audioPipelineDescription)
    assert.doesNotMatch(source, /four SQL CTEs|四层 SQL CTE/)
    assert.match(
      imageCode,
      new RegExp('Return only an? ' + outputLanguage + '-language result'),
    )
    assert.match(source, nullDescription)
    assert.match(source, quickstart)
  }
})

test('Blog metadata and long-form styles are localized', () => {
  assert.equal(chineseBlogOptions.title.message, 'Vane 技术博客')
  assert.match(chineseBlogOptions.description.message, /工程文章/)
  assert.match(pageStyles, /\.blog-wrapper \.markdown/)
  assert.match(pageStyles, /\.blog-wrapper \.markdown p\.blog-body-lead/)
  assert.match(pageStyles, /\.blog-wrapper \.markdown \.dimg/)
  assert.match(pageStyles, /\.blog-wrapper \.table-of-contents__link/)
})

test('Blog prose fills the available article width', () => {
  assert.match(pageStyles, /--blog-prose-w:\s*100%/)
  assert.match(
    pageStyles,
    /\.blog-wrapper \.markdown p \{[^}]*max-width:\s*var\(--blog-prose-w\)/,
  )
  assert.match(
    pageStyles,
    /\.blog-wrapper \.markdown h2\.ds \{[^}]*max-width:\s*var\(--blog-prose-w\)/,
  )
  assert.match(
    pageStyles,
    /\.blog-wrapper \.markdown p\.blog-body-lead \{[^}]*max-width:\s*var\(--blog-prose-w\)/,
  )
  assert.match(
    pageStyles,
    /\.blog-wrapper \.markdown ul\.dl \{[^}]*max-width:\s*var\(--blog-prose-w\)/,
  )
})

test('Product category review post translations share explicit localized metadata', () => {
  assert.equal(frontmatterValue(englishProductReviewPost, 'slug'), 'product-category-review')
  assert.equal(
    frontmatterValue(chineseProductReviewPost, 'slug'),
    frontmatterValue(englishProductReviewPost, 'slug'),
  )
  assert.equal(
    frontmatterValue(chineseProductReviewPost, 'date'),
    frontmatterValue(englishProductReviewPost, 'date'),
  )
  assert.equal(
    frontmatterValue(englishProductReviewPost, 'title'),
    'Assisted Product Category Review with Vane Data and Lance',
  )
  assert.equal(
    frontmatterValue(chineseProductReviewPost, 'title'),
    '用 Vane Data + Lance 做商品类目辅助审核',
  )
  assert.match(
    frontmatterValue(englishProductReviewPost, 'description'),
    /Jina CLIP embeddings, Gemini structured verdicts/,
  )
  assert.match(
    frontmatterValue(chineseProductReviewPost, 'description'),
    /Jina CLIP 向量、Gemini 结构化结论/,
  )
  for (const source of [englishProductReviewPost, chineseProductReviewPost]) {
    const preview = source.split('<!-- truncate -->', 1)[0]
    const previewBody = preview.replace(/^---\n[\s\S]*?\n---\n/, '')
    assert.doesNotMatch(previewBody, /^# /m)
    assert.doesNotMatch(previewBody, /<Callout(?:\s|>)/)
    assert.match(previewBody.trim(), /^<p className="blog-body-lead">[\s\S]*<\/p>$/)
  }
})

test('Product category review post translations use localized in-article diagrams', () => {
  const localizedPosts = [
    [englishProductReviewPost, englishProductReviewImagePath, englishProductReviewImageUrl],
    [chineseProductReviewPost, chineseProductReviewImagePath, chineseProductReviewImageUrl],
  ]

  for (const [source, imagePath, imageUrl] of localizedPosts) {
    const preview = source.split('<!-- truncate -->', 1)[0]
    const previewBody = preview.replace(/^---\n[\s\S]*?\n---\n/, '')

    assert.equal(existsSync(imagePath), true)
    const image = readFileSync(imagePath)
    assert.equal(image.subarray(1, 4).toString('ascii'), 'PNG')
    assert.equal(image.readUInt32BE(16), Number(productReviewImageSize[0]))
    assert.equal(image.readUInt32BE(20), Number(productReviewImageSize[1]))
    assert.equal(frontmatterValue(source, 'image'), imageUrl)
    assert.match(source, /<img\s+className="dimg"/)
    assert.match(source, /style=\{\{ width: '100%', height: 'auto' \}\}/)
    assert.ok(source.includes(`src="${imageUrl}"`))
    assert.ok(source.includes(`width="${productReviewImageSize[0]}"`))
    assert.ok(source.includes(`height="${productReviewImageSize[1]}"`))
    assert.match(source, /loading="lazy"/)
    assert.match(source, /decoding="async"/)
    assert.equal(previewBody.includes(imageUrl), false)
  }
})

test('Product category review post keeps the Lance extension contract', () => {
  const localizedPosts = [
    {
      source: englishProductReviewPost,
      calloutLabel: /label="Reading note"/,
      lanceDocs: /\[Lance extension documentation\]\(\/docs\/data\/extensions\/lance\)/,
      quickstart: /\[Vane Data quickstart\]\(\/docs\/data\/quickstart\/quickstart\)/,
    },
    {
      source: chineseProductReviewPost,
      calloutLabel: /label="阅读说明"/,
      lanceDocs: /\[Lance 扩展文档\]\(\/zh-CN\/docs\/data\/extensions\/lance\)/,
      quickstart: /\[Vane Data 快速开始\]\(\/zh-CN\/docs\/data\/quickstart\/quickstart\)/,
    },
  ]

  for (const { source, calloutLabel, lanceDocs, quickstart } of localizedPosts) {
    const blocks = fencedCode(source)

    assert.match(source, calloutLabel)
    assert.match(source, lanceDocs)
    assert.match(source, quickstart)
    assert.match(source, /jina-clip-v2/)
    assert.match(source, /gemini-3\.5-flash-lite/)
    assert.match(source, /lance_vector_search/)
    assert.ok(source.includes("ATTACH 'lance_store' AS lance_ns (TYPE LANCE, READ_ONLY false)"))
    assert.match(source, /\.create\("lance_ns\.main\.products_search"\)/)
    assert.match(source, /\.insert_into\("lance_ns\.main\.products_category_audit"\)/)
    assert.match(source, /\.fetchall\(\)/)
    assert.match(source, /\.show\(\)/)
    for (const block of blocks) {
      assert.doesNotMatch(block, /VANE_RUNNER/)
    }
    assert.equal(blocks.length, 16)
    assert.equal((source.match(/^## /gm) ?? []).length, 10)
  }
})

test('Product category review post code comments match each locale', () => {
  const englishComments = codeComments(englishProductReviewPost)
  const chineseComments = codeComments(chineseProductReviewPost)

  assert.ok(englishComments.length > 0)
  assert.equal(chineseComments.length, englishComments.length)
  for (const comment of chineseComments) {
    assert.match(comment, /\p{Script=Han}/u)
  }
})
