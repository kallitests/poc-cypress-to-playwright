const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

const baseApi = '/api';
const credentials = () => ({ email: Cypress.env('userEmail'), password: Cypress.env('userPassword') });

// Cypress retries get/find assertions until they pass; data-qa and semantic controls are more stable than styling classes.
Given('I open the homepage', () => cy.visit('/'));
Then('I see the site title', () => cy.title().should('contain', 'Automation Exercise'));
// MIGRATED FROM CYPRESS: cy.visit('/login'); cy.get('[data-qa="login-email"]').type(email); cy.get('[data-qa="login-password"]').type(password); cy.get('[data-qa="login-button"]').click()
// Cypress waits for each command and retries the final assertion; data-qa avoids classes that change with presentation.
Given('I open the login page', () => cy.visit('/login'));
When('I log in with valid credentials', () => { const user = credentials(); expect(user.email, 'TEST_USER_EMAIL').to.be.a('string'); cy.get('[data-qa="login-email"]').type(user.email); cy.get('[data-qa="login-password"]').type(user.password); cy.get('[data-qa="login-button"]').click(); });
Then('I should see the logged in indicator', () => cy.contains('Logged in as').should('be.visible'));
// Cypress automatically waits for the product controls to become actionable before clicking.
Given('I open the products page', () => cy.visit('/products'));
When('I add the first product to the cart', () => cy.get('.product-overlay').first().should('be.visible').click());
Then('the cart contains one item', () => cy.visit('/view_cart').get('.cart_quantity').should('contain', '1'));
// cy.request is retried only at the command level; the explicit status/body assertions document the API contract.
When('I request the products list API', () => cy.request(`${baseApi}/productsList`).as('apiResponse'));
Then('the API response is successful and non-empty', () => cy.get('@apiResponse').its('status').should('eq', 200).get('@apiResponse').its('body.products').should('not.be.empty'));
When('I verify login with valid credentials', () => { const user = credentials(); cy.request({ method: 'POST', url: `${baseApi}/verifyLogin`, form: true, body: user, failOnStatusCode: false }).as('apiResponse'); });
Then('the login API response is valid', () => cy.get('@apiResponse').its('body.responseCode').should('be.oneOf', [200, 201]));
When('I log in with invalid credentials', () => cy.get('[data-qa="login-email"]').type('invalid@example.invalid').get('[data-qa="login-password"]').type('wrong').get('[data-qa="login-button"]').click());
Then('I see a login error', () => cy.contains('Your email or password is incorrect!').should('be.visible'));
When('I search for {string}', (keyword) => cy.get('#search_product').type(keyword).get('#submit_search').click());
Then('search results contain {string}', (keyword) => cy.get('.productinfo p').should('contain.text', keyword));
Then('no matching products are shown', () => cy.get('.productinfo p').should('not.exist'));
Given('I add a product to the cart', () => cy.visit('/products').get('.product-overlay').first().click());
When('I increase and decrease its quantity', () => cy.visit('/view_cart').get('.cart_quantity button').first().click().click());
Then('the cart quantity is updated', () => cy.get('.cart_quantity').should('be.visible'));
Given('I open the cart', () => cy.visit('/view_cart'));
When('I continue checkout without required fields', () => cy.contains('Proceed To Checkout').click());
Then('checkout requires account details', () => cy.url().should('include', 'login'));
Then('every product includes id name price and brand', () => cy.get('@apiResponse').its('body.products').each((product) => expect(product).to.include.all.keys('id', 'name', 'price', 'brand')));
When('I search the product API for {string}', (keyword) => cy.request({ method: 'POST', url: `${baseApi}/searchProduct`, form: true, body: { search_product: keyword } }).as('apiResponse'));
Then('the product API returns matching results', () => cy.get('@apiResponse').its('status').should('eq', 200).get('@apiResponse').its('body.products').should('not.be.empty'));
When('I verify login with invalid credentials', () => cy.request({ method: 'POST', url: `${baseApi}/verifyLogin`, form: true, body: { email: 'invalid@example.invalid', password: 'wrong' }, failOnStatusCode: false }).as('apiResponse'));
Then('the login API rejects the credentials', () => cy.get('@apiResponse').its('body.responseCode').should('not.eq', 200));
When('I request the brands list API', () => cy.request(`${baseApi}/brandsList`).as('apiResponse'));
Then('the brands API response is non-empty', () => cy.get('@apiResponse').its('body.brands').should('not.be.empty'));
