import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {await page.emulateMedia({reducedMotion: 'reduce'})})

test('equipment example connects native types, UDFs, structured output and business queries in both languages', async ({page}) => {
  for (const [prefix, udf, understanding, embeddings, query] of [['', 'Custom functions', 'Structured understanding', 'Embeddings', 'Search & joins'], ['/zh-CN', '自定义函数', '结构化理解', '向量化', '检索与关联']]) {
    await page.goto(prefix + '/products/data')
    const example = page.locator('.etl-explorer')
    for (const name of ['File','ImageFile','AudioFile','VideoFile']) {
      await example.getByRole('button', {name, exact: true}).click()
      await expect(example.locator('.etl-result dd').first()).toContainText(name.toUpperCase())
    }
    await example.getByRole('tab', {name: udf, exact: true}).click()
    await expect(example.locator('.etl-code > .term pre')).toContainText('@vane.func')
    await expect(example.getByRole('button', {name: 'SQL', exact: true})).toHaveCount(0)
    await expect(example.getByRole('button', {name: 'Python', exact: true})).toHaveCount(0)
    await expect(example.locator('.etl-code > .term .fn')).toContainText('.py')
    await example.locator('.etl-variants button').last().click()
    await expect(example.locator('.etl-code > .term pre')).toContainText('@vane.cls')
    await expect(example.locator('.etl-code > .term pre')).toContainText('class SpeechRecognizer')
    await expect(example.getByRole('button', {name: 'SQL', exact: true})).toHaveCount(0)
    await example.getByRole('tab', {name: understanding, exact: true}).click()
    await expect(example.locator('.etl-code pre').first()).toContainText('return_format := $observation_schema')
    await example.getByRole('tab', {name: embeddings, exact: true}).click()
    await expect(example.locator('.etl-result')).toContainText('FLOAT[1024]')
    await example.getByRole('tab', {name: query, exact: true}).click()
    await expect(example.locator('.etl-code pre').first()).toContainText('JOIN events s USING (asset_id)')
    await example.getByRole('link').click()
    await expect(page).toHaveURL(new RegExp(prefix + '/docs/data/tutorials/use-cases/equipment-observations'))
    await expect(page.locator('h1')).toBeVisible()
  }
})

test('new value sections fit narrow screens and benchmark comparisons keep slower results visible', async ({page}) => {
  await page.setViewportSize({width:390,height:844})
  for (const route of ['/zh-CN/','/zh-CN/products/context','/zh-CN/products/data','/zh-CN/solutions/video-research','/zh-CN/benchmarks']) {
    await page.goto(route)
    await page.evaluate(async () => {await document.fonts.ready})
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const story = page.locator('.reuse-story')
    if (await story.count()) {
      await story.getByRole('button', {name:'后续任务',exact:true}).click()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    const example = page.locator('.etl-explorer')
    if (await example.count()) {
      await example.getByRole('tab', {name:'检索与关联',exact:true}).click()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  }
  await expect(page.locator('.benchmark-takeaways > div')).toHaveCount(4)
  await expect(page.locator('.benchmark-takeaways > div').last()).toContainText('更高')
  await expect(page.locator('.benchmark-reading-guide')).toContainText('不衡量模型准确率、上下文质量或 Token 节省')
})

test('an evidence deep link cannot select an insight belonging to another media type', async ({page}) => {
  await page.goto('/?media=image&insight=blending')
  await expect(page.locator('.understanding-explorer')).toHaveAttribute('data-media','image')
  await expect(page.locator('.understanding-finding.selected')).toHaveCount(0)
  await page.locator('.understanding-finding').last().click()
  await expect(page).toHaveURL(/insight=caption/)
  await page.getByRole('tab',{name:'Audio',exact:true}).click()
  await expect(page).not.toHaveURL(/insight=/)
})
