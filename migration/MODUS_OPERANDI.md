# Modus Operandi

## 1. Inventory phase

Audit the Cypress feature directory and catalog every scenario by intent, runner surface, and tag: smoke or regression, UI or API. Record selectors, fixtures, custom commands, network stubs, and data dependencies. This POC has 3 smoke UI, 2 smoke API, 5 regression UI, and 4 regression API scenarios.

## 2. Parallel authoring phase

Copy feature files as-is first. Gherkin is the behavioral contract, so preserving wording makes parity review mechanical and isolates framework changes to step definitions. Rewrite one vertical slice at a time, keeping the Cypress baseline runnable while Playwright steps are added.

## 3. Dual-run validation phase

CI runs both suites side by side on a reproducible kind cluster. A temporary mismatch is visible rather than hidden by a hard cutover; artifacts allow failures to be diagnosed against the same commit and environment.

## 4. Comparison and sign-off criteria

Require scenario pass-rate parity, no unexplained status differences, lower or equal median duration, and a measured flakiness rate over repeated runs. Review API contract assertions and representative UI paths, not only aggregate green status.

## 5. Decommissioning phase

Freeze new Cypress scenarios, keep a final dual-run window, archive its reports and configuration, remove Cypress dependencies from the default pipeline, and retain the migration record. Roll back by restoring the last known Cypress job if parity regresses.
