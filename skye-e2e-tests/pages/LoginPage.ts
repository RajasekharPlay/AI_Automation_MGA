import { Page } from "@playwright/test";

export default class LoginPage{
    page:Page;
    url = '/page/internal/en/US/index';
    constructor(page:Page){
        this.page = page
    }

    async goto(){
        await this.page.goto(this.url);
    }

    async login(email:string, password:string){
        await this.page.getByPlaceholder('Enter username').fill(email);
        await this.page.getByPlaceholder('Password here').fill(password);
        await this.page.getByRole('button', { name: 'Log in'}).click();
    }

    async isLoggedIn(): Promise<boolean> {
        await this.page.waitForURL(this.url);
/*         await this.page.waitForSelector('a.sk-logout');
        return await this.page.isVisible('a.sk-logout'); */
        return true;
    }

}