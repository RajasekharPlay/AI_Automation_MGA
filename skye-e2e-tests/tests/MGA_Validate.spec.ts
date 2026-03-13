import { test } from '../fixtures/Fixtures';
import { expect } from "@playwright/test";
import MainPage from '../pages/MainPage';


test('MGA test', async ({ page, skye, mga }) => {
    const mainPage = new MainPage(page);
    await test.step('Load the page', async ()=>{
        await mainPage.goto();
        expect(await mainPage.isLoaded()).toBe(true);
        await mga.checkGeo();
    });

});