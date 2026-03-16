import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('DASH_002 - Validate Welcome Message', async ({ page, skye, mga }) => {

    await test.step('Step 1: Navigate to the application and check Dashboard title and welcome text', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        // Verify the Dashboard heading is displayed
        const dashboardHeading = page.locator('h1', { hasText: 'Dashboard' });
        await expect(dashboardHeading).toBeVisible();

        // Verify the Welcome message is displayed with username
        const welcomeMessage = page.locator('h3');
        await expect(welcomeMessage).toBeVisible();
        await expect(welcomeMessage).toContainText('Welcome');

        // Verify the HTML/JS attribute container is visible
        await expect(page.getByTestId('sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute')).toBeVisible();
    });
});