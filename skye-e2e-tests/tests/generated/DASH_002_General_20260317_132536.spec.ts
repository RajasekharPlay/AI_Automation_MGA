I'll create both the DashboardPage.ts page class and the MGA_Dashboard_Validate.spec.ts test file based on the provided HTML and framework conventions.

---

**FILE 1: pages/DashboardPage.ts**

```typescript
import { Page, expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class DashboardPage extends BasePage {
    private url = '/page/internal/en/US/index';

    // Locators based on provided HTML
    private readonly dashboardContainer = '#sk-app';
    private readonly dashboardTitle = 'h1';
    private readonly welcomeMessage = 'h3';
    private readonly homeZoneTab = '#sk-zone-HomeZone';
    private readonly myTasksTab = '#sk-zone-Tasks';
    private readonly reportingTab = '#sk-zone-MyZone';
    private readonly productsTab = '#sk-zone-Products';
    private readonly processTab = '#sk-zone-ProcessZone';
    private readonly logoutButton = '#sk-logout';
    private readonly searchIcon = 'i.fa-search';
    private readonly primaryLogo = 'img.sk-logo-1';
    private readonly secondaryLogo = 'img.sk-logo-2';
    private readonly withYouCard = '[data-testid="sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS"]';
    private readonly withBrokerCard = '[data-testid="sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS"]';
    private readonly withClientCard = '[data-testid="sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS"]';
    private readonly assignedToMeTab = '[title="Assigned to Me"]';
    private readonly quotesTab = '[title="Quotes"]';
    private readonly policiesTab = '[title="Policies"]';
    private readonly referralsTab = '[title="Referrals"]';
    private readonly dataTable = '.sk-datatable';
    private readonly footerText = '.footer-content span';

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(this.url);
        await this.page.waitForURL(`**${this.url}**`);
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForSelector(this.dashboardContainer, { state: 'visible', timeout: 30000 });
        return await this.page.isVisible(this.dashboardContainer);
    }

    async getDashboardTitle(): Promise<string> {
        const titleElement = this.page.locator(this.dashboardTitle).first();
        await titleElement.waitFor({ state: 'visible' });
        return await titleElement.innerText();
    }

    async getWelcomeMessage(): Promise<string> {
        const welcomeElement = this.page.locator(this.welcomeMessage).first();
        await welcomeElement.waitFor({ state: 'visible' });
        return await welcomeElement.innerText();
    }

    async verifyDashboardTitleIsDisplayed(): Promise<void> {
        const titleElement = this.page.locator(this.dashboardTitle).first();
        await expect(titleElement).toBeVisible();
        await expect(titleElement).toHaveText('Dashboard');
    }

    async verifyWelcomeMessageContainsUsername(username: string): Promise<void> {
        const welcomeElement = this.page.locator(this.welcomeMessage).first();
        await expect(welcomeElement).toBeVisible();
        await expect(welcomeElement).toContainText(`Welcome ${username}`);
    }

    async verifyWelcomeMessageIsDisplayed(): Promise<void> {
        const welcomeElement = this.page.locator(this.welcomeMessage).first();
        await expect(welcomeElement).toBeVisible();
        const text = await welcomeElement.innerText();
        expect(text).toContain('Welcome');
    }

    async isLogoutButtonVisible(): Promise<boolean> {
        return await this.page.isVisible(this.logoutButton);
    }

    async clickOnHomeZone(): Promise<void> {
        await this.page.locator(this.homeZoneTab).first().click();
    }

    async clickOnMyTasksZone(): Promise<void> {
        await this.page.locator(this.myTasksTab).click();
    }

    async clickOnReportingZone(): Promise<void> {
        await this.page.locator(this.reportingTab).click();
    }

    async clickOnProductsZone(): Promise<void> {
        await this.page.locator(this.productsTab).click();
    }

    async clickOnProcessZone(): Promise<void> {
        await this.page.locator(this.processTab).click();
    }

    async verifyWithYouCardIsDisplayed(): Promise<void> {
        const card = this.page.locator(this.withYouCard);
        await expect(card).toBeVisible();
    }

    async getWithYouCardValue(): Promise<string> {
        const card = this.page.locator(this.withYouCard);
        const valueElement = card.locator('h2');
        return await valueElement.innerText();
    }

    async verifyWithBrokerCardIsDisplayed(): Promise<void> {
        const card = this.page.locator(this.withBrokerCard);
        await expect(card).toBeVisible();
    }

    async verifyWithClientCardIsDisplayed(): Promise<void> {
        const card = this.page.locator(this.withClientCard);
        await expect(card).toBeVisible();
    }

    async clickOnAssignedToMeTab(): Promise<void> {
        await this.page.locator(this.assignedToMeTab).click();
    }

    async clickOnQuotesTab(): Promise<void> {
        await this.page.locator(this.quotesTab).click();
    }

    async clickOnPoliciesTab(): Promise<void> {
        await this.page.locator(this.policiesTab).click();
    }

    async clickOnReferralsTab(): Promise<void> {
        await this.page.locator(this.referralsTab).click();
    }

    async verifyDataTableIsDisplayed(): Promise<void> {
        const table = this.page.locator(this.dataTable);
        await expect(table).toBeVisible();
    }

    async getDataTableRecordsCount(): Promise<number> {
        const table = this.page.locator(this.dataTable);
        const recordsCountAttr = await table.getAttribute('data-records-count');
        return recordsCountAttr ? parseInt(recordsCountAttr, 10) : 0;
    }

    async verifyPrimaryLogoIsDisplayed(): Promise<void> {
        const logo = this.page.locator(this.primaryLogo);
        await expect(logo).toBeVisible();
    }

    async verifyFooterIsDisplayed(): Promise<void> {
        const footer = this.page.locator(this.footerText);
        await expect(footer).toBeVisible();
        await expect(footer).toContainText('Tinubu Square SA');
    }

    async logout(): Promise<void> {
        await this.page.locator(this.logoutButton).click();
    }
}
```

---

**FILE 2: tests/MGA_Dashboard_Validate.spec.ts**

```typescript
import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import DashboardPage from '../../pages/DashboardPage';

test.describe('MGA Dashboard Validation Tests', () => {

    test('DASH_001 - Validate Dashboard Header Loads', async ({ page, skye, mga }) => {

        const dashboardPage = new DashboardPage(page);

        await test.step('Step 1: Navigate to the application URL', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        });

        await test.step('Step 2: Verify the dashboard main container is visible', async () => {
            await expect(page.locator('#sk-app')).toBeVisible();
            const isLoaded = await dashboardPage.isLoaded();
            expect(isLoaded).toBe(true);
        });

        await test.step('Step 3: Verify page title or heading is displayed', async () => {
            await dashboardPage.verifyDashboardTitleIsDisplayed();
            await dashboardPage.verifyPrimaryLogoIsDisplayed();
        });
    });

    test('DASH_002 - Validate Welcome Message', async ({ page, skye, mga }) => {

        const dashboardPage = new DashboardPage(page);

        await test.step('Step 1: Check Dashboard title and welcome text', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });

            // Verify Dashboard title is displayed
            await dashboardPage.verifyDashboardTitleIsDisplayed();
            const dashboardTitle = await dashboardPage.getDashboardTitle();
            expect(dashboardTitle).toBe('Dashboard');

            // Verify Welcome message is displayed with username
            await dashboardPage.verifyWelcomeMessageIsDisplayed();
            const welcomeMessage = await dashboardPage.getWelcomeMessage();
            expect(welcomeMessage).toContain('Welcome');

            // Verify the logout button is visible (indicates user is logged in)
            const isLogoutVisible = await dashboardPage.isLogoutButtonVisible();
            expect(isLogoutVisible).toBe(true);
        });
    });

});
```