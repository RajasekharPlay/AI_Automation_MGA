import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_003 - Validate Summary Tiles', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    await test.step('Step 1: Navigate to dashboard and observe 3 KPI tiles', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.sk-summary-tile', { state: 'visible', timeout: 30000 });

        // Verify exactly 3 summary tiles are present
        const summaryTiles = page.locator('.sk-summary-tile');
        await expect(summaryTiles).toHaveCount(3);

        // Verify each tile has numbers and labels
        for (let i = 0; i < 3; i++) {
            const tile = summaryTiles.nth(i);
            await expect(tile).toBeVisible();
            
            // Verify tile has a number/value
            const tileValue = tile.locator('.sk-summary-tile-value, .sk-tile-number, .tile-value');
            await expect(tileValue).toBeVisible();
            
            // Verify tile has a label
            const tileLabel = tile.locator('.sk-summary-tile-label, .sk-tile-label, .tile-label');
            await expect(tileLabel).toBeVisible();
        }

        // Verify specific tiles for With You / Broker / Client if identifiable
        const withYouTile = page.locator('.sk-summary-tile').filter({ hasText: /with you|With You/i });
        const brokerTile = page.locator('.sk-summary-tile').filter({ hasText: /broker|Broker/i });
        const clientTile = page.locator('.sk-summary-tile').filter({ hasText: /client|Client/i });

        if (await withYouTile.count() > 0) {
            await expect(withYouTile).toBeVisible();
        }
        if (await brokerTile.count() > 0) {
            await expect(brokerTile).toBeVisible();
        }
        if (await clientTile.count() > 0) {
            await expect(clientTile).toBeVisible();
        }
    });
});