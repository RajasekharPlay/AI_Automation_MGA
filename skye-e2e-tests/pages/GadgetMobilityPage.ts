import { Page } from "@playwright/test";
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";
import BasePage from "./BasePage";

export default class GadgetMobilityPage extends BasePage {
    constructor(page:Page, skye:SkyeAttributeCommands){
        super(page, skye);
    }

    private async increaseMobilityItem(mobilityItemName: string) {
        const element = this.page.locator(`div[data-testid^="sk-CreateMobilityQuotePublicProcessClone2UI1"][data-testid*="${mobilityItemName}"] a`);
        element.waitFor();
        await element.click();
    }

    public async addBikeMobilityAndFillData(nthIndex: number, typeIndex: number, testData_type: string, valueIndex: number, testData_value: string) {
        await this.increaseMobilityItem('Bikes');
        await this.skye.selectFromDropdown(`sk-MobilityProduct-Product-ProductData-MyThings-Mobility-BikeList°${nthIndex}-BikeType`, typeIndex, testData_type);
        await this.skye.selectFromDropdown(`sk-MobilityProduct-Product-ProductData-MyThings-Mobility-BikeList°${nthIndex}-Value`, valueIndex, testData_value);
    }

    public async addScooterMobilityAndFillData(nthIndex: number, typeIndex: number, testData_type: string, valueIndex: number, testData_value: string) {
        await this.increaseMobilityItem('Scooters');
        await this.skye.selectFromDropdown(`sk-MobilityProduct-Product-ProductData-MyThings-Mobility-ScooterList°${nthIndex}-ScooterType`, typeIndex, testData_type);
        await this.skye.selectFromDropdown(`sk-MobilityProduct-Product-ProductData-MyThings-Mobility-ScooterList°${nthIndex}-Value`, valueIndex, testData_value);
    }

    public async addEBoardMobilityAndFillData(nthIndex: number, typeIndex: number, testData_type: string, valueIndex: number, testData_value: string) {
        await this.increaseMobilityItem('EBoards');
        await this.skye.selectFromDropdown(`sk-MobilityProduct-Product-ProductData-MyThings-Mobility-EBoardList°${nthIndex}-EBoardType`, typeIndex, testData_type);
        await this.skye.selectFromDropdown(`sk-MobilityProduct-Product-ProductData-MyThings-Mobility-EBoardList°${nthIndex}-Value`, valueIndex, testData_value);
    }

    public async selectCardTypeAndAcceptTerms(paymentCardType: string){
        await this.skye.selectFromDropdown('sk-SecureThings-Payment-PaymentMethod', 1, paymentCardType);
        await this.skye.selectFromCheckbox('SecureThings-Summary-AcceptRecurringPayment-1checkbox');
        await this.skye.selectFromCheckbox('SecureThings-Summary-AcceptGeneralConditions-1checkbox');
    }
}