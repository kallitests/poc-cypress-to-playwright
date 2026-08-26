# Cypress to Playwright Migration POC

A runnable migration exercise against [automationexercise.com](https://automationexercise.com). The same English Gherkin intent is executed by the original Cypress suite and the target Playwright suite, then compared in CI.

## Repository map

- `cypress-suite/`: baseline Cypress + `@badeball/cypress-cucumber-preprocessor` implementation.
- `playwright-suite/`: target Playwright + `playwright-bdd` implementation.
- `migration/`: migration decisions, operating method, and living coverage comparison.
- `docker/`: independent headless runner images.
- `k8s/`: run-to-completion Kubernetes Jobs and environment templates.
- `.github/workflows/`: dual-run kind pipeline.
- `alerting/`: batched Slack, Discord, and Gmail notifications.
- `reporting/`: report normalization and Power BI streaming schema.

## Local run

Prerequisites: Node.js 20+, Docker for browser dependencies, and credentials only when integrations are enabled.

```bash
npm install
npm --prefix cypress-suite install
npm --prefix playwright-suite install
npm run test:cypress
npm run test:playwright
```

The public site can change, so UI checks use roles, labels, and stable `data-qa` selectors where available, with assertions focused on observable behavior. Set `BASE_URL` to point at a controlled environment when reproducibility matters. API and login scenarios use `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`; the login scenarios are skipped when credentials are not supplied.

See [CODE_WALKTHROUGH.md](CODE_WALKTHROUGH.md) for the ten-minute tour and [migration/MODUS_OPERANDI.md](migration/MODUS_OPERANDI.md) for the migration method.
