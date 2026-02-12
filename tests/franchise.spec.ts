import {test, expect} from 'playwright-test-coverage'
import { BasicInit, LoginFranchisee } from './helpers';

test('login to dashboard', async ({ page }) => {
  await BasicInit(page);

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await LoginFranchisee(page)
  await expect(page.getByText('Everything you need to run an')).toBeVisible();
});

test('open new store', async ({ page }) => {
  await BasicInit(page);

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await LoginFranchisee(page)

  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('A Test Store!');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('tbody')).toContainText('A Test Store!');
});