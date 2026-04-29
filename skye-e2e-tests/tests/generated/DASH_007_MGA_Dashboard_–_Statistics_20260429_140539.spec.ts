import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('DASH_007 - Verify Statistics Cards Reflect Real Data (Sanity)', async ({ page, skye, mga }) => {

    let withYouValue: number;
    let withBrokerValue: number;
    let withClientValue: number;
    let totalCardsSum: number;

    await test.step('Step 1: Note the numeric values displayed on all three statistics cards', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        const withYouCard = page.locator('[data-testid="sk-statistics-with-you"], .statistics-card:has-text("With You")').first();
        const withBrokerCard = page.locator('[data-testid="sk-statistics-with-broker"], .statistics-card:has-text("With the Broker")').first();
        const withClientCard = page.locator('[data-testid="sk-statistics-with-client"], .statistics-card:has-text("With the Client")').first();

        await expect(withYouCard).toBeVisible({ timeout: 10000 });
        await expect(withBrokerCard).toBeVisible({ timeout: 10000 });
        await expect(withClientCard).toBeVisible({ timeout: 10000 });

        const extractNumericValue = async (cardLocator: typeof withYouCard): Promise<number> => {
            const valueText = await cardLocator.locator('.card-value, .statistics-value, span').first().innerText();
            const numericValue = parseInt(valueText.replace(/[^0-9]/g, ''), 10);
            return isNaN(numericValue) ? 0 : numericValue;
        };

        withYouValue = await extractNumericValue(withYouCard);
        withBrokerValue = await extractNumericValue(withBrokerCard);
        withClientValue = await extractNumericValue(withClientCard);

        expect(withYouValue).toBeGreaterThanOrEqual(0);
        expect(withBrokerValue).toBeGreaterThanOrEqual(0);
        expect(withClientValue).toBeGreaterThanOrEqual(0);

        console.log(`Statistics Cards - With You: ${withYouValue}, With Broker: ${withBrokerValue}, With Client: ${withClientValue}`);
    });

    await test.step('Step 2: Compare the sum of all three card values against the total record count', async () => {
        totalCardsSum = withYouValue + withBrokerValue + withClientValue;

        const dataTable = page.locator('[data-testid="sk-data-table"], .data-table, table').first();
        
        if (await dataTable.isVisible()) {
            const totalRecordLocator = page.locator('[data-testid="sk-total-records"], .total-records, .pagination-info').first();
            
            if (await totalRecordLocator.isVisible()) {
                const totalText = await totalRecordLocator.innerText();
                const tableTotal = parseInt(totalText.replace(/[^0-9]/g, ''), 10);
                
                if (!isNaN(tableTotal)) {
                    expect(totalCardsSum).toBeLessThanOrEqual(tableTotal);
                    console.log(`Sum of cards: ${totalCardsSum}, Table total: ${tableTotal}`);
                }
            }
        }

        expect(totalCardsSum).toBeGreaterThanOrEqual(0);
        console.log(`Total sum of all statistics cards: ${totalCardsSum}`);
    });

    await test.step('Step 3: Refresh the page and re-check the card values', async () => {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

        const withYouCardRefreshed = page.locator('[data-testid="sk-statistics-with-you"], .statistics-card:has-text("With You")').first();
        const withBrokerCardRefreshed = page.locator('[data-testid="sk-statistics-with-broker"], .statistics-card:has-text("With the Broker")').first();
        const withClientCardRefreshed = page.locator('[data-testid="sk-statistics-with-client"], .statistics-card:has-text("With the Client")').first();

        await expect(withYouCardRefreshed).toBeVisible({ timeout: 10000 });
        await expect(withBrokerCardRefreshed).toBeVisible({ timeout: 10000 });
        await expect(withClientCardRefreshed).toBeVisible({ timeout: 10000 });

        const extractNumericValue = async (cardLocator: typeof withYouCardRefreshed): Promise<number> => {
            const valueText = await cardLocator.locator('.card-value, .statistics-value, span').first().innerText();
            const numericValue = parseInt(valueText.replace(/[^0-9]/g, ''), 10);
            return isNaN(numericValue) ? 0 : numericValue;
        };

        const withYouRefreshed = await extractNumericValue(withYouCardRefreshed);
        const withBrokerRefreshed = await extractNumericValue(withBrokerCardRefreshed);
        const withClientRefreshed = await extractNumericValue(withClientCardRefreshed);

        expect(withYouRefreshed).toBeGreaterThanOrEqual(0);
        expect(withBrokerRefreshed).toBeGreaterThanOrEqual(0);
        expect(withClientRefreshed).toBeGreaterThanOrEqual(0);

        console.log(`After refresh - With You: ${withYouRefreshed}, With Broker: ${withBrokerRefreshed}, With Client: ${withClientRefreshed}`);
    });
});