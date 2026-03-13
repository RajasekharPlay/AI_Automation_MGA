import { Page } from "@playwright/test";
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";
import BasePage from "./BasePage";

export default class GadgetPage extends BasePage {
    constructor(page:Page, skye:SkyeAttributeCommands){
        super(page, skye);
    }

    public async increaseMultibrickCounterNumber(gadgetName: string) {
        const divElement = this.page.locator(`[id="sk-Gadget-Product-ProductData-MyThings-Gadgets-${gadgetName}MultibrickCounter"][data-loading="false"]`);
        divElement.waitFor();
        const spanElement = divElement.locator('span[class="add-icon"][data-listener="true"]');
        spanElement.waitFor();
        await spanElement.click();
    }

    public async decreaseMultibrickCounterNumber(gadgetName: string) {
        const divElement = this.page.locator(`[id="sk-Gadget-Product-ProductData-MyThings-Gadgets-${gadgetName}MultibrickCounter"][data-loading="false"]`);
        divElement.waitFor();
        const spanElement = divElement.locator('span.remove-icon[data-listener="true"]');
        spanElement.waitFor();
        await spanElement.click();
    }

    public async getValueOfGadgetCounter(gadgetName: string) {
        const divElement = this.page.locator(`input[id="Gadget-Product-ProductData-MyThings-Gadgets-${gadgetName}MultibrickCounter"]`);
        return divElement.getAttribute('value');
    }

    public async fillCellular(numberOfTheCellphone: string){
        await this.skye.selectFromFlexDataDropdown(`sk-Gadget-Product-ProductData-MyThings-Gadgets-CellPhoneList°${numberOfTheCellphone}-CellPhoneBrandsListFlexdata`,'Apple','Apple');
        await this.skye.fillGenericTextbox(`Gadget-Product-ProductData-MyThings-Gadgets-CellPhoneList°${numberOfTheCellphone}-Model`,'iPhone15 Pro','iPhone15 Pro');
        await this.skye.selectFromDropdown(`sk-Gadget-Product-ProductData-MyThings-Gadgets-CellPhoneList°${numberOfTheCellphone}-DamageCoverage`,1,'$10,000');
    }

    public async fillLaptop(numberOfTheLaptop: string){
        await this.skye.selectFromFlexDataDropdown(`sk-Gadget-Product-ProductData-MyThings-Gadgets-LaptopList°${numberOfTheLaptop}-LaptopBrandsListFlexdata`,'Asus','Asus');
        await this.skye.fillGenericTextbox(`Gadget-Product-ProductData-MyThings-Gadgets-LaptopList°${numberOfTheLaptop}-Model`,'Zenbook 14','Zenbook 14');
        await this.skye.selectFromDropdown(`sk-Gadget-Product-ProductData-MyThings-Gadgets-LaptopList°${numberOfTheLaptop}-DamageCoverage`,2,'$20,000');
    }

    public async fillVideoGame(numberOfTheVideOgame:string){
        await this.skye.selectFromFlexDataDropdown(`sk-Gadget-Product-ProductData-MyThings-Gadgets-VideoConsoleList°${numberOfTheVideOgame}-VideoConsoleBrandsListFlexdata`,'Playstation','Playstation');
        await this.skye.fillGenericTextbox(`Gadget-Product-ProductData-MyThings-Gadgets-VideoConsoleList°${numberOfTheVideOgame}-Model`,'Playstation5 Pro','Playstation5 Pro');
        await this.skye.selectFromDropdown(`sk-Gadget-Product-ProductData-MyThings-Gadgets-VideoConsoleList°${numberOfTheVideOgame}-DamageCoverage`,4,'$11,000');
    }

    public async selectDebitCardAndAcceptTerms(){
        await this.skye.selectFromDropdown('sk-SecureThings-Payment-PaymentMethod',1,'Débito');
        await this.skye.selectFromCheckbox('SecureThings-Summary-AcceptRecurringPayment-1checkbox');
        await this.skye.selectFromCheckbox('SecureThings-Summary-AcceptGeneralConditions-1checkbox');
    }
}