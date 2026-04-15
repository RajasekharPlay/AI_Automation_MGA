import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_001 - Validate Dashboard Header Loads', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    await test.step('Step 1: Open Dashboard page and observe header', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        // Verify main container is loaded
        await expect(page.locator('#sk-app')).toBeVisible();
        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);

        // Verify header menu items are visible
        await expect(page.locator('nav, .sk-navigation, [data-testid*="nav"], .header-menu').first()).toBeVisible();

        // Verify logo is visible
        await expect(page.locator('img[alt*="logo"], .logo, [data-testid*="logo"]').first()).toBeVisible();

        // Verify language dropdown is visible
        await expect(page.locator('select[data-testid*="language"], .language-selector, [data-testid*="lang"]').first()).toBeVisible();
    });
});