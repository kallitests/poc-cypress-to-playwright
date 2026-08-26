const summary = JSON.parse(process.env.SUMMARY_JSON || '{}');
const status = process.env.TEST_STATUS || 'failed';
const webhook = process.env.SLACK_WEBHOOK_URL;
if (!webhook) { console.log('SLACK_WEBHOOK_URL not configured; skipping Slack notification.'); process.exit(0); }
// Slack Incoming Webhooks expect a JSON message; one batched Block Kit payload prevents alert fatigue.
const payload = { attachments: [{ color: status === 'passed' ? '#2eb67d' : '#e01e5a', blocks: [{ type: 'section', text: { type: 'mrkdwn', text: `*Migration dual run: ${status.toUpperCase()}*\nCypress: ${summary.cypress || 'n/a'} | Playwright: ${summary.playwright || 'n/a'}` } }] }] };
fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }).then(response => { if (!response.ok) process.exitCode = 1; });
