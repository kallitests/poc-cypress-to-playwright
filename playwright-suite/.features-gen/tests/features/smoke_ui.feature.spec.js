// Generated from: tests\features\smoke_ui.feature
import { test } from "../../../tests/steps/fixtures.ts";

test.describe('Smoke UI coverage', () => {

  test('Homepage loads successfully', async ({ Given, page, Then }) => { 
    await Given('I open the homepage', null, { page }); 
    await Then('I see the site title', null, { page }); 
  });

  test('User can log in with valid credentials', async ({ Given, page, When, Then }) => { 
    await Given('I open the login page', null, { page }); 
    await When('I log in with valid credentials', null, { page }); 
    await Then('I should see the logged in indicator', null, { page }); 
  });

  test('User can add a product to the cart', async ({ Given, page, When, Then }) => { 
    await Given('I open the products page', null, { page }); 
    await When('I add the first product to the cart', null, { page }); 
    await Then('the cart contains one item', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('tests\\features\\smoke_ui.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":11,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":12,"gherkinStepLine":8,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":9,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":17,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":18,"gherkinStepLine":13,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":14,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":15,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
]; // bdd-data-end