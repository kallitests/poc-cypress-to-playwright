// Generated from: tests\features\regression_api.feature
import { test } from "../../../tests/steps/fixtures.ts";

test.describe('Regression API coverage', () => {

  test('Products list API response includes required fields (id, name, price, brand)', async ({ When, request, Then }) => { 
    await When('I request the products list API', null, { request }); 
    await Then('every product includes id name price and brand'); 
  });

  test('Search product API returns matching results for a keyword', async ({ When, request, Then }) => { 
    await When('I search the product API for "dress"', null, { request }); 
    await Then('the product API returns matching results'); 
  });

  test('Invalid login API returns an appropriate error response', async ({ When, request, Then }) => { 
    await When('I verify login with invalid credentials', null, { request }); 
    await Then('the login API rejects the credentials'); 
  });

  test('Brands list API returns a non-empty list of brands', async ({ When, request, Then }) => { 
    await When('I request the brands list API', null, { request }); 
    await Then('the brands API response is non-empty'); 
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('tests\\features\\regression_api.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":11,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":12,"gherkinStepLine":8,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[{"group":{"start":29,"value":"\"dress\"","children":[{"start":30,"value":"dress","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":9,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":16,"pickleLine":11,"tags":[],"steps":[{"pwStepLine":17,"gherkinStepLine":12,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":13,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":21,"pickleLine":15,"tags":[],"steps":[{"pwStepLine":22,"gherkinStepLine":16,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":17,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
]; // bdd-data-end