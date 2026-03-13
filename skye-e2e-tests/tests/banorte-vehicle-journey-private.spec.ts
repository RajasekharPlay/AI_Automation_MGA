import { test } from '../fixtures/Fixtures';
import { expect } from "@playwright/test";
import MainPage from '../pages/MainPage';
import VehiclePage from '../pages/VehiclePage';

test('Vehicle journey test', async ({page, skye, banorte}) => {
    const mainPage = new MainPage(page);
    const vehiclePage = new VehiclePage(page,skye);

    await test.step('Load the main page', async () => {
        await mainPage.goto();
        expect(await mainPage.isLoaded()).toBe(true);
        await banorte.checkGeo();
    });

    await test.step('Click on vehicle product',async ({})=>{
        await mainPage.selectProductByAlt('My Ride');
        await skye.verifyProcessStepIsLoaded('AutoInfoPageProccess:1');
    });

    await test.step('Click on "INICIAR COTIZACIÓN" button', async () => {
        await vehiclePage.clickOnLink('INICIAR COTIZACIÓN');
        await skye.verifyProcessStepIsLoaded('CreateAutoQuotePublicProcess:VehicleData');
    });

    await test.step('Fill the car details data', async () => {
        await vehiclePage.fillVehicleData();
        await vehiclePage.clickOnButton('SIGUIENTE');
        await skye.verifyProcessStepIsLoaded('CreateAutoQuotePublicProcess:VehicleValue');
    });

    await test.step('Click on personalize button', async () => {
        await vehiclePage.clickOnButton('PERSONALIZA TU PÓLIZA');
        await skye.verifyProcessStepIsLoaded('CreateAutoQuotePublicProcess:Customization');
    });

    await test.step('Check additional coverage', async () => {
        await banorte.checkToggle('Auto-Product-OptionalCoverages-PartialTheftToggle-1');
        await banorte.checkToggle('Auto-Product-OptionalCoverages-CivilLiabilityToggle-1');
        await banorte.checkToggle('Auto-Product-OptionalCoverages-UnitedStatesCoverToggle-1');
        expect(await banorte.getPayment('.price-message .price')).toEqual(1821.18);
        await vehiclePage.clickOnButton('Siguiente');
        await skye.verifyProcessStepIsLoaded('CreateAutoQuotePublicProcess:Summary');
    });

    await test.step('Go to summary page and go to the serial number page', async () => {
        await vehiclePage.clickOnButton('Siguiente');
        await skye.verifyProcessStepIsLoaded('CreateAutoQuotePublicProcess:SerialNumber');
    });

    await test.step('Fill serial number data', async () => {
       await skye.fillGenericTextbox('Auto-Product-ProductData-SerialNumber','12345678912345678','12345678912345678');
       await skye.fillGenericTextbox('Auto-Product-ProductData-CarPlate','B55NUN','B55NUN');
       await skye.selectFromCheckbox('Auto-Product-ProductData-ConfirmationCheckbox-1checkbox');
       await vehiclePage.clickOnButton('Siguiente');
       await banorte.handlePopupAceptar('sk-CreateAutoQuotePublicProcessSerialNumberUI1-PopupDialog1', 'CreateAutoQuotePublicProcess', 'Siguiente', true, 'Auto-Product-ProductData-InspectionCheckbox-1checkbox');
       await skye.verifyProcessStepIsLoaded('CreateAutoQuotePublicProcess:SummaryBeforePayment');
    });

    await test.step('Accept summary', async () => {
        await skye.selectFromCheckbox('Auto-Product-RecurringPayment-AcceptAndAuthorizeCard-1checkbox');
        await skye.selectFromCheckbox('Auto-Product-RecurringPayment-TermandConditionPayment-1checkbox');
        await vehiclePage.clickOnButton('IR A PAGAR');
        await skye.verifyProcessStepIsLoaded('CreateAutoQuotePublicProcess:Payment');
    });

    await test.step('Fill payment info', async () => { 
        await vehiclePage.fillPaymentInfo();
        await skye.verifyProcessStepIsLoaded('CreateAutoQuotePublicProcess:Confirmation');
    });
});