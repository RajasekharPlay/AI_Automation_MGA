I'll generate two files as requested: `RajPage.ts` (page class) and `RAja.spec.ts` (test spec file).

**FILE 1: pages/RajPage.ts**

```typescript
import { Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class RajPage extends BasePage {
    private url = '/page/private/es/MX/index';

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(this.url);
        await this.page.waitForURL(`**${this.url}**`);
    }

    async clickOnNavigationMenu() {
        const navMenu = this.page.getByTestId('sk-nav-menu');
        await navMenu.waitFor({ state: 'visible', timeout: 30000 });
        await navMenu.click();
    }

    async selectMascotasOption() {
        const mascotasOption = this.page.getByText('Mascotas');
        await mascotasOption.waitFor({ state: 'visible', timeout: 10000 });
        await mascotasOption.click();
    }

    async clickVerSeguro() {
        const verSeguroButton = this.page.getByText('Ver seguro');
        await verSeguroButton.waitFor({ state: 'visible', timeout: 10000 });
        await verSeguroButton.click();
    }

    async isTabVisible(tabName: string): Promise<boolean> {
        const tab = this.page.getByRole('tab', { name: tabName });
        await tab.waitFor({ state: 'visible', timeout: 10000 });
        return await tab.isVisible();
    }

    async verifyCoberturasBaseTabVisible(): Promise<boolean> {
        return await this.isTabVisible('Coberturas base');
    }

    async verifyServiciosOpcionalesTabVisible(): Promise<boolean> {
        return await this.isTabVisible('Servicios opcionales');
    }

    async verifyExclusionesTabVisible(): Promise<boolean> {
        return await this.isTabVisible('Exclusiones');
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        return await this.page.isVisible('#sk-app');
    }
}
```

**FILE 2: tests/generated/RAja.spec.ts**

```typescript
import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import RajPage from '../../pages/RajPage';

test('RB001 - Verify Pet landing page with newly added 3 tabs from public page', async ({ page, skye, mga }) => {

    const rajPage = new RajPage(page);

    await test.step('Step 1 & 2: Navigate to Seguros Banorte application', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-testid="sk-nav-menu"]', { state: 'visible', timeout: 30000 });
        const isLoaded = await rajPage.isLoaded();
        expect(isLoaded).toBe(true);
    });

    await test.step('Step 3: User clicks on the navigation menu', async () => {
        await rajPage.clickOnNavigationMenu();
    });

    await test.step('Step 4: User selects the Mascotas option', async () => {
        await rajPage.selectMascotasOption();
    });

    await test.step('Step 5: User clicks on Ver seguro', async () => {
        await rajPage.clickVerSeguro();
    });

    await test.step('Step 6 & 7: Verify Coberturas base tab is visible', async () => {
        const isCoberturasBaseVisible = await rajPage.verifyCoberturasBaseTabVisible();
        expect(isCoberturasBaseVisible).toBe(true);
    });

    await test.step('Step 8: Verify Servicios opcionales tab is visible', async () => {
        const isServiciosOpcionalesVisible = await rajPage.verifyServiciosOpcionalesTabVisible();
        expect(isServiciosOpcionalesVisible).toBe(true);
    });

    await test.step('Step 9: Verify Exclusiones tab is visible', async () => {
        const isExclusionesVisible = await rajPage.verifyExclusionesTabVisible();
        expect(isExclusionesVisible).toBe(true);
    });
});
```