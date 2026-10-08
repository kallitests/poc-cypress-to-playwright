'use strict';
// Migration quality gate. Reads the normalized rows (comparison.json) and decides whether the
// Playwright suite is at parity with the Cypress baseline, following the sign-off criteria of
// migration/MODUS_OPERANDI.md. Writes:
//   - SUMMARY_FILE (default comparison-summary.json): machine-readable metrics for alerting / AI triage
//   - MARKDOWN_FILE (default comparison.md): PR comment + GitHub job summary
//   - $GITHUB_OUTPUT: gate=pass|fail, status=passed|failed, counters
// Exit code 1 when the gate fails and GATE_ENFORCE != 'false'.
const fs = require('fs');

const ICON = { passed: '✅', failed: '❌', flaky: '⚠️', skipped: '⏭️', unknown: '❔', missing: '➖' };

function suiteMetrics(rows, suite) {
  const own = rows.filter(r => r.suite === suite);
  const count = s => own.filter(r => r.status === s).length;
  const executed = own.filter(r => r.status !== 'skipped');
  const passed = count('passed');
  const flaky = count('flaky');
  return {
    suite,
    scenarios: own.length,
    passed,
    failed: count('failed'),
    flaky,
    skipped: count('skipped'),
    // A flaky scenario eventually passed: it counts as passing but is reported separately.
    pass_rate: executed.length ? (passed + flaky) / executed.length : 0,
    avg_duration_ms: executed.length ? Math.round(executed.reduce((s, r) => s + r.duration_ms, 0) / executed.length) : 0,
    total_duration_ms: executed.reduce((s, r) => s + r.duration_ms, 0),
    failing: own.filter(r => r.status === 'failed').map(r => ({ feature: r.feature, scenario: r.scenario_name, error: r.error_message })),
    flaky_scenarios: own.filter(r => r.status === 'flaky').map(r => ({ feature: r.feature, scenario: r.scenario_name })),
  };
}

function evaluate(rows, options = {}) {
  const maxFlaky = Number(options.maxFlaky ?? -1);
  const cypress = suiteMetrics(rows, 'cypress');
  const playwright = suiteMetrics(rows, 'playwright');
  const key = r => `${r.feature} › ${r.scenario_name}`;
  const byKey = suite => new Map(rows.filter(r => r.suite === suite).map(r => [key(r), r]));
  const cy = byKey('cypress');
  const pw = byKey('playwright');
  const allKeys = [...new Set([...cy.keys(), ...pw.keys()])].sort();

  const matrix = allKeys.map(k => ({
    key: k,
    cypress: cy.get(k)?.status || 'missing',
    playwright: pw.get(k)?.status || 'missing',
  }));
  const missingInPlaywright = matrix.filter(m => m.cypress !== 'missing' && m.playwright === 'missing').map(m => m.key);
  const extraInPlaywright = matrix.filter(m => m.cypress === 'missing' && m.playwright !== 'missing').map(m => m.key);
  const regressions = matrix.filter(m => m.cypress === 'passed' && m.playwright === 'failed').map(m => m.key);
  const improvements = matrix.filter(m => m.cypress === 'failed' && ['passed', 'flaky'].includes(m.playwright)).map(m => m.key);

  const checks = [
    { id: 'reports', label: 'Both suites produced a report', ok: cypress.scenarios > 0 && playwright.scenarios > 0,
      detail: `cypress=${cypress.scenarios}, playwright=${playwright.scenarios} scenarios` },
    { id: 'inventory', label: 'Same scenario inventory (Gherkin parity)', ok: missingInPlaywright.length === 0,
      detail: missingInPlaywright.length ? `missing in Playwright: ${missingInPlaywright.join('; ')}` : `${pw.size} scenarios matched` },
    { id: 'no-regression', label: 'No scenario green in Cypress but red in Playwright', ok: regressions.length === 0,
      detail: regressions.length ? regressions.join('; ') : 'none' },
    { id: 'pass-rate', label: 'Playwright pass rate ≥ Cypress pass rate', ok: playwright.pass_rate >= cypress.pass_rate,
      detail: `${pct(playwright.pass_rate)} vs ${pct(cypress.pass_rate)}` },
  ];
  if (maxFlaky >= 0) {
    checks.push({ id: 'flaky', label: `Playwright flaky scenarios ≤ ${maxFlaky}`, ok: playwright.flaky <= maxFlaky, detail: `${playwright.flaky} flaky` });
  }
  const gate = checks.every(c => c.ok) ? 'pass' : 'fail';
  const status = cypress.failed + playwright.failed === 0 && cypress.scenarios > 0 && playwright.scenarios > 0 ? 'passed' : 'failed';
  return { gate, status, cypress, playwright, checks, matrix, missingInPlaywright, extraInPlaywright, regressions, improvements };
}

function pct(x) { return `${(x * 100).toFixed(1)}%`; }
function escapeCell(text) { return String(text || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' '); }

function toMarkdown(result, meta = {}) {
  const { cypress, playwright } = result;
  const lines = [];
  lines.push('<!-- dual-run-parity-report -->');
  lines.push(`## ${result.gate === 'pass' ? '🟢' : '🔴'} Cypress → Playwright parity gate: **${result.gate.toUpperCase()}**`);
  lines.push('');
  if (meta.commitSha) lines.push(`Commit \`${String(meta.commitSha).slice(0, 7)}\`${meta.runUrl ? ` · [workflow run](${meta.runUrl})` : ''}`, '');
  lines.push('| Suite | Scenarios | Passed | Failed | Flaky | Skipped | Pass rate | Avg duration (ms) |');
  lines.push('|---|---:|---:|---:|---:|---:|---:|---:|');
  for (const m of [cypress, playwright]) {
    lines.push(`| ${m.suite === 'cypress' ? 'Cypress (baseline)' : 'Playwright (target)'} | ${m.scenarios} | ${m.passed} | ${m.failed} | ${m.flaky} | ${m.skipped} | ${pct(m.pass_rate)} | ${m.avg_duration_ms} |`);
  }
  lines.push('', '### Sign-off checks', '', '| Check | Result | Detail |', '|---|:---:|---|');
  for (const c of result.checks) lines.push(`| ${c.label} | ${c.ok ? '✅' : '❌'} | ${escapeCell(c.detail)} |`);
  if (result.improvements.length) lines.push('', `ℹ️ Fixed by the migration (red in Cypress, green in Playwright): ${result.improvements.join('; ')}`);
  lines.push('', '<details><summary>Scenario matrix</summary>', '', '| Feature › Scenario | Cypress | Playwright |', '|---|:---:|:---:|');
  for (const m of result.matrix) lines.push(`| ${escapeCell(m.key)} | ${ICON[m.cypress]} ${m.cypress} | ${ICON[m.playwright]} ${m.playwright} |`);
  lines.push('', '</details>');
  const failures = [...cypress.failing.map(f => ({ ...f, suite: 'cypress' })), ...playwright.failing.map(f => ({ ...f, suite: 'playwright' }))];
  if (failures.length) {
    lines.push('', '<details><summary>Failure details</summary>', '');
    for (const f of failures) lines.push(`- **${f.suite}** · ${escapeCell(f.feature)} › ${escapeCell(f.scenario)}`, '', '  ```', `  ${String(f.error || 'no error message').split('\n').join('\n  ')}`, '  ```');
    lines.push('', '</details>');
  }
  return lines.join('\n') + '\n';
}

function writeOutputs(result) {
  if (!process.env.GITHUB_OUTPUT) return;
  const out = [
    `gate=${result.gate}`,
    `status=${result.status}`,
    `cypress_failed=${result.cypress.failed}`,
    `playwright_failed=${result.playwright.failed}`,
    `failures=${result.cypress.failed + result.playwright.failed}`,
  ];
  fs.appendFileSync(process.env.GITHUB_OUTPUT, out.join('\n') + '\n');
}

function main() {
  const input = process.env.INPUT_FILE || 'comparison.json';
  const rows = fs.existsSync(input) ? JSON.parse(fs.readFileSync(input, 'utf8')) : [];
  const result = evaluate(rows, { maxFlaky: process.env.GATE_MAX_FLAKY });
  const meta = { commitSha: process.env.GITHUB_SHA, runUrl: process.env.GITHUB_SERVER_URL && `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` };
  const summary = { ...result, commit_sha: meta.commitSha || 'local', run_url: meta.runUrl || '' };
  fs.writeFileSync(process.env.SUMMARY_FILE || 'comparison-summary.json', JSON.stringify(summary, null, 2));
  const markdown = toMarkdown(result, meta);
  fs.writeFileSync(process.env.MARKDOWN_FILE || 'comparison.md', markdown);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  writeOutputs(result);
  console.log(`Parity gate: ${result.gate} (cypress ${pct(result.cypress.pass_rate)}, playwright ${pct(result.playwright.pass_rate)})`);
  for (const c of result.checks.filter(c => !c.ok)) console.log(`::error title=Parity gate::${c.label} — ${c.detail}`);
  if (result.gate === 'fail' && process.env.GATE_ENFORCE !== 'false') process.exitCode = 1;
}

if (require.main === module) main();
module.exports = { evaluate, suiteMetrics, toMarkdown };
