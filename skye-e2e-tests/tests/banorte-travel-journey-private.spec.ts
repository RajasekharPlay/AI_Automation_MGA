import { test } from '../fixtures/Fixtures';
import { expect } from "@playwright/test";
import MainPage from '../pages/MainPage';
import TravelPage from '../pages/TravelPage';

test('Travel journey test', async ({page, skye, banorte}) => {
    const mainPage = new MainPage(page);
    const travelPage = new TravelPage(page,skye);

    // Test Data
    const testData_cardType = 'Debito';
    const testData_customerName = process.env.pw_TESTUSER;

    await test.step('Load the main page', async () => {
        await mainPage.goto();
        expect(await mainPage.isLoaded()).toBe(true);
        await banorte.checkGeo();
    });

    await test.step('Select travel product', async () => {
        await mainPage.selectProductByAlt('Viajes');
        await skye.verifyProcessStepIsLoaded('TravelInfoPageProccess:2');
    });

    await test.step('Iniciar Cotización', async ()=> {
        await travelPage.clickOnLink('Iniciar Cotización');
        await skye.verifyProcessStepIsLoaded('CreateTravelDetailsProcess:TravelType');
    });

    await test.step('Select traditional travel type and click on next', async () => {
        await skye.selectRadioOptionByTestId('TravelDetailsGeneric-TravelType-Tradicional-1');
        await travelPage.clickOnButton('Siguiente');
        await skye.verifyProcessStepIsLoaded('CreateTravelDetailsProcess:TravelDetails');
    });

    await test.step('Fill travel details', async () => {
        await travelPage.fillTravelDetails();
        await travelPage.clickOnButton('Siguiente');
        await skye.verifyProcessStepIsLoaded('CreateTravelCoveragesProcess:Coverages');
    });

    await test.step('Check the premium and go to personailze', async () => {
        await travelPage.checkPremium(336.98);
        await travelPage.clickOnButton('PERSONALIZA TUS COBERTURAS');
        await skye.verifyProcessStepIsLoaded('CreateTravelCoveragesProcess:Personalization');
    });

    await test.step('Fill personalize and continute', async () => {
        await travelPage.fillPremium();
        await travelPage.checkPremium(508.26);
        await travelPage.clickOnButton('SÍ, CONTINUAR');
        await skye.verifyProcessStepIsLoaded('CreateTravelCoveragesProcess:Summary');
    });
    
    await test.step('Accept Summary', async () => {
        await travelPage.clickOnButton('SÍ, CONTINUAR'); 
        await skye.verifyProcessStepIsLoaded('CreateTravelProcess:Travellers');
    });

    await test.step('Fill travellers data', async () => {
        await travelPage.fillTravellersData();
        await travelPage.clickOnButton('Siguiente');
        await travelPage.acceptTravellerPopup();
    });

    await test.step('Fill payment data', async () => {
        await travelPage.fillPayment(testData_cardType, testData_customerName);
        await travelPage.clickOnButton('IR A PAGAR');
        await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Payment');
    });

    await test.step('Fill credit card', async () => {
        await travelPage.fillCreditCard();
        await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Result');
    });
});