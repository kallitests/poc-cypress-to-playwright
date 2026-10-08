'use strict';
// Slack Incoming Webhook: expects { attachments: [{ color, blocks }] } (Block Kit). Sent on every main/nightly run;
// green runs get this lightweight summary only.
const { loadSummary, line, title, failingText } = require('./summary');

const webhook = process.env.SLACK_WEBHOOK_URL;
if (!webhook) { console.log('SLACK_WEBHOOK_URL not configured; skipping Slack notification.'); process.exit(0); }
const s = loadSummary();
const blocks = [
  { type: 'section', text: { type: 'mrkdwn', text: `*${title(s)}*` } },
  { type: 'section', fields: [
    { type: 'mrkdwn', text: `*Cypress*\n${line(s.cypress)}` },
    { type: 'mrkdwn', text: `*Playwright*\n${line(s.playwright)}` },
  ] },
];
if (s.failing.length) blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*Failing scenarios*\n\`\`\`${failingText(s)}\`\`\`` } });
if (s.runUrl) blocks.push({ type: 'context', elements: [{ type: 'mrkdwn', text: `<${s.runUrl}|Open workflow run>` }] });
const payload = { attachments: [{ color: s.status === 'passed' ? '#2eb67d' : '#e01e5a', blocks }] };
fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
  .then(response => { if (!response.ok) { console.error(`Slack HTTP ${response.status}`); process.exitCode = 1; } });
