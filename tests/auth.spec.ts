import {test, expect} from 'playwright-test-coverage'

test('auth', async ({ page }) => {
  await page.goto('http://localhost:5173/')
})
