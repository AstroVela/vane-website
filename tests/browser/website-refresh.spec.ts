import {test, expect, type Page, type Locator} from '@playwright/test'

const scenarios = ['meeting-intelligence','customer-support','equipment-diagnosis','personal-work','marketing-campaigns','commerce-sales','training','enterprise-agent']
test.beforeEach(async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.route('https://api.github.com/repos/AstroVela/vane', route => route.fulfill({json:{stargazers_count:1234}}))
})

async function seek(page: Page, slider: Locator, seconds: number) {
  await slider.scrollIntoViewIfNeeded()
  const box = (await slider.boundingBox())!
  const max = Number(await slider.getAttribute('max'))
  await page.mouse.click(box.x + 8 + (box.width - 16) * seconds / max, box.y + box.height / 2)
}

for (const prefix of ['', '/zh-CN']) {
  const zh = Boolean(prefix)
  test(`${prefix || 'en'}: navigation, comment headline, product copy and resource labels`, async ({page}) => {
    const errors:string[]=[];page.on('pageerror', error => errors.push(error.message))
    await page.goto(prefix + '/')
    const nav=page.locator('.site-nav')
    await expect(nav.locator('.nav-right > a')).toHaveCount(4)
    await expect(nav.locator('.nav-discord')).toHaveAttribute('href', 'https://discord.gg/BuKhPQcqs')
    await expect(nav.locator('.ghp')).toHaveAttribute('href', 'https://github.com/AstroVela/vane')
    await expect(nav.locator('.ghp')).toContainText('1.2k')
    await expect(nav.locator('.nav-contact')).toHaveAttribute('href', prefix + '/contact')
    await expect(nav.locator('.nav-locale')).toHaveAttribute('href', zh ? '/' : '/zh-CN')
    await expect(nav.locator('.nav-main-cta')).toHaveCount(0)
    await nav.getByRole('button',{name:zh?'产品':'Products',exact:true}).click()
    await expect(nav.locator('#nav-products a')).toHaveCount(2)
    await expect(nav.locator('#nav-products')).not.toContainText(/commercial|open.source|Apache|商业|开源/i)
    await nav.getByRole('button',{name:zh?'开发者':'Developers',exact:true}).click()
    await expect(nav.locator('#nav-developers')).not.toContainText('Vane Context')
    await nav.getByRole('button',{name:zh?'资源':'Resources',exact:true}).click()
    await expect(nav.locator('#nav-resources').getByRole('link',{name:zh?'博客':'Blogs',exact:true})).toHaveAttribute('href',prefix+'/blog')
    await expect(nav.locator('#nav-resources').getByRole('link',{name:zh?'版本更新':'Release Notes',exact:true})).toHaveAttribute('href',prefix+'/release-notes')
    if(zh) await expect(page.locator('h1')).toHaveText('让 Agent 用好企业资料，完成业务任务')
    else await expect(page.locator('h1')).toHaveText(/^Make your multimodal data\s*useful to AI agents\.$/)
    await expect(page.locator('.workshop-support')).toHaveCount(0)
    await expect(page.locator('meta[name=description]')).toHaveAttribute('content',/AI [Aa]gent/)
    expect(errors).toEqual([])
  })

  test(`${prefix || 'en'}: homepage seeking replaces the previous selection`, async ({page}) => {
    await page.goto(prefix+'/?media=video&insight=camping')
    const section=page.locator('.understanding-explorer'), video=section.locator('video')
    await section.scrollIntoViewIfNeeded()
    await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1)
    await video.evaluate(v=>(v as HTMLVideoElement).pause())
    await seek(page,section.locator('.media-controls input[type=range]'),3)
    await expect(section.locator('.understanding-finding[aria-pressed=true]')).toHaveCount(1)
    await expect(section.locator('.understanding-finding.selected')).toHaveCount(1)
    await expect(section.locator('.understanding-finding.selected')).toContainText(zh?'倒入饮料与冰块':'Adding the drink and ice')
    await expect(section.locator('.current-caption')).toContainText(zh?'倒入饮料与冰块':'Adding the drink and ice')
    await seek(page,section.locator('.media-controls input[type=range]'),10)
    await expect(section.locator('.understanding-finding.selected,.understanding-finding.playing')).toHaveCount(0)
  })

  test(`${prefix || 'en'}: product video and cards follow each other without reseeking`, async ({page}) => {
    await page.goto(prefix+'/products/context')
    const hero=page.locator('.hero-experience'),video=hero.locator('video')
    await hero.scrollIntoViewIfNeeded()
    const blending=hero.locator('.insight-item').filter({hasText:zh?'启动搅拌':'Blending on the outdoor table'})
    await blending.click()
    await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(5)
    await expect(blending).toHaveAttribute('aria-pressed','true')
    await video.evaluate(v=>(v as HTMLVideoElement).pause())
    await seek(page,hero.locator('.media-controls input[type=range]'),3)
    await expect(hero.locator('.insight-item.selected')).toHaveCount(1)
    await expect(hero.locator('.insight-item.selected')).toContainText(zh?'倒入饮料与冰块':'Adding the drink and ice')
    await expect(blending).toHaveAttribute('aria-pressed','false')
    await video.evaluate(v=>{(v as HTMLVideoElement).currentTime=4.7})
    await expect(hero.locator('.insight-item.selected')).toContainText(zh?'户外露营场景':'Outdoor campsite')
    await hero.getByRole('button',{name:zh?'播放':'Play',exact:true}).click()
    await expect(blending).toHaveAttribute('aria-pressed','true')
    await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(5.4)
    await video.evaluate(v=>(v as HTMLVideoElement).pause())
    await seek(page,hero.locator('.media-controls input[type=range]'),12)
    await expect(hero.locator('.insight-item.selected,.insight-item.featured')).toHaveCount(0)
  })

  test(`${prefix || 'en'}: eight solutions are reachable and removed docs stay absent`, async ({page,request}) => {
    await page.goto(prefix+'/solutions')
    const links=page.locator('.case-index-links a')
    await expect(links).toHaveCount(8)
    for(const slug of scenarios) await expect(page.locator(`.case-index-links a[href="${prefix}/solutions/${slug}"]`)).toHaveCount(1)
    for(const route of ['/', '/products/context','/products/data',...scenarios.map(s=>'/solutions/'+s),'/docs','/contact']) {
      expect((await page.goto(prefix+(route==='/'?'/':route)))?.status(),route).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      const visible=await page.locator('body').innerText()
      expect(visible,route).not.toMatch(/commercial product|open[ -]source|Apache-2|商业产品|商业版|开源/i)
      await expect(page.locator('a[href*="/docs/context"]')).toHaveCount(0)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true)
    }
    for(const slug of ['', '/ingestion','/search','/analysis','/references','/integration','/llms.txt','/manifest.json']) {
      expect((await request.get(prefix+'/docs/context'+slug)).status(),slug).toBe(404)
    }
    await page.goto(prefix+'/products/context')
    await expect(page.locator('.task-context-experience,.context-task-detail')).toHaveCount(0)
    await expect(page.locator('.integration-guidance')).toContainText('list_context_skills')
    await expect(page.locator('.integration-guidance')).toContainText('read_context_skill')
    await page.goto(prefix+'/products/data')
    await expect(page.locator('.runner-launch')).toHaveCount(0)
    await expect(page.locator('body')).not.toContainText('RAY_ADDRESS=auto python job.py')
  })
}

for(const width of [390,768,1024]) test(`navigation, integration and new solutions fit ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900})
  for(const route of ['/zh-CN/','/products/context','/zh-CN/products/context','/solutions/training','/zh-CN/solutions/training','/solutions/enterprise-agent','/zh-CN/solutions/enterprise-agent']) {
    await page.goto(route)
    await page.evaluate(()=>document.fonts.ready)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true)
  }
  if(width<960){
    await page.locator('.site-menu-toggle').click()
    await expect(page.locator('.site-mobile-panel a[href*="/solutions/"]')).toHaveCount(8)
    await expect(page.locator('.site-mobile-panel a[href*="discord.gg"]')).toBeVisible()
    await expect(page.locator('.site-mobile-panel a[href*="/docs/context"]')).toHaveCount(0)
    await page.keyboard.press('Escape')
  }
})
