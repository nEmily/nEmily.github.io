const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  retries: 0,
  use: {
    baseURL: process.env.TEST_URL || 'http://localhost:8847',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'python -m http.server 8847 --directory docs',
    port: 8847,
    reuseExistingServer: true,
  },
});
