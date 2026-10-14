import {test, expect, type Page} from '@playwright/test'
test.beforeEach(async ({page}) => {await page.emulateMedia({reducedMotion: 'reduce'})})

async function fillDemo(page: Page) {
  await page.getByLabel('Name *', {exact: true}).fill('Website browser acceptance')
  await page.getByLabel('Work email *', {exact: true}).fill('website-test@example.com')
  await page.getByLabel('Company or team *', {exact: true}).fill('Local preview test')
  await page.getByLabel('What would you like to solve? *', {exact: true}).fill('Local acceptance: media references. No email is sent.')
  await page.getByRole('checkbox', {name: 'Video', exact: true}).check()
}
test('demo preselects media, validates fields and receives a durable SQLite receipt', async ({page, request}) => {
  expect((await (await request.get('/api/demo-status')).json()).available).toBe(true)
  await page.goto('/demo?source=home&media=image')
  await expect(page.getByRole('checkbox', {name: 'Images', exact: true})).toBeChecked()
  await page.getByRole('button', {name: 'Request a demo', exact: true}).click()
  await expect(page.getByText('Please fill out this field.').first()).toBeVisible()
  await fillDemo(page)
  const response = page.waitForResponse(r => r.url().endsWith('/api/demo-requests') && r.request().method() === 'POST')
  await page.getByRole('button', {name: 'Request a demo', exact: true}).click()
  const body = await (await response).json(); expect(body.status).toBe('received')
  await expect(page.locator('.receipt-id')).toContainText(body.request_id)
  await page.reload(); await expect(page.locator('.receipt-id')).toContainText(body.request_id)
  await page.screenshot({path: '.tmp-visual-check/demo-success.png'})
})
test('lost response retry preserves fields and reuses the same idempotency key', async ({page}) => {
  const keys: string[] = []
  await page.route('**/api/demo-requests', async route => {keys.push(route.request().headers()['idempotency-key']); const response = await route.fetch(); if (keys.length === 1) await route.abort(); else await route.fulfill({response})})
  await page.goto('/demo'); await fillDemo(page)
  await page.getByRole('button', {name: 'Request a demo', exact: true}).click()
  await expect(page.getByRole('alert')).toContainText('could not confirm')
  await expect(page.getByLabel('Name *', {exact: true})).toHaveValue('Website browser acceptance')
  await page.screenshot({path: '.tmp-visual-check/demo-failure.png'})
  await page.getByRole('button', {name: 'Request a demo', exact: true}).click()
  await expect(page.locator('.receipt-id')).toBeVisible(); expect(keys).toHaveLength(2); expect(keys[0]).toBe(keys[1])
})
test('unavailable reception shows the contact path without claiming receipt', async ({page}) => {
  await page.route('**/api/demo-status', r => r.fulfill({json: {available: false, retention_days: 90}}))
  await page.goto('/zh-CN/demo'); await expect(page.getByRole('alert')).toContainText('申请表暂时不可用')
  await expect(page.locator('.demo-received')).toHaveCount(0)
  await expect(page.locator('.demo-submit-error a')).toHaveAttribute('href', 'mailto:pulse@astrovela.ai')
})
test('product pages, documents and retained scenario routes work in both languages', async ({page, request}) => {
  for (const prefix of ['', '/zh-CN']) {
    for (const route of ['/products/context','/products/data','/docs','/docs/context','/docs/context/search','/docs/data/quickstart/quickstart','/solutions','/solutions/video-research','/solutions/audio-evidence','/solutions/product-verification','/contact','/privacy','/blog','/release-notes']) {
      expect((await page.goto(prefix + route))?.status()).toBe(200)
      await expect(page.locator(route === '/blog' ? 'h2' : 'h1').first()).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    const redirect = await request.get(prefix + '/solutions/enterprise-agent', {maxRedirects: 0})
    expect(redirect.status()).toBe(301); expect(redirect.headers().location).toContain(prefix + '/products/context')
  }
  await page.goto('/products/data'); await page.getByRole('button', {name: 'SQL', exact: true}).click()
  await expect(page.locator('.data-example')).toContainText('SQL excerpt')
})
test('Context documents remain discoverable from search and mobile navigation', async ({page}) => {
  await page.goto('/docs/context')
  await page.getByRole('button', {name: 'Search docs', exact: true}).click()
  await page.getByRole('textbox', {name: 'Search the docs'}).fill('Vane Context')
  await expect(page.locator('.cmdk-item')).toHaveCount(6)
  await page.keyboard.press('Escape')
  await page.setViewportSize({width: 390, height: 844})
  await page.getByRole('button', {name: 'Open documentation navigation', exact: true}).click()
  await expect(page.getByRole('dialog', {name: 'Documentation navigation'})).toBeVisible()
  await expect(page.locator('#docs-mobile-navigation')).toContainText('Analysis and jobs')
})
