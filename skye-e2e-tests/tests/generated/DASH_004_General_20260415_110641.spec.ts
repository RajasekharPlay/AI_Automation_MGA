import { test } from '../../fixtures/Fixtures';
import { expect } from '@playwright/test';
import MainPage from '../../pages/MainPage';

test('DASH_004 - Validate Tab Navigation', async ({ page, skye, mga }) => {

    const mainPage = new MainPage(page);

    await test.step('Step 1: Navigate to the dashboard and ensure it loads', async () => {
        await page.goto(process.env.pw_HOST!, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-testid="sk-nav-menu"]', { state: 'visible', timeout: 30000 });
        
        // Verify dashboard is loaded
        const isLoaded = await mainPage.isLoaded();
        expect(isLoaded).toBe(true);
    });

    await test.step('Step 2: Click and validate Quotes tab', async () => {
        const quotesTab = page.getByTestId('sk-nav-quotes');
        await expect(quotesTab).toBeVisible();
        await quotesTab.click();
        
        // Wait for content to load and verify active state
        await expect(quotesTab).toHaveClass(/active|selected/);
        await expect(page.locator('[data-testid="sk-quotes-content"], #quotes-content')).toBeVisible();
    });

    await test.step('Step 3: Click and validate Policies tab', async () => {
        const policiesTab = page.getByTestId('sk-nav-policies');
        await expect(policiesTab).toBeVisible();
        await policiesTab.click();
        
        // Wait for content to load and verify active state
        await expect(policiesTab).toHaveClass(/active|selected/);
        await expect(page.locator('[data-testid="sk-policies-content"], #policies-content')).toBeVisible();
    });

    await test.step('Step 4: Click and validate Assigned to Me tab', async () => {
        const assignedTab = page.getByTestId('sk-nav-assigned');
        await expect(assignedTab).toBeVisible();
        await assignedTab.click();
        
        // Wait for content to load and verify active state
        await expect(assignedTab).toHaveClass(/active|selected/);
        await expect(page.locator('[data-testid="sk-assigned-content"], #assigned-content')).toBeVisible();
    });

    await test.step('Step 5: Click and validate Referrals tab', async () => {
        const referralsTab = page.getByTestId('sk-nav-referrals');
        await expect(referralsTab).toBeVisible();
        await referralsTab.click();
        
        // Wait for content to load and verify active state
        await expect(referralsTab).toHaveClass(/active|selected/);
        await expect(page.locator('[data-testid="sk-referrals-content"], #referrals-content')).toBeVisible();
    });
});