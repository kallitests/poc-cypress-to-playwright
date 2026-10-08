'use strict';
// Step 1 (normalize): read raw Cypress + Playwright reports -> one row per scenario (OUTPUT_FILE).
// Step 2 (push, optional): POST the rows to a Power BI streaming dataset when POWERBI_PUSH_URL is set.
//   - normalize: CYPRESS_REPORT=<dir|file> PLAYWRIGHT_REPORT=<dir|file> OUTPUT_FILE=comparison.json node reporting/transform-results-to-powerbi.js
//   - push only: INPUT_FILE=comparison.json POWERBI_PUSH_URL=... node reporting/transform-results-to-powerbi.js
const fs = require('fs');
const path = require('path');
const { normalizeReports } = require('./lib/normalize');

// Power BI streaming datasets accept flat, typed columns only (see powerbi-schema.md).
const POWERBI_FIELDS = ['suite', 'feature', 'scenario_name', 'tags', 'status', 'executions', 'duration_ms', 'run_timestamp', 'commit_sha', 'branch', 'run_id'];

function buildRows() {
  if (process.env.INPUT_FILE) return JSON.parse(fs.readFileSync(process.env.INPUT_FILE, 'utf8'));
  const meta = {
    runTimestamp: new Date().toISOString(),
    commitSha: process.env.COMMIT_SHA || process.env.GITHUB_SHA,
    branch: process.env.BRANCH || process.env.GITHUB_REF_NAME,
    runId: process.env.RUN_ID || process.env.GITHUB_RUN_ID,
  };
  return [
    ...normalizeReports(process.env.CYPRESS_REPORT || path.join('cypress-suite', 'results', 'mochawesome'), meta),
    ...normalizeReports(process.env.PLAYWRIGHT_REPORT || path.join('playwright-suite', 'results'), meta),
  ];
}

async function pushToPowerBI(rows, url) {
  // Streaming datasets cap a single POST; send in chunks to stay well under the limit.
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500).map(row => Object.fromEntries(POWERBI_FIELDS.map(f => [f, row[f]])));
    const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ rows: chunk }) });
    if (!response.ok) throw new Error(`Power BI push failed: HTTP ${response.status}`);
  }
}

async function main() {
  const rows = buildRows();
  if (!process.env.INPUT_FILE) {
    const output = process.env.OUTPUT_FILE || 'powerbi-rows.json';
    fs.writeFileSync(output, JSON.stringify(rows, null, 2));
    console.log(`Normalized ${rows.length} scenario rows to ${output}`);
  }
  if (process.env.POWERBI_PUSH_URL) {
    await pushToPowerBI(rows, process.env.POWERBI_PUSH_URL);
    console.log(`Pushed ${rows.length} rows to Power BI`);
  } else if (process.env.INPUT_FILE) {
    console.log('POWERBI_PUSH_URL not configured; skipping Power BI push.');
  }
}

if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { buildRows, POWERBI_FIELDS };
