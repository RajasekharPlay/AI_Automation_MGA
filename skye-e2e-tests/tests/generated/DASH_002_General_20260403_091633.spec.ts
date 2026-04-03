**FILE 1: DashboardTest001.spec.ts**

```typescript
import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import DashboardPage from '../../pages/Dashboard_Page';
import BasePage from '../../pages/BasePage';

test('DASH_002 - Validate Welcome Message', async ({ page, skye, mga }) => {

    const dashboardPage = new DashboardPage(page);

    await test.step('Step 1: Check Dashboard title and welcome text', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#sk-app', { state: 'visible', timeout: 30000 });
        
        const isDashboardLoaded = await dashboardPage.isLoaded();
        expect(isDashboardLoaded).toBe(true);
        
        const welcomeMessage = await dashboardPage.getWelcomeMessage();
        expect(welcomeMessage).toContain('Welcome');
        
        const dashboardTitle = await dashboardPage.getDashboardTitle();
        expect(dashboardTitle).toBeTruthy();
    });
});
```

**FILE 2: Dashboard_Page.ts**

```typescript
import { Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class DashboardPage extends BasePage {
    private url = '/page/internal/en/US/index';

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(this.url);
        await this.page.waitForURL(this.url);
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForSelector('#sk-app');
        return await this.page.isVisible('#sk-app');
    }

    async getDashboardTitle(): Promise<string> {
        const titleSelectors = ['h1', 'h2', '[data-testid="page-title"]', '.sk-page-title'];
        
        for (const selector of titleSelectors) {
            const element = this.page.locator(selector).first();
            if (await element.isVisible()) {
                return await element.innerText();
            }
        }
        
        return '';
    }

    async getWelcomeMessage(): Promise<string> {
        const welcomeSelectors = [
            '[data-testid="welcome-message"]',
            '.sk-welcome-message',
            'sk-logout',
            '[class*="welcome"]'
        ];
        
        for (const selector of welcomeSelectors) {
            const element = this.page.locator(selector).first();
            if (await element.isVisible()) {
                return await element.innerText();
            }
        }
        
        return '';
    }

    async getLoggedInUsername(): Promise<string> {
        const logoutElement = this.page.locator('sk-logout');
        if (await logoutElement.isVisible()) {
            const text = await logoutElement.innerText();
            const usernameMatch = text.match(/Welcome\s+(.+)/i);
            return usernameMatch ? usernameMatch[1].trim() : '';
        }
        
        return '';
    }
}
```