import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test.describe('MGA Dashboard Validation Tests', () => {

    test('DASH_002 - Validate Welcome Message', async ({ page, skye, mga }) => {

        await test.step('Step 1: Navigate to the application and verify Dashboard loads', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        });

        await test.step('Step 2: Check Dashboard title and welcome text', async () => {
            const dashboardTitle = page.locator('h1');
            await expect(dashboardTitle, 'Dashboard title should be visible').toBeVisible();
            await expect(dashboardTitle, 'Dashboard title should display "Dashboard"').toHaveText('Dashboard');

            const welcomeMessage = page.locator('h3');
            await expect(welcomeMessage, 'Welcome message should be visible').toBeVisible();
            
            const welcomeText = await welcomeMessage.innerText();
            expect(welcomeText, 'Welcome message should contain "Welcome"').toContain('Welcome');
        });
    });

    test('DASH_003 - Validate Dashboard Navigation Menu', async ({ page, skye, mga }) => {

        await test.step('Step 1: Navigate to the application', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-nav', { state: 'visible', timeout: 30000 });
        });

        await test.step('Step 2: Verify navigation menu is visible with expected zones', async () => {
            const navMenu = page.locator('#sk-nav');
            await expect(navMenu, 'Navigation menu should be visible').toBeVisible();

            const homeZone = page.locator('#sk-zone-HomeZone');
            await expect(homeZone, 'Home zone should be visible in navigation').toBeVisible();
            await expect(homeZone.locator('.sk-zone-text'), 'Home zone should display "Home"').toHaveText('Home');

            const tasksZone = page.locator('#sk-zone-Tasks');
            await expect(tasksZone, 'My Tasks zone should be visible in navigation').toBeVisible();
            await expect(tasksZone.locator('.sk-zone-text'), 'Tasks zone should display "My Tasks"').toHaveText('My Tasks');

            const reportingZone = page.locator('#sk-zone-MyZone');
            await expect(reportingZone, 'Reporting zone should be visible in navigation').toBeVisible();

            const productsZone = page.locator('#sk-zone-Products');
            await expect(productsZone, 'Products zone should be visible in navigation').toBeVisible();
            await expect(productsZone.locator('.sk-zone-text'), 'Products zone should display "Products"').toHaveText('Products');

            const processZone = page.locator('#sk-zone-ProcessZone');
            await expect(processZone, 'Process zone should be visible in navigation').toBeVisible();
            await expect(processZone.locator('.sk-zone-text'), 'Process zone should display "Process"').toHaveText('Process');
        });

        await test.step('Step 3: Verify Home zone is active by default', async () => {
            const activeZone = page.locator('.sk-nav-zones-item.sk-zone--active');
            await expect(activeZone, 'An active zone should be present').toBeVisible();
            
            const activeZoneId = await activeZone.getAttribute('id');
            expect(activeZoneId, 'Home zone should be active by default').toBe('sk-zone-HomeZone');
        });
    });

    test('DASH_004 - Validate Dashboard Statistics Cards', async ({ page, skye, mga }) => {

        await test.step('Step 1: Navigate to the application', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('[data-testid="sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS"]', { state: 'visible', timeout: 30000 });
        });

        await test.step('Step 2: Verify "With You" statistics card is displayed', async () => {
            const withYouCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS');
            await expect(withYouCard, '"With You" card should be visible').toBeVisible();

            const withYouValue = withYouCard.locator('h2');
            await expect(withYouValue, '"With You" value should be visible').toBeVisible();
            
            const valueText = await withYouValue.innerText();
            expect(parseInt(valueText), '"With You" value should be a valid number').not.toBeNaN();

            const withYouLabel = withYouCard.locator('h4');
            await expect(withYouLabel, '"With You" label should contain expected text').toContainText('With You');
        });

        await test.step('Step 3: Verify "With the Broker" statistics card is displayed', async () => {
            const brokerCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS');
            await expect(brokerCard, '"With the Broker" card should be visible').toBeVisible();

            const brokerValue = brokerCard.locator('h2');
            await expect(brokerValue, '"With the Broker" value should be visible').toBeVisible();
            
            const valueText = await brokerValue.innerText();
            expect(parseInt(valueText), '"With the Broker" value should be a valid number').not.toBeNaN();

            const brokerLabel = brokerCard.locator('h4');
            await expect(brokerLabel, '"With the Broker" label should contain expected text').toContainText('With the Broker');
        });

        await test.step('Step 4: Verify "With the Client" statistics card is displayed', async () => {
            const clientCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS');
            await expect(clientCard, '"With the Client" card should be visible').toBeVisible();

            const clientValue = clientCard.locator('h2');
            await expect(clientValue, '"With the Client" value should be visible').toBeVisible();
            
            const valueText = await clientValue.innerText();
            expect(parseInt(valueText), '"With the Client" value should be a valid number').not.toBeNaN();

            const clientLabel = clientCard.locator('h4');
            await expect(clientLabel, '"With the Client" label should contain expected text').toContainText('With the Client');
        });

        await test.step('Step 5: Verify data table with records is displayed', async () => {
            const dataTable = page.locator('.sk-datatable');
            await expect(dataTable, 'Data table should be visible').toBeVisible();

            const recordsCount = await dataTable.getAttribute('data-records-count');
            expect(parseInt(recordsCount || '0'), 'Data table should have records').toBeGreaterThan(0);

            const tableRows = page.locator('.p-datatable-tbody tr');
            const rowCount = await tableRows.count();
            expect(rowCount, 'Data table should display at least one row').toBeGreaterThan(0);
        });
    });

});