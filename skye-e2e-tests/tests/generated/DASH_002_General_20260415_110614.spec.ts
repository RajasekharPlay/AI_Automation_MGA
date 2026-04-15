import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_002 - Validate Welcome Message', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    await test.step('Step 1: Check Dashboard title and welcome text', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('sk-logout', { state: 'visible', timeout: 30000 });
        
        // Verify main container is loaded
        await expect(page.locator('#sk-app')).toBeVisible();
        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);
        
        // Verify welcome message with username is displayed
        const welcomeMessage = page.locator('sk-logout');
        await expect(welcomeMessage).toBeVisible();
        
        // Extract and verify username is present in welcome message
        const welcomeText = await welcomeMessage.innerText();
        expect(welcomeText).toMatch(/Welcome\s+\w+/i);
        
        // Verify dashboard title/heading is present
        await expect(page.locator('h1, h2, [data-testid="page-title"]').first()).toBeVisible();
    });
});