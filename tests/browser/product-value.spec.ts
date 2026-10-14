import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {await page.emulateMedia({reducedMotion: 'reduce'})})

test('data example connects the original image, structured fields and query in both languages', async ({page}) => {
  for (const [prefix, source, record, query] of [['', 'Source', 'Structured result', 'Query'], ['/zh-CN', '原始文件', '结构化结果', '查询使用']]) {
    await page.goto(prefix + '/products/data')
    const example = page.locator('.data-flow')
    await expect(example.locator('dd')).toContainText(['comp_005', 'blender cup', 'kitchen', 'Aardbeien + Chocolade smoothie'])
    await example.getByRole('button', {name: source, exact: true}).click()
    await expect(example.locator('.data-source-view img')).toBeVisible()
    await example.getByRole('button', {name: query, exact: true}).click()
    await expect(example.locator('.data-query-view')).toContainText("WHERE scene = 'kitchen'")
    await expect(example.locator('.data-query-result')).toContainText('comp_005')
    await example.getByRole('button', {name: record, exact: true}).click()
    await expect(example.locator('dd').last()).toHaveText('Aardbeien + Chocolade smoothie')
    await example.getByRole('link').click()
    await expect(page).toHaveURL(new RegExp(prefix + '/blog/from-files-to-queryable-data'))
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
    const example = page.locator('.data-flow')
    if (await example.count()) {
      await example.getByRole('button', {name:'查询使用',exact:true}).click()
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
