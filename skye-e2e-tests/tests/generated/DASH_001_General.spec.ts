import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('DASH_001 - Validate Dashboard Header Loads', async ({ page, skye, mga }) => {

    await test.step('Step 1: Open Dashboard page and observe header', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 2: Verify main application container is loaded', async () => {
        const skApp = page.locator('#sk-app');
        await expect(skApp).toBeVisible();
        await expect(skApp).toHaveAttribute('data-app-ready', 'true');
    });

    await test.step('Step 3: Verify header toolbar is visible', async () => {
        const toolbar = page.locator('#sk-toolbar');
        await expect(toolbar).toBeVisible();
    });

    await test.step('Step 4: Verify logo is visible', async () => {
        const primaryLogo = page.locator('img.sk-logo-1');
        await expect(primaryLogo).toBeVisible();
        await expect(primaryLogo).toHaveAttribute('alt', 'Primary logo');
    });

    await test.step('Step 5: Verify navigation menu items are visible', async () => {
        const navZones = page.locator('.sk-nav-zones');
        await expect(navZones).toBeVisible();

        const homeZone = page.locator('#sk-zone-HomeZone');
        await expect(homeZone).toBeVisible();
        await expect(page.locator('#sk-zone-HomeZone .sk-zone-text')).toHaveText('Home');

        const tasksZone = page.locator('#sk-zone-Tasks');
        await expect(tasksZone).toBeVisible();
        await expect(page.locator('#sk-zone-Tasks .sk-zone-text')).toHaveText('My Tasks');

        const reportingZone = page.locator('#sk-zone-MyZone');
        await expect(reportingZone).toBeVisible();

        const productsZone = page.locator('#sk-zone-Products');
        await expect(productsZone).toBeVisible();
        await expect(page.locator('#sk-zone-Products .sk-zone-text')).toHaveText('Products');

        const processZone = page.locator('#sk-zone-ProcessZone');
        await expect(processZone).toBeVisible();
        await expect(page.locator('#sk-zone-ProcessZone .sk-zone-text')).toHaveText('Process');
    });

    await test.step('Step 6: Verify language dropdown is visible', async () => {
        const languageDropdown = page.locator('#sk-language');
        await expect(languageDropdown).toBeVisible();

        const languageSelect = page.locator('#sk-language-select');
        await expect(languageSelect).toBeVisible();
    });

    await test.step('Step 7: Verify search icon is visible', async () => {
        const searchIcon = page.locator('#sk-search').locator('..').locator('i.fa-search');
        await expect(searchIcon).toBeVisible();
    });

    await test.step('Step 8: Verify logout button is visible', async () => {
        const logoutButton = page.locator('#sk-logout');
        await expect(logoutButton).toBeVisible();
        await expect(logoutButton).toHaveAttribute('href', /idpLogout/);
    });

    await test.step('Step 9: Verify Dashboard heading and welcome message are displayed', async () => {
        const dashboardHeading = page.locator('h1:has-text("Dashboard")');
        await expect(dashboardHeading).toBeVisible();

        const welcomeMessage = page.locator('h3:has-text("Welcome")');
        await expect(welcomeMessage).toBeVisible();
    });

    await test.step('Step 10: Verify dashboard cards are visible', async () => {
        const withYouCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS');
        await expect(withYouCard).toBeVisible();
        await expect(withYouCard.locator('h4')).toContainText('With You');

        const brokerCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS');
        await expect(brokerCard).toBeVisible();
        await expect(brokerCard.locator('h4')).toContainText('With the Broker');

        const clientCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS');
        await expect(clientCard).toBeVisible();
        await expect(clientCard.locator('h4')).toContainText('With the Client');
    });

    await test.step('Step 11: Verify footer is visible', async () => {
        const footer = page.locator('#footer');
        await expect(footer).toBeVisible();
        await expect(footer).toContainText('INNOVEO INC - All rights reserved');
    });
});