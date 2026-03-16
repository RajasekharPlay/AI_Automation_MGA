import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('DASH_001 - Validate Dashboard Header Loads', async ({ page, skye, mga }) => {

    await test.step('Step 1: Open Dashboard page and observe header', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
    });

    await test.step('Verify header menu items are visible', async () => {
        const navbar = page.locator('#sk-nav');
        await expect(navbar).toBeVisible();

        const homeZone = page.locator('#sk-zone-HomeZone');
        await expect(homeZone).toBeVisible();
        await expect(homeZone.locator('.sk-zone-text')).toHaveText('Home');

        const tasksZone = page.locator('#sk-zone-Tasks');
        await expect(tasksZone).toBeVisible();
        await expect(tasksZone.locator('.sk-zone-text')).toHaveText('My Tasks');

        const reportingZone = page.locator('#sk-zone-MyZone');
        await expect(reportingZone).toBeVisible();
        await expect(reportingZone.locator('.sk-zone-text')).toContainText('Reporting');

        const productsZone = page.locator('#sk-zone-Products');
        await expect(productsZone).toBeVisible();
        await expect(productsZone.locator('.sk-zone-text')).toHaveText('Products');

        const processZone = page.locator('#sk-zone-ProcessZone');
        await expect(processZone).toBeVisible();
        await expect(processZone.locator('.sk-zone-text')).toHaveText('Process');
    });

    await test.step('Verify logo is visible', async () => {
        const logoContainer = page.locator('.sk-logos');
        await expect(logoContainer).toBeVisible();

        const primaryLogo = page.locator('img.sk-logo-1');
        await expect(primaryLogo).toBeVisible();
        await expect(primaryLogo).toHaveAttribute('alt', 'Primary logo');

        const secondaryLogo = page.locator('img.sk-logo-2');
        await expect(secondaryLogo).toBeVisible();
        await expect(secondaryLogo).toHaveAttribute('alt', 'Secondary logo');
    });

    await test.step('Verify language dropdown is visible', async () => {
        const languageDropdown = page.locator('#sk-language');
        await expect(languageDropdown).toBeVisible();

        const languageSelect = page.locator('#sk-language-select');
        await expect(languageSelect).toBeVisible();

        const selectedLanguage = languageSelect.locator('.p-dropdown-label');
        await expect(selectedLanguage).toContainText('English (US)');

        const flagIcon = page.locator('.sk-flag-icon-us');
        await expect(flagIcon).toBeVisible();
    });

    await test.step('Verify search icon is visible', async () => {
        const searchIcon = page.locator('.sk-toolbar-end .fa-search');
        await expect(searchIcon).toBeVisible();
    });

    await test.step('Verify logout link is visible', async () => {
        const logoutLink = page.locator('#sk-logout');
        await expect(logoutLink).toBeVisible();
        await expect(logoutLink).toHaveAttribute('href', /idpLogout/);
    });

    await test.step('Verify Dashboard heading and welcome message are displayed', async () => {
        const dashboardHeading = page.locator('h1:has-text("Dashboard")');
        await expect(dashboardHeading).toBeVisible();

        const welcomeMessage = page.locator('h3:has-text("Welcome")');
        await expect(welcomeMessage).toBeVisible();
    });

    await test.step('Verify dashboard cards are visible', async () => {
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

    await test.step('Verify data table with tabs is visible', async () => {
        const autoSearch = page.locator('.sk-autosearch');
        await expect(autoSearch).toBeVisible();

        const quotesTab = page.locator('a[title="Quotes"]');
        await expect(quotesTab).toBeVisible();

        const policiesTab = page.locator('a[title="Policies"]');
        await expect(policiesTab).toBeVisible();

        const assignedToMeTab = page.locator('a[title="Assigned to Me"]');
        await expect(assignedToMeTab).toBeVisible();

        const referralsTab = page.locator('a[title="Referrals"]');
        await expect(referralsTab).toBeVisible();

        const dataTable = page.locator('.sk-datatable');
        await expect(dataTable).toBeVisible();
        await expect(dataTable).toHaveAttribute('data-loading', 'false');
    });

    await test.step('Verify footer is visible', async () => {
        const footer = page.locator('#footer');
        await expect(footer).toBeVisible();
        await expect(footer).toContainText('© INNOVEO INC - All rights reserved.');
    });
});