const nodemailer = require('nodemailer');
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.ALERT_TO) { console.log('Gmail variables not configured; skipping email notification.'); process.exit(0); }
// Gmail requires an App Password with 2-step verification; a regular password is rejected. This is demo-only; use a transactional provider in production.
const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
const summary = JSON.parse(process.env.SUMMARY_JSON || '{}');
// Send one summary email rather than one message per scenario to keep failures actionable and calm.
transporter.sendMail({ from: process.env.GMAIL_USER, to: process.env.ALERT_TO, subject: 'Migration dual run failed', text: `Cypress: ${summary.cypress || 'n/a'}\nPlaywright: ${summary.playwright || 'n/a'}` }).catch(() => { process.exitCode = 1; });
