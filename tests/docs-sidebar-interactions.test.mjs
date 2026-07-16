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

maybeTest('docs sidebar keeps sibling categories open when another one expands', async () => {
  await request(`/session/${sessionId}/url`, {
    url: `${docsUrl}/docs/data/concepts/ai-functions`,
  })
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const initial = await execute(`
    return Array.from(document.querySelectorAll('.theme-doc-sidebar-container .menu__link--sublist[role="button"]')).map((button) => ({
      text: button.textContent.trim(),
      expanded: button.getAttribute('aria-expanded'),
    }))
  `)
  assert.deepEqual(initial.find((item) => item.text === 'Concepts'), {
    text: 'Concepts',
    expanded: 'true',
  })

  await execute(`
    const button = Array.from(document.querySelectorAll('.theme-doc-sidebar-container .menu__link--sublist[role="button"]'))
      .find((el) => el.textContent.trim() === 'Getting Started')
    button.click()
    return button.getAttribute('aria-expanded')
  `)
  await new Promise((resolve) => setTimeout(resolve, 50))
  const gettingStartedExpanded = await execute(`
    return Array.from(document.querySelectorAll('.theme-doc-sidebar-container .menu__link--sublist[role="button"]'))
      .find((el) => el.textContent.trim() === 'Getting Started')
      .getAttribute('aria-expanded')
  `)

  assert.equal(gettingStartedExpanded, 'true')

  await execute(`
    const button = Array.from(document.querySelectorAll('.theme-doc-sidebar-container .menu__link--sublist[role="button"]'))
      .find((el) => el.textContent.trim() === 'Examples')
    button.click()
    return button.getAttribute('aria-expanded')
  `)
  await new Promise((resolve) => setTimeout(resolve, 50))
  const siblingStates = await execute(`
    return Array.from(document.querySelectorAll('.theme-doc-sidebar-container .menu__link--sublist[role="button"]'))
      .filter((el) => ['Getting Started', 'Concepts', 'Examples'].includes(el.textContent.trim()))
      .map((el) => ({
        text: el.textContent.trim(),
        expanded: el.getAttribute('aria-expanded'),
      }))
  `)

  assert.deepEqual(siblingStates, [
    { text: 'Getting Started', expanded: 'true' },
    { text: 'Concepts', expanded: 'true' },
    { text: 'Examples', expanded: 'true' },
  ])
})
