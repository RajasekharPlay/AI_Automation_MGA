import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });



/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],  // Auto-close after report generation
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true, // All Skyetest pw_HOSTs have a self-signed certificate which is causing issue, without this value tests will throw Error: page.goto: net::ERR_CERT_AUTHORITY_INVALID
    permissions: ['geolocation']
  },
  timeout: 180000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup-auth',
      testMatch: ["**/setup/auth.setup.ts"],
      use: {
        baseURL: process.env.pw_HOST,
      },
      dependencies: [
        'setup-global'
      ],
    },
    {
      name: 'setup-api',
      testMatch: ["**/setup/api.setup.ts"],
      use: {
        baseURL: process.env.pw_HOST,
      }
    },
    {
      name: 'setup-global',
      testMatch: ["**/setup/global.setup.ts"],
      use: {
        baseURL: process.env.pw_HOST,
      }
    },
    
/*     {
      name: 'chromium-auth',
      testMatch: /.*private.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/storeStateFile.json',
        screenshot: { mode: 'on', fullPage: true }
      },
      dependencies: [
        'setup-auth',
        'setup-global'
      ],
    },

    {
      name: 'firefox-auth',
      testMatch: /.*private.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/storeStateFile.json',
        screenshot: { mode: 'on', fullPage: true }
      },
      dependencies: [
        'setup-auth',
        'setup-global'
      ],
    }, */
   
    {
      name: 'webkit-auth',
      testMatch: /.*private.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/storeStateFile.json',
        screenshot: { mode: 'on', fullPage: true }
      },
      dependencies: [
        'setup-auth',
        'setup-global'
      ],
    },

    {
      name: 'chromium-no-auth',
      testMatch: /.*public.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Chrome'],
        screenshot: { mode: 'on', fullPage: true }
      },
      dependencies: [
        'setup-global'
      ],
    },


    {
      name: 'firefox-no-auth',
      testMatch: /.*public.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Firefox'],
        screenshot: { mode: 'on', fullPage: true }
      },
      dependencies: [
        'setup-global'
      ],
    },
    {
      name: 'api',
      testMatch: /.*api.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
      },
      dependencies: [
        'setup-api',
        'setup-global'
      ]
    },

    {
      name: 'webkit-no-auth',
      testMatch: /.*public.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Safari'],
        screenshot: { mode: 'on', fullPage: true }
      },
      dependencies: [
        'setup-global'
      ],
    },

    // {
    //   name: 'webkit - playground',
    //   testMatch: /.*playground.spec.ts/,
    //   use: {
    //     baseURL: process.env.pw_HOST,
    //     ...devices['Desktop Chrome'],
    //     screenshot: { mode: 'on', fullPage: true },
    //     headless: false,
    //     bypassCSP: true,
    //     launchOptions: {
    //       args: ['--disable-web-security'], // add this to disable cors
    //     }
    //   }
    // },
    // {
    //   name: 'manual-test-setup',
    //   testMatch: ["**/setup/manual-test.setup.ts"],
    //   use: {
    //     baseURL: process.env.pw_HOST,
    //   }
    // },
  ],

});