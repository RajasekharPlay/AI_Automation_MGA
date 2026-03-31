import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test.describe('MGA Dashboard Validation Tests', () => {

    test('DASH_001 - Validate Dashboard Header Loads', async ({ page, skye, mga }) => {

        const mainPage = new MainPage(page);

        await test.step('Step 1: Open Dashboard page and observe header', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

            // Verify main application container is loaded
            const isAppLoaded = await mainPage.isLoaded();
            expect(isAppLoaded, 'Dashboard main container #sk-app should be visible').toBe(true);

            // Verify header/toolbar is visible
            const toolbar = page.locator('#sk-toolbar');
            await expect(toolbar, 'Header toolbar should be visible').toBeVisible();

            // Verify logo is visible
            const primaryLogo = page.locator('img.sk-logo-1[alt="Primary logo"]');
            await expect(primaryLogo, 'Primary logo should be visible in header').toBeVisible();

            // Verify navigation menu items are visible
            const navMenu = page.locator('#sk-nav');
            await expect(navMenu, 'Navigation menu should be visible').toBeVisible();

            // Verify menu zones are present (Home, My Tasks, Reporting, Products, Process)
<<<<<<< Updated upstream
            const homeZone = page.locator('#sk-zone-HomeZone');
=======
            const homeZone = page.locator('#sk-zone-HomeZone').nth(0);
>>>>>>> Stashed changes
            await expect(homeZone, 'Home menu item should be visible').toBeVisible();

            const tasksZone = page.locator('#sk-zone-Tasks');
            await expect(tasksZone, 'My Tasks menu item should be visible').toBeVisible();

            const productsZone = page.locator('#sk-zone-Products');
            await expect(productsZone, 'Products menu item should be visible').toBeVisible();

            const processZone = page.locator('#sk-zone-ProcessZone');
            await expect(processZone, 'Process menu item should be visible').toBeVisible();

            // Verify language dropdown is visible
            const languageDropdown = page.locator('#sk-language');
            await expect(languageDropdown, 'Language dropdown should be visible').toBeVisible();

            // Verify logout button is visible
            const logoutButton = page.locator('#sk-logout');
            await expect(logoutButton, 'Logout button should be visible').toBeVisible();

            // Verify search icon is visible
            const searchIcon = page.locator('#sk-toolbar .fal.fa-search');
            await expect(searchIcon, 'Search icon should be visible').toBeVisible();
        });
    });

    test('DASH_002 - Validate Dashboard Welcome Message and Cards', async ({ page, skye, mga }) => {

        await test.step('Step 1: Navigate to Dashboard and verify welcome message', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('[data-testid="sk-ZoneDefinition-HomeZone-CustomerPortalHTMLAttribute"]', { state: 'visible', timeout: 30000 });

            // Verify Dashboard heading is displayed
            const dashboardHeading = page.locator('h1:has-text("Dashboard")');
            await expect(dashboardHeading, 'Dashboard heading should be visible').toBeVisible();

            // Verify Welcome message is displayed
            const welcomeMessage = page.locator('h3:has-text("Welcome")');
            await expect(welcomeMessage, 'Welcome message should be visible').toBeVisible();
        });

        await test.step('Step 2: Verify dashboard statistic cards are visible', async () => {
            // Verify "With You" card
            const withYouCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS');
            await expect(withYouCard, '"With You" dashboard card should be visible').toBeVisible();
            
            const withYouText = withYouCard.locator('h4:has-text("With You")');
            await expect(withYouText, '"With You" label should be visible').toBeVisible();

            // Verify "With the Broker" card
            const brokerCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS');
            await expect(brokerCard, '"With the Broker" dashboard card should be visible').toBeVisible();
            
            const brokerText = brokerCard.locator('h4:has-text("With the Broker")');
            await expect(brokerText, '"With the Broker" label should be visible').toBeVisible();

            // Verify "With the Client" card
            const clientCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS');
            await expect(clientCard, '"With the Client" dashboard card should be visible').toBeVisible();
            
            const clientText = clientCard.locator('h4:has-text("With the Client")');
            await expect(clientText, '"With the Client" label should be visible').toBeVisible();
        });
    });

    test('DASH_003 - Validate Dashboard Data Table and Tabs', async ({ page, skye, mga }) => {

        await test.step('Step 1: Navigate to Dashboard and verify data table is loaded', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.sk-autosearch', { state: 'visible', timeout: 30000 });

            // Verify autosearch component is visible
            const autosearchComponent = page.locator('#sk-ZoneDefinition-HomeZone-MGAUnderWriterReferralsAutomaticSearchComponent');
            await expect(autosearchComponent, 'Autosearch data table component should be visible').toBeVisible();
        });

        await test.step('Step 2: Verify tab navigation is available', async () => {
            // Verify "Assigned to Me" tab
            const assignedToMeTab = page.locator('a[title="Assigned to Me"]');
            await expect(assignedToMeTab, '"Assigned to Me" tab should be visible').toBeVisible();

            // Verify "Quotes" tab
            const quotesTab = page.locator('a[title="Quotes"]');
            await expect(quotesTab, '"Quotes" tab should be visible').toBeVisible();

            // Verify "Policies" tab
            const policiesTab = page.locator('a[title="Policies"]');
            await expect(policiesTab, '"Policies" tab should be visible').toBeVisible();

            // Verify "Referrals" tab
            const referralsTab = page.locator('a[title="Referrals"]');
            await expect(referralsTab, '"Referrals" tab should be visible').toBeVisible();
        });

        await test.step('Step 3: Verify data table columns are displayed', async () => {
            const dataTable = page.locator('.p-datatable');
            await expect(dataTable, 'Data table should be visible').toBeVisible();

            // Verify table headers
            const actionHeader = page.locator('.p-column-title:has-text("Action")');
            await expect(actionHeader, '"Action" column header should be visible').toBeVisible();

            const quoteNumberHeader = page.locator('.p-column-title:has-text("Quote Number")');
            await expect(quoteNumberHeader, '"Quote Number" column header should be visible').toBeVisible();

            const insuredNameHeader = page.locator('.p-column-title:has-text("Insured Name")');
            await expect(insuredNameHeader, '"Insured Name" column header should be visible').toBeVisible();

            const stageHeader = page.locator('.p-column-title:has-text("Stage")');
            await expect(stageHeader, '"Stage" column header should be visible').toBeVisible();

            const statusHeader = page.locator('.p-column-title:has-text("Status")');
            await expect(statusHeader, '"Status" column header should be visible').toBeVisible();
        });

        await test.step('Step 4: Verify pagination is available', async () => {
            const paginator = page.locator('.p-paginator');
            await expect(paginator, 'Pagination component should be visible').toBeVisible();

            // Verify records count text
            const recordsInfo = page.locator('.sk-pagination-records');
            await expect(recordsInfo, 'Records count information should be visible').toBeVisible();
            
            const recordsText = await recordsInfo.innerText();
            expect(recordsText, 'Records text should contain "Showing records"').toContain('Showing records');

            // Verify pagination buttons
            const nextButton = page.locator('.p-paginator-next');
            await expect(nextButton, 'Next page button should be visible').toBeVisible();

            const lastButton = page.locator('.p-paginator-last');
            await expect(lastButton, 'Last page button should be visible').toBeVisible();
        });

        await test.step('Step 5: Verify footer is visible', async () => {
            const footer = page.locator('footer#footer');
            await expect(footer, 'Footer should be visible').toBeVisible();

            const footerText = page.locator('footer .text-small-80');
            await expect(footerText, 'Footer copyright text should be visible').toContainText('Tinubu Square SA');
        });
    });

});