import { defineConfig, devices } from '@playwright/test';
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

export default defineConfig({

  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    ["@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,

        // Set your Argos token (required if not using GitHub Actions).
        token: "argos_cphfs39jd1srkxkjdoz1ershyz9hol5ewa",
      }),

    ],
    ['html']
  ],
  /** 
    reporter: [ ['json', {outputFile:'test-results/jsonReport.json'}],  
     ['junit', {outputFile:'test-results/junitsReport.json'}],
      ['allure-playwright'] ],
      **/

  use: {
    baseURL: 'http://localhost:4200/',
    trace: 'on-first-retry',
    video: 'on',
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
      }
      // viewport : {width:414, height :800} }
    },
  ],

  // tells Playwright to automatically start your application before tests run.
  // playwright will also. automatically stop the app server when the test is done.
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/'
  }
});