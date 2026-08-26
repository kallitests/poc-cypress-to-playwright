const fs = require('fs');
const path = require('path');

function readJson(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; } }
function flatten(node, suite, rows = []) {
  if (!node || typeof node !== 'object') return rows;
  if (node.title && (node.state || node.status || node.duration !== undefined)) rows.push({ suite, scenario_name: node.title, status: node.state || node.status || 'unknown', duration_ms: Number(node.duration || 0) });
  for (const value of Object.values(node)) if (value && typeof value === 'object') flatten(value, suite, rows);
  return rows;
}
function normalize(file, suite) {
  const report = readJson(file);
  const rows = flatten(report, suite);
  const timestamp = new Date().toISOString();
  return rows.map(row => ({ ...row, tags: ['migration'], run_timestamp: timestamp, commit_sha: process.env.COMMIT_SHA || 'local' }));
}
const inputFile = process.env.INPUT_FILE;
const inputRows = inputFile ? readJson(inputFile) : null;
const cypress = inputRows ? inputRows.filter(row => row.suite === 'cypress') : normalize(process.env.CYPRESS_REPORT || path.join('cypress-suite', 'results', 'mochawesome.json'), 'cypress');
const playwright = inputRows ? inputRows.filter(row => row.suite === 'playwright') : normalize(process.env.PLAYWRIGHT_REPORT || path.join('playwright-suite', 'results', 'playwright.json'), 'playwright');
const rows = [...cypress, ...playwright];
const output = process.env.OUTPUT_FILE || 'powerbi-rows.json';
fs.writeFileSync(output, JSON.stringify(rows, null, 2));
// Power BI Streaming Dataset accepts POST { rows }; provision the endpoint and schema once in Power BI, then reuse it here.
if (process.env.POWERBI_PUSH_URL) fetch(process.env.POWERBI_PUSH_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ rows }) }).then(response => { if (!response.ok) process.exitCode = 1; });
console.log(`Normalized ${rows.length} scenario rows to ${output}`);
