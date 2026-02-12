import { Franchise, Store, User, Role } from '../src/service/pizzaService';
import { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage'

export async function BasicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
     'd@jwt.com': { 
        id: '3', 
        name: 'Kai Chen', 
        email: 'd@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'f@jwt.com': {
        id: '4',
        name: 'Papa John',
        email: 'f@jwt.com',
        password: 'a',
        roles: [{ role: Role.Franchisee, objectId: '5'}]
      },
     'a@jwt.com': { 
        id: '5', 
        name: 'Boss Man', 
        email: 'a@jwt.com',
        password: 'a',
        roles: [{ role: Role.Admin }]
      },
    };
  const franchises: Franchise[] = [
    {
      id: '2',
      name: 'LotaPizza',
      stores: [
        { id: '4', name: 'Lehi' },
        { id: '5', name: 'Springville' },
        { id: '6', name: 'American Fork' },
      ],
    },
    { id: '3', name: 'PizzaCorp', stores: [{ id: '7', name: 'Spanish Fork' }] },
    { id: '4', name: 'topSpot', stores: [] },
    { id: '5', name: "Papa John's", stores: [{ id: '8', name: 'University Avenue' }] },
  ];
  const franchiseByUserId: Record<string, string> = {
    '4': '5',
  };
  let nextFranchiseId = 6;
  let nextStoreId = 9;

  // Authorize login, register, and handle logout.
  await page.route('*/**/api/auth', async (route) => {
    const method = route.request().method();
    if (method === 'PUT') {
      console.log('LOGGING IN')
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
      await route.fulfill({ json: loginRes });
      return;
    }

    if (method === 'POST') {
      const registerReq = route.request().postDataJSON();
      const existingUser = validUsers[registerReq.email];
      if (existingUser) {
        await route.fulfill({ status: 409, json: { error: 'User already exists' } });
        return;
      }
      const newUser: User = {
        id: '99',
        name: registerReq.name,
        email: registerReq.email,
        password: registerReq.password,
        roles: [{ role: Role.Diner }],
      };
      validUsers[registerReq.email] = newUser;
      loggedInUser = newUser;
      await route.fulfill({ json: { user: newUser, token: 'abcdef' } });
      return;
    }

    if (method === 'DELETE') {
      loggedInUser = undefined;
      await route.fulfill({ json: { message: 'logged out' } });
      return;
    }

    await route.fulfill({ status: 405, json: { error: 'Method Not Allowed' } });
  });

  // Return the currently logged in user
  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  // A standard menu
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      {
        id: 1,
        title: 'Veggie',
        image: 'pizza1.png',
        price: 0.0038,
        description: 'A garden of delight',
      },
      {
        id: 2,
        title: 'Pepperoni',
        image: 'pizza2.png',
        price: 0.0042,
        description: 'Spicy treat',
      },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise?*', async (route) => {
    console.log('GET /api/franchise?page=*&limit=*&name=*')
    const url = new URL(route.request().url())
    const page = url.searchParams.get("page")
    const limit = url.searchParams.get("limit")
    const name = url.searchParams.get("name")
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: {franchises: franchises} })
  })

  await page.route('*/**/api/franchise/*', async (route) => {
    const method = route.request().method();

    if (method === 'GET') {
        console.log('GET /api/franchise/:userId')
        const url = new URL(route.request().url())
        const userId = url.pathname.split("/")[3]
        
        console.log("Getting Franchise for user", userId)

        const franchiseId = franchiseByUserId[userId]
        if (franchiseId == null) {
          console.log("No franshise found!")
          await route.fulfill({ status: 404, json: { error: 'Franchise not found' } });
          return
        }
        
        const fran = franchises.find(f => f.id === franchiseId)

        console.log(fran)

        await route.fulfill({json: [fran]})

    } else if (method === 'DELETE') {
        console.log('DELETE /api/franchise/:id')
    }
  })

  await page.route('*/**/api/franchise/*/store', async (route) => {
        const method = route.request().method();
        if (method === 'POST') {
          console.log('POST /api/franchise/:id/store')
          const url = new URL(route.request().url())
          const franchiseId = url.pathname.split("/")[3]
          const storeReq = route.request().postDataJSON();

          const franchise = franchises.find(f => f.id === franchiseId)
          if (!franchise) {
            await route.fulfill({ status: 404, json: { error: 'Franchise not found' } });
            return;
          }

          const createdStore: Store = {
            id: storeReq.id ?? String(nextStoreId++),
            name: storeReq.name,
          };
          franchise.stores.push(createdStore);
          await route.fulfill({ json: createdStore });
          return;
        }

        await route.fulfill({ status: 405, json: { error: 'Method Not Allowed' } });
  })

  await page.route('*/**/api/franchise/*/store/*', async (route) => {

        const method = route.request().method();
        if (method === 'DELETE') {
          console.log('DELETE /api/franchise/:id/store/:storeId')
          const url = new URL(route.request().url())
          const franchiseId = url.pathname.split("/")[3]
          const storeId = url.pathname.split("/")[5]

          const franchise = franchises.find(f => f.id === franchiseId)
          if (!franchise) {
            await route.fulfill({ status: 404, json: { error: 'Franchise not found' } });
            return;
          }

          const storeIndex = franchise.stores.findIndex(store => store.id === storeId);
          if (storeIndex === -1) {
            await route.fulfill({ status: 404, json: { error: 'Store not found' } });
            return;
          }
          franchise.stores.splice(storeIndex, 1);

          await route.fulfill({ json: { message: 'store deleted' } });
          return;
        }

        await route.fulfill({ status: 405, json: { error: 'Method Not Allowed' } });
  })

  // Order a pizza.
  await page.route('*/**/api/order', async (route) => {
    const orderReq = route.request().postDataJSON();
    const orderRes = {
      order: { ...orderReq, id: 23 },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');
}

export async function LoginDiner(page: Page) {
  await login(page, 'd@jwt.com', 'a')
}
export async function LoginFranchisee(page: Page) {
  await login(page, 'f@jwt.com', 'a')
}
export async function LoginAdmin(page: Page) {
  await login(page, 'a@jwt.com', 'a')
}

async function login(page: Page, email: string, password: string) {
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}
