import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

const DASHBOARD_TEST_IDS = {
    withYouCard: 'sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS',
    withBrokerCard: 'sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS',
    withClientCard: 'sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS'
};

const CARD_LABELS = {
    withYou: 'With You',
    withBroker: 'With the Broker',
    withClient: 'With the Client'
};

const NUMERIC_PATTERN = /^\d+$/;

test('DASH_004 - Validate Dashboard Statistics Cards and Data Table', async ({ page, skye, mga }) => {

    await test.step('Step 1: Navigate to the application and wait for dashboard to load', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(`[data-testid="${DASHBOARD_TEST_IDS.withYouCard}"]`, { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 2: Verify "With You" card container is visible', async () => {
        const withYouCard = page.getByTestId(DASHBOARD_TEST_IDS.withYouCard);
        await expect(withYouCard).toBeVisible();
    });

    await test.step('Step 3: Verify "With You" card displays numeric value', async () => {
        const withYouCard = page.getByTestId(DASHBOARD_TEST_IDS.withYouCard);
        const valueElement = withYouCard.locator('h2');
        await expect(valueElement).toBeVisible();
        const valueText = await valueElement.innerText();
        expect(valueText.trim()).toMatch(NUMERIC_PATTERN);
    });

    await test.step('Step 4: Verify "With You" card label text', async () => {
        const withYouCard = page.getByTestId(DASHBOARD_TEST_IDS.withYouCard);
        const labelElement = withYouCard.locator('h4');
        await expect(labelElement).toContainText(CARD_LABELS.withYou);
    });

    await test.step('Step 5: Verify "With the Broker" card container is visible', async () => {
        const withBrokerCard = page.getByTestId(DASHBOARD_TEST_IDS.withBrokerCard);
        await expect(withBrokerCard).toBeVisible();
    });

    await test.step('Step 6: Verify "With the Broker" card displays numeric value and correct label', async () => {
        const withBrokerCard = page.getByTestId(DASHBOARD_TEST_IDS.withBrokerCard);
        
        const valueElement = withBrokerCard.locator('h2');
        await expect(valueElement).toBeVisible();
        const valueText = await valueElement.innerText();
        expect(valueText.trim()).toMatch(NUMERIC_PATTERN);
        
        const labelElement = withBrokerCard.locator('h4');
        await expect(labelElement).toContainText(CARD_LABELS.withBroker);
    });

    await test.step('Step 7: Verify "With the Client" card container is visible', async () => {
        const withClientCard = page.getByTestId(DASHBOARD_TEST_IDS.withClientCard);
        await expect(withClientCard).toBeVisible();
    });

    await test.step('Step 8: Verify "With the Client" card displays numeric value and correct label', async () => {
        const withClientCard = page.getByTestId(DASHBOARD_TEST_IDS.withClientCard);
        
        const valueElement = withClientCard.locator('h2');
        await expect(valueElement).toBeVisible();
        const valueText = await valueElement.innerText();
        expect(valueText.trim()).toMatch(NUMERIC_PATTERN);
        
        const labelElement = withClientCard.locator('h4');
        await expect(labelElement).toContainText(CARD_LABELS.withClient);
    });

    await test.step('Step 9: Verify data table is visible on the page', async () => {
        const dataTable = page.locator('.sk-datatable');
        await expect(dataTable).toBeVisible();
    });

    await test.step('Step 10: Verify data table has records count greater than 0', async () => {
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