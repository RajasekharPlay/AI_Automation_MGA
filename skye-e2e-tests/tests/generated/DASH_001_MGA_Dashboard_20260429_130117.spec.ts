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

    await test.step('Step 3: Enter valid username in the Enter username field', async () => {
        await page.getByPlaceholder('Enter username').fill(process.env.pw_TESTUSER!);
    });

    await test.step('Step 4: Enter valid password in the Password here field', async () => {
        await page.getByPlaceholder('Password here').fill(process.env.pw_PASSWORD!);
    });

    await test.step('Step 5: Click the Log in button', async () => {
        await page.getByRole('button', { name: 'Log in' }).click();
    });

    await test.step('Verify: User is logged in and main page is loaded', async () => {
        await page.waitForURL('**/page/internal/**', { timeout: 30000 });
        await expect(page.locator('#sk-app')).toBeVisible();
        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);
    });
});