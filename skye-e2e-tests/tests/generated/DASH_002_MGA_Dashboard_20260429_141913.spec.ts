import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_002 - Validate Welcome Message on Dashboard', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    const selectors = {
        rootElement: '#sk-app',
        customerPortalSection: '#sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute',
        heading: 'h1',
        subHeading: 'h3'
    };

    const expectedText = {
        dashboardTitle: 'Dashboard',
        welcomeMessage: 'Welcome'
    };

    await test.step('Step 1 & 2: Navigate to the application URL and wait for page to load', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(selectors.rootElement, { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 3: Locate the Customer Portal HTML section', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        await customerPortalSection.waitFor({ state: 'visible', timeout: 30000 });
        await expect(customerPortalSection).toBeVisible();
    });

    await test.step('Step 4 & 5: Verify Dashboard heading is visible and has correct text', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        const dashboardHeading = customerPortalSection.locator(selectors.heading);
        
        await expect(dashboardHeading).toBeVisible();
        await expect(dashboardHeading).toHaveText(expectedText.dashboardTitle);
    });

    await test.step('Step 6 & 7: Verify Welcome message is visible and contains expected text', async () => {
        const customerPortalSection = page.locator(selectors.customerPortalSection);
        const welcomeSubHeading = customerPortalSection.locator(selectors.subHeading);
        
        await expect(welcomeSubHeading).toBeVisible();
        
        const welcomeText = await welcomeSubHeading.innerText();
        expect(welcomeText).toContain(expectedText.welcomeMessage);
    });
});