// Generated from: tests\features\smoke_api.feature
import { test } from "../../../tests/steps/fixtures.ts";

test.describe('Smoke API coverage', () => {

  test('Products list API returns 200 and a non-empty list', async ({ When, request, Then }) => { 
    await When('I request the products list API', null, { request }); 
    await Then('the API response is successful and non-empty'); 
  });

  test('Login API returns a valid response for correct credentials', async ({ When, request, Then }) => { 
    await When('I verify login with valid credentials', null, { request }); 
    await Then('the login API response is valid'); 
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('tests\\features\\smoke_api.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
  {"pwTestLine":11,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":12,"gherkinStepLine":8,"keywordOrig":"When ","keywordType":"Action","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":9,"keywordOrig":"Then ","keywordType":"Outcome","stepMatchArguments":[]}]},
]; // bdd-data-end