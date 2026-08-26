const webhook = process.env.DISCORD_WEBHOOK_URL;
if (!webhook) { console.log('DISCORD_WEBHOOK_URL not configured; skipping Discord notification.'); process.exit(0); }
const summary = JSON.parse(process.env.SUMMARY_JSON || '{}');
// Discord webhooks expect embeds; batch failing scenarios in one embed to avoid one notification per test.
const payload = { embeds: [{ title: 'Migration dual run failed', color: 0xe01e5a, fields: [{ name: 'Cypress', value: summary.cypress || 'n/a', inline: true }, { name: 'Playwright', value: summary.playwright || 'n/a', inline: true }] }] };
fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }).then(response => { if (!response.ok) process.exitCode = 1; });
