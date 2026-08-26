import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['tests/features/**/*.feature'],
  require: ['tests/steps/**/*.ts'],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  // Shards are independent by design, so CI can split the generated scenarios without Cypress Cloud.
  shard: process.env.PW_SHARD ? { current: Number(process.env.PW_SHARD.split('/')[0]), total: Number(process.env.PW_SHARD.split('/')[1]) } : undefined,
  reporter: [['list'], ['json', { outputFile: 'results/playwright.json' }]],
  use: { baseURL: process.env.BASE_URL || 'https://automationexercise.com', trace: 'retain-on-failure', screenshot: 'only-on-failure', testIdAttribute: 'data-qa' },
});
