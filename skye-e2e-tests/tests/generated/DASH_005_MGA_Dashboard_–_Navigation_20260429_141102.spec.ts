import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('DASH_005 - Verify Navigation to My Tasks Zone', async ({ page, skye, mga }) => {

    await test.step('Step 1: Observe the navigation menu on the left/top of the page', async () => {
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        
        const navigationMenu = page.locator('ul.sk-zones, nav.sk-navigation, #sk-zones');
        await expect(navigationMenu.first()).toBeVisible();
        
        const homeZone = page.locator('li#sk-zone-Home');
        await expect(homeZone).toBeVisible();
        
        const tasksZone = page.locator('li#sk-zone-Tasks');
        await expect(tasksZone).toBeVisible();
    });

    await test.step('Step 2: Click on the My Tasks navigation item', async () => {
        const tasksZone = page.locator('li#sk-zone-Tasks');
        await tasksZone.waitFor({ state: 'visible' });
        await tasksZone.click();
    });

    await test.step('Step 3: Verify the active zone is now My Tasks', async () => {
        const activeTasksZone = page.locator('li#sk-zone-Tasks.sk-zone--selected, li#sk-zone-Tasks.active, li#sk-zone-Tasks[aria-selected="true"]');
        await expect(activeTasksZone.first()).toBeVisible({ timeout: 10000 });
        
        const homeZone = page.locator('li#sk-zone-Home');
        const homeIsActive = await homeZone.evaluate(el => 
            el.classList.contains('sk-zone--selected') || 
            el.classList.contains('active') || 
            el.getAttribute('aria-selected') === 'true'
        );
        expect(homeIsActive).toBe(false);
    });
});