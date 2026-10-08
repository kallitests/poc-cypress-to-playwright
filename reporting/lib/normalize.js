'use strict';
// Normalizes Cypress (mochawesome) and Playwright (JSON reporter) results into one row-per-execution
// schema, then aggregates executions into one row per scenario. Both suites run the SAME Gherkin
// scenarios, so (feature, scenario_name) is the join key used by the parity report.
const fs = require('fs');
const path = require('path');

const ANSI = /\u001b\[[0-9;]*m/g;
const MAX_ERROR = 600;

function cleanError(message) {
  if (!message) return '';
  return String(message).replace(ANSI, '').trim().slice(0, MAX_ERROR);
}

// "cypress/e2e/features/smoke_ui.feature" or "features/smoke_ui.feature.spec.js" -> "smoke_ui"
function featureFromFile(file) {
  if (!file) return 'unknown';
  return path.basename(String(file)).replace(/\.spec\.[jt]s$/, '').replace(/\.feature$/, '').replace(/\.cy\.[jt]s$/, '');
}

// Tags are derived from the feature naming convention <level>_<layer>.feature (smoke_ui, regression_api).
function tagsFromFeature(feature) {
  const match = /^(smoke|regression)_(ui|api)$/.exec(feature);
  return match ? `${match[1]},${match[2]}` : 'untagged';
}

function listJsonFiles(target) {
  if (!target || !fs.existsSync(target)) return [];
  if (fs.statSync(target).isFile()) return [target];
  return fs.readdirSync(target, { recursive: true })
    .map(entry => path.join(target, String(entry)))
    .filter(file => file.endsWith('.json') && fs.statSync(file).isFile());
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

// ---------- Cypress / mochawesome ----------
const CYPRESS_STATUS = { passed: 'passed', failed: 'failed', pending: 'skipped', skipped: 'skipped' };

function fromMochawesome(report) {
  const executions = [];
  const walk = (suite, file) => {
    const currentFile = suite.file || file;
    for (const test of suite.tests || []) {
      executions.push({
        suite: 'cypress',
        feature: featureFromFile(currentFile),
        scenario_name: test.title,
        status: CYPRESS_STATUS[test.state] || (test.skipped ? 'skipped' : test.pending ? 'skipped' : 'unknown'),
        duration_ms: Number(test.duration || 0),
        error_message: cleanError(test.err && test.err.message),
      });
    }
    for (const child of suite.suites || []) walk(child, currentFile);
  };
  for (const result of report.results || []) walk(result, result.file || result.fullFile);
  return executions;
}

// ---------- Playwright JSON reporter ----------
const PLAYWRIGHT_STATUS = { expected: 'passed', unexpected: 'failed', flaky: 'flaky', skipped: 'skipped' };

function fromPlaywright(report) {
  const executions = [];
  const walk = suite => {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const results = test.results || [];
        const lastError = [...results].reverse().find(r => r.error || (r.errors && r.errors.length));
        executions.push({
          suite: 'playwright',
          feature: featureFromFile(spec.file || suite.file),
          scenario_name: spec.title,
          status: PLAYWRIGHT_STATUS[test.status] || 'unknown',
          duration_ms: results.reduce((sum, r) => sum + Number(r.duration || 0), 0),
          error_message: cleanError(lastError && ((lastError.error && lastError.error.message) || lastError.errors[0].message)),
        });
      }
    }
    for (const child of suite.suites || []) walk(child);
  };
  for (const suite of report.suites || []) walk(suite);
  return executions;
}

function detectAndParse(report) {
  if (!report || typeof report !== 'object') return [];
  if (Array.isArray(report.results)) return fromMochawesome(report);
  if (Array.isArray(report.suites) && report.config) return fromPlaywright(report);
  return [];
}

// Collapse repeated executions (retries are already folded in by each runner, repeat-each is not)
// into a single scenario verdict: mixed pass/fail across executions == flaky.
function aggregate(executions, meta = {}) {
  const groups = new Map();
  for (const execution of executions) {
    const key = `${execution.suite}::${execution.feature}::${execution.scenario_name}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(execution);
  }
  const rows = [];
  for (const runs of groups.values()) {
    const statuses = new Set(runs.map(r => r.status));
    const ran = runs.filter(r => r.status !== 'skipped');
    let status;
    if (ran.length === 0) status = 'skipped';
    else if (statuses.has('flaky') || (statuses.has('passed') && statuses.has('failed'))) status = 'flaky';
    else if (ran.every(r => r.status === 'passed')) status = 'passed';
    else if (ran.every(r => r.status === 'failed')) status = 'failed';
    else status = 'unknown';
    const first = runs[0];
    const error = runs.map(r => r.error_message).filter(Boolean).pop() || '';
    rows.push({
      suite: first.suite,
      feature: first.feature,
      scenario_name: first.scenario_name,
      tags: tagsFromFeature(first.feature),
      status,
      executions: runs.length,
      duration_ms: Math.round(ran.reduce((s, r) => s + r.duration_ms, 0) / Math.max(ran.length, 1)),
      error_message: error,
      run_timestamp: meta.runTimestamp || new Date().toISOString(),
      commit_sha: meta.commitSha || 'local',
      branch: meta.branch || 'local',
      run_id: meta.runId || 'local',
    });
  }
  return rows.sort((a, b) => (a.suite + a.feature + a.scenario_name).localeCompare(b.suite + b.feature + b.scenario_name));
}

function normalizeReports(target, meta) {
  const executions = listJsonFiles(target).flatMap(file => detectAndParse(readJson(file)));
  return aggregate(executions, meta);
}

module.exports = { normalizeReports, aggregate, detectAndParse, fromMochawesome, fromPlaywright, featureFromFile, tagsFromFeature, listJsonFiles, cleanError };
