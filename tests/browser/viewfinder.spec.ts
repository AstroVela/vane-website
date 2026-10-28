import {test, expect} from '@playwright/test'


for (const [width,height] of [[1440,900],[1366,768],[1024,900]]) test(`all media content fits its stage at ${width} × ${height}`, async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.setViewportSize({width,height})
  for (const locale of ['', '/zh-CN']) {
    await page.goto(locale+'/?media=video')
    for (let i=0;i<4;i++) {
      await page.getByRole('tab').nth(i).click()
      await page.evaluate(()=>scrollTo(0,0))
      const cta=await page.locator('.workshop-heading .btn').boundingBox()
      expect(cta!.y+cta!.height).toBeLessThan(height)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    }
  }
})
