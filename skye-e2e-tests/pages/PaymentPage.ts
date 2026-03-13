import { expect, Page } from "@playwright/test";
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";
import BasePage from "./BasePage";

export default class PaymentPage extends BasePage {
    constructor(page:Page, skye:SkyeAttributeCommands){
        super(page, skye);
    }

    async fillCardNumber(cardNumber: string) {
        await this.page.locator('[id="sk-payment-card-number"]').fill(cardNumber);
    }

    async fillCardNumberExpiryDate(expiryDate: string) {
        await this.page.locator('[id="sk-payment-expiry-date"]').fill(expiryDate);
    }

    async fillCardNumberCVV(cvv: string) {
        await this.page.locator('[id="sk-payment-cvv"]').fill(cvv);
    }

    async clickPay() {
        const button = this.page.getByRole('button', { name: 'Pagar' });
        await button.waitFor({ state: 'visible' });
        await button.click();
    }

    async isPaymentAmountEqualsExpectedAmount(expectedAmount: number) {
        const element = this.page.locator('.sk-payment-amount b');
        const text = await element.innerText();
        const amount = Number(text.split(' ')[1]);
        expect(amount).toEqual(expectedAmount);
    }
}