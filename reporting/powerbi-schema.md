# Power BI Streaming Schema

Create a streaming dataset with these exact columns:

| Field | Type | Meaning |
|---|---|---|
| `suite` | Text | `cypress` or `playwright` |
| `feature` | Text | Feature file stem (`smoke_ui`, `regression_api`, …) — join key with `scenario_name` |
| `scenario_name` | Text | One Gherkin scenario per row |
| `tags` | Text | Comma-separated `smoke,ui`, `regression,api`, etc. (derived from the feature file name) |
| `status` | Text | `passed`, `failed`, `flaky` (passed on retry or mixed across repeats), `skipped`, `unknown` |
| `executions` | Number | Executions aggregated in the row (>1 on nightly `--repeat-each` runs) |
| `duration_ms` | Number | Average scenario duration in milliseconds |
| `run_timestamp` | DateTime | ISO-8601 execution time |
| `commit_sha` | Text | Source revision |
| `branch` | Text | Git ref name |
| `run_id` | Text | GitHub Actions run id (drill-through to the workflow run) |

Rows are produced by `reporting/lib/normalize.js` (one row per scenario per suite per run) and pushed by the `push-to-powerbi` job on `main` only, in chunks of 500 rows.

## Dashboard layout

1. **Pass rate over time:** line chart with one line per suite.
2. **Migration progress:** donut showing migrated scenarios versus total inventory.
3. **Average execution time:** grouped bar chart by suite and smoke/regression tag.
4. **Flaky tests:** table of scenarios with `status = flaky` or inconsistent status over the last N runs (nightly runs use `PW_REPEAT_EACH=3`), with conditional formatting.
5. **Latest run status:** large pass/fail card refreshed from the streaming dataset.

A streaming dataset is appropriate because CI can push rows immediately and update tiles near real time without an import refresh cycle. The push URL is provisioned manually in Power BI and supplied through `POWERBI_PUSH_URL`.
