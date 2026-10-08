# Coverage Comparison

The live version of this table is generated on every CI run by `reporting/parity-report.js`: it is posted as a sticky comment on each pull request, written to the GitHub job summary, and archived in the `parity-report` artifact (90 days). The rows below are the static baseline.

| Run timestamp | Suite | Scenario count | Passed | Failed | Pass rate | Average duration (ms) |
|---|---|---:|---:|---:|---:|---:|
| baseline | Cypress | 14 | n/a | n/a | n/a | n/a |
| baseline | Playwright | 14 | n/a | n/a | n/a | n/a |

The parity gate (`parity-gate` job) enforces the sign-off criteria of [MODUS_OPERANDI.md](MODUS_OPERANDI.md): both reports present, identical scenario inventory, no scenario green in Cypress but red in Playwright, Playwright pass rate ≥ Cypress pass rate, and optionally a maximum number of flaky scenarios (`GATE_MAX_FLAKY` repository variable).

The target is equal scenario count and unexplained pass-rate delta of zero; duration and flakiness are evaluated over several runs rather than one sample.
