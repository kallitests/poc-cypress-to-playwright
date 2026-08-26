# Code Walkthrough

## 1. Problem

This POC demonstrates a controlled Cypress-to-Playwright migration: intent remains in identical Gherkin while implementation, API isolation, browser contexts, parallelism, containers, and reporting move to the target stack.

## 2. Local run

Install Node 20+, then run `npm install`, `npm --prefix cypress-suite install`, and `npm --prefix playwright-suite install`. Run either suite with the root scripts. Set `BASE_URL`, `TEST_USER_EMAIL`, and `TEST_USER_PASSWORD` in the environment; secrets are never committed. Dockerfiles provide reproducible headless environments.

## 3. CI behavior

Pull requests build both images and execute Cypress and Playwright in parallel as Jobs on a disposable kind cluster. Both results are needed before comparison. Main can additionally publish Power BI rows and send failure alerts; green runs send only a Slack summary.

## 4. Migration method

Read [MODUS_OPERANDI.md](migration/MODUS_OPERANDI.md) for inventory, parallel authoring, dual-run validation, sign-off, and decommissioning.

## 5. Interview discussion points

Ask about preserving Gherkin intent, choosing locator contracts, isolating API tests with `request`, managing origin and tab boundaries, why Kubernetes Jobs fit run-to-completion work, and how pass-rate/duration/flakiness metrics support a defensible cutover.
