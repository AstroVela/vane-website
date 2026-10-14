import {test, expect} from '@playwright/test'
import {agentUseCases} from '../../src/content/useCases'

test.beforeEach(async ({page}) => {await page.emulateMedia({reducedMotion:'reduce'})})

test('all six use cases have localized pages, source examples, handoff and contextual demo links', async ({page}) => {
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message))
  for(const locale of ['en','zh-CN'] as const) {
    const prefix=locale==='en'?'':'/zh-CN'
    for(const item of agentUseCases) {
      expect((await page.goto(prefix+'/solutions/'+item.id))?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveText(item.title[locale])
      await expect(page.locator('.case-experience')).toHaveAttribute('data-case',item.id)
      await expect(page.locator('.case-agent-action')).toContainText(item.action[locale])
      await expect(page.locator('.case-hero-copy .btn')).toHaveAttribute('href',prefix+'/demo?source=solution&scenario='+item.id)
      await expect(page.locator('.nav-main-cta')).toHaveAttribute('href',prefix+'/demo?source=solution&scenario='+item.id)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',new RegExp('/solutions/'+item.id+'$'))
      await page.locator('.case-repeat .case-choice-row button').last().click()
      await expect(page.locator('.case-repeat-result')).toContainText(item.reuse[locale])
    }
  }
  expect(errors).toEqual([])
})

test('meeting references, support events and personal viewpoints each reveal their own evidence', async ({page}) => {
  await page.goto('/zh-CN/solutions/meeting-intelligence')
  await page.getByRole('button',{name:'CRM 项目记录',exact:true}).click()
  await expect(page.locator('.case-source-excerpt')).toContainText('青杉零售')
  await page.locator('.case-observation').nth(1).click()
  await expect(page.locator('.case-finding-text')).toContainText('以访问权限获批为前提')
  await expect(page.locator('.case-source-excerpt')).toContainText('周五前')
  await page.goto('/zh-CN/solutions/customer-support')
  await expect(page.locator('.case-finding-text')).toContainText('尚不能证明客户本人收到')
  await page.locator('.case-observation').last().click()
  await expect(page.locator('.case-source-excerpt')).toContainText('升级补发或退款审核')
  await page.goto('/zh-CN/solutions/personal-work')
  await page.locator('.case-observation').last().click()
  await expect(page.locator('.case-source-excerpt')).toContainText('一周的行李')
})

test('equipment timeline keeps observations, readings and source records aligned', async ({page}) => {
  await page.goto('/zh-CN/solutions/equipment-diagnosis')
  await page.getByRole('slider',{name:'拖动查看异常前后'}).focus()
  await page.keyboard.press('End')
  await expect(page.locator('.case-signal-heading')).toContainText('10:31:14')
  await expect(page.locator('.case-signal-readings')).toContainText('皮带边缘接触导向件')
  await expect(page.locator('.case-signal-readings')).toContainText('6.8 mm/s')
  await page.locator('.case-source-detail summary').click()
  await expect(page.locator('.case-source-detail')).toContainText('VIB-HIGH')
  await page.getByRole('slider').focus(); await page.keyboard.press('Home')
  await expect(page.locator('.case-signal-readings')).toContainText('1.4 mm/s')
  await expect(page.locator('.case-finding-text')).toContainText('基线观测')
})

test('commerce comparison distinguishes durable product facts from dated business records', async ({page}) => {
  await page.goto('/zh-CN/solutions/commerce-sales')
  await page.getByRole('button',{name:'清洗',exact:true}).click()
  await expect(page.locator('.case-comparison')).toContainText('刀头组件可拆卸')
  await page.locator('.case-source-detail summary').click()
  await expect(page.locator('.case-source-detail')).toContainText('电机底座不可浸水')
  await page.getByRole('button',{name:'价格与库存',exact:true}).click()
  await page.locator('.case-source-detail summary').click()
  await expect(page.locator('.case-source-detail')).toContainText('不构成商品报价')
})

test('marketing evidence plays the selected source and releases playback when switching media', async ({page}) => {
  await page.goto('/zh-CN/solutions/marketing-campaigns')
  await expect(page.locator('video')).not.toHaveAttribute('src',/./)
  await expect(page.locator('.current-caption')).not.toContainText('正在加载')
  await page.locator('.case-reference-button').click()
  await expect.poll(()=>page.locator('video').evaluate(e=>(e as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(5)
  await page.getByRole('button',{name:'旁白表达',exact:true}).click()
  await page.locator('.case-reference-button').click()
  await expect(page.locator('audio')).toHaveJSProperty('paused',false)
  await page.getByRole('button',{name:'画面信息',exact:true}).click()
  await expect(page.locator('audio,video')).toHaveCount(0)
  await page.locator('.image-stage-button').click()
  await expect(page.locator('dialog.media-modal')).toBeVisible()
  await expect(page.locator('dialog .image-region')).toHaveCount(1)
  await page.keyboard.press('Escape')
})

test('homepage explorer mounts one scenario and the navigation exposes all six pages', async ({page}) => {
  await page.goto('/zh-CN/')
  const explorer=page.locator('.case-explorer')
  await expect(explorer.locator('.case-experience')).toHaveCount(1)
  await expect(explorer.locator('.case-experience')).toHaveAttribute('data-case','marketing-campaigns')
  for(const item of agentUseCases) {
    await explorer.getByRole('button',{name:item.name['zh-CN'],exact:true}).click()
    await expect(explorer.locator('.case-experience')).toHaveAttribute('data-case',item.id)
    await expect(explorer.locator('.case-experience')).toHaveCount(1)
    await expect(explorer.locator('.case-explorer-panel:visible .arrow-link')).toHaveAttribute('href','/zh-CN/solutions/'+item.id)
  }
  await page.getByRole('button',{name:'应用场景',exact:true}).click()
  await expect(page.locator('#nav-use-cases a')).toHaveCount(7)
  await page.locator('#nav-use-cases').getByRole('link',{name:'会议智能',exact:true}).click()
  await expect(page.locator('.case-experience')).toHaveAttribute('data-case','meeting-intelligence')
})

test('demo requests preserve the scenario, suggested brief and modalities across direct loads and submission', async ({page}) => {
  const item=agentUseCases[2]
  await page.goto('/zh-CN/solutions/'+item.id)
  await page.locator('.case-hero-copy .btn').click()
  await expect(page.locator('.demo-selected-case')).toContainText('设备诊断')
  await expect(page.locator('textarea[name="need"]')).toHaveValue(item.need['zh-CN'])
  await page.reload()
  await expect(page.locator('textarea[name="need"]')).toHaveValue(item.need['zh-CN'])
  for(const modality of item.modalities) await expect(page.locator(`input[name="modalities"][value="${modality}"]`)).toBeChecked()
  await page.locator('input[name="name"]').fill('Use case acceptance')
  await page.locator('input[name="email"]').fill('website-test@example.com')
  await page.locator('input[name="company"]').fill('Local website test')
  const request=page.waitForRequest(r=>r.url().endsWith('/api/demo-requests') && r.method()==='POST')
  const response=page.waitForResponse(r=>r.url().endsWith('/api/demo-requests') && r.request().method()==='POST')
  await page.getByRole('button',{name:'申请产品演示',exact:true}).click()
  expect((await request).postDataJSON().scenario).toBe(item.id)
  expect((await response).status()).toBe(201)
  await expect(page.locator('.receipt-id')).toBeVisible()
})

test('all scenario pages and the mobile accordion fit a narrow viewport', async ({page}) => {
  await page.setViewportSize({width:390,height:844})
  for(const item of agentUseCases) {
    await page.goto('/zh-CN/solutions/'+item.id)
    await expect(page.locator('.case-experience')).toBeVisible()
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
  await page.goto('/zh-CN/solutions')
  await expect(page.getByRole('navigation',{name:'浏览应用场景'}).getByRole('link')).toHaveCount(6)
  const explorer=page.locator('.case-explorer')
  for(const item of agentUseCases) {
    await explorer.getByRole('button',{name:item.name['zh-CN'],exact:true}).click()
    await expect(explorer.locator('.case-experience')).toHaveAttribute('data-case',item.id)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
  await page.getByRole('button',{name:'打开菜单',exact:true}).click()
  await page.locator('#site-mobile-navigation').getByRole('link',{name:'商品导购',exact:true}).click()
  await expect(page).toHaveURL(/\/solutions\/commerce-sales$/)
})
