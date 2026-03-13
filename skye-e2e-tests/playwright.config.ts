import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
    permissions: ['geolocation'],
  },
  timeout: 180000,

  projects: [
    {
      name: 'setup-global',
      testMatch: ['**/setup/global.setup.ts'],
      use: {
        baseURL: process.env.pw_HOST,
      },
    },
    {
      name: 'setup-auth',
      testMatch: ['**/setup/auth.setup.ts'],
      use: {
        baseURL: process.env.pw_HOST,
      },
      dependencies: ['setup-global'],
    },
    {
      name: 'webkit-auth',
      testMatch: /.*private.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/storeStateFile.json',
        screenshot: { mode: 'on', fullPage: true },
      },
      dependencies: ['setup-auth', 'setup-global'],
    },
    {
      name: 'chromium-no-auth',
      testMatch: /.*public.spec.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Chrome'],
        screenshot: { mode: 'on', fullPage: true },
      },
      dependencies: ['setup-global'],
    },
    {
      name: 'mga-chromium',
      testMatch: /.*MGA.*\.spec\.ts/,
      use: {
        baseURL: process.env.pw_HOST,
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/storeStateFile.json',
        screenshot: { mode: 'on', fullPage: true },
      },
      dependencies: ['setup-auth', 'setup-global'],
    },
    // {
    //   name: 'firefox-no-auth',
    //   testMatch: /.*public.spec.ts/,
    //   use: {
    //     baseURL: process.env.pw_HOST,
    //     ...devices['Desktop Firefox'],
    //     screenshot: { mode: 'on', fullPage: true },
    //   },
    //   dependencies: ['setup-global'],
    // },
    // {
    //   name: 'webkit-no-auth',
    //   testMatch: /.*public.spec.ts/,
    //   use: {
    //     baseURL: process.env.pw_HOST,
    //     ...devices['Desktop Safari'],
    //     screenshot: { mode: 'on', fullPage: true },
    //   },
    //   dependencies: ['setup-global'],
    // },
  ],
});
