import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('DASH_002 - Validate Welcome Message', async ({ page, skye, mga }) => {

    await test.step('Step 1: Navigate to the application and check Dashboard title and welcome text', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        // Wait for the page to fully load
        await page.waitForLoadState('load');

        // Verify the Dashboard heading is displayed - using more flexible selector
        const dashboardHeading = page.getByRole('heading', { name: /Dashboard/i });
        await expect(dashboardHeading).toBeVisible({ timeout: 15000 });

        // Verify the Welcome message is displayed
        const welcomeMessage = page.locator('text=/Welcome/i');
        await expect(welcomeMessage.first()).toBeVisible({ timeout: 15000 });

        // Verify the HTML/JS attribute container is visible
        const htmlJsAttribute = page.getByTestId('sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute');
        await expect(htmlJsAttribute).toBeVisible({ timeout: 15000 });
    });
});