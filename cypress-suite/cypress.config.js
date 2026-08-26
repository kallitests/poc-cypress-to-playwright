const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://automationexercise.com',
    specPattern: 'cypress/e2e/features/**/*.feature',
    video: false,
    reporter: 'mochawesome',
    reporterOptions: { reportDir: 'results', overwrite: false, html: false, json: true },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      return config;
    }
  },
  env: { userEmail: process.env.TEST_USER_EMAIL, userPassword: process.env.TEST_USER_PASSWORD }
});
