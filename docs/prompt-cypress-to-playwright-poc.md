# Master Prompt — Cypress → Playwright Migration POC (copy-paste ready)

> **How to use this file**: copy everything inside the fenced block below and paste it as-is into an agentic coding tool (Claude Code, Cursor, GitHub Copilot Workspace, etc.). The prompt is self-contained and written so the agent builds the repository step by step, explains its own code, and documents the migration methodology as it goes.

---

## Why this prompt is structured this way

Before you paste it, here's the reasoning so you can adapt it if needed:

- **Target site**: `automationexercise.com` is a public QA practice site with both a UI (login, products, cart, checkout) and a documented REST API (`/api/productsList`, `/api/verifyLogin`, `/api/searchProduct`, etc.) — that's why it fits your requirement of testing both UI and API in the same POC.
- **Gherkin in English**: both Cypress and Playwright support Cucumber/Gherkin via plugins (`@badeball/cypress-cucumber-preprocessor` for Cypress, `playwright-bdd` for Playwright) — same `.feature` files can largely survive the migration, only the step-definition code changes.
- **Docker + K8s**: the test runner is containerized and executed as a Kubernetes `Job` — this mirrors how many companies actually run scheduled/on-demand test suites in production, and gives you a concrete K8s artifact for your portfolio.
- **Dual-run comparison**: the pipeline runs Cypress and Playwright side by side, not Playwright alone — this is your differentiator from a generic "learn Playwright" project, it's literally a documented migration.
- **Alerting + Power BI**: the pipeline doesn't just pass/fail, it notifies (Slack/Discord/Gmail) and feeds a real reporting pipeline — this is what makes it look like a production system, not a tutorial exercise.

---

## The prompt to paste

```
ROLE
You are a senior SDET / DevOps engineer. Build a complete, working proof-of-concept
repository that demonstrates a professional migration of an automated test suite
from Cypress to Playwright, fully containerized, orchestrated in CI/CD, deployed
as a Kubernetes Job, with alerting and BI reporting. Explain your own code as you
write it — do not just produce files silently.

TARGET APPLICATION UNDER TEST
https://automationexercise.com — a public QA practice e-commerce site with:
- UI flows: signup/login, product browsing & search, cart, checkout, contact form
- A documented REST API at https://automationexercise.com/api_list (productsList,
  brandsList, searchProduct, verifyLogin, createAccount, etc.)

===========================================================
PHASE 0 — REPOSITORY STRUCTURE
===========================================================
Create this structure and explain in the root README.md what each top-level
folder is for before writing any test code:

/cypress-suite/            # the ORIGINAL suite (baseline, to be migrated away from)
  /cypress/e2e/features/   # .feature Gherkin files (UI + API)
  /cypress/support/step_definitions/
  cypress.config.js
/playwright-suite/         # the TARGET suite (migration destination)
  /tests/features/         # same .feature files, reused as-is where possible
  /tests/steps/
  playwright.config.ts
/migration/                # migration documentation (see PHASE 3)
  MIGRATION_GUIDE.md
  MODUS_OPERANDI.md
  COVERAGE_COMPARISON.md
/docker/
  Dockerfile.cypress
  Dockerfile.playwright
/k8s/
  cypress-job.yaml
  playwright-job.yaml
  configmap-env.yaml
  secret-template.yaml
/.github/workflows/
  ci-dual-run.yml
/reporting/
  transform-results-to-powerbi.js
  powerbi-schema.md
/alerting/
  notify-slack.js
  notify-discord.js
  notify-gmail.js
README.md

===========================================================
PHASE 1 — CYPRESS BASELINE SUITE (the "before" state)
===========================================================
Install and configure Cypress with @badeball/cypress-cucumber-preprocessor so
Gherkin .feature files drive the tests.

Write these Gherkin feature files in English, under /cypress-suite/cypress/e2e/features/:

1. smoke_ui.feature
   - Scenario: Homepage loads successfully
   - Scenario: User can log in with valid credentials
   - Scenario: User can add a product to the cart

2. smoke_api.feature
   - Scenario: Products list API returns 200 and a non-empty list
   - Scenario: Login API returns a valid response for correct credentials

3. regression_ui.feature
   - Scenario: User cannot log in with invalid credentials
   - Scenario: Search returns relevant products for a valid keyword
   - Scenario: Search returns an empty state for a nonsense keyword
   - Scenario: Cart quantity updates correctly when increasing/decreasing items
   - Scenario: Checkout blocks submission when required fields are empty

4. regression_api.feature
   - Scenario: Products list API response includes required fields (id, name, price, brand)
   - Scenario: Search product API returns matching results for a keyword
   - Scenario: Invalid login API returns an appropriate error response
   - Scenario: Brands list API returns a non-empty list of brands

For EACH step definition file you write, add inline comments explaining:
- what the Cypress command does semantically (not just "clicks button" — explain
  WHY this selector strategy was chosen, e.g. data-qa attributes over CSS classes)
- how Cypress's retry-ability / automatic waiting affects this specific step

After Phase 1, output a short paragraph confirming all scenarios pass locally
and how you validated that (npx cypress run output summary).

===========================================================
PHASE 2 — PLAYWRIGHT TARGET SUITE (the "after" state)
===========================================================
Install and configure Playwright with playwright-bdd so the SAME .feature files
(copy them, do not rewrite the Gherkin text) drive Playwright tests instead.

Rewrite every step definition in Playwright/TypeScript. For each one, add an
inline comment block directly above the Cypress equivalent it replaces, in this
exact format:

  // MIGRATED FROM CYPRESS:
  // cy.get('[data-qa="login-button"]').click()
  // WHY THIS CHANGES IN PLAYWRIGHT:
  // Playwright's `page.getByTestId()` reads from the configured testIdAttribute
  // instead of a raw CSS attribute selector, which decouples the test from the
  // exact attribute name and matches Playwright's role/testid-first locator
  // philosophy (see MIGRATION_GUIDE.md, section "Locator strategy").
  await page.getByTestId('login-button').click();

Also implement, and explain in comments, at least one example of each of these
Playwright-specific capabilities that Cypress could not do the same way:
- Cross-origin navigation handling (Playwright drives the browser from outside
  via CDP, so multi-origin flows do not need a workaround like Cypress does)
- API testing via Playwright's built-in `request` fixture (no `cy.request` plugin
  needed) — use it for the regression_api.feature scenarios
- Parallel execution config (`playwright.config.ts` workers/shards) with an
  explanation of why this doesn't require Cypress Cloud (paid) to achieve

===========================================================
PHASE 3 — MIGRATION DOCUMENTATION (this is the deliverable that matters most)
===========================================================
Write /migration/MIGRATION_GUIDE.md containing:
- A table: Cypress command | Playwright equivalent | Why it changes
  (cover at minimum: cy.get, cy.contains, cy.intercept, cy.request, cy.wait,
  cy.should, custom commands, fixtures/cy.fixture)
- A section "Patterns that do NOT translate 1:1" explaining architectural
  differences (Cypress runs inside the browser event loop; Playwright drives
  it externally via CDP/WebSocket) and what that means practically for
  iframe handling, multi-tab flows, and network stubbing

Write /migration/MODUS_OPERANDI.md containing the STEP-BY-STEP METHODOLOGY
used for this migration, written so it could be handed to another engineer
doing a real migration at work. Structure it as:
1. Inventory phase — how the existing Cypress suite was audited (list of
   scenarios, tagged smoke vs regression, UI vs API)
2. Parallel authoring phase — why feature files were migrated as-is first,
   and step definitions rewritten second, rather than rewriting everything
   at once
3. Dual-run validation phase — why both suites run side by side in CI during
   transition (see Phase 4) instead of a hard cutover
4. Comparison & sign-off criteria — what metrics decide the suite is ready
   to fully cut over (pass rate parity, execution time, flakiness rate)
5. Decommissioning phase — how the Cypress suite is safely retired once
   Playwright reaches parity

Write /migration/COVERAGE_COMPARISON.md as a living table updated by the CI
pipeline (see Phase 5) comparing scenario count, pass rate, and average
execution time between the two suites.

===========================================================
PHASE 4 — DOCKERIZATION
===========================================================
Write /docker/Dockerfile.cypress and /docker/Dockerfile.playwright.
For each Dockerfile, add a comment above EVERY instruction explaining what it
does and why it's necessary for a headless browser test runner specifically
(e.g. why extra system libraries are needed for headless Chromium, why the
Playwright official base image already bundles browsers while Cypress's does not).

===========================================================
PHASE 5 — KUBERNETES DEPLOYMENT
===========================================================
Write K8s manifests under /k8s/ that run each suite as a Kubernetes Job
(not a Deployment — explain why a Job is the correct primitive for a
run-to-completion test suite versus a long-running Deployment).

Include:
- cypress-job.yaml and playwright-job.yaml (image, command, resource limits,
  restartPolicy: Never, backoffLimit)
- configmap-env.yaml for non-secret config (BASE_URL, TEST_ENV)
- secret-template.yaml (placeholder only, never real values) for API tokens
  used later by the alerting/reporting steps

Explain, in a comment block at the top of each YAML file, how this Job would
be triggered in a real cluster (CronJob for scheduled runs vs Job triggered
by a CI pipeline step via `kubectl apply` — use the second approach here and
explain the trade-off).

===========================================================
PHASE 6 — CI/CD: GITHUB ACTIONS DUAL-RUN PIPELINE
===========================================================
Write /.github/workflows/ci-dual-run.yml implementing this flow, with a
comment above each job/step explaining its purpose:

1. build-images: build both Docker images, tag with the commit SHA
2. run-cypress: run the Cypress suite as a Job against a local kind (Kubernetes
   in Docker) cluster spun up in the runner — explain why `kind` is used here
   instead of a real cluster (cost, speed, reproducibility for a POC)
3. run-playwright: same, for the Playwright suite, in parallel with step 2
4. compare-results: run reporting/transform-results-to-powerbi.js to merge
   both suites' JSON results into the comparison table format defined in
   COVERAGE_COMPARISON.md, and update that file via a commit or PR comment
5. push-to-powerbi: push the merged results to a Power BI streaming dataset
   (see Phase 7)
6. alert: on failure of run-cypress OR run-playwright, call all three
   alerting scripts (Slack, Discord, Gmail) — on success, send a lightweight
   Slack summary only (do not spam Discord/Gmail on green runs)

Explain the dependency graph between jobs (needs:) and why compare-results
must wait for both suites rather than running after either one individually.

===========================================================
PHASE 7 — ALERTING (Slack, Discord, Gmail)
===========================================================
Write three small Node.js scripts under /alerting/, each taking the test
result summary (pass/fail count, duration, failing scenario names) as input:

- notify-slack.js — posts to a Slack Incoming Webhook URL (from a GitHub
  Actions secret), formatted as a Slack Block Kit message with a red/green
  color bar depending on status
- notify-discord.js — posts to a Discord Webhook URL, formatted as a Discord
  embed with the same information
- notify-gmail.js — sends an email via Nodemailer using a Gmail App Password
  (explain in a comment why an App Password is required instead of the
  regular Gmail password, and that this is for POC/demo purposes — for a real
  production setup, recommend a transactional email service instead of a
  personal Gmail account)

For each script, explain in comments what payload structure the destination
expects and why failures should be batched into ONE message rather than one
message per failing scenario (to avoid alert fatigue).

===========================================================
PHASE 8 — POWER BI REPORTING
===========================================================
Write /reporting/transform-results-to-powerbi.js that:
- Parses the JSON test reports from both suites (Cypress's mochawesome/JSON
  reporter output and Playwright's built-in JSON reporter output)
- Normalizes them into one common schema (explain the schema design decision:
  one row per scenario, with fields: suite, scenario_name, tags [smoke/
  regression, ui/api], status, duration_ms, run_timestamp, commit_sha)
- Pushes rows to a Power BI Streaming Dataset via its REST API (POST request
  with the rows as JSON), explaining how the endpoint URL and dataset schema
  are provisioned once manually in the Power BI service, then reused
  programmatically here

Write /reporting/powerbi-schema.md documenting:
- The exact streaming dataset schema (field names and types) to create in
  Power BI before running the pipeline
- A description of the recommended DASHBOARD layout for a "pro" look:
  - Tile 1: Pass rate over time (line chart, one line per suite — Cypress vs
    Playwright) to visually track migration parity
  - Tile 2: Migration progress donut chart (% of scenarios migrated vs total)
  - Tile 3: Average execution time comparison (bar chart, Cypress vs Playwright,
    per tag: smoke/regression)
  - Tile 4: Flaky test table (scenarios with inconsistent pass/fail across the
    last N runs) with conditional formatting
  - Tile 5: Latest run status card (big pass/fail number, refreshed live from
    the streaming dataset)
- A short note on why a STREAMING dataset (not an imported one) is the right
  choice here: it allows the dashboard tiles to update in near-real-time as
  CI pipeline runs push new rows, without manual refresh

===========================================================
PHASE 9 — FINAL DELIVERABLE CHECK
===========================================================
Once everything above is built, produce a final CODE_WALKTHROUGH.md at the
repo root that a reviewer (e.g. a hiring manager) could read top-to-bottom
in 10 minutes to understand:
1. What problem this POC solves (Cypress → Playwright migration, demonstrated
   end-to-end, not just described)
2. How to run it locally (docker compose or manual steps)
3. How the CI pipeline behaves on a pull request vs on main
4. Where to look for the migration methodology (link to MODUS_OPERANDI.md)
5. What a recruiter/interviewer should ask you about, based on the hardest
   design decisions made in this repo

Do not skip PHASE 9 — it is the piece that turns this from "a folder of code"
into "a portfolio artifact that tells a story in an interview."
```

---

## What to check once the agent finishes

| Check | Why it matters |
|---|---|
| Every Gherkin scenario in Cypress has a matching one in Playwright with identical wording | Proves the migration preserved test *intent*, not just *syntax* |
| `MIGRATION_GUIDE.md` table is filled with real command mappings, not placeholders | This table is your interview cheat-sheet — know it by heart |
| The GitHub Actions workflow actually runs on a `kind` cluster, not just `docker run` | This is what makes the K8s claim on your CV true, not decorative |
| Alerting scripts use secrets (GitHub Actions `secrets.*`), never hardcoded webhook URLs | Basic security hygiene — a recruiter checking your repo will notice hardcoded secrets immediately |
| Power BI schema doc exists even if you don't have a live Power BI account to test against | You can still walk an interviewer through the design without a live dashboard |

## Suggested order to actually execute this

Don't ask the agent to do all 9 phases in one shot — you'll get a shallow result. Run the prompt phase by phase (paste PHASE 0-1, review, then PHASE 2, review, etc.). This also mirrors the MODUS_OPERANDI.md methodology you're documenting: incremental, validated steps — not a big-bang rewrite.
