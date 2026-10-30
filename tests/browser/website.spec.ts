import {test, expect} from '@playwright/test'
test.beforeEach(async ({page}) => {await page.emulateMedia({reducedMotion: 'reduce'})})

for (const prefix of ['', '/zh-CN']) {
  test(`${prefix || 'en'}: contact and demo work without any request service`, async ({page, context}) => {
    const apiRequests: string[] = []
    await page.route('**/api/**', route => {apiRequests.push(route.request().url()); return route.abort()})
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    for (const width of [1440, 390]) {
      await page.setViewportSize({width, height: 1000})
      await page.goto(prefix + '/contact')
      await expect(page.locator('.capability-card')).toHaveCount(3)
      for (const card of await page.locator('.capability-card').all()) {
        expect(await card.evaluate(element => getComputedStyle(element, '::before').display)).toBe('none')
      }
      await page.locator('.capability-card .btn-solid').click()
      await expect(page.locator('.demo-contact-email')).toHaveText('pulse@astrovela.ai')
      await expect(page.locator('form')).toHaveCount(0)
      expect(await page.locator('.demo-contact-card').evaluate(element => getComputedStyle(element, '::before').display)).toBe('none')
      await page.getByRole('button', {name: prefix ? '复制联系邮箱' : 'Copy email address', exact: true}).click()
      await expect(page.getByRole('status')).toContainText(prefix ? '邮箱已复制' : 'Email address copied')
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('pulse@astrovela.ai')
      await expect(page.locator('.demo-received, .demo-submit-error')).toHaveCount(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.screenshot({path: `.tmp-visual-check/demo-static-${prefix ? 'zh' : 'en'}-${width}.png`, fullPage: true})
    }
    await page.goto(prefix + '/privacy')
    await expect(page.locator('article')).not.toContainText('SQLite')
    expect(apiRequests).toEqual([])
  })
}

test('denied clipboard access leaves a readable email and clear manual-copy guidance', async ({page}) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.reject(new Error('denied'))}}))
  await page.goto('/demo')
  await page.getByRole('button', {name: 'Copy email address', exact: true}).click()
  await expect(page.getByRole('status')).toHaveText('Please select and copy the email address above.')
  await expect(page.locator('.demo-contact-email')).toHaveText('pulse@astrovela.ai')
  await expect(page.locator('form, .demo-received')).toHaveCount(0)
})

test('contact details remain available without JavaScript', async ({browser, baseURL}) => {
  const context = await browser.newContext({javaScriptEnabled: false})
  try {
    const page = await context.newPage()
    for (const prefix of ['', '/zh-CN']) {
      await page.goto(baseURL + prefix + '/demo?source=contact')
      await expect(page.locator('.demo-contact-email')).toHaveText('pulse@astrovela.ai')
      await expect(page.locator('form, .demo-submit-error')).toHaveCount(0)
    }
  } finally {await context.close()}
})

test('product pages, documents and retained scenario routes work in both languages', async ({page, request}) => {
  for (const prefix of ['', '/zh-CN']) {
    for (const route of ['/products/context','/products/data','/docs','/solutions/training','/solutions/enterprise-agent','/docs/data/quickstart/quickstart','/solutions','/solutions/video-research','/solutions/audio-evidence','/solutions/product-verification','/contact','/privacy','/blog','/release-notes']) {
      expect((await page.goto(prefix + route))?.status()).toBe(200)
      await expect(page.locator(route === '/blog' ? 'h2' : 'h1').first()).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    const removed = await request.get(prefix + '/docs/context', {maxRedirects: 0})
    expect(removed.status()).toBe(404)
  }
  await page.goto('/products/data'); await page.locator('.data-example').getByRole('button', {name: 'SQL', exact: true}).click()
  await expect(page.locator('.data-example')).toContainText('list_files')
})
test('documentation search and mobile navigation expose Data documentation only', async ({page}) => {
  await page.goto('/docs/data')
  await page.getByRole('button', {name: 'Search docs', exact: true}).click()
  await page.getByRole('textbox', {name: 'Search the docs'}).fill('Vane Context')
  await expect(page.locator('.cmdk-item')).toHaveCount(0)
  await page.getByRole('textbox', {name: 'Search the docs'}).fill('Quickstart')
  await expect(page.locator('.cmdk-item').first()).toBeVisible()
  await page.keyboard.press('Escape')
  await page.setViewportSize({width: 390, height: 844})
  await page.getByRole('button', {name: 'Open documentation navigation', exact: true}).click()
  await expect(page.getByRole('dialog', {name: 'Documentation navigation'})).toBeVisible()
  await expect(page.locator('#docs-mobile-navigation')).toContainText('Vane Data')
})
