import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_007 - Verify Statistics Cards Reflect Real Data (Sanity)', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    // Variables to store card values for comparison
    let withYouValue: number;
    let withBrokerValue: number;
    let withClientValue: number;
    let totalTableRecords: number;

    await test.step('Step 1: Note the numeric values displayed on all three statistics cards', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);

        // Locate and extract values from statistics cards
        const withYouCard = page.locator('[data-testid="stats-with-you"], .statistics-card:has-text("With You")').first();
        const withBrokerCard = page.locator('[data-testid="stats-with-broker"], .statistics-card:has-text("With the Broker")').first();
        const withClientCard = page.locator('[data-testid="stats-with-client"], .statistics-card:has-text("With the Client")').first();

        await expect(withYouCard).toBeVisible({ timeout: 10000 });
        await expect(withBrokerCard).toBeVisible({ timeout: 10000 });
        await expect(withClientCard).toBeVisible({ timeout: 10000 });

        // Extract numeric values from cards
        const withYouText = await withYouCard.locator('.card-value, .sk-counter, span').first().innerText();
        const withBrokerText = await withBrokerCard.locator('.card-value, .sk-counter, span').first().innerText();
        const withClientText = await withClientCard.locator('.card-value, .sk-counter, span').first().innerText();

        withYouValue = parseInt(withYouText.replace(/[^\d]/g, ''), 10) || 0;
        withBrokerValue = parseInt(withBrokerText.replace(/[^\d]/g, ''), 10) || 0;
        withClientValue = parseInt(withClientText.replace(/[^\d]/g, ''), 10) || 0;

        // Verify all card values are >= 0
        expect(withYouValue).toBeGreaterThanOrEqual(0);
        expect(withBrokerValue).toBeGreaterThanOrEqual(0);
        expect(withClientValue).toBeGreaterThanOrEqual(0);
    });

    await test.step('Step 2: Compare the sum of all three card values against the total record count', async () => {
        const sumOfCards = withYouValue + withBrokerValue + withClientValue;

        // Locate the data table and get total record count
        const dataTable = page.locator('[data-testid="data-table"], .sk-table, table').first();
        await expect(dataTable).toBeVisible({ timeout: 10000 });

        // Try to get total count from pagination or table info
        const totalCountElement = page.locator('[data-testid="total-records"], .pagination-info, .table-info').first();
        
        if (await totalCountElement.isVisible()) {
            const totalText = await totalCountElement.innerText();
            totalTableRecords = parseInt(totalText.replace(/[^\d]/g, ''), 10) || 0;

            // Compare sum of cards with total records
            expect(sumOfCards).toEqual(totalTableRecords);
        } else {
            // If no total count element, count table rows as fallback
            const tableRows = dataTable.locator('tbody tr');
            totalTableRecords = await tableRows.count();

            // Log for visibility when pagination might hide some records
            console.log(`Sum of cards: ${sumOfCards}, Visible table rows: ${totalTableRecords}`);
            expect(sumOfCards).toBeGreaterThanOrEqual(totalTableRecords);
        }
    });

    await test.step('Step 3: Refresh the page and re-check the card values', async () => {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        // Re-verify cards are visible and contain valid values after refresh
        const withYouCard = page.locator('[data-testid="stats-with-you"], .statistics-card:has-text("With You")').first();
        const withBrokerCard = page.locator('[data-testid="stats-with-broker"], .statistics-card:has-text("With the Broker")').first();
        const withClientCard = page.locator('[data-testid="stats-with-client"], .statistics-card:has-text("With the Client")').first();

        await expect(withYouCard).toBeVisible({ timeout: 10000 });
        await expect(withBrokerCard).toBeVisible({ timeout: 10000 });
        await expect(withClientCard).toBeVisible({ timeout: 10000 });

        // Extract and verify values after refresh
        const withYouTextRefresh = await withYouCard.locator('.card-value, .sk-counter, span').first().innerText();
        const withBrokerTextRefresh = await withBrokerCard.locator('.card-value, .sk-counter, span').first().innerText();
        const withClientTextRefresh = await withClientCard.locator('.card-value, .sk-counter, span').first().innerText();

        const withYouValueRefresh = parseInt(withYouTextRefresh.replace(/[^\d]/g, ''), 10) || 0;
        const withBrokerValueRefresh = parseInt(withBrokerTextRefresh.replace(/[^\d]/g, ''), 10) || 0;
        const withClientValueRefresh = parseInt(withClientTextRefresh.replace(/[^\d]/g, ''), 10) || 0;

        // Verify all card values are >= 0 after refresh
        expect(withYouValueRefresh).toBeGreaterThanOrEqual(0);
        expect(withBrokerValueRefresh).toBeGreaterThanOrEqual(0);
        expect(withClientValueRefresh).toBeGreaterThanOrEqual(0);

        // Verify values remain consistent after refresh (data should be stable)
        expect(withYouValueRefresh).toEqual(withYouValue);
        expect(withBrokerValueRefresh).toEqual(withBrokerValue);
        expect(withClientValueRefresh).toEqual(withClientValue);
    });
});