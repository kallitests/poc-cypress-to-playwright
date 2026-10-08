# Code Walkthrough

## 1. Problem

This POC demonstrates a controlled Cypress-to-Playwright migration: intent remains in identical Gherkin while implementation, API isolation, browser contexts, parallelism, containers, and reporting move to the target stack.

## 2. Local run

Install Node 20+, then run `npm install`, `npm --prefix cypress-suite install`, and `npm --prefix playwright-suite install`. Run either suite with the root scripts. Set `BASE_URL`, `TEST_USER_EMAIL`, and `TEST_USER_PASSWORD` in the environment; secrets are never committed. Dockerfiles provide reproducible headless environments.

## 3. CI behavior

Pull requests run fast static checks (Gherkin parity, tooling unit tests, TypeScript, actionlint, hadolint, kubeconform, gitleaks), build and scan both images (Trivy + SBOM), then execute Cypress and Playwright in parallel as Kubernetes Jobs on a disposable kind cluster — Playwright sharded across the pods of an Indexed Job. Both results are needed before the parity gate compares them; an advisory AI triage classifies failures, and the result is posted as a sticky PR comment. Main additionally pushes Power BI rows and sends alerts (Slack summary when green, Slack + Discord + Gmail when red); a weekday nightly repeats each Playwright scenario three times to measure flakiness. Every run leaves an audit evidence bundle. Details: [docs/CI-PIPELINE.md](docs/CI-PIPELINE.md).

## 4. Migration method

Read [MODUS_OPERANDI.md](migration/MODUS_OPERANDI.md) for inventory, parallel authoring, dual-run validation, sign-off, and decommissioning.

## 5. Interview discussion points

Ask about preserving Gherkin intent, choosing locator contracts, isolating API tests with `request`, managing origin and tab boundaries, why Kubernetes Jobs fit run-to-completion work (and how an Indexed Job shards Playwright without a paid service), why the parity gate tolerates a scenario that fails in both suites, and how pass-rate/duration/flakiness metrics support a defensible cutover, and which guardrails keep the AI triage advisory rather than authoritative.
