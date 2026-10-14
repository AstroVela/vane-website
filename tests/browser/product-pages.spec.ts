import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {await page.emulateMedia({reducedMotion: 'reduce'})})

test('Context architecture exposes the product boundary and the lifecycle keeps update distinct from reuse', async ({page}) => {
  await page.goto('/zh-CN/products/context')
  await expect(page.locator('.context-architecture > img')).toBeVisible()
  await expect(page.locator('.diagram-summary')).toContainText('新理解回到数据空间')
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

test('the Data architecture is readable page content; execution and deployments are visible without controls', async ({page}) => {
  await page.goto('/zh-CN/products/data')
  const architecture = page.locator('.data-engine-architecture')
  await expect(architecture.getByRole('heading', {name: 'Relation 流水线', exact: true})).toBeVisible()
  await expect(architecture).toContainText('逻辑计划 → 执行图')
  await expect(architecture).toContainText('实例状态复用')
  await expect(architecture.locator('img')).toHaveCount(0)
  const mechanism = page.locator('.data-execution')
  await expect(mechanism.locator('img')).toBeVisible()
  await expect(mechanism.getByRole('tab')).toHaveCount(0)
  await expect(mechanism).toContainText('控制在途数据')
  const runners = page.locator('.data-runners')
  await expect(runners.getByRole('tab')).toHaveCount(0)
  await expect(runners.locator('.runner-configurations .term').nth(0)).toContainText('runner="local"')
  await expect(runners.locator('.runner-configurations .term').nth(1)).toContainText('con.sql(pipeline_sql)')
  await expect(runners.locator('.runner-launch')).toContainText('RAY_ADDRESS=auto')
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

test('all examples fit mobile; management copy and readable diagram alternatives remain visible', async ({page}) => {
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
  await expect(management.getByRole('tab')).toHaveCount(0)
  await expect(management.locator('img')).toHaveCount(0)
  for (const topic of await management.locator('.management-topic').all()) await expect(topic).toBeVisible()
  await expect(page.locator('.context-architecture-mobile')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
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


test('SQL/Python switch keeps the stage and evidence, and copies the visible language', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  for (const prefix of ['', '/zh-CN']) {
    await page.goto(prefix + '/products/data')
    const explorer = page.locator('.etl-explorer')
    await expect(explorer.getByRole('button', {name: 'SQL', exact: true})).toHaveAttribute('aria-pressed','true')
    await explorer.getByRole('button', {name: 'VideoFile', exact: true}).click()
    const result = await explorer.locator('.etl-result').textContent()
    await explorer.getByRole('button', {name: 'Python', exact: true}).click()
    await expect(explorer.locator('.etl-result')).toHaveText(result!)
    await expect(explorer.locator('.etl-code > .term pre')).toContainText('vane.from_files')
    await explorer.getByRole('tab').nth(1).click()
    await expect(explorer.getByRole('button', {name: 'SQL', exact: true})).toHaveCount(0)
    await explorer.locator('.etl-code > .term .term-copy').click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('@vane.func')
    await explorer.locator('.etl-variants button').last().click()
    await expect(explorer.locator('.etl-code > .term pre')).toContainText('@vane.cls')
    await explorer.getByRole('tab').last().click()
    await expect(explorer.getByRole('button', {name: 'Python', exact: true})).toHaveAttribute('aria-pressed','true')
    const code = explorer.locator('.etl-code > .term pre')
    await expect(code).toContainText('.aggregate(')
    await explorer.locator('.etl-code > .term .term-copy').click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await code.textContent())
    await explorer.getByRole('button', {name: 'SQL', exact: true}).click()
    await expect(code).toContainText('GROUP BY')
    await expect(code).not.toContainText('.aggregate(')
  }
})

test('quickstart languages are complete independent queries and share one fixture and result', async ({page}) => {
  for (const prefix of ['', '/zh-CN']) {
    await page.goto(prefix + '/products/data#quickstart')
    const example = page.locator('.data-example')
    const output = await example.locator('.quickstart-output table').textContent()
    await expect(example.locator(':scope > .term pre')).toContainText("list_files('quickstart-images/*.png')")
    await example.getByRole('button', {name: 'Python', exact: true}).click()
    await expect(example.locator(':scope > .term pre')).toContainText('vane.from_files(')
    await expect(example.locator(':scope > .term pre')).not.toContainText('con.sql(')
    await expect(example.locator('.quickstart-output table')).toHaveText(output!)
    await expect(example.locator('.quickstart-run pre')).toHaveText('python3 quickstart.py')
    await example.locator('.quickstart-fixtures summary').click()
    await expect(example.locator('.quickstart-fixtures pre')).toContainText('Image.new(')
  }
})
