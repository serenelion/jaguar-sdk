import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'retain-on-failure',
  },
  timeout: 120 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  projects: [
    {
      name: 'e2e',
      testMatch: /e2e\/.*.test.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  // No webServer configuration - use existing server
});