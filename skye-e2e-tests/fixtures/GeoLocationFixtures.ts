import { test as base } from '@playwright/test';

export const geolocationFixture = base.extend({
  context: async ({ browser, contextOptions }, use) => {
    const context = await browser.newContext({
      ...contextOptions,
      geolocation: { latitude: 47.1751, longitude: 18.9444 },
      permissions: ['geolocation']
    });
    await use(context);
    await context.close();
  }
});