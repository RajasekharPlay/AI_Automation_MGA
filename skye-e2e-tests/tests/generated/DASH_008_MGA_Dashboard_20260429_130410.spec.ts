import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_008 - Verify Dashboard Page Load Performance', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);
    let startTime: number;
    let endTime: number;
    let loadTime: number;

    await test.step('Step 1: Start a timer immediately before navigating to the application URL', async () => {
        startTime = Date.now();
        expect(startTime).toBeGreaterThan(0);
    });

    await test.step('Step 2: Navigate to the application URL and wait for #sk-app to be visible', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        
        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);
    });

    await test.step('Step 3: Stop the timer when the statistics cards section becomes visible', async () => {
        await page.waitForSelector('.sk-statistics-cards, [data-testid*="statistics"], .dashboard-cards, .sk-card', { state: 'visible', timeout: 30000 });
        
        endTime = Date.now();
        loadTime = endTime - startTime;
        
        console.log(`Dashboard load time: ${loadTime}ms`);
        
        expect(loadTime).toBeGreaterThan(0);
        expect(loadTime).toBeLessThan(30000);
    });
});