import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_005 - Verify Navigation to My Tasks Zone', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    await test.step('Step 1: Observe the navigation menu on the left/top of the page', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        
        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);
        
        const navigationMenu = page.locator('ul.sk-zones, nav, #sk-zones');
        await expect(navigationMenu.first()).toBeVisible();
    });

    await test.step('Step 2: Click on the My Tasks navigation item', async () => {
        const myTasksNavItem = page.locator('li#sk-zone-Tasks');
        await myTasksNavItem.waitFor({ state: 'visible', timeout: 10000 });
        await expect(myTasksNavItem).toBeVisible();
        await myTasksNavItem.click();
    });

    await test.step('Step 3: Verify the active zone is now My Tasks', async () => {
        const activeMyTasksZone = page.locator('li#sk-zone-Tasks.sk-zone--selected, li#sk-zone-Tasks.active, li#sk-zone-Tasks[aria-selected="true"]');
        await expect(activeMyTasksZone.first()).toBeVisible({ timeout: 10000 });
        
        const homeZone = page.locator('li#sk-zone-Home.sk-zone--selected, li#sk-zone-Home.active');
        await expect(homeZone).toHaveCount(0);
    });
});