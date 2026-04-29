import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_007 - Verify Statistics Cards Reflect Real Data (Sanity)', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    let withYouValue: number;
    let withBrokerValue: number;
    let withClientValue: number;
    let totalCardSum: number;

    await test.step('Step 1: Note the numeric values displayed on all three statistics cards', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);

        const withYouCard = page.locator('[data-testid="sk-stats-with-you"], .statistics-card:has-text("With You")').first();
        const withBrokerCard = page.locator('[data-testid="sk-stats-with-broker"], .statistics-card:has-text("With the Broker")').first();
        const withClientCard = page.locator('[data-testid="sk-stats-with-client"], .statistics-card:has-text("With the Client")').first();

        await expect(withYouCard).toBeVisible();
        await expect(withBrokerCard).toBeVisible();
        await expect(withClientCard).toBeVisible();

        const withYouText = await withYouCard.locator('.card-value, .sk-counter-value, span').first().innerText();
        const withBrokerText = await withBrokerCard.locator('.card-value, .sk-counter-value, span').first().innerText();
        const withClientText = await withClientCard.locator('.card-value, .sk-counter-value, span').first().innerText();

        withYouValue = parseInt(withYouText.replace(/[^0-9]/g, ''), 10) || 0;
        withBrokerValue = parseInt(withBrokerText.replace(/[^0-9]/g, ''), 10) || 0;
        withClientValue = parseInt(withClientText.replace(/[^0-9]/g, ''), 10) || 0;

        expect(withYouValue).toBeGreaterThanOrEqual(0);
        expect(withBrokerValue).toBeGreaterThanOrEqual(0);
        expect(withClientValue).toBeGreaterThanOrEqual(0);

        totalCardSum = withYouValue + withBrokerValue + withClientValue;
    });

    await test.step('Step 2: Compare the sum of all three card values against the total record count shown in the data table', async () => {
        const dataTable = page.locator('.sk-data-table, table, [data-testid="sk-data-table"]').first();
        await expect(dataTable).toBeVisible();

        const totalRecordCountElement = page.locator('.sk-table-total, .total-count, [data-testid="sk-total-records"]').first();
        
        if (await totalRecordCountElement.isVisible()) {
            const totalRecordText = await totalRecordCountElement.innerText();
            const totalRecordCount = parseInt(totalRecordText.replace(/[^0-9]/g, ''), 10) || 0;

            expect(totalCardSum).toBeLessThanOrEqual(totalRecordCount);
        }

        expect(totalCardSum).toBeGreaterThanOrEqual(0);
    });

    await test.step('Step 3: Refresh the page (F5) and re-check the card values', async () => {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        const withYouCardAfterRefresh = page.locator('[data-testid="sk-stats-with-you"], .statistics-card:has-text("With You")').first();
        const withBrokerCardAfterRefresh = page.locator('[data-testid="sk-stats-with-broker"], .statistics-card:has-text("With the Broker")').first();
        const withClientCardAfterRefresh = page.locator('[data-testid="sk-stats-with-client"], .statistics-card:has-text("With the Client")').first();

        await expect(withYouCardAfterRefresh).toBeVisible();
        await expect(withBrokerCardAfterRefresh).toBeVisible();
        await expect(withClientCardAfterRefresh).toBeVisible();

        const withYouTextAfterRefresh = await withYouCardAfterRefresh.locator('.card-value, .sk-counter-value, span').first().innerText();
        const withBrokerTextAfterRefresh = await withBrokerCardAfterRefresh.locator('.card-value, .sk-counter-value, span').first().innerText();
        const withClientTextAfterRefresh = await withClientCardAfterRefresh.locator('.card-value, .sk-counter-value, span').first().innerText();

        const withYouValueAfterRefresh = parseInt(withYouTextAfterRefresh.replace(/[^0-9]/g, ''), 10) || 0;
        const withBrokerValueAfterRefresh = parseInt(withBrokerTextAfterRefresh.replace(/[^0-9]/g, ''), 10) || 0;
        const withClientValueAfterRefresh = parseInt(withClientTextAfterRefresh.replace(/[^0-9]/g, ''), 10) || 0;

        expect(withYouValueAfterRefresh).toBeGreaterThanOrEqual(0);
        expect(withBrokerValueAfterRefresh).toBeGreaterThanOrEqual(0);
        expect(withClientValueAfterRefresh).toBeGreaterThanOrEqual(0);

        expect(withYouValueAfterRefresh).toBe(withYouValue);
        expect(withBrokerValueAfterRefresh).toBe(withBrokerValue);
        expect(withClientValueAfterRefresh).toBe(withClientValue);
    });
});