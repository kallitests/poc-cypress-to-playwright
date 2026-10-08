import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['tests/features/**/*.feature'],
  require: ['tests/steps/**/*.ts'],
});

const isCI = !!process.env.CI;

// PW_SHARD="1/2" lets CI split the generated scenarios across independent workers
// (here: the pods of a Kubernetes Indexed Job) without any paid orchestration service.
const shard = process.env.PW_SHARD
  ? { current: Number(process.env.PW_SHARD.split('/')[0]), total: Number(process.env.PW_SHARD.split('/')[1]) }
  : undefined;

// Shards may run concurrently on the same volume (Kubernetes Indexed Job): Playwright cleans its output
// folders at start-up, so every shard gets its own folders to avoid deleting a sibling's artefacts.
const shardId = shard ? `shard-${shard.current}` : 'shard-1';

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: isCI,
  // One retry in CI: a test that passes on retry is reported as "flaky" instead of hiding instability.
  retries: isCI ? 1 : 0,
  // Nightly flake hunting sets PW_REPEAT_EACH>1 to run every scenario several times.
  repeatEach: Number(process.env.PW_REPEAT_EACH || 1),
  workers: isCI ? 2 : undefined,
  shard,
  // In CI each shard writes a blob report; the pipeline merges them into one HTML + one JSON report.
  reporter: isCI
    ? [['list'], ['blob', { outputDir: `results/blob/${shardId}` }], ['json', { outputFile: `results/json/playwright-${shardId}.json` }]]
    : [['list'], ['json', { outputFile: 'results/playwright.json' }], ['html', { open: 'never', outputFolder: 'results/html' }]],
  outputDir: isCI ? `results/test-results/${shardId}` : 'results/test-results',
  use: {
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    trace: isCI ? 'retain-on-first-failure' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-qa',
  },
});
