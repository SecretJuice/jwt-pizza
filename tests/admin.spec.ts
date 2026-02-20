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

test('create franchise', async ({ page }) => {
  await BasicInit(page);

  await page.getByRole('link', { name: 'Login' }).click();
  await LoginAdmin(page)

  await page.getByRole('link', { name: 'Admin' }).click();

  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('Test Franchise!');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('textbox', { name: 'Filter franchises' }).fill('Test Franchise!');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('cell', { name: 'Test Franchise!', exact: true })).toBeVisible();  
});

test('see users table in dashboard', async ({ page }) => {
  await BasicInit(page);

  await page.getByRole('link', { name: 'Login' }).click();
  await LoginAdmin(page)

  await page.getByRole('link', { name: 'Admin' }).click();

  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Filter users' })).toBeVisible();

  await expect(page.getByRole('main')).toContainText('Kai Chen');
  await expect(page.getByRole('main')).toContainText('d@jwt.com');
  await expect(page.getByRole('main')).toContainText('diner');
  await page.getByRole('textbox', { name: 'Filter users' }).fill('Kai');
  await page.getByRole('button', { name: 'Submit' }).nth(1).click();

  await expect(page.getByRole('main')).toContainText('Kai Chen');
  await expect(page.getByRole('main')).not.toContainText('Boss Man');
})