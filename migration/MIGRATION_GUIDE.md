# Migration Guide

## Command mapping

| Cypress command | Playwright equivalent | Why it changes |
|---|---|---|
| `cy.get(selector)` | `page.getByRole()` / `page.getByTestId()` | Locators are strict, web-first, and auto-wait for actionability. |
| `cy.contains(text)` | `page.getByText(text)` | The locator API makes intent explicit and supports strictness. |
| `cy.intercept()` | `page.route()` / `context.route()` | Routing is attached to a page or context and can await the request lifecycle. |
| `cy.request()` | `request.get()` / `request.post()` fixture | The isolated API fixture needs no browser command/plugin and is parallel-safe. |
| `cy.wait()` | `expect(locator).toBeVisible()` / `page.waitForResponse()` | Wait on a condition or named response, never an arbitrary delay. |
| `cy.should()` | `expect(locator).toHaveText()` / `toBeVisible()` | Assertions are web-first and retry until timeout. |
| custom commands | typed fixtures/helpers | Composition stays explicit and is reusable across browser contexts. |
| `cy.fixture()` | `testInfo` attachments, Node imports, or fixtures | Data setup is ordinary TypeScript and can be scoped per test. |

## Locator strategy

Prefer accessible roles and labels, then `data-qa` test ids. Playwright is configured with `testIdAttribute: 'data-qa'`, so `getByTestId('login-button')` expresses the contract without coupling the test to CSS. Keep fallback CSS selectors limited to legacy controls with no accessible hook.

## Patterns that do not translate 1:1

Cypress executes commands through its browser-side event loop and serializes command chains. Playwright drives the browser externally through its protocol connection, so each test owns explicit pages, contexts, and API clients.

- **Iframes:** use `frameLocator()` or a resolved `Frame`; do not rely on Cypress's command queue finding the frame implicitly.
- **Multi-tab flows:** capture `context.waitForEvent('page')` and assert the new page directly. There is no single Cypress subject representing every tab.
- **Network stubbing:** use `page.route()` for browser traffic and `context.route()` for all pages. API fixture calls are real HTTP calls unless explicitly mocked.
- **Origins:** create a context/page for the second origin and coordinate it in the test; Playwright does not impose Cypress's single-origin command restriction.

## Validation

Run both suites against the same `BASE_URL`, persist JSON reports, compare scenario status and duration, and investigate any parity difference before cutover.
