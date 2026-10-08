# CI/CD pipeline — how the dual run is gated

Two workflows live in `.github/workflows/`:

| Workflow | Purpose | Triggers |
|---|---|---|
| `ci-dual-run.yml` | Runs Cypress (baseline) and Playwright (target) on Kubernetes, compares them, and gates the migration | PR, push to `main`, weekdays 02:30 UTC, manual |
| `agent-eval.yml` | Tests the LangGraph agent harness (`agents/test-agent`) with the AI test pyramid | PR/push touching `agents/**`, weekdays 03:00 UTC, manual |

## `ci-dual-run.yml` at a glance

```
static-checks ──▶ build-images (cypress | playwright) ──▶ run-suite (cypress | playwright, on kind)
                                                                   │
                                                                   ▼
                                                             parity-gate ──▶ push-to-powerbi  (main)
                                                                   │     ──▶ alert            (main, nightly)
                                                                   └────▶ evidence          (always)
```

| Job | What it does | Why |
|---|---|---|
| **static-checks** | Gherkin parity (`diff` of both feature folders) · unit tests of the CI tooling · `tsc --noEmit` + `bddgen` + scenario count check · actionlint/shellcheck · hadolint · kubeconform · gitleaks | Fails in ~2 min on cheap problems before spending browser minutes. The gate's own code is tested before it judges anything. |
| **build-images** | Builds each runner image once with a commit-SHA tag, Trivy scan (HIGH/CRITICAL, report-only), CycloneDX SBOM, warms the BuildKit GHA cache | Supply-chain visibility (DevSecOps); later jobs rebuild from cache in seconds instead of moving multi-GB tarballs |
| **run-suite** | Matrix (`fail-fast: false`): creates a kind cluster, loads the image, applies ConfigMap/Secret, runs the suite as a **Kubernetes Job** and waits on its Complete/Failed condition (`ci/wait-for-job.sh`) | Real K8s semantics: the Job's verdict *is* the test verdict. One suite failing never hides the other. |
| ↳ Playwright | **Indexed Job** with `PW_SHARDS` pods (`completionMode: Indexed`, `backoffLimitPerIndex: 0`); each pod runs shard `JOB_COMPLETION_INDEX+1/N`, writes a blob report; the runner merges them into one HTML report (with traces) and one JSON | Parallelism from the cluster itself — no paid orchestration service, unlike Cypress Cloud |
| **parity-gate** | Normalizes both reports into one row per scenario, evaluates the sign-off criteria, runs the **AI failure triage**, posts a sticky PR comment and the job summary, then enforces the gate | Turns MODUS_OPERANDI §4 into an executable, reviewable decision |
| **push-to-powerbi** | Pushes the normalized rows to the Power BI streaming dataset | Trend of pass rate / duration / flakiness per suite over time |
| **alert** | Slack summary on every main/nightly run; Discord + Gmail only when red; one batched message per run | Signal without alert fatigue |
| **evidence** | Bundles commit SHA, image IDs, SBOMs, Trivy reports, parity report, `manifest.json` and `SHA256SUMS` (90-day retention) | Audit trail habit from regulated contexts (ISO 13485 / IEC 62304): what was tested, with what, and with which result |

## Parity gate (sign-off criteria)

Implemented in `reporting/parity-report.js`, unit-tested in `reporting/test/tooling.test.js`.

| Check | Fails when |
|---|---|
| Both suites produced a report | One suite produced no parsable report (infrastructure failure) |
| Same scenario inventory | A Cypress scenario has no Playwright counterpart |
| No migration regression | A scenario is green in Cypress and red in Playwright |
| Pass-rate parity | Playwright pass rate < Cypress pass rate |
| Flakiness budget (optional) | More Playwright `flaky` scenarios than the `GATE_MAX_FLAKY` repository variable (disabled by default) |

A scenario failing in **both** suites does not fail the gate (it is a product, data or environment problem, not a migration problem) — but it still makes `run-suite` red and triggers alerts.

`flaky` = passed on retry (both suites run with 1 retry in CI) or mixed results across nightly repeats (`PW_REPEAT_EACH=3`).

## AI-augmented triage (advisory)

`ai/triage-failures.js` sends **only** the failing/flaky scenario names, their status in both suites and truncated error messages to Claude, and asks for one category per failure: `PRODUCT_BUG`, `TEST_BUG`, `MIGRATION_GAP`, `FLAKY`, `ENVIRONMENT`, `TEST_DATA`, with confidence, evidence and next action.

Guardrails: temperature 0 · JSON output validated against the allowed categories and failure ids · never changes the gate verdict · skipped when `ANTHROPIC_API_KEY` is absent (forks, local) · any API error is a warning, not a failure. The cross-suite signal is the key input: red in both → app/env/data; red only in Playwright → migration gap.

## Configuration

| Name | Kind | Used by | Required |
|---|---|---|---|
| `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` | Secret | Login scenarios (injected as a K8s Secret into the test pods only) | For login scenarios |
| `ANTHROPIC_API_KEY` | Secret | AI triage, agent integration/eval tests | Optional |
| `LANGSMITH_API_KEY` | Secret | Agent eval tests | Optional |
| `SLACK_WEBHOOK_URL`, `DISCORD_WEBHOOK_URL` | Secret | Alerting | Optional |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `ALERT_TO` | Secret | Alerting | Optional |
| `POWERBI_PUSH_URL` | Secret | Power BI push | Optional |
| `TRIAGE_MODEL` | Variable | AI triage model (default `claude-sonnet-5-5`) | Optional |
| `GATE_MAX_FLAKY` | Variable | Flakiness budget (`-1` = disabled) | Optional |

Every integration skips cleanly when its secret is missing, so a fork or a fresh clone gets a green static pipeline without any account.

Manual run (`Actions → dual-run-migration → Run workflow`): `base_url` to target another environment, `repeat_each` for flake hunting, `playwright_shards` to change the number of pods.

## Artifacts

| Artifact | Content | Retention |
|---|---|---|
| `results-cypress` / `results-playwright` | Raw mochawesome JSON + screenshots / merged Playwright JSON | 14 days |
| `playwright-html-report` | Merged HTML report with traces (`npx playwright show-report <folder>`) | 14 days |
| `security-<suite>` | Trivy report, CycloneDX SBOM, image ID | 90 days |
| `parity-report` | `comparison.json`, `comparison-summary.json`, `comparison.md`, AI triage | 90 days |
| `evidence-<sha>` | Everything above that proves the run, plus `manifest.json` and `SHA256SUMS` | 90 days |

## Run the tooling locally

```bash
npm ci && npm run test:tooling                         # unit tests of normalizer / gate / triage parser
CYPRESS_REPORT=cypress-suite/results/mochawesome PLAYWRIGHT_REPORT=playwright-suite/results \
  OUTPUT_FILE=comparison.json npm run report           # normalize local reports
GATE_ENFORCE=false npm run compare                     # writes comparison.md
```

## Hardening left for a production setup

- Pin third-party actions by commit SHA (Dependabot keeps them updated) and the scanner images by digest.
- Make Trivy blocking (`--exit-code 1`) once base-image CVEs are triaged.
- Replace the kind `hostPath` results volume with object storage (S3/Blob) on a real cluster.
- Run against a controlled environment (`base_url`) rather than the public demo site, whose availability and data are not under our control.
