import {test, expect} from 'playwright-test-coverage'
import { BasicInit, LoginAdmin, LoginFranchisee } from './helpers';

test('login to dashboard', async ({ page }) => {
  await BasicInit(page);

  await page.getByRole('link', { name: 'Login' }).click();
  await LoginAdmin(page)

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.locator('h2')).toContainText('Mama Ricci\'s kitchen');
});
