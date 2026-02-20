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
      'u1@jwt.com': {
        id: '6',
        name: 'Avery Parker',
        email: 'u1@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u2@jwt.com': {
        id: '7',
        name: 'Blake Morgan',
        email: 'u2@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u3@jwt.com': {
        id: '8',
        name: 'Casey Reed',
        email: 'u3@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u4@jwt.com': {
        id: '9',
        name: 'Drew Kim',
        email: 'u4@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u5@jwt.com': {
        id: '10',
        name: 'Evan Ortiz',
        email: 'u5@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u6@jwt.com': {
        id: '11',
        name: 'Finley Ross',
        email: 'u6@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u7@jwt.com': {
        id: '12',
        name: 'Gabe Patel',
        email: 'u7@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u8@jwt.com': {
        id: '13',
        name: 'Hayden Lopez',
        email: 'u8@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u9@jwt.com': {
        id: '14',
        name: 'Jules Carter',
        email: 'u9@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
      },
      'u10@jwt.com': {
        id: '15',
        name: 'Kendall Nguyen',
        email: 'u10@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }]
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
      console.log('PUT /api/auth')
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
      console.log('POST /api/auth')
      const registerReq = route.request().postDataJSON();
      const existingUser = validUsers[registerReq.email];
      if (existingUser) {
        await route.fulfill({ status: 409, json: { error: 'User already exists' } });
        return;
      }
      const newUser: User = {
        id: Math.floor(6 + (Math.random() * 1000000)).toString(), // random id, never pick existing
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
      console.log('DELETE /api/auth')
      loggedInUser = undefined;
      await route.fulfill({ json: { message: 'logged out' } });
      return;
    }

    await route.fulfill({ status: 405, json: { error: 'Method Not Allowed' } });
  });

  await page.route('*/**/api/user?*', async (route) => {
    expect(route.request().method()).toBe('GET');
    const url = new URL(route.request().url())
    const page = url.searchParams.get("page")
    const limit = url.searchParams.get("limit")
    const name = url.searchParams.get("name")
    console.log(`GET /api/user?page=${page}&limit=${limit}&name=${name}`)
    let users = Object.values(validUsers);
    if (name && name.trim() !== '') {
      const substring = name.replace(/\*/g, '').toLowerCase();
      users = users.filter((user) => (user.name ?? '').toLowerCase().includes(substring));
    }
    const pageNumber = Number(page ?? 0);
    const limitNumber = Number(limit ?? users.length);
    const start = Math.max(0, pageNumber) * Math.max(0, limitNumber);
    const end = start + Math.max(0, limitNumber);
    const pagedUsers = users.slice(start, end);
    const more = end < users.length;
    await route.fulfill({ json: {users: pagedUsers, more} })
    return;
  });

  await page.route('*/**/api/user/*', async (route) => {
    const method = route.request().method();
    const url = new URL(route.request().url())
    const userId = url.pathname.split("/")[3]

    if (method === 'DELETE') {
      console.log("DELETE /api/user/:userId")
      const existingEntry = Object.entries(validUsers).find(([, user]) => user.id === userId);
      if (!existingEntry) {
        await route.fulfill({ status: 404, json: { message: "User doesn't exist" } })
        return;
      }
      const [email] = existingEntry;
      delete validUsers[email];
      await route.fulfill({ status: 200, json: { message: "User deleted" } })
      return;
    }

    expect(method).toBe('PUT');
    console.log("PUT /api/user/:userId")

    const updatedUser: User = route.request().postDataJSON()

    let user: User = validUsers[updatedUser.email ?? '']
    if (user == null) {
      route.fulfill({ status: 404, json: "User doesn't exist"})
      return;
    }

    user.email = updatedUser.email ?? user.email
    user.name = updatedUser.name ?? user.name
    user.password = updatedUser.password ?? user.password

    validUsers[user.email ?? ''] = user;

    route.fulfill({ json: { email: user.email, roles: user.roles } })
    return;
  });

  // Return the currently logged in user
  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    console.log("GET /api/user/me")
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

  await page.route('*/**/api/franchise', async (route) => {
    console.log('POST /api/franchise')
    expect(route.request().method()).toBe('POST');

    const franchiseReq = route.request().postDataJSON();

    const createdFranchise: Franchise = {
      id: String(nextFranchiseId++),
      name: franchiseReq.name,
      stores: [],
      admins: [],
    };

    const adminEmail = franchiseReq.admins?.[0]?.email;
    if (adminEmail) {
      const adminUser = validUsers[adminEmail];
      if (adminUser) {
        createdFranchise.admins = [{ email: adminEmail, id: adminUser.id, name: adminUser.name }];
        if (adminUser.id) {
          franchiseByUserId[adminUser.id] = createdFranchise.id;
        }
      } else {
        createdFranchise.admins = [{ email: adminEmail }];
      }
    }

    franchises.push(createdFranchise);

    await route.fulfill({ json: createdFranchise })
  })

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

    const method = route.request().method()

    if (method === 'POST') {
      const orderReq = route.request().postDataJSON();
      const orderRes = {
        order: { ...orderReq, id: 23 },
        jwt: 'eyJpYXQ',
      };
      await route.fulfill({ json: orderRes });
    }
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
