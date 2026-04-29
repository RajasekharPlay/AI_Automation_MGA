import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_003 - Validate Dashboard Navigation Menu Structure', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    await test.step('Step 1: Navigate to the application URL and wait for the navigation element', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-nav', { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 2: Verify the navigation menu element #sk-nav is visible on the page', async () => {
        await expect(page.locator('#sk-nav')).toBeVisible();
    });

    await test.step('Step 3: Verify Home zone item is attached and has correct text', async () => {
        const homeZone = page.locator('li#sk-zone-HomeZone');
        await expect(homeZone).toBeAttached();
        const homeZoneText = homeZone.locator('.sk-zone-text');
        await expect(homeZoneText).toHaveText('Home');
    });

    await test.step('Step 4: Verify Tasks zone item is attached and has correct text', async () => {
        const tasksZone = page.locator('li#sk-zone-Tasks');
        await expect(tasksZone).toBeAttached();
        const tasksZoneText = tasksZone.locator('.sk-zone-text');
        await expect(tasksZoneText).toHaveText('My Tasks');
    });

    await test.step('Step 5: Verify Reporting/My Zone item is attached to the DOM', async () => {
        const myZone = page.locator('li#sk-zone-MyZone');
        await expect(myZone).toBeAttached();
    });

    await test.step('Step 6: Verify Products zone item is attached and has correct text', async () => {
        const productsZone = page.locator('li#sk-zone-Products');
        await expect(productsZone).toBeAttached();
        const productsZoneText = productsZone.locator('.sk-zone-text');
        await expect(productsZoneText).toHaveText('Products');
    });

    await test.step('Step 7: Verify Process zone item is attached and has correct text', async () => {
        const processZone = page.locator('li#sk-zone-ProcessZone');
        await expect(processZone).toBeAttached();
        const processZoneText = processZone.locator('.sk-zone-text');
        await expect(processZoneText).toHaveText('Process');
    });

    await test.step('Step 8: Verify currently active navigation item is visible', async () => {
        const activeZone = page.locator('.sk-nav-zones-item.sk-zone--active');
        await expect(activeZone).toBeVisible();
    });

    await test.step('Step 9: Verify the active zone element id equals sk-zone-HomeZone', async () => {
        const activeZone = page.locator('.sk-nav-zones-item.sk-zone--active');
        const activeZoneId = await activeZone.getAttribute('id');
        expect(activeZoneId).toBe('sk-zone-HomeZone');
    });
});