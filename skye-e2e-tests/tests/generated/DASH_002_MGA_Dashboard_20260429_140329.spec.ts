import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_002 - Validate Welcome Message on Dashboard', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    const selectors = {
        rootApp: '#sk-app',
        customerPortalSection: '#sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute',
    };

    const expectedValues = {
        dashboardTitle: 'Dashboard',
        welcomeTextPattern: 'Welcome',
    };

    await test.step('Step 1 & 2: Navigate to the application URL and wait for root element', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(selectors.rootApp, { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 3: Locate the Customer Portal HTML section', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        await customerPortalSection.waitFor({ state: 'visible', timeout: 10000 });
        await expect(customerPortalSection).toBeVisible();
    });

    await test.step('Step 4 & 5: Verify Dashboard heading is visible with correct text', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        const dashboardHeading = customerPortalSection.locator('h1');
        
        await expect(dashboardHeading).toBeVisible();
        await expect(dashboardHeading).toHaveText(expectedValues.dashboardTitle);
    });

    await test.step('Step 6 & 7: Verify Welcome message is visible and contains expected text', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        const welcomeMessage = customerPortalSection.locator('h3');
        
        await expect(welcomeMessage).toBeVisible();
        
        const welcomeText = await welcomeMessage.innerText();
        expect(welcomeText).toContain(expectedValues.welcomeTextPattern);
    });
});