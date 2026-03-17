I'll create both the DashboardPage.ts page class and the MGA_Dashboard_Validate.spec.ts test file based on the provided HTML and framework conventions.

---

**FILE 1: pages/DashboardPage.ts**

```typescript
import { Page, expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class DashboardPage extends BasePage {
    private url = '/page/internal/en/US/index';

    // Selectors based on provided HTML
    private readonly selectors = {
        // Main app container
        appContainer: '#sk-app',
        
        // Header/Toolbar
        topBar: '#sk-top-bar',
        toolbar: '#sk-toolbar',
        
        // Logo elements
        primaryLogo: 'img.sk-logo-1',
        secondaryLogo: 'img.sk-logo-2',
        
        // Navigation menu
        navMenu: '#sk-nav',
        homeZone: '#sk-zone-HomeZone',
        tasksZone: '#sk-zone-Tasks',
        reportingZone: '#sk-zone-MyZone',
        productsZone: '#sk-zone-Products',
        processZone: '#sk-zone-ProcessZone',
        
        // Language dropdown
        languageDropdown: '#sk-language',
        languageSelect: '#sk-language-select',
        
        // Search and logout
        searchIcon: 'i.fa-search',
        logoutButton: '#sk-logout',
        
        // Dashboard content
        dashboardHeading: 'h1:has-text("Dashboard")',
        welcomeMessage: 'h3:has-text("Welcome")',
        
        // Dashboard cards
        withYouCard: '[data-testid="sk-ZoneDefinition-HomeZone-MGAWithYouDashBoardHTMLJS"]',
        withBrokerCard: '[data-testid="sk-ZoneDefinition-HomeZone-MGABrokerDashboardCardHTMLJS"]',
        withClientCard: '[data-testid="sk-ZoneDefinition-HomeZone-MGAClientDashboardCard3HTMLJS"]',
        
        // Data table
        autoSearchComponent: '[data-testid="sk-ZoneDefinition-HomeZone-MGAUnderWriterReferralsAutomaticSearchComponent"]',
        dataTable: '.sk-datatable',
        dataTableHeader: '.p-datatable-header',
        dataTableBody: '.p-datatable-tbody',
        dataTableRows: '.p-datatable-tbody tr[role="row"]',
        
        // Tabs
        assignedToMeTab: 'a[title="Assigned to Me"]',
        quotesTab: 'a[title="Quotes"]',
        policiesTab: 'a[title="Policies"]',
        referralsTab: 'a[title="Referrals"]',
        
        // Pagination
        paginationInfo: '.sk-pagination-records',
        paginatorFirst: '.p-paginator-first',
        paginatorPrev: '.p-paginator-prev',
        paginatorNext: '.p-paginator-next',
        paginatorLast: '.p-paginator-last',
        
        // Footer
        footer: '#footer',
        footerText: '.footer-content .text-small-80',
        
        // Action icons in table
        editIcon: 'i.fa-edit',
        viewIcon: 'i.fa-eye',
        tasksIcon: 'i.fa-tasks',
        
        // Refresh button
        refreshButton: '.sk-datatable-refresh',
        
        // Column selector
        columnSelector: '.sk-columns-selector'
    };

    constructor(page: Page) {
        super(page);
    }

    async goto(): Promise<void> {
        await this.page.goto(this.url);
        await this.page.waitForURL(`**${this.url}*`);
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForSelector(this.selectors.appContainer, { state: 'visible', timeout: 30000 });
        return await this.page.isVisible(this.selectors.appContainer);
    }

    async isHeaderVisible(): Promise<boolean> {
        await this.page.waitForSelector(this.selectors.topBar, { state: 'visible' });
        return await this.page.isVisible(this.selectors.topBar);
    }

    async isPrimaryLogoVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.primaryLogo);
    }

    async isSecondaryLogoVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.secondaryLogo);
    }

    async isLanguageDropdownVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.languageDropdown);
    }

    async isLogoutButtonVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.logoutButton);
    }

    async isSearchIconVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.searchIcon);
    }

    async isDashboardHeadingVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.dashboardHeading);
    }

    async getWelcomeMessage(): Promise<string> {
        const welcomeElement = this.page.locator(this.selectors.welcomeMessage);
        await welcomeElement.waitFor({ state: 'visible' });
        return await welcomeElement.innerText();
    }

    async isNavMenuVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.navMenu);
    }

    async getNavMenuItems(): Promise<string[]> {
        const menuItems = this.page.locator('.sk-nav-zones-item .sk-zone-text');
        await menuItems.first().waitFor({ state: 'visible' });
        return await menuItems.allInnerTexts();
    }

    async clickNavZone(zoneName: 'Home' | 'My Tasks' | 'Reporting' | 'Products' | 'Process'): Promise<void> {
        const zoneMap: Record<string, string> = {
            'Home': this.selectors.homeZone,
            'My Tasks': this.selectors.tasksZone,
            'Reporting': this.selectors.reportingZone,
            'Products': this.selectors.productsZone,
            'Process': this.selectors.processZone
        };
        const zoneSelector = zoneMap[zoneName];
        await this.page.locator(zoneSelector).click();
    }

    async isWithYouCardVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.withYouCard);
    }

    async getWithYouCount(): Promise<string> {
        const card = this.page.locator(this.selectors.withYouCard);
        const count = card.locator('h2');
        await count.waitFor({ state: 'visible' });
        return await count.innerText();
    }

    async isWithBrokerCardVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.withBrokerCard);
    }

    async isWithClientCardVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.withClientCard);
    }

    async isDataTableVisible(): Promise<boolean> {
        await this.page.waitForSelector(this.selectors.dataTable, { state: 'visible', timeout: 30000 });
        return await this.page.isVisible(this.selectors.dataTable);
    }

    async getDataTableRowCount(): Promise<number> {
        await this.page.waitForSelector(this.selectors.dataTableRows, { state: 'visible' });
        return await this.page.locator(this.selectors.dataTableRows).count();
    }

    async clickTab(tabName: 'Assigned to Me' | 'Quotes' | 'Policies' | 'Referrals'): Promise<void> {
        const tabMap: Record<string, string> = {
            'Assigned to Me': this.selectors.assignedToMeTab,
            'Quotes': this.selectors.quotesTab,
            'Policies': this.selectors.policiesTab,
            'Referrals': this.selectors.referralsTab
        };
        const tabSelector = tabMap[tabName];
        await this.page.locator(tabSelector).click();
        await this.page.waitForTimeout(1000);
    }

    async getPaginationInfo(): Promise<string> {
        const paginationElement = this.page.locator(this.selectors.paginationInfo);
        await paginationElement.waitFor({ state: 'visible' });
        return await paginationElement.innerText();
    }

    async clickRefreshButton(): Promise<void> {
        const refreshButton = this.page.locator(this.selectors.refreshButton);
        await refreshButton.waitFor({ state: 'visible' });
        await refreshButton.click();
    }

    async isFooterVisible(): Promise<boolean> {
        return await this.page.isVisible(this.selectors.footer);
    }

    async getFooterText(): Promise<string> {
        const footerElement = this.page.locator(this.selectors.footerText);
        await footerElement.waitFor({ state: 'visible' });
        return await footerElement.innerText();
    }

    async clickLogout(): Promise<void> {
        await this.page.locator(this.selectors.logoutButton).click();
    }

    async verifyAllHeaderElementsVisible(): Promise<void> {
        await expect(this.page.locator(this.selectors.topBar)).toBeVisible();
        await expect(this.page.locator(this.selectors.primaryLogo)).toBeVisible();
        await expect(this.page.locator(this.selectors.navMenu)).toBeVisible();
        await expect(this.page.locator(this.selectors.languageDropdown)).toBeVisible();
        await expect(this.page.locator(this.selectors.logoutButton)).toBeVisible();
    }

    async verifyDashboardCardsVisible(): Promise<void> {
        await expect(this.page.locator(this.selectors.withYouCard)).toBeVisible();
        await expect(this.page.locator(this.selectors.withBrokerCard)).toBeVisible();
        await expect(this.page.locator(this.selectors.withClientCard)).toBeVisible();
    }
}
```

---

**FILE 2: tests/generated/MGA_Dashboard_Validate.spec.ts**

```typescript
import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import DashboardPage from '../../pages/DashboardPage';

test.describe('MGA Dashboard Validation Tests', () => {

    test('DASH_001 - Validate Dashboard Header Loads', async ({ page, skye, mga }) => {

        const dashboardPage = new DashboardPage(page);

        await test.step('Step 1: Open Dashboard page and observe header', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        });

        await test.step('Step 2: Verify header menu items are visible', async () => {
            const isHeaderVisible = await dashboardPage.isHeaderVisible();
            expect(isHeaderVisible).toBe(true);

            const isNavMenuVisible = await dashboardPage.isNavMenuVisible();
            expect(isNavMenuVisible).toBe(true);

            const menuItems = await dashboardPage.getNavMenuItems();
            expect(menuItems.length).toBeGreaterThan(0);
            expect(menuItems).toContain('Home');
            expect(menuItems).toContain('My Tasks');
            expect(menuItems).toContain('Products');
            expect(menuItems).toContain('Process');
        });

        await test.step('Step 3: Verify logo is visible', async () => {
            const isPrimaryLogoVisible = await dashboardPage.isPrimaryLogoVisible();
            expect(isPrimaryLogoVisible).toBe(true);
        });

        await test.step('Step 4: Verify language dropdown is visible', async () => {
            const isLanguageDropdownVisible = await dashboardPage.isLanguageDropdownVisible();
            expect(isLanguageDropdownVisible).toBe(true);
        });

        await test.step('Step 5: Verify all header elements are visible', async () => {
            await dashboardPage.verifyAllHeaderElementsVisible();
        });
    });

    test('DASH_002 - Validate Dashboard Content Loads', async ({ page, skye, mga }) => {

        const dashboardPage = new DashboardPage(page);

        await test.step('Step 1: Navigate to Dashboard page', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        });

        await test.step('Step 2: Verify Dashboard heading is displayed', async () => {
            const isDashboardHeadingVisible = await dashboardPage.isDashboardHeadingVisible();
            expect(isDashboardHeadingVisible).toBe(true);
        });

        await test.step('Step 3: Verify Welcome message is displayed', async () => {
            const welcomeMessage = await dashboardPage.getWelcomeMessage();
            expect(welcomeMessage).toContain('Welcome');
        });

        await test.step('Step 4: Verify Dashboard cards are visible', async () => {
            await dashboardPage.verifyDashboardCardsVisible();
            
            const withYouCount = await dashboardPage.getWithYouCount();
            expect(withYouCount).toBeTruthy();
        });

        await test.step('Step 5: Verify Data table is loaded', async () => {
            const isDataTableVisible = await dashboardPage.isDataTableVisible();
            expect(isDataTableVisible).toBe(true);

            const rowCount = await dashboardPage.getDataTableRowCount();
            expect(rowCount).toBeGreaterThan(0);
        });

        await test.step('Step 6: Verify pagination info is displayed', async () => {
            const paginationInfo = await dashboardPage.getPaginationInfo();
            expect(paginationInfo).toContain('Showing records');
        });

        await test.step('Step 7: Verify footer is visible', async () => {
            const isFooterVisible = await dashboardPage.isFooterVisible();
            expect(isFooterVisible).toBe(true);

            const footerText = await dashboardPage.getFooterText();
            expect(footerText).toContain('Tinubu Square');
        });
    });

    test('DASH_003 - Validate Dashboard Tabs Navigation', async ({ page, skye, mga }) => {

        const dashboardPage = new DashboardPage(page);

        await test.step('Step 1: Navigate to Dashboard page', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        });

        await test.step('Step 2: Verify Assigned to Me tab is active by default', async () => {
            const activeTab = page.locator('.sk-autosearch-tab--active a');
            await expect(activeTab).toHaveAttribute('title', 'Assigned to Me');
        });

        await test.step('Step 3: Click on Quotes tab and verify', async () => {
            await dashboardPage.clickTab('Quotes');
            const quotesTab = page.locator('a[title="Quotes"]');
            await expect(quotesTab.locator('..')).toHaveClass(/sk-autosearch-tab/);
        });

        await test.step('Step 4: Click on Policies tab and verify', async () => {
            await dashboardPage.clickTab('Policies');
            const policiesTab = page.locator('a[title="Policies"]');
            await expect(policiesTab).toBeVisible();
        });

        await test.step('Step 5: Click on Referrals tab and verify', async () => {
            await dashboardPage.clickTab('Referrals');
            const referralsTab = page.locator('a[title="Referrals"]');
            await expect(referralsTab).toBeVisible();
        });
    });

    test('DASH_004 - Validate Logout Button Functionality', async ({ page, skye, mga }) => {

        const dashboardPage = new DashboardPage(page);

        await test.step('Step 1: Navigate to Dashboard page', async () => {
            await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        });

        await test.step('Step 2: Verify logout button is visible', async () => {
            const isLogoutVisible = await dashboardPage.isLogoutButtonVisible();
            expect(isLogoutVisible).toBe(true);
        });

        await test.step('Step 3: Verify logout button has correct href', async () => {
            const logoutButton = page.locator('#sk-logout');
            await expect(logoutButton).toHaveAttribute('href', /idpLogout/);
        });
    });

});
```