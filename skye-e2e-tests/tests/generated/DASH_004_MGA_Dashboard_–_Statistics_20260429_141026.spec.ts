import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

const SELECTORS = {
    WITH_YOU_CARD: 'sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS',
    WITH_BROKER_CARD: 'sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS',
    WITH_CLIENT_CARD: 'sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS',
    DATA_TABLE: '.sk-datatable',
    DATA_TABLE_ROWS: '.p-datatable-tbody tr'
};

const EXPECTED_LABELS = {
    WITH_YOU: 'With You',
    WITH_BROKER: 'With the Broker',
    WITH_CLIENT: 'With the Client'
};

const NUMERIC_PATTERN = /^\d+$/;

test('DASH_004 - Validate Dashboard Statistics Cards and Data Table', async ({ page, skye, mga }) => {

    await test.step('Step 1: Navigate to the application and wait for dashboard statistics to load', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector(`[data-testid="${SELECTORS.WITH_YOU_CARD}"]`, { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 2: Verify "With You" card container is visible', async () => {
        const withYouCard = page.getByTestId(SELECTORS.WITH_YOU_CARD);
        await expect(withYouCard).toBeVisible();
    });

    await test.step('Step 3: Verify "With You" card displays a numeric value', async () => {
        const withYouCard = page.getByTestId(SELECTORS.WITH_YOU_CARD);
        const valueElement = withYouCard.locator('h2');
        await expect(valueElement).toBeVisible();
        const valueText = await valueElement.innerText();
        expect(valueText.trim()).toMatch(NUMERIC_PATTERN);
    });

    await test.step('Step 4: Verify "With You" card label contains expected text', async () => {
        const withYouCard = page.getByTestId(SELECTORS.WITH_YOU_CARD);
        const labelElement = withYouCard.locator('h4');
        await expect(labelElement).toContainText(EXPECTED_LABELS.WITH_YOU);
    });

    await test.step('Step 5: Verify "With the Broker" card container is visible', async () => {
        const withBrokerCard = page.getByTestId(SELECTORS.WITH_BROKER_CARD);
        await expect(withBrokerCard).toBeVisible();
    });

    await test.step('Step 6: Verify "With the Broker" card displays numeric value and correct label', async () => {
        const withBrokerCard = page.getByTestId(SELECTORS.WITH_BROKER_CARD);
        
        const valueElement = withBrokerCard.locator('h2');
        await expect(valueElement).toBeVisible();
        const valueText = await valueElement.innerText();
        expect(valueText.trim()).toMatch(NUMERIC_PATTERN);
        
        const labelElement = withBrokerCard.locator('h4');
        await expect(labelElement).toContainText(EXPECTED_LABELS.WITH_BROKER);
    });

    await test.step('Step 7: Verify "With the Client" card container is visible', async () => {
        const withClientCard = page.getByTestId(SELECTORS.WITH_CLIENT_CARD);
        await expect(withClientCard).toBeVisible();
    });

    await test.step('Step 8: Verify "With the Client" card displays numeric value and correct label', async () => {
        const withClientCard = page.getByTestId(SELECTORS.WITH_CLIENT_CARD);
        
        const valueElement = withClientCard.locator('h2');
        await expect(valueElement).toBeVisible();
        const valueText = await valueElement.innerText();
        expect(valueText.trim()).toMatch(NUMERIC_PATTERN);
        
        const labelElement = withClientCard.locator('h4');
        await expect(labelElement).toContainText(EXPECTED_LABELS.WITH_CLIENT);
    });

    await test.step('Step 9: Verify data table is visible on the page', async () => {
        const dataTable = page.locator(SELECTORS.DATA_TABLE);
        await expect(dataTable).toBeVisible();
    });

    await test.step('Step 10: Verify data table has records (data-records-count > 0)', async () => {
        const dataTable = page.locator(SELECTORS.DATA_TABLE);
        const recordsCountAttr = await dataTable.getAttribute('data-records-count');
        expect(recordsCountAttr).not.toBeNull();
        const recordsCount = parseInt(recordsCountAttr!, 10);
        expect(recordsCount).toBeGreaterThan(0);
    });

    await test.step('Step 11: Verify at least one row is displayed in the data table', async () => {
        const tableRows = page.locator(SELECTORS.DATA_TABLE_ROWS);
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    });
});