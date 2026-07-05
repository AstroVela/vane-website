import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'

const webdriverUrl = process.env.WEBDRIVER_URL
const docsUrl = process.env.DOCS_E2E_URL

const maybeTest = webdriverUrl && docsUrl ? test : test.skip

let sessionId

async function request(path, body, method = 'POST') {
  const response = await fetch(`${webdriverUrl}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok || data.value?.error) {
    throw new Error(JSON.stringify(data, null, 2))
  }
  return data.value
}

async function execute(script, args = []) {
  return request(`/session/${sessionId}/execute/sync`, { script, args })
}

before(async () => {
  if (!webdriverUrl || !docsUrl) return

  const value = await request('/session', {
    capabilities: {
      alwaysMatch: {
        browserName: 'firefox',
        'moz:firefoxOptions': { args: ['-headless'] },
      },
    },
  })
  sessionId = value.sessionId
})

after(async () => {
  if (!sessionId) return
  await fetch(`${webdriverUrl}/session/${sessionId}`, { method: 'DELETE' })
})

maybeTest('active docs sidebar groups can be collapsed by the reader', async () => {
  await request(`/session/${sessionId}/url`, {
    url: `${docsUrl}/docs/data/guides/structured-transformation`,
  })
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const initial = await execute(`
    return Array.from(document.querySelectorAll('.side .gt')).map((button) => ({
      text: button.textContent.trim().replace('▸', ''),
      expanded: button.getAttribute('aria-expanded'),
    }))
  `)
  assert.deepEqual(
    initial.filter((item) => item.text === 'Guides' || item.text === 'Data Transformation'),
    [
      { text: 'Guides', expanded: 'true' },
      { text: 'Data Transformation', expanded: 'true' },
    ],
  )

  await execute(`
    const button = Array.from(document.querySelectorAll('.side .gt'))
      .find((el) => el.textContent.trim().replace('▸', '') === 'Guides')
    button.click()
    return button.getAttribute('aria-expanded')
  `)
  await new Promise((resolve) => setTimeout(resolve, 50))
  const guidesExpanded = await execute(`
    return Array.from(document.querySelectorAll('.side .gt'))
      .find((el) => el.textContent.trim().replace('▸', '') === 'Guides')
      .getAttribute('aria-expanded')
  `)

  assert.equal(guidesExpanded, 'false')

  await execute(`
    const button = Array.from(document.querySelectorAll('.side .gt'))
      .find((el) => el.textContent.trim().replace('▸', '') === 'Guides')
    button.click()
    return button.getAttribute('aria-expanded')
  `)
  await new Promise((resolve) => setTimeout(resolve, 50))

  await execute(`
    const button = Array.from(document.querySelectorAll('.side .gt'))
      .find((el) => el.textContent.trim().replace('▸', '') === 'Data Transformation')
    button.click()
    return button.getAttribute('aria-expanded')
  `)
  await new Promise((resolve) => setTimeout(resolve, 50))
  const transformationStillCollapsed = await execute(`
    return Array.from(document.querySelectorAll('.side .gt'))
      .find((el) => el.textContent.trim().replace('▸', '') === 'Data Transformation')
      .getAttribute('aria-expanded')
  `)

  assert.equal(transformationStillCollapsed, 'false')
})
