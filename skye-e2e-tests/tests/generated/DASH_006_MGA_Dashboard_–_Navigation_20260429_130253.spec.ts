import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_006 - Verify Navigation to Products Zone', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    await test.step('Step 1: Click on the Products navigation item', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        const productsNavItem = page.locator('li#sk-zone-Products');
        await productsNavItem.waitFor({ state: 'visible', timeout: 10000 });
        await productsNavItem.click();

        await expect(productsNavItem).toHaveClass(/sk-zone--selected|active/);
    });

    await test.step('Step 2: Verify the Products section header or content is displayed', async () => {
        const productsContent = page.locator('#sk-zone-Products-content, [data-zone="Products"]').first();
        await expect(productsContent).toBeVisible({ timeout: 10000 });
    });

    await test.step('Step 3: Navigate back to the Home zone', async () => {
        const homeNavItem = page.locator('li#sk-zone-Home');
        await homeNavItem.waitFor({ state: 'visible', timeout: 10000 });
        await homeNavItem.click();

        await expect(homeNavItem).toHaveClass(/sk-zone--selected|active/);
    });
});