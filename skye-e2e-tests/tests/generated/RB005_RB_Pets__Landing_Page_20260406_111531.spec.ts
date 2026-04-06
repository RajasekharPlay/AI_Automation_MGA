import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';

test('RB005 - Verify Pet landing page with newly added 3 tabs from public page', async ({ page, skye, mga }) => {

    await test.step('Step 1 & 2: Navigate to Seguros Banorte application', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-testid="sk-nav-menu"]', { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 3: User clicks on the navigation menu', async () => {
        await page.getByTestId('sk-nav-menu').click();
    });

    await test.step('Step 4: User selects the "Mascotas" option', async () => {
        const mascotasOption = page.getByRole('link', { name: 'Mascotas' });
        await mascotasOption.waitFor({ state: 'visible', timeout: 10000 });
        await mascotasOption.click();
    });

    await test.step('Step 5: User clicks on "Ver seguro"', async () => {
        const verSeguroButton = page.getByRole('link', { name: 'Ver seguro' });
        await verSeguroButton.waitFor({ state: 'visible', timeout: 10000 });
        await verSeguroButton.click();
    });

    await test.step('Step 6-9: Verify user is able to see the 3 tabs', async () => {
        const coberturasBaseTab = page.getByRole('tab', { name: 'Coberturas base' });
        await expect(coberturasBaseTab).toBeVisible({ timeout: 10000 });

        const serviciosOpcionalesTab = page.getByRole('tab', { name: 'Servicios opcionales' });
        await expect(serviciosOpcionalesTab).toBeVisible();

        const exclusionesTab = page.getByRole('tab', { name: 'Exclusiones' });
        await expect(exclusionesTab).toBeVisible();
    });
});