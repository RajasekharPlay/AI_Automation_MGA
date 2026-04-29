import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

// Test data centralized for maintainability
const NAV_ZONES = {
    HOME: {
        selector: 'li#sk-zone-HomeZone',
        expectedText: 'Home'
    },
    TASKS: {
        selector: 'li#sk-zone-Tasks',
        expectedText: 'My Tasks'
    },
    MY_ZONE: {
        selector: 'li#sk-zone-MyZone'
    },
    PRODUCTS: {
        selector: 'li#sk-zone-Products',
        expectedText: 'Products'
    },
    PROCESS: {
        selector: 'li#sk-zone-ProcessZone',
        expectedText: 'Process'
    }
} as const;

const SELECTORS = {
    NAV_MENU: '#sk-nav',
    ZONE_TEXT: '.sk-zone-text',
    ACTIVE_ZONE: '.sk-nav-zones-item.sk-zone--active'
} as const;

test('DASH_003 - Validate Dashboard Navigation Menu Structure', async ({ page, skye, mga }) => {

    await test.step('Step 1: Navigate to the application URL and wait for navigation element', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(SELECTORS.NAV_MENU, { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 2: Verify the navigation menu element is visible', async () => {
        const navMenu = page.locator(SELECTORS.NAV_MENU);
        await expect(navMenu).toBeVisible();
    });

    await test.step('Step 3: Verify Home zone item is present with correct text', async () => {
        const homeZone = page.locator(NAV_ZONES.HOME.selector);
        await expect(homeZone).toBeAttached();
        
        const homeZoneText = homeZone.locator(SELECTORS.ZONE_TEXT);
        await expect(homeZoneText).toHaveText(NAV_ZONES.HOME.expectedText);
    });

    await test.step('Step 4: Verify Tasks zone item is present with correct text', async () => {
        const tasksZone = page.locator(NAV_ZONES.TASKS.selector);
        await expect(tasksZone).toBeAttached();
        
        const tasksZoneText = tasksZone.locator(SELECTORS.ZONE_TEXT);
        await expect(tasksZoneText).toHaveText(NAV_ZONES.TASKS.expectedText);
    });

    await test.step('Step 5: Verify Reporting/My Zone item is present', async () => {
        const myZone = page.locator(NAV_ZONES.MY_ZONE.selector);
        await expect(myZone).toBeAttached();
    });

    await test.step('Step 6: Verify Products zone item is present with correct text', async () => {
        const productsZone = page.locator(NAV_ZONES.PRODUCTS.selector);
        await expect(productsZone).toBeAttached();
        
        const productsZoneText = productsZone.locator(SELECTORS.ZONE_TEXT);
        await expect(productsZoneText).toHaveText(NAV_ZONES.PRODUCTS.expectedText);
    });

    await test.step('Step 7: Verify Process zone item is present with correct text', async () => {
        const processZone = page.locator(NAV_ZONES.PROCESS.selector);
        await expect(processZone).toBeAttached();
        
        const processZoneText = processZone.locator(SELECTORS.ZONE_TEXT);
        await expect(processZoneText).toHaveText(NAV_ZONES.PROCESS.expectedText);
    });

    await test.step('Step 8: Verify active navigation item is visible', async () => {
        const activeZone = page.locator(SELECTORS.ACTIVE_ZONE);
        await expect(activeZone).toBeVisible();
    });

    await test.step('Step 9: Verify active zone is Home zone', async () => {
        const activeZone = page.locator(SELECTORS.ACTIVE_ZONE);
        const activeZoneId = await activeZone.getAttribute('id');
        expect(activeZoneId).toBe('sk-zone-HomeZone');
    });
});