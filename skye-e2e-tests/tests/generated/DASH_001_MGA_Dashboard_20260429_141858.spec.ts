import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import MainPage from '../../pages/MainPage';

test('DASH_001 - Verify Application Login and Initial Page Load', async ({ page, skye, mga }) => {

    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);

    await test.step('Step 1 & 2: Open browser and navigate to the application URL', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[placeholder="Enter username"]', { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 3, 4 & 5: Enter valid credentials and click Log in', async () => {
        await loginPage.login(process.env.pw_TESTUSER!, process.env.pw_PASSWORD!);
    });

    await test.step('Verify: User is logged in and dashboard is loaded', async () => {
        await page.waitForURL('**/page/internal/**', { timeout: 30000 });
        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);
    });
});