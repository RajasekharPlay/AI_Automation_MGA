import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('DASH_005 - Verify Navigation to My Tasks Zone', async ({ page, skye, mga }) => {

    await test.step('Step 1: Observe the navigation menu on the left/top of the page', async () => {
        const navigationMenu = page.locator('ul.sk-zones, nav.sk-navigation, [data-testid="sk-navigation"]');
        await navigationMenu.first().waitFor({ state: 'visible', timeout: 30000 });
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
        const activeTasksZone = page.locator('li#sk-zone-Tasks.sk-zone--selected, li#sk-zone-Tasks[class*="active"], li#sk-zone-Tasks[aria-selected="true"]');
        await expect(activeTasksZone).toBeVisible({ timeout: 10000 });
        
        const homeZone = page.locator('li#sk-zone-Home');
        const homeZoneClass = await homeZone.getAttribute('class');
        expect(homeZoneClass).not.toContain('selected');
    });
});