'use strict';
// Discord webhook: expects { embeds: [...] }. Only called on red runs, with every failure batched into ONE embed.
const { loadSummary, line, title, failingText } = require('./summary');

const webhook = process.env.DISCORD_WEBHOOK_URL;
if (!webhook) { console.log('DISCORD_WEBHOOK_URL not configured; skipping Discord notification.'); process.exit(0); }
const s = loadSummary();
const payload = { embeds: [{
  title: title(s).slice(0, 256),
  url: s.runUrl || undefined,
  color: s.status === 'passed' ? 0x2eb67d : 0xe01e5a,
  fields: [
    { name: 'Cypress', value: line(s.cypress), inline: false },
    { name: 'Playwright', value: line(s.playwright), inline: false },
    { name: 'Failing scenarios', value: failingText(s).slice(0, 1000), inline: false },
  ],
}] };
fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
  .then(response => { if (!response.ok) { console.error(`Discord HTTP ${response.status}`); process.exitCode = 1; } });
