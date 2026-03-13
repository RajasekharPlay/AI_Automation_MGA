import { Page } from "@playwright/test";
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";

export default abstract class BasePage {
    page: Page;
    skye: SkyeAttributeCommands;

    constructor(page: Page, skye?: SkyeAttributeCommands){
        this.page = page;
        this.skye = skye;
    }

    public async clickOnButton(buttonName:string) {
        const btn = this.page.getByRole('button', { name: buttonName });
        await btn.waitFor({ timeout: 10000 });
        await btn.click();
    }

    public async clickOnLink(linkName:string) {
        const link = this.page.getByRole('link', { name: linkName });
        await link.waitFor({ timeout: 10000 });
        await link.click();
    };
}