import {test, expect} from 'playwright-test-coverage'
import { BasicInit, LoginFranchisee } from './helpers';

test('login to dashboard', async ({ page }) => {
  await BasicInit(page);

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await LoginFranchisee(page)
  await expect(page.getByText('Everything you need to run an')).toBeVisible();
});