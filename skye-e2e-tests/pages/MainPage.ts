import { Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class MainPage extends BasePage {
    private url = '/page/internal/en/US/index';

    constructor(page:Page){
        super(page);
    }

    async goto(){
        await this.page.goto(this.url);
        await this.page.waitForURL(this.url);
    }

    async selectProductByAlt(altText: string) {
        const productSelector = `img[alt="${altText}"]`;
        await this.page.waitForSelector(productSelector, { state: 'visible' });
        await this.page.locator(productSelector).click();
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForSelector('sk-app');
        return await this.page.isVisible('sk-app');
    }
}