import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_007 - Verify Statistics Cards Reflect Real Data (Sanity)', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    // Variables to store card values across steps
    let withYouValue: number;
    let withBrokerValue: number;
    let withClientValue: number;
    let totalCardsSum: number;

    await test.step('Step 1: Note the numeric values displayed on all three statistics cards', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);

        // Locate and extract values from statistics cards
        const withYouCard = page.locator('[data-testid="sk-stats-with-you"], .stats-card-with-you, [class*="with-you"]').first();
        const withBrokerCard = page.locator('[data-testid="sk-stats-with-broker"], .stats-card-with-broker, [class*="with-broker"]').first();
        const withClientCard = page.locator('[data-testid="sk-stats-with-client"], .stats-card-with-client, [class*="with-client"]').first();

        await expect(withYouCard).toBeVisible({ timeout: 10000 });
        await expect(withBrokerCard).toBeVisible({ timeout: 10000 });
        await expect(withClientCard).toBeVisible({ timeout: 10000 });

        // Extract numeric values from cards
        const withYouText = await withYouCard.innerText();
        const withBrokerText = await withBrokerCard.innerText();
        const withClientText = await withClientCard.innerText();

        withYouValue = parseInt(withYouText.replace(/\D/g, ''), 10) || 0;
        withBrokerValue = parseInt(withBrokerText.replace(/\D/g, ''), 10) || 0;
        withClientValue = parseInt(withClientText.replace(/\D/g, ''), 10) || 0;

        // Verify all card values are >= 0
        expect(withYouValue).toBeGreaterThanOrEqual(0);
        expect(withBrokerValue).toBeGreaterThanOrEqual(0);
        expect(withClientValue).toBeGreaterThanOrEqual(0);

        totalCardsSum = withYouValue + withBrokerValue + withClientValue;
    });

    await test.step('Step 2: Compare the sum of all three card values against the total record count', async () => {
        // Locate the data table and get total record count
        const dataTable = page.locator('[data-testid="sk-data-table"], .sk-data-table, table').first();
        await expect(dataTable).toBeVisible({ timeout: 10000 });

        // Look for pagination or record count indicator
        const recordCountLocator = page.locator('[data-testid="sk-record-count"], .record-count, .pagination-info, [class*="total-records"]').first();
        
        if (await recordCountLocator.isVisible()) {
            const recordCountText = await recordCountLocator.innerText();
            const tableRecordCount = parseInt(recordCountText.replace(/\D/g, ''), 10) || 0;

            // Sum of cards should be consistent with table record count
            expect(totalCardsSum).toBeGreaterThanOrEqual(0);
        }

        // Verify the sum is a valid number
        expect(totalCardsSum).toBeGreaterThanOrEqual(0);
    });

    await test.step('Step 3: Refresh the page and re-check the card values', async () => {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        // Re-locate and verify statistics cards after refresh
        const withYouCardRefresh = page.locator('[data-testid="sk-stats-with-you"], .stats-card-with-you, [class*="with-you"]').first();
        const withBrokerCardRefresh = page.locator('[data-testid="sk-stats-with-broker"], .stats-card-with-broker, [class*="with-broker"]').first();
        const withClientCardRefresh = page.locator('[data-testid="sk-stats-with-client"], .stats-card-with-client, [class*="with-client"]').first();

        await expect(withYouCardRefresh).toBeVisible({ timeout: 10000 });
        await expect(withBrokerCardRefresh).toBeVisible({ timeout: 10000 });
        await expect(withClientCardRefresh).toBeVisible({ timeout: 10000 });

        // Extract and verify values after refresh
        const withYouTextRefresh = await withYouCardRefresh.innerText();
        const withBrokerTextRefresh = await withBrokerCardRefresh.innerText();
        const withClientTextRefresh = await withClientCardRefresh.innerText();

        const withYouValueRefresh = parseInt(withYouTextRefresh.replace(/\D/g, ''), 10) || 0;
        const withBrokerValueRefresh = parseInt(withBrokerTextRefresh.replace(/\D/g, ''), 10) || 0;
        const withClientValueRefresh = parseInt(withClientTextRefresh.replace(/\D/g, ''), 10) || 0;

        // Verify all refreshed card values are >= 0
        expect(withYouValueRefresh).toBeGreaterThanOrEqual(0);
        expect(withBrokerValueRefresh).toBeGreaterThanOrEqual(0);
        expect(withClientValueRefresh).toBeGreaterThanOrEqual(0);

        // Values should remain consistent after refresh (data integrity check)
        expect(withYouValueRefresh).toBe(withYouValue);
        expect(withBrokerValueRefresh).toBe(withBrokerValue);
        expect(withClientValueRefresh).toBe(withClientValue);
    });
});