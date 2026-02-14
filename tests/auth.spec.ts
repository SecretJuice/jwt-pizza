import {test, expect} from 'playwright-test-coverage'
import { BasicInit, LoginDiner } from './helpers';

test('login', async ({ page }) => {
  await BasicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await LoginDiner(page)

  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('diner dashboard', async ({ page }) => {
  await BasicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await LoginDiner(page)


  await page.getByRole('link', { name: 'KC' }).click();
  await expect(page.getByRole('main')).toContainText('Kai Chen');
  await expect(page.getByRole('main')).toContainText('d@jwt.com');
  await expect(page.getByRole('main')).toContainText('diner');
});

test('purchase with login', async ({ page }) => {
  await BasicInit(page);

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await LoginDiner(page)

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('logout', async ({ page }) => {
  await BasicInit(page);

  await page.getByRole('link', { name: 'Login' }).click();
  await LoginDiner(page)

  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
})

test('register', async ({ page }) => {
  await BasicInit(page)
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('test');
  await page.getByRole('textbox', { name: 'Email address' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByRole('link', { name: 't', exact: true })).toBeVisible();
})
