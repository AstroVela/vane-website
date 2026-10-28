import {test, expect} from '@playwright/test'
import {agentUseCases} from '../../src/content/useCases'

test.beforeEach(async ({page}) => {await page.emulateMedia({reducedMotion: 'reduce'})})

for (const locale of ['en', 'zh-CN'] as const) {
  const prefix = locale === 'en' ? '' : '/zh-CN'
  test(`${locale}: six complete pages, localized navigation and contextual demo requests`, async ({page}) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    for (const scenario of agentUseCases) {
      expect((await page.goto(prefix + '/solutions/' + scenario.id))?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveText(scenario.title[locale])
      await expect(page.locator('.solution-demo')).toHaveAttribute('data-case', scenario.id)
      await expect(page.locator('.solution-handoff')).toContainText(scenario.action[locale])
      await expect(page.locator('.solution-reuse-steps > li')).toHaveCount(3)
      await expect(page.locator('.solution-deliverables > li')).toHaveCount(3)
      await expect(page.locator('.solution-outcomes li')).toHaveCount(3)
      for (const selector of ['.case-hero-copy .btn', '.solution-final-cta .btn']) {
        await expect(page.locator(selector)).toHaveAttribute('href', prefix + '/demo?source=solution&scenario=' + scenario.id)
      }
      await expect(page.locator('.nav-contact')).toHaveAttribute('href', prefix + '/contact')
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp('/solutions/' + scenario.id + '$'))
      await page.locator('.case-hero-copy a[href="#case-example"]').click()
      await expect(page).toHaveURL(/#case-example$/)
      await expect(page.locator('.solution-demo')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    expect(errors).toEqual([])
  })
}

test('meeting stages distinguish a proposed date, a confirmed target and a remaining condition', async ({page}) => {
  await page.goto('/zh-CN/solutions/meeting-intelligence')
  await expect(page.locator('.solution-context-pane')).toContainText('6 月 24 日是后续建议，仍待确认')
  await page.getByRole('button', {name: '6 月 12 日 · 日期调整邮件'}).click()
  await expect(page.locator('.solution-source blockquote')).toContainText('请在下次推进会上确认')
  await page.getByRole('tab', {name: '会中查证'}).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.solution-task-pane')).toContainText('原来的日期')
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', {name: '会后跟进'})).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.solution-context-pane')).toContainText('6 月 18 日前补齐评审材料')
  await expect(page.locator('.solution-source')).toContainText('18:20–18:45')
  await expect(page.locator('.solution-source blockquote')).toContainText('启动仍以评审通过为条件')
  await page.getByRole('tab', {name: '会前准备'}).click()
  await expect(page.getByRole('button', {name: '6 月 15 日 · 本次会议决定'})).toHaveCount(0)
})

test('support preserves evidence boundaries when the customer adds information', async ({page}) => {
  await page.goto('/zh-CN/solutions/customer-support')
  await expect(page.locator('.solution-source blockquote')).toContainText('8D')
  await expect(page.locator('.delivery-record-label')).toContainText('8B')
  await page.getByRole('button', {name: '查看客户补充信息'}).click()
  await expect(page.locator('.solution-timeline')).toContainText('14:35')
  await expect(page.locator('.solution-source blockquote')).toContainText('旁边那栋楼')
  await expect(page.locator('.solution-context-pane')).toContainText('需核对承运商投递位置和收件人')
  await page.getByRole('button', {name: '政策 3.2 · 配送信息不一致'}).click()
  await expect(page.locator('.solution-source')).toContainText('地区 A')
  await expect(page.locator('.solution-source blockquote')).toContainText('结合核查结果')
  await page.getByRole('button', {name: '查看新物流事件'}).click()
  await expect(page.locator('.solution-timeline')).toContainText('14:50')
  await expect(page.locator('.solution-source')).toContainText('目前尚无核查结论')
  await expect(page.locator('.solution-next')).toContainText('跟进已有调查')
  await page.getByRole('button', {name: '重置示例', exact: true}).click()
  await expect(page.locator('.solution-timeline')).not.toContainText('14:35')
})

test('mobile source references bring the selected evidence into view', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844})
  for (const [route, button] of [['personal-work', '当前项目事实'], ['customer-support', '政策 3.2 · 配送信息不一致']]) {
    await page.goto('/zh-CN/solutions/' + route)
    await page.getByRole('button', {name: button}).click()
    await expect(page.locator('.solution-source')).toBeInViewport({ratio: 1})
    const position = await page.locator('.solution-source').boundingBox()
    expect(position!.y).toBeGreaterThanOrEqual(80)
    expect(position!.y + position!.height).toBeLessThanOrEqual(844)
  }
})

test('equipment observations stay aligned with the window and distinguish hypotheses', async ({page}) => {
  await page.goto('/zh-CN/solutions/equipment-diagnosis')
  await expect(page.locator('.equipment-readings')).toContainText('4.8')
  await page.getByRole('tab', {name: '报警后'}).click()
  await expect(page.locator('.equipment-readings')).toContainText('10:42:30')
  await expect(page.locator('.equipment-readings')).toContainText('7.2')
  await expect(page.locator('.solution-source')).toContainText('10:42:22')
  await page.getByRole('button', {name: 'WO-204 · 联轴器更换工单'}).click()
  await expect(page.locator('.solution-source')).toContainText('没有本次对中测量附件')
  await page.getByText('来源与时间对齐', {exact: true}).click()
  await expect(page.locator('.solution-details')).toContainText('±1 秒')
  await page.getByRole('tab', {name: '异常前'}).click()
  await expect(page.locator('.equipment-readings')).toContainText('2.1')
  await expect(page.locator('.solution-source blockquote')).toContainText('无振动报警')
  await expect(page.locator('.solution-hypotheses')).toContainText('待核实原因')
})

test('personal drafts keep the same facts across audiences and expose explicit preference sources', async ({page}) => {
  await page.goto('/zh-CN/solutions/personal-work')
  await expect(page.locator('.personal-draft')).toContainText('前提是接口方案获得确认')
  await page.getByRole('button', {name: '项目历史'}).click()
  await expect(page.locator('.solution-source blockquote')).toContainText('报表增强另列入二期')
  await page.getByRole('tab', {name: '内部更新'}).click()
  await expect(page.locator('.personal-draft')).toContainText('仍需接口方案确认')
  await page.getByRole('button', {name: '查看表达偏好依据'}).click()
  await expect(page.locator('.solution-source')).toContainText('6 月 2 日确认')
  await expect(page.locator('.solution-source blockquote')).toContainText('客户更新先说结论')
  await expect(page.locator('.solution-semantic-note')).toContainText('只修改本次草稿')
})

test('commerce changes the recommendation with physical dimensions and shows dated variant evidence', async ({page}) => {
  await page.goto('/zh-CN/solutions/commerce-sales')
  await expect(page.locator('.commerce-recommendation')).toContainText('电脑尺寸待核对')
  await page.getByRole('button', {name: '31 × 22 × 1.8 cm', exact: true}).click()
  await expect(page.locator('.commerce-recommendation')).toContainText('A 轻 290 g')
  await page.getByRole('button', {name: '33 × 24 × 2 cm', exact: true}).click()
  await expect(page.locator('.commerce-recommendation')).toContainText('A 的电脑仓过小')
  await expect(page.locator('.commerce-criteria')).toContainText('无法容纳')
  await page.getByRole('button', {name: '价格与可售状态 · 中国区'}).click()
  await expect(page.locator('.solution-source')).toContainText('09:00')
  await expect(page.locator('.solution-source')).toContainText('结算前')
  await page.getByRole('button', {name: '重置', exact: true}).click()
  await expect(page.locator('.commerce-recommendation')).toContainText('电脑尺寸待核对')
})

test('marketing plays exact evidence on demand and separates campaign samples from original media', async ({page}) => {
  await page.goto('/zh-CN/solutions/marketing-campaigns')
  await expect(page.locator('video')).not.toHaveAttribute('src', /./)
  await page.getByRole('button', {name: '启动搅拌', exact: true}).click()
  await page.locator('.creative-play-reference').click()
  await expect.poll(() => page.locator('video').evaluate(e => (e as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(5)
  await page.getByRole('button', {name: '音频表达', exact: true}).click()
  await expect(page.locator('video')).toHaveCount(0)
  await page.locator('.creative-play-reference').click()
  await expect(page.locator('audio')).toHaveJSProperty('paused', false)
  await page.getByRole('button', {name: '图片细节', exact: true}).click()
  await expect(page.locator('audio,video')).toHaveCount(0)
  await page.getByRole('button', {name: '画面文字识别', exact: true}).click()
  await page.locator('.image-stage-button').click()
  await expect(page.locator('dialog.media-modal')).toBeVisible()
  await expect(page.locator('dialog .image-region')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await page.getByRole('tab', {name: '复盘与优化'}).click()
  await expect(page.locator('.campaign-learning-note')).toContainText('对照测试，核查开场的影响')
  await page.getByText('统计范围与指标定义', {exact: true}).click()
  await expect(page.locator('.solution-details')).toContainText('不是参考媒体的实际表现')
  await expect(page.locator('.campaign-metrics tbody tr')).toHaveCount(2)
})

test('overview and Context explorer mount one updated scenario preview at a time', async ({page}) => {
  await page.goto('/zh-CN/products/context#solutions')
  const explorer = page.locator('.case-explorer')
  for (const scenario of agentUseCases) {
    await explorer.getByRole('button', {name: scenario.name['zh-CN'], exact: true}).click()
    await expect(explorer.locator('.case-experience')).toHaveCount(1)
    await expect(explorer.locator('.case-experience')).toHaveAttribute('data-case', scenario.id)
    await expect(explorer.locator('.case-explorer-panel:visible .arrow-link')).toHaveAttribute('href', '/zh-CN/solutions/' + scenario.id)
  }
  await page.getByRole('button', {name: '解决方案', exact: true}).click()
  await expect(page.locator('#nav-use-cases a')).toHaveCount(9)
  await page.locator('#nav-use-cases').getByRole('link', {name: '会议智能', exact: true}).click()
  await expect(page.locator('.solution-demo')).toHaveAttribute('data-case', 'meeting-intelligence')
})

test('demo requests retain the scenario, suggested brief and modalities through submission', async ({page}) => {
  const scenario = agentUseCases[2]
  await page.goto('/zh-CN/solutions/' + scenario.id)
  await page.locator('.case-hero-copy .btn').click()
  await expect(page.locator('.demo-selected-case')).toContainText('设备诊断')
  await expect(page.locator('textarea[name="need"]')).toHaveValue(scenario.need['zh-CN'])
  await page.reload()
  for (const modality of scenario.modalities) await expect(page.locator(`input[name="modalities"][value="${modality}"]`)).toBeChecked()
  await page.locator('input[name="name"]').fill('Solution acceptance')
  await page.locator('input[name="email"]').fill('website-test@example.com')
  await page.locator('input[name="company"]').fill('Local website test')
  const response = page.waitForResponse(r => r.url().endsWith('/api/demo-requests') && r.request().method() === 'POST')
  await page.getByRole('button', {name: '申请产品演示', exact: true}).click()
  const result = await response
  expect(result.request().postDataJSON().scenario).toBe(scenario.id)
  expect(result.status()).toBe(201)
  await expect(page.locator('.receipt-id')).toBeVisible()
})

test('all twelve localized pages scroll normally and fit narrow screens in their interactive states', async ({page}) => {
  test.setTimeout(60000)
  await page.setViewportSize({width: 390, height: 844})
  for (const prefix of ['', '/zh-CN']) {
    for (const scenario of agentUseCases) {
      await page.goto(prefix + '/solutions/' + scenario.id)
      await page.evaluate(async () => {await document.fonts.ready})
      const tabs = page.locator('.solution-demo [role=tab]')
      if (await tabs.count()) await tabs.last().click()
      await page.locator('.solution-demo').scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      const scroll = await page.evaluate(() => scrollY)
      await page.mouse.move(190, 410)
      await page.mouse.wheel(0, 450)
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scroll)
    }
  }
  await page.goto('/zh-CN/solutions')
  const explorer = page.locator('.case-explorer')
  for (const scenario of agentUseCases) {
    await explorer.getByRole('button', {name: scenario.name['zh-CN'], exact: true}).click()
    await expect(explorer.locator('.case-experience')).toHaveAttribute('data-case', scenario.id)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
