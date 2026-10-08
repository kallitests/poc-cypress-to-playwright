import type { APIResponse } from '@playwright/test';
import { test as base } from 'playwright-bdd';

// Scenario-scoped context shared between Given/When/Then steps.
// playwright-bdd passes step parameters after the fixtures object, so state cannot travel
// through a second positional argument; a fixture gives every scenario a fresh, typed store.
export type ScenarioContext = { apiResponse?: APIResponse };

export const test = base.extend<{ ctx: ScenarioContext }>({
  ctx: async ({}, use) => {
    await use({});
  },
});
