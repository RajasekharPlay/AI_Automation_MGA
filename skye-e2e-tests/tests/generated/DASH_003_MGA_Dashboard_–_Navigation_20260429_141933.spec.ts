import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

const navigationTestData = {
    selectors: {
        navMenu: '#sk-nav',
        homeZone: 'li#sk-zone-HomeZone',
        tasksZone: 'li#sk-zone-Tasks',
        myZone: 'li#sk-zone-MyZone',
        productsZone: 'li#sk-zone-Products',
        processZone: 'li#sk-zone-ProcessZone',
        activeZone: '.sk-nav-zones-item.sk-zone--active',
        zoneText: '.sk-zone-text'
    },
    expectedLabels: {
        home: 'Home',
        tasks: 'My Tasks',
        products: 'Products',
        process: 'Process'
    },
    expectedActiveZoneId: 'sk-zone-HomeZone'
};

test('DASH_003 - Validate Dashboard Navigation Menu Structure', async ({ page, skye, mga }) => {

    await test.step('Step 1: Navigate to the application URL and wait for navigation element', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(navigationTestData.selectors.navMenu, { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 2: Verify the navigation menu element is visible', async () => {
        const navMenu = page.locator(navigationTestData.selectors.navMenu);
        await expect(navMenu).toBeVisible();
    });

    await test.step('Step 3: Verify Home zone item is attached and has correct text', async () => {
        const homeZone = page.locator(navigationTestData.selectors.homeZone);
        await expect(homeZone).toBeAttached();
        
        const homeZoneText = homeZone.locator(navigationTestData.selectors.zoneText);
        await expect(homeZoneText).toHaveText(navigationTestData.expectedLabels.home);
    });

    await test.step('Step 4: Verify Tasks zone item is attached and has correct text', async () => {
        const tasksZone = page.locator(navigationTestData.selectors.tasksZone);
        await expect(tasksZone).toBeAttached();
        
        const tasksZoneText = tasksZone.locator(navigationTestData.selectors.zoneText);
        await expect(tasksZoneText).toHaveText(navigationTestData.expectedLabels.tasks);
    });

    await test.step('Step 5: Verify My Zone item is attached to the DOM', async () => {
        const myZone = page.locator(navigationTestData.selectors.myZone);
        await expect(myZone).toBeAttached();
    });

    await test.step('Step 6: Verify Products zone item is attached and has correct text', async () => {
        const productsZone = page.locator(navigationTestData.selectors.productsZone);
        await expect(productsZone).toBeAttached();
        
        const productsZoneText = productsZone.locator(navigationTestData.selectors.zoneText);
        await expect(productsZoneText).toHaveText(navigationTestData.expectedLabels.products);
    });

    await test.step('Step 7: Verify Process zone item is attached and has correct text', async () => {
        const processZone = page.locator(navigationTestData.selectors.processZone);
        await expect(processZone).toBeAttached();
        
        const processZoneText = processZone.locator(navigationTestData.selectors.zoneText);
        await expect(processZoneText).toHaveText(navigationTestData.expectedLabels.process);
    });

    await test.step('Step 8: Verify active navigation item is visible', async () => {
        const activeZone = page.locator(navigationTestData.selectors.activeZone);
        await expect(activeZone).toBeVisible();
    });

    await test.step('Step 9: Verify active zone id equals sk-zone-HomeZone', async () => {
        const activeZone = page.locator(navigationTestData.selectors.activeZone);
        const activeZoneId = await activeZone.getAttribute('id');
        expect(activeZoneId).toBe(navigationTestData.expectedActiveZoneId);
    });
});