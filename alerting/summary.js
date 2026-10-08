'use strict';
// Shared input for the three notifiers: the parity summary written by reporting/parity-report.js.
// One batched message per run (never one per failing scenario) keeps alerts actionable and avoids alert fatigue.
const fs = require('fs');

function loadSummary() {
  const file = process.env.SUMMARY_FILE || 'comparison-summary.json';
  let summary = {};
  if (fs.existsSync(file)) summary = JSON.parse(fs.readFileSync(file, 'utf8'));
  else if (process.env.SUMMARY_JSON) summary = JSON.parse(process.env.SUMMARY_JSON);
  const suite = name => summary[name] || { scenarios: 0, passed: 0, failed: 0, flaky: 0, pass_rate: 0, total_duration_ms: 0, failing: [] };
  const cypress = suite('cypress');
  const playwright = suite('playwright');
  const status = process.env.TEST_STATUS || summary.status || 'failed';
  const failing = [...cypress.failing.map(f => `cypress · ${f.scenario}`), ...playwright.failing.map(f => `playwright · ${f.scenario}`)];
  return {
    status,
    gate: summary.gate || 'unknown',
    runUrl: summary.run_url || process.env.RUN_URL || '',
    commit: String(summary.commit_sha || process.env.GITHUB_SHA || 'local').slice(0, 7),
    cypress,
    playwright,
    failing,
  };
}

const pct = x => `${(Number(x || 0) * 100).toFixed(0)}%`;
const line = m => `${m.passed}/${m.scenarios} passed · ${m.failed} failed · ${m.flaky} flaky · ${pct(m.pass_rate)} · ${(m.total_duration_ms / 1000).toFixed(0)}s`;

function title(s) { return `Migration dual run ${s.status.toUpperCase()} — parity gate ${s.gate.toUpperCase()} (${s.commit})`; }
function failingText(s, max = 10) {
  if (!s.failing.length) return 'none';
  const shown = s.failing.slice(0, max).join('\n');
  return s.failing.length > max ? `${shown}\n… and ${s.failing.length - max} more` : shown;
}

module.exports = { loadSummary, line, title, failingText };
