I'll create both the PetsPage class and the test file. Let me generate them:

**File 1: skye-e2e-tests/pages/PetsPage.ts**

```typescript
import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class PetsPage extends BasePage {
    // Locators
    private navMenuButton: Locator;
    private mascotasOption: Locator;
    private verSeguroButton: Locator;
    private coberturasBaseTab: Locator;
    private serviciosOpcionalesTab: Locator;
    private exclusionesTab: Locator;

    constructor(page: Page) {
        super(page);
        this.navMenuButton = page.getByTestId('sk-nav-menu');
        this.mascotasOption = page.getByRole('link', { name: 'Mascotas' });
        this.verSeguroButton = page.getByRole('link', { name: 'Ver seguro' });
        this.coberturasBaseTab = page.getByRole('tab', { name: 'Coberturas base' });
        this.serviciosOpcionalesTab = page.getByRole('tab', { name: 'Servicios opcionales' });
        this.exclusionesTab = page.getByRole('tab', { name: 'Exclusiones' });
    }

    async openNavigationMenu(): Promise<void> {
        await this.navMenuButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.navMenuButton.click();
    }

    async selectMascotasOption(): Promise<void> {
        await this.mascotasOption.waitFor({ state: 'visible', timeout: 10000 });
        await this.mascotasOption.click();
    }

    async clickVerSeguro(): Promise<void> {
        await this.verSeguroButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.verSeguroButton.click();
    }

    async isCoberturasBaseTabVisible(): Promise<boolean> {
        await this.coberturasBaseTab.waitFor({ state: 'visible', timeout: 10000 });
        return await this.coberturasBaseTab.isVisible();
    }

    async isServiciosOpcionalesTabVisible(): Promise<boolean> {
        await this.serviciosOpcionalesTab.waitFor({ state: 'visible', timeout: 10000 });
        return await this.serviciosOpcionalesTab.isVisible();
    }

    async isExclusionesTabVisible(): Promise<boolean> {
        await this.exclusionesTab.waitFor({ state: 'visible', timeout: 10000 });
        return await this.exclusionesTab.isVisible();
    }

    getCoberturasBaseTab(): Locator {
        return this.coberturasBaseTab;
    }

    getServiciosOpcionalesTab(): Locator {
        return this.serviciosOpcionalesTab;
    }

    getExclusionesTab(): Locator {
        return this.exclusionesTab;
    }
}
```

**File 2: skye-e2e-tests/tests/generated/RB005_PetsLandingPageTabs.spec.ts**

```typescript
import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import PetsPage from '../../pages/PetsPage';

test('RB005 - Verify Pet landing page with newly added 3 tabs from public page', async ({ page, skye, mga }) => {

    const petsPage = new PetsPage(page);

    await test.step('Step 1 & 2: Navigate to Seguros Banorte application', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-testid="sk-nav-menu"]', { state: 'visible', timeout: 30000 });
    });

    await test.step('Step 3: User clicks on the navigation menu', async () => {
        await petsPage.openNavigationMenu();
    });

    await test.step('Step 4: User selects the Mascotas option', async () => {
        await petsPage.selectMascotasOption();
    });

    await test.step('Step 5: User clicks on Ver seguro', async () => {
        await petsPage.clickVerSeguro();
    });

    await test.step('Step 6, 7, 8, 9: Verify all 3 tabs are visible', async () => {
        const isCoberturasBaseVisible = await petsPage.isCoberturasBaseTabVisible();
        expect(isCoberturasBaseVisible).toBe(true);
        await expect(petsPage.getCoberturasBaseTab()).toBeVisible();

        const isServiciosOpcionalesVisible = await petsPage.isServiciosOpcionalesTabVisible();
        expect(isServiciosOpcionalesVisible).toBe(true);
        await expect(petsPage.getServiciosOpcionalesTab()).toBeVisible();

        const isExclusionesVisible = await petsPage.isExclusionesTabVisible();
        expect(isExclusionesVisible).toBe(true);
        await expect(petsPage.getExclusionesTab()).toBeVisible();
    });
});
```