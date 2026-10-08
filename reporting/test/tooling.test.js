'use strict';
// Unit tests for the CI tooling itself (normalizer, parity gate, AI triage parsing).
// A quality gate is only trustworthy if the gate's own code is tested: run with `npm run test:tooling`.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { normalizeReports, featureFromFile, tagsFromFeature } = require('../lib/normalize');
const { evaluate, toMarkdown } = require('../parity-report');
const { collectFailures, parseTriage } = require('../../ai/triage-failures');

const mochawesome = {
  stats: {},
  results: [{
    file: 'cypress/e2e/features/smoke_api.feature',
    suites: [{
      title: 'Smoke API coverage',
      tests: [
        { title: 'Products list API returns 200 and a non-empty list', state: 'passed', duration: 120, err: {} },
        { title: 'Login API returns a valid response for correct credentials', state: 'failed', duration: 80, err: { message: 'AssertionError: expected undefined to be a string' } },
      ],
      suites: [],
    }],
  }],
};

const playwright = (statusLogin, statusProducts = 'expected', repeat = 1) => ({
  config: {},
  suites: [{
    title: 'features/smoke_api.feature.spec.js',
    file: 'features/smoke_api.feature.spec.js',
    specs: [],
    suites: [{
      title: 'Smoke API coverage',
      file: 'features/smoke_api.feature.spec.js',
      specs: [
        { title: 'Products list API returns 200 and a non-empty list', file: 'features/smoke_api.feature.spec.js',
          tests: Array.from({ length: repeat }, () => ({ status: statusProducts, results: [{ status: 'passed', duration: 50 }] })) },
        { title: 'Login API returns a valid response for correct credentials', file: 'features/smoke_api.feature.spec.js',
          tests: [{ status: statusLogin, results: [{ status: 'failed', duration: 30, error: { message: '\u001b[31mError: TEST_USER_EMAIL is required\u001b[39m' } }] }] },
      ],
    }],
  }],
});

function tmpReports(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reports-'));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), JSON.stringify(content));
  }
  return dir;
}

test('feature names and tags are derived from both runners file conventions', () => {
  assert.equal(featureFromFile('cypress/e2e/features/regression_ui.feature'), 'regression_ui');
  assert.equal(featureFromFile('features/regression_ui.feature.spec.js'), 'regression_ui');
  assert.equal(tagsFromFeature('regression_ui'), 'regression,ui');
  assert.equal(tagsFromFeature('other'), 'untagged');
});

test('mochawesome and Playwright reports normalize to the same scenario keys', () => {
  const cy = normalizeReports(tmpReports({ 'mochawesome.json': mochawesome }), { commitSha: 'abc' });
  const pw = normalizeReports(tmpReports({ 'json/playwright-1.json': playwright('unexpected') }), { commitSha: 'abc' });
  assert.deepEqual(cy.map(r => r.scenario_name), pw.map(r => r.scenario_name));
  assert.deepEqual(cy.map(r => r.status), ['failed', 'passed']);
  assert.equal(pw.find(r => r.status === 'failed').error_message, 'Error: TEST_USER_EMAIL is required', 'ANSI codes stripped');
  assert.equal(cy[0].commit_sha, 'abc');
});

test('repeated executions with mixed results are aggregated as flaky', () => {
  const dir = tmpReports({ 'json/playwright-1.json': playwright('expected', 'expected'), 'json/playwright-2.json': playwright('expected', 'unexpected') });
  const rows = normalizeReports(dir, {});
  assert.equal(rows.find(r => r.scenario_name.startsWith('Products')).status, 'flaky');
  assert.equal(rows.find(r => r.scenario_name.startsWith('Products')).executions, 2);
});

test('parity gate passes when Playwright matches Cypress, even if both fail the same scenario', () => {
  const rows = [
    ...normalizeReports(tmpReports({ 'm.json': mochawesome }), {}),
    ...normalizeReports(tmpReports({ 'p.json': playwright('unexpected') }), {}),
  ];
  const result = evaluate(rows);
  assert.equal(result.gate, 'pass');
  assert.equal(result.status, 'failed');
  assert.match(toMarkdown(result), /parity gate: \*\*PASS\*\*/);
});

test('parity gate fails on a migration regression and on missing reports', () => {
  const okCypress = JSON.parse(JSON.stringify(mochawesome));
  okCypress.results[0].suites[0].tests[1].state = 'passed';
  const rows = [
    ...normalizeReports(tmpReports({ 'm.json': okCypress }), {}),
    ...normalizeReports(tmpReports({ 'p.json': playwright('unexpected') }), {}),
  ];
  const result = evaluate(rows);
  assert.equal(result.gate, 'fail');
  assert.equal(result.regressions.length, 1);
  assert.equal(evaluate(rows.filter(r => r.suite === 'cypress')).checks.find(c => c.id === 'reports').ok, false);
});

test('AI triage keeps only schema-valid verdicts', () => {
  const rows = [
    ...normalizeReports(tmpReports({ 'm.json': mochawesome }), {}),
    ...normalizeReports(tmpReports({ 'p.json': playwright('unexpected') }), {}),
  ];
  const failures = collectFailures(evaluate(rows));
  assert.equal(failures.length, 2);
  assert.equal(failures[0].playwright_status, 'failed');
  const verdicts = parseTriage('Sure! [{"id":1,"category":"TEST_DATA","confidence":"high","evidence":"missing creds","next_action":"set secret"},{"id":2,"category":"MADE_UP"},{"id":99,"category":"FLAKY"}]', failures);
  assert.deepEqual(verdicts.map(v => v.id), [1]);
});
