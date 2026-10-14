import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {await page.emulateMedia({reducedMotion: 'reduce'})})

test('Context architecture links to the matching sections and the lifecycle keeps update distinct from reuse', async ({page}) => {
  await page.goto('/zh-CN/products/context')
  await page.locator('.context-architecture-node a').nth(1).click()
  await expect(page).toHaveURL(/#knowledge$/)
  const cycle = page.locator('.knowledge-cycle')
  await cycle.getByRole('tab', {name: '后续相关任务', exact: true}).click()
  await expect(cycle).toHaveAttribute('data-state', 'reuse')
  await expect(cycle.locator('.knowledge-online')).toContainText('检查权限与来源版本')
  await cycle.getByRole('tab', {name: '来源更新后', exact: true}).click()
  await expect(cycle.locator('.knowledge-online')).toContainText('更新变化的来源')
  const data = page.locator('.context-data-experience')
  await data.getByRole('tab', {name: '业务语义', exact: true}).click()
  await expect(data.locator('.connected-semantic')).toHaveClass(/selected/)
  await expect(data.locator('.connected-semantic')).toContainText('转化数 / 点击数')
})

test('MCP configuration, Skill and call details remain inspectable without a live service request', async ({page}) => {
  await page.goto('/products/context#integration')
  const integration = page.locator('.agent-integration')
  const config = JSON.parse((await integration.locator('.agent-connection pre').textContent())!)
  expect(config.mcpServers.vanecontext.url).toBe('<MCP_ENDPOINT_URL>')
  await integration.getByRole('tab', {name: 'Load Skill', exact: true}).click()
  await expect(integration.locator('.agent-connection pre')).toContainText('prepare_context')
  await integration.locator('.agent-call-story details').first().locator('summary').click()
  const call = JSON.parse((await integration.locator('.agent-call-story pre').first().textContent())!)
  expect(call.input.request_key).toBe('camping-script-01')
  expect(call.output.task_id).toBeTruthy()
})

test('the Data architecture enlarges and returns focus, and execution changes follow the selected mechanism', async ({page}) => {
  await page.goto('/zh-CN/products/data')
  await page.getByRole('button', {name: '放大架构图', exact: false}).click()
  await expect(page.getByRole('dialog', {name: 'Vane Data 架构图'})).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.locator('.architecture-image-button')).toBeFocused()
  const mechanism = page.locator('.data-execution')
  await mechanism.getByRole('tab', {name: '批处理与背压', exact: true}).click()
  await expect(mechanism.locator('.held')).toHaveCount(2)
  await mechanism.getByRole('tab', {name: '实例复用', exact: true}).click()
  await expect(mechanism).toContainText('每个实例初始化一次')
  const runners = page.locator('.data-runners')
  await runners.getByRole('tab', {name: 'Ray', exact: true}).click()
  await expect(runners.locator('.ray-worker-grid > span')).toHaveCount(4)
  await expect(runners.locator('pre')).toContainText('runner="ray"')
})

test('new tabs support the keyboard and copy the currently selected code', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/products/data#processing')
  const explorer = page.locator('.etl-explorer')
  await explorer.getByRole('tab', {name: 'Native types', exact: true}).focus()
  await page.keyboard.press('End')
  await expect(explorer.getByRole('tab', {name: 'Search & joins', exact: true})).toBeFocused()
  await expect(explorer).toHaveAttribute('data-stage', 'query')
  await explorer.getByRole('button', {name: 'Copy code', exact: true}).click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('lance_hybrid_search')
})

test('all new examples fit mobile and product screenshots load for each management topic', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844})
  await page.goto('/zh-CN/products/data#processing')
  const explorer = page.locator('.etl-explorer')
  for (const tab of await explorer.getByRole('tab').all()) {
    await tab.click()
    for (const option of await explorer.locator('.etl-variants button').all()) await option.click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.goto('/zh-CN/products/context#management')
  const management = page.locator('.product-management')
  for (const tab of await management.getByRole('tab').all()) {
    await tab.click()
    await expect.poll(() => management.locator('.management-preview > img').evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('both product benchmarks include the slower video result and the downloadable example is available', async ({page, request}) => {
  for (const route of ['/zh-CN/', '/zh-CN/products/data']) {
    await page.goto(route)
    const plots = page.locator('.benchmark-preview .benchmark-plot')
    await expect(plots).toHaveCount(4)
    await expect(plots.last()).toContainText('9.8% 较 Ray 耗时更高')
    await expect(plots.nth(1)).toContainText('OOM')
  }
  const source = await request.get('/examples/equipment_observations.py')
  expect(source.status()).toBe(200)
  expect(await source.text()).toContain('vane.attach_function')
})
