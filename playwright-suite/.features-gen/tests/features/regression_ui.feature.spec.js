// Generated from: tests\features\regression_ui.feature
import { test } from "../../../tests/steps/fixtures.ts";

test.describe('Regression UI coverage', () => {

  test('User cannot log in with invalid credentials', async ({ Given, page, When, Then }) => { 
    await Given('I open the login page', null, { page }); 
    await When('I log in with invalid credentials', null, { page }); 
    await Then('I see a login error', null, { page }); 
  });

  test('Search returns relevant products for a valid keyword', async ({ Given, page, When, Then }) => { 
    await Given('I open the products page', null, { page }); 
    await When('I search for "dress"', null, { page }); 
    await Then('search results contain "dress"', null, { page }); 
  });

  test('Search returns an empty state for a nonsense keyword', async ({ Given, page, When, Then }) => { 
    await Given('I open the products page', null, { page }); 
    await When('I search for "zzzz-no-such-product"', null, { page }); 
    await Then('no matching products are shown', null, { page }); 
  });

  test('Cart quantity updates correctly when increasing/decreasing items', async ({ Given, page, When, Then }) => { 
    await Given('I add a product to the cart', null, { page }); 
    await When('I increase and decrease its quantity', null, { page }); 
    await Then('the cart quantity is updated', null, { page }); 
  });

  test('Checkout blocks submission when required fields are empty', async ({ Given, page, When, Then }) => { 
    await Given('I open the cart', null, { page }); 
    await When('I continue checkout without required fields', null, { page }); 
    await Then('checkout requires account details', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('tests\\features\\regression_ui.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":12,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":9,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[{"group":{"start":13,"value":"\"dress\"","children":[{"start":14,"value":"dress","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":11,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[{"group":{"start":23,"value":"\"dress\"","children":[{"start":24,"value":"dress","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":18,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":19,"gherkinStepLine":14,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":15,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[{"group":{"start":13,"value":"\"zzzz-no-such-product\"","children":[{"start":14,"value":"zzzz-no-such-product","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":16,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":24,"pickleLine":18,"tags":[],"steps":[{"pwStepLine":25,"gherkinStepLine":19,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":20,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":21,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":30,"pickleLine":23,"tags":[],"steps":[{"pwStepLine":31,"gherkinStepLine":24,"keywordOrig":"Given ","keywordType":"Context","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":25,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":26,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
]; // bdd-data-end