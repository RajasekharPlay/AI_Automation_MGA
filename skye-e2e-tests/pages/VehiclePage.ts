import test, { Page } from "@playwright/test";
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";
import { expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class VehiclePage extends BasePage {
    constructor(page: Page, skye: SkyeAttributeCommands){
        super(page, skye);
    }

    public async fillVehicleData(){
        await this.selectFromFlexDataDropdown('sk-Auto-Product-ProductData-AutoBrandFlexdata','AUDI','AUDI');            
        await this.selectFromFlexDataDropdown('sk-Auto-Product-ProductData-AutoModelFlexdata','A4','A4');
        await this.selectFromFlexDataDropdown('sk-Auto-Product-ProductData-AutoYearFlexdata','2020','2020');
    };

    public async selectFromFlexDataDropdown(
        skTestId: string,
        inputValue: string,
        expectedValueSavedToDb: string
    ) {
        await test.step(`Selecting ${expectedValueSavedToDb} in flexdata dropdown`, async () => {
            const flexData = this.page.getByTestId(skTestId)
            const flexDataInput = flexData.locator('input.react-select__input')

            await flexDataInput.pressSequentially(inputValue);
            await this.page.waitForTimeout(1000); // temp solution — better to wait on a specific thing

            await this.skye.inputToSkyeAndWaitForBackendResponse(
                flexDataInput,
                () => flexDataInput.press('Enter')
            )

        const selectedLabel = flexData.locator('.sk-dropdownlist-option-label');
        await expect(selectedLabel).toHaveText(expectedValueSavedToDb, { timeout: 20000 });
        },{box: true});
    }

    public async fillPaymentInfo(){
        await this.skye.selectFromDropdown('sk-Auto-Product-Payment-PaymentMethod',1,'Débito');
        await this.selectFromFlexDataDropdown('sk-Auto-Product-Payment-BankNameFlexdata','Banorte','Banorte');
        await this.skye.fillGenericTextbox('Auto-Product-Payment-CardNumber','4242424242424242');
        await this.skye.fillGenericTextbox('Auto-Product-Payment-ExpirationDate','03/28');
        await this.clickOnButton('PAGAR');
    }
}