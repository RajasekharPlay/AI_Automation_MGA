import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('DASH_004 - Validate Dashboard Statistics Cards and Data Table', async ({ page, skye, mga }) => {

    await test.step('Step 1: Navigate to the application and wait for the dashboard element to be visible', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-testid="sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS"]', { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 2: Verify "With You" card container is visible', async () => {
        const withYouCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS');
        await expect(withYouCard).toBeVisible();
    });

    await test.step('Step 3: Verify "With You" card h2 value displays a numeric pattern', async () => {
        const withYouCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS');
        const h2Value = withYouCard.locator('h2');
        await expect(h2Value).toBeVisible();
        const valueText = await h2Value.innerText();
        expect(valueText).toMatch(/^\d+$/);
    });

    await test.step('Step 4: Verify "With You" card h4 label contains "With You"', async () => {
        const withYouCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS');
        const h4Label = withYouCard.locator('h4');
        await expect(h4Label).toBeVisible();
        await expect(h4Label).toContainText('With You');
    });

    await test.step('Step 5: Verify "With the Broker" card container is visible', async () => {
        const brokerCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS');
        await expect(brokerCard).toBeVisible();
    });

    await test.step('Step 6: Verify "With the Broker" card h2 shows numeric value and h4 contains "With the Broker"', async () => {
        const brokerCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS');
        const h2Value = brokerCard.locator('h2');
        await expect(h2Value).toBeVisible();
        const valueText = await h2Value.innerText();
        expect(valueText).toMatch(/^\d+$/);

        const h4Label = brokerCard.locator('h4');
        await expect(h4Label).toBeVisible();
        await expect(h4Label).toContainText('With the Broker');
    });

    await test.step('Step 7: Verify "With the Client" card container is visible', async () => {
        const clientCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS');
        await expect(clientCard).toBeVisible();
    });

    await test.step('Step 8: Verify "With the Client" card h2 shows numeric value and h4 contains "With the Client"', async () => {
        const clientCard = page.getByTestId('sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS');
        const h2Value = clientCard.locator('h2');
        await expect(h2Value).toBeVisible();
        const valueText = await h2Value.innerText();
        expect(valueText).toMatch(/^\d+$/);

        const h4Label = clientCard.locator('h4');
        await expect(h4Label).toBeVisible();
        await expect(h4Label).toContainText('With the Client');
    });

    await test.step('Step 9: Verify the data table is visible', async () => {
        const dataTable = page.locator('.sk-datatable');
        await expect(dataTable).toBeVisible();
    });

    await test.step('Step 10: Verify data table records count is greater than 0', async () => {
        const dataTable = page.locator('.sk-datatable');
        const recordsCountAttr = await dataTable.getAttribute('data-records-count');
        expect(recordsCountAttr).not.toBeNull();
        const recordsCount = parseInt(recordsCountAttr!, 10);
        expect(recordsCount).toBeGreaterThan(0);
    });

    await test.step('Step 11: Verify at least one row is displayed in the data table', async () => {
        const tableRows = page.locator('.p-datatable-tbody tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    });
});