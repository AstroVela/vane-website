import {defineConfig} from '@playwright/test'
export default defineConfig({
  testDir:'tests/browser',
  fullyParallel:false,
  workers:1,
  timeout:30000,
  expect:{timeout:7000},
  outputDir:'.tmp-visual-check/browser',
  reporter:'list',
  use:{baseURL:process.env.WEBSITE_TEST_URL??'http://127.0.0.1:4328',headless:true,viewport:{width:1440,height:900},trace:'retain-on-failure',screenshot:'only-on-failure',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox']}},
})
