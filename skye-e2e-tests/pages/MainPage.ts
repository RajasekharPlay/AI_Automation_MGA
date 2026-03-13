import { Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class MainPage extends BasePage {
    private url = '/page/customerportal/es/MX/index';

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
        await this.page.waitForSelector('div.custom-cards-list.horizontal');
        return await this.page.isVisible('div.custom-cards-list.horizontal');
    }
}