import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_002 - Validate Welcome Message on Dashboard', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    const selectors = {
        rootApp: '#sk-app',
        customerPortalSection: '#sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute',
    };

    const expectedContent = {
        dashboardTitle: 'Dashboard',
        welcomeText: 'Welcome',
    };

    await test.step('Step 1 & 2: Navigate to application and wait for page load', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(selectors.rootApp, { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 3: Locate the Customer Portal HTML section', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        await expect(customerPortalSection).toBeVisible({ timeout: 10000 });
    });

    await test.step('Step 4 & 5: Verify Dashboard heading is visible and has correct text', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        const dashboardHeading = customerPortalSection.locator('h1');
        
        await expect(dashboardHeading).toBeVisible();
        await expect(dashboardHeading).toHaveText(expectedContent.dashboardTitle);
    });

    await test.step('Step 6 & 7: Verify Welcome message is visible and contains expected text', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        const welcomeHeading = customerPortalSection.locator('h3');
        
        await expect(welcomeHeading).toBeVisible();
        const welcomeText = await welcomeHeading.innerText();
        expect(welcomeText).toContain(expectedContent.welcomeText);
    });
});