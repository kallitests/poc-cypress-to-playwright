# Power BI Streaming Schema

Create a streaming dataset with these exact columns:

| Field | Type | Meaning |
|---|---|---|
| `suite` | Text | `cypress` or `playwright` |
| `scenario_name` | Text | One Gherkin scenario per row |
| `tags` | Text | Comma-separated `smoke,ui`, `regression,api`, etc. |
| `status` | Text | passed, failed, skipped, or unknown |
| `duration_ms` | Number | Scenario duration in milliseconds |
| `run_timestamp` | DateTime | ISO-8601 execution time |
| `commit_sha` | Text | Source revision |

## Dashboard layout

1. **Pass rate over time:** line chart with one line per suite.
2. **Migration progress:** donut showing migrated scenarios versus total inventory.
3. **Average execution time:** grouped bar chart by suite and smoke/regression tag.
4. **Flaky tests:** table of scenarios with inconsistent status over the last N runs, with conditional formatting.
5. **Latest run status:** large pass/fail card refreshed from the streaming dataset.

A streaming dataset is appropriate because CI can push rows immediately and update tiles near real time without an import refresh cycle. The push URL is provisioned manually in Power BI and supplied through `POWERBI_PUSH_URL`.
