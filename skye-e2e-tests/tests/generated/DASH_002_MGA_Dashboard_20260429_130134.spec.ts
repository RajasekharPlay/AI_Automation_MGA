import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_002 - Validate Welcome Message on Dashboard', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    await test.step('Step 1: Navigate to the application URL', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
    });

    await test.step('Step 2: Wait for the root element #sk-app to become visible', async () => {
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);
    });

    await test.step('Step 3: Locate the Customer Portal HTML section', async () => {
        const customerPortalSection = page.locator('#sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute');
        await customerPortalSection.waitFor({ state: 'visible', timeout: 30000 });
        await expect(customerPortalSection).toBeVisible();
    });

    await test.step('Step 4: Verify the h1 element is visible within Customer Portal section', async () => {
        const customerPortalSection = page.locator('#sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute');
        const h1Element = customerPortalSection.locator('h1');
        await expect(h1Element).toBeVisible();
    });

    await test.step('Step 5: Verify the h1 text content equals "Dashboard"', async () => {
        const customerPortalSection = page.locator('#sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute');
        const h1Element = customerPortalSection.locator('h1');
        await expect(h1Element).toHaveText('Dashboard');
    });

    await test.step('Step 6: Verify the h3 element is visible within Customer Portal section', async () => {
        const customerPortalSection = page.locator('#sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute');
        const h3Element = customerPortalSection.locator('h3');
        await expect(h3Element).toBeVisible();
    });

    await test.step('Step 7: Verify the h3 text contains "Welcome"', async () => {
        const customerPortalSection = page.locator('#sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute');
        const h3Element = customerPortalSection.locator('h3');
        const h3Text = await h3Element.innerText();
        expect(h3Text).toContain('Welcome');
    });
});