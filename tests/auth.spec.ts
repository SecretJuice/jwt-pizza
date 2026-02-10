import {test, expect} from 'playwright-test-coverage'
import { User, Role } from '../src/service/pizzaService';
import { Page } from '@playwright/test';

// test('auth', async ({ page }) => {
//   await page.goto('http://localhost:5173/')
// })
// await page.route('*/**/api/auth', async (route) => {
//   const loginReq = { email: 'd@jwt.com', password: 'a' };
//   const loginRes = {
//     user: {
//       id: 3,
//       name: 'Kai Chen',
//       email: 'd@jwt.com',
//       roles: [{ role: 'diner' }],
//     },
//     token: 'abcdef',
//   };
//   expect(route.request().method()).toBe('PUT');
//   expect(route.request().postDataJSON()).toMatchObject(loginReq);
//   await route.fulfill({ json: loginRes });
// });
async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = { 'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Diner }] } };

  // Authorize login for the given user
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = route.request().postDataJSON();
    const user = validUsers[loginReq.email];
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      return;
    }
    loggedInUser = validUsers[loginReq.email];
    const loginRes = {
      user: loggedInUser,
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: loginRes });
  });
}

test('login', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
})
