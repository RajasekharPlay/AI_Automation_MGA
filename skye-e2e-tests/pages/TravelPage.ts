import { Page } from "@playwright/test";
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";
import { expect } from "@playwright/test";
import BanorteCommands from "../custom/BanorteCommands";
import PaymentPage from "./PaymentPage";
import BasePage from "./BasePage";

export default class TravelPage extends BasePage {
    private banorteCommands: BanorteCommands;
    private paymentPage: PaymentPage;
    constructor(page:Page, skye:SkyeAttributeCommands){
        super(page, skye);
        this.banorteCommands = new BanorteCommands(this.page,this.skye);
        this.paymentPage = new PaymentPage(this.page,this.skye);
    }

    public async fillTravelDetails(){
        await this.skye.selectFromDropdown('sk-TravelDetailsGeneric-TravelDetails-TravelType',1,'INTERNACIONAL');
        await this.banorteCommands.selectFromRangeDates('sk-TravelDetailsGeneric-TravelDetails-TravelDateRange','23.06.2025','27.06.2025');
        await this.skye.selectFromCheckbox('TravelDetailsGeneric-TravelDetails-TravellersCheckbox-1');
        await this.banorteCommands.increaseNumberInTextbox('sk-TravelDetailsGeneric-TravelDetails-Kids');
    };
    
    public async checkPremium(premium:Number){
        expect(await this.banorteCommands.getPayment('.price-message')).toEqual(premium);
    };

    public async fillPremium(){
        const accordionHeader = this.page.locator('#pr_id_1_header_0');
        await accordionHeader.waitFor({ state: 'attached', timeout: 10000 });
        expect(accordionHeader).toBeVisible();
        await accordionHeader.scrollIntoViewIfNeeded();
        await accordionHeader.click();
    
        const accordionContent = this.page.locator('#pr_id_1_content_0');
        await expect(accordionContent).toBeVisible({ timeout: 7000 });
    
        await this.banorteCommands.checkToggle('TravelCoveragesGeneric-Premium-Addons-HomeCheckbox-1');
    };

    public async fillTravellersData(){
        await this.skye.selectFromCheckbox('Travel-Travellers-SameUser-1checkbox');
        await this.skye.fillGenericTextbox('Travel-Travellers-Kids°1-LastName','Toth','Toth');
        await this.skye.fillGenericTextbox('Travel-Travellers-Kids°1-FirstName','Andras','Andras');
        await this.skye.fillDateToDatepicker('Travel-Travellers-Kids°1-DateOfBirth','03122015');
        await this.skye.selectFromDropdown('sk-Travel-Travellers-Kids°1-Gender',0,'Masculino');
        await this.skye.selectFromDropdown('sk-Travel-Travellers-Kids°1-Relationship',0,'Padre');
    }

    public async acceptTravellerPopup(){
        await this.banorteCommands.handlePopupAceptar('sk-CreateTravelProcess1UI1-PopupDialog1','CreateTravelProcess','Siguiente');
    };

    public async fillPayment(cardType: string, customerName: string){
        await this.skye.selectFromDropdown('sk-Travel-Payment-PaymentMethod',0,cardType);
        await this.skye.selectFromDropdown('sk-Travel-Payment-CustomerNameDropdown',0,customerName);
        await this.skye.selectFromCheckbox('Travel-Product-RecurringPayment-AcceptAndAuthorizeCard-1checkbox');
        await this.skye.selectFromCheckbox('Travel-Product-RecurringPayment-TermandConditionPayment-1checkbox');

    };

    public async fillCreditCard(){
        await this.paymentPage.isPaymentAmountEqualsExpectedAmount(508.26);
        await this.paymentPage.fillCardNumber('4242 4242 4242 4242 4242');
        await this.paymentPage.fillCardNumberCVV('123');
        await this.paymentPage.fillCardNumberExpiryDate('03/28');
        await this.paymentPage.clickPay();
    }
};