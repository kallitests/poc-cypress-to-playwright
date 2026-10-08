'use strict';
// Gmail via Nodemailer. Gmail requires an App Password (2-step verification enabled); the regular account
// password is rejected over SMTP. Demo only — production should use a transactional provider (SES, SendGrid…).
const { loadSummary, line, title, failingText } = require('./summary');

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.ALERT_TO) {
  console.log('Gmail variables not configured; skipping email notification.');
  process.exit(0);
}
// Required lazily so the script can skip cleanly where dependencies are not installed.
const nodemailer = require('nodemailer');
const s = loadSummary();
const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
// One summary email per run rather than one message per scenario.
transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: process.env.ALERT_TO,
  subject: title(s),
  text: [`Cypress:    ${line(s.cypress)}`, `Playwright: ${line(s.playwright)}`, '', 'Failing scenarios:', failingText(s, 25), '', s.runUrl].join('\n'),
}).catch(error => { console.error(error.message); process.exitCode = 1; });
