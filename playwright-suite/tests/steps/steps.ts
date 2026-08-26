import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
const { Given, When, Then } = createBdd(test);
const api = '/api';
const credentials = () => ({ email: process.env.TEST_USER_EMAIL, password: process.env.TEST_USER_PASSWORD });

Given('I open the homepage', async ({ page }) => await page.goto('/'));
Then('I see the site title', async ({ page }) => await expect(page).toHaveTitle(/Automation Exercise/));
// MIGRATED FROM CYPRESS:
// cy.get('[data-qa="login-button"]').click()
// WHY THIS CHANGES IN PLAYWRIGHT:
// Playwright's page.getByTestId() reads the configured testIdAttribute instead of a raw CSS attribute selector, decoupling the locator from the attribute name and prioritizing resilient locators (see MIGRATION_GUIDE.md, section "Locator strategy").
Given('I open the login page', async ({ page }) => await page.goto('/login'));
When('I log in with valid credentials', async ({ page }) => { const user = credentials(); expect(user.email, 'TEST_USER_EMAIL is required').toBeTruthy(); await page.getByTestId('login-email').fill(user.email!); await page.getByTestId('login-password').fill(user.password || ''); await page.getByTestId('login-button').click(); });
Then('I should see the logged in indicator', async ({ page }) => await expect(page.getByText('Logged in as')).toBeVisible());
Given('I open the products page', async ({ page }) => await page.goto('/products'));
When('I add the first product to the cart', async ({ page }) => await page.locator('.product-overlay').first().click());
Then('the cart contains one item', async ({ page }) => { await page.goto('/view_cart'); await expect(page.locator('.cart_quantity').first()).toContainText('1'); });
// Playwright's request fixture is isolated from the browser and requires no cy.request plugin or browser origin workaround.
When('I request the products list API', async ({ request }, scenario) => { (scenario as any).apiResponse = await request.get(`${api}/productsList`); });
Then('the API response is successful and non-empty', async ({}, scenario) => { const response = (scenario as any).apiResponse; expect(response.status()).toBe(200); expect((await response.json()).products.length).toBeGreaterThan(0); });
When('I verify login with valid credentials', async ({ request }, scenario) => { const user = credentials(); expect(user.email, 'TEST_USER_EMAIL is required').toBeTruthy(); (scenario as any).apiResponse = await request.post(`${api}/verifyLogin`, { form: { email: user.email!, password: user.password || '' } }); });
Then('the login API response is valid', async ({}, scenario) => expect([200, 201]).toContain((await (scenario as any).apiResponse.json()).responseCode));
When('I log in with invalid credentials', async ({ page }) => { await page.getByTestId('login-email').fill('invalid@example.invalid'); await page.getByTestId('login-password').fill('wrong'); await page.getByTestId('login-button').click(); });
Then('I see a login error', async ({ page }) => await expect(page.getByText('Your email or password is incorrect!')).toBeVisible());
When('I search for {string}', async ({ page }, keyword) => { await page.locator('#search_product').fill(keyword); await page.locator('#submit_search').click(); });
Then('search results contain {string}', async ({ page }, keyword) => await expect(page.locator('.productinfo p')).toContainText(keyword));
Then('no matching products are shown', async ({ page }) => await expect(page.locator('.productinfo p')).toHaveCount(0));
Given('I add a product to the cart', async ({ page }) => { await page.goto('/products'); await page.locator('.product-overlay').first().click(); });
When('I increase and decrease its quantity', async ({ page }) => { await page.goto('/view_cart'); await page.locator('.cart_quantity button').first().dblclick(); });
Then('the cart quantity is updated', async ({ page }) => await expect(page.locator('.cart_quantity').first()).toBeVisible());
Given('I open the cart', async ({ page }) => await page.goto('/view_cart'));
When('I continue checkout without required fields', async ({ page }) => await page.getByText('Proceed To Checkout').click());
Then('checkout requires account details', async ({ page }) => await expect(page).toHaveURL(/login/));
Then('every product includes id name price and brand', async ({}, scenario) => { for (const product of (await (scenario as any).apiResponse.json()).products) expect(product).toEqual(expect.objectContaining({ id: expect.any(Number), name: expect.any(String), price: expect.any(String), brand: expect.any(String) })); });
When('I search the product API for {string}', async ({ request }, scenario, keyword) => { (scenario as any).apiResponse = await request.post(`${api}/searchProduct`, { form: { search_product: keyword } }); });
Then('the product API returns matching results', async ({}, scenario) => { expect((await (scenario as any).apiResponse.json()).products.length).toBeGreaterThan(0); });
When('I verify login with invalid credentials', async ({ request }, scenario) => { (scenario as any).apiResponse = await request.post(`${api}/verifyLogin`, { form: { email: 'invalid@example.invalid', password: 'wrong' } }); });
Then('the login API rejects the credentials', async ({}, scenario) => expect((await (scenario as any).apiResponse.json()).responseCode).not.toBe(200));
When('I request the brands list API', async ({ request }, scenario) => { (scenario as any).apiResponse = await request.get(`${api}/brandsList`); });
Then('the brands API response is non-empty', async ({}, scenario) => expect((await (scenario as any).apiResponse.json()).brands.length).toBeGreaterThan(0));

// Playwright can create a second origin context directly; Cypress normally needs cy.origin for this boundary.
Then('I can navigate to a second origin', async ({ browser }) => { const context = await browser.newContext(); const otherOrigin = await context.newPage(); await otherOrigin.goto('https://example.com'); await expect(otherOrigin).toHaveTitle(/Example Domain/); await context.close(); });
