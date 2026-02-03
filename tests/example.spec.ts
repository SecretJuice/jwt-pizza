import { test, expect } from 'playwright-test-coverage';

test('get home page', async ({ page }) => {
  await page.goto('http://localhost:5173/');

});
