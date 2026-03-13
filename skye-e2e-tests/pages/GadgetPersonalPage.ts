import { Page } from "@playwright/test";
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";
import BasePage from "./BasePage";

export default class GadgetPersonalPage extends BasePage {
    constructor(page:Page, skye:SkyeAttributeCommands){
        super(page, skye);
    }

    public async enablePersonalPropertyInsurance() {
        const element = this.page.locator(
            'i[class="sk-icon fal fa-sk-icon fal fa-plus  sk-option-icon"]');
        await element.waitFor();
        await element.click();
    }

    private async increaseInstrumentalItem() {
        const element = this.page.locator(`div[data-testid="sk-CreatePersonalItemsQuotePublicProcess2UI1-FieldsetGroup2-Fieldset5-Instruments"] a`);
        element.waitFor();
        await element.click();
    }

    public async addInstrumentsAndFillData(nthIndex: number, typeIndex: number, testData_type: string, instrumentIndex: number, testData_instrument: string, valueIndex: number, testData_value: string) {
        await this.increaseInstrumentalItem();
        await this.skye.selectFromDropdown(`sk-Personal-Product-ProductData-MyThings-PersonalItems-MusicalList°${nthIndex}-TypeOfInstrument`, typeIndex, testData_type);
        await this.skye.selectFromDropdown(`sk-Personal-Product-ProductData-MyThings-PersonalItems-MusicalList°${nthIndex}-Instrument`, instrumentIndex, testData_instrument);
        await this.skye.selectFromDropdown(`sk-Personal-Product-ProductData-MyThings-PersonalItems-MusicalList°${nthIndex}-Value`, valueIndex, testData_value);
    }

    public async selectCardTypeAndAcceptTerms(paymentCardType: string){
        await this.skye.selectFromDropdown('sk-SecureThings-Payment-PaymentMethod', 1, paymentCardType);
        await this.skye.selectFromCheckbox('SecureThings-Summary-AcceptRecurringPayment-1checkbox');
        await this.skye.selectFromCheckbox('SecureThings-Summary-AcceptGeneralConditions-1checkbox');
    }
}