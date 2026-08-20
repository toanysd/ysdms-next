import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: ['e2e/**/*.spec.ts', 'tests/e2e/**/*.spec.ts'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['json', { outputFile: 'results.json' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
//   webServer: {
//     command: 'npm.cmd start',
//     url: 'http://localhost:3000',
//     reuseExistingServer: !process.env.CI,
//     timeout: 120 * 1000,
//   }
});
