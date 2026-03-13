import { test } from '../fixtures/Fixtures';
import { expect } from "@playwright/test";
import MainPage from '../pages/MainPage';
import GadgetPage from '../pages/GadgetPage';
import PaymentPage from '../pages/PaymentPage';
import GadgetMobilityPage from '../pages/GadgetMobilityPage';
import GadgetPersonalPage from '../pages/GadgetPersonalPage';

test('Gadget journey test', async ({ page, skye, banorte }) => {
    const mainPage = new MainPage(page);
    const paymentPage = new PaymentPage(page,skye);
    const gadgetPage = new  GadgetPage(page,skye);

    const testData_gadgetsToBeIncremented = ["CellPhone", "Laptop", "VideoConsole"];
    const paymentAmount = 116.41;

    await test.step('Load the page',async ()=>{
        await mainPage.goto();
        expect(await mainPage.isLoaded()).toBe(true);
        await banorte.checkGeo();
    });

    await test.step('Click on gadget product',async ({})=>{
        await mainPage.selectProductByAlt('Secure things');
        await skye.verifyProcessStepIsLoaded('CreateGadgetQuotePublicProcess:LandingPage');
    });

    await test.step('Click on "INICIAR COTIZACIÓN" button', async () => {
        await gadgetPage.clickOnButton('INICIAR COTIZACIÓN');
        await skye.verifyProcessStepIsLoaded('CreateGadgetQuotePublicProcess:Initial');
    });

    await test.step('Increment number of gadgets & continue', async () => {
        for (const gadget of testData_gadgetsToBeIncremented) {
            await gadgetPage.increaseMultibrickCounterNumber(gadget);
            expect(await gadgetPage.getValueOfGadgetCounter(gadget)).toBe("1");
        }
        await expect(page.locator('[data-testid="GadgetSection"] i.icon-loading')).toHaveCount(0, { timeout: 15000 });
    });
    
    await test.step('Continue to details page', async () => {
        await gadgetPage.clickOnButton('SIGUIENTE');
        await skye.verifyProcessStepIsLoaded('CreateGadgetQuotePublicProcess:Details');
    });

    await test.step('Fill cellphone data', async () => {
        await gadgetPage.fillCellular('1');
    });

    await test.step('Fill Laptop Data', async () => {
        await gadgetPage.fillLaptop('1');
    });

    await test.step('Fill video game data', async () => {
        await gadgetPage.fillVideoGame('1');
        await gadgetPage.clickOnButton('SIGUIENTE');
    });

    await test.step('Accept popup dialog', async () =>{
        banorte.handlePopupAceptar('sk-CreateGadgetQuotePublicProcessDetailsUI1-PopupDialog1','CreateSecureThingsProcess','ACEPTAR');
        await skye.verifyProcessStepIsLoaded('CreateSecureThingsProcess:AdditionalCoverages');
    });

    await test.step('Check if the payment amount is correct and go to payment details', async () =>{
        expect( await banorte.getPayment('.price-message h4')).toEqual(paymentAmount);
        await gadgetPage.clickOnButton('Aceptar');
        await skye.verifyProcessStepIsLoaded('CreateSecureThingsProcess:Summary');
    });

    await test.step('Select debit card, accept the terms and go to the payment page', async () => {
        await gadgetPage.selectDebitCardAndAcceptTerms();
        await gadgetPage.clickOnButton('Ir a pagar');
        await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Payment');
    });

    await test.step('Fill debit card data and pay', async () => {
       await paymentPage.isPaymentAmountEqualsExpectedAmount(paymentAmount);
       await paymentPage.fillCardNumber('4242 4242 4242 4242');
       await paymentPage.fillCardNumberCVV('123');
       await paymentPage.fillCardNumberExpiryDate('08/29');
       await paymentPage.clickPay();
    });

    await test.step('Arrive to the result page', async () => {
        await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Result');
    });
});


test('Gadget as Movilidad journey test', async ({ page, skye, banorte }) => {
    const mainPage = new MainPage(page);
    const gadgetMobilityPage = new GadgetMobilityPage(page,skye);
    const paymentPage = new PaymentPage(page,skye);

    // TEST DATAS
    const testData_Bike_Type = "BMX";
    const testData_Bike_Value = "$6,000";
    const testData_Scooter_Type = "Scooter eléctrico";
    const testData_Scooter_Value = "$19,000";
    const testData_EBoard_Type = "Segway";
    const testData_EBoard_Value = "$10,000";
    const testData_paymentCardType = "Débito";
    const testData_paymentCardNumber = "4242 4242 4242 4242";
    const testData_paymentCardExpiryDate = "08/32";
    const testData_paymentCardCVV = "123";
    const testData_paymentExpectedPriceAmount = 102.55;

    await test.step('Load the page',async ()=>{
        await mainPage.goto();
        expect(await mainPage.isLoaded()).toBe(true);
        await banorte.checkGeo();
    });

    await test.step('Click on gadget product',async ({})=>{
        await mainPage.selectProductByAlt('Secure things');
        await skye.verifyProcessStepIsLoaded('CreateGadgetQuotePublicProcess:LandingPage');
    });

    await test.step('Click on "Movilidad", then "Iniciar Cotizactión" button', async () => {
        const product = page.locator('a[href*="CreateMobilityQuotePublicProcessClone"]');
        await product.waitFor({timeout: 10000});
        await product.click();
        await skye.verifyProcessStepIsLoaded('CreateMobilityQuotePublicProcessClone:1');
        await gadgetMobilityPage.clickOnButton('INICIAR COTIZACIÓN');
        await skye.verifyProcessStepIsLoaded('CreateMobilityQuotePublicProcessClone:2');
    });

    await test.step('Increment Mobility (Movilidad) items', async () => {
        await gadgetMobilityPage.addBikeMobilityAndFillData(1, 0, testData_Bike_Type, 2, testData_Bike_Value);
        await gadgetMobilityPage.addScooterMobilityAndFillData(1, 1, testData_Scooter_Type, 5, testData_Scooter_Value);
        await gadgetMobilityPage.addEBoardMobilityAndFillData(1, 2, testData_EBoard_Type, 0, testData_EBoard_Value);
        await gadgetMobilityPage.clickOnButton('SIGUIENTE');
        await banorte.handlePopupAceptar('sk-CreateMobilityQuotePublicProcessClone2UI1-PopupDialog1', 'CreateSecureThingsProcess','ACEPTAR');
        await skye.verifyProcessStepIsLoaded('CreateSecureThingsProcess:AdditionalCoverages');
    });

    await test.step('Check if the payment amount is correct and go to payment details', async () => {
        expect(await banorte.getPayment('.price-message h4')).toEqual(testData_paymentExpectedPriceAmount);
        await gadgetMobilityPage.clickOnButton('Aceptar');
        await skye.verifyProcessStepIsLoaded('CreateSecureThingsProcess:Summary');
    });

    await test.step('Select debit card, accept the terms and go to the payment page', async () => { 
        await gadgetMobilityPage.selectCardTypeAndAcceptTerms(testData_paymentCardType);
        await gadgetMobilityPage.clickOnButton('Ir a pagar');
        await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Payment');
    });

    await test.step('Fill debit card data and pay', async () => {
        await paymentPage.isPaymentAmountEqualsExpectedAmount(testData_paymentExpectedPriceAmount);
        await paymentPage.fillCardNumber(testData_paymentCardNumber);
        await paymentPage.fillCardNumberCVV(testData_paymentCardCVV);
        await paymentPage.fillCardNumberExpiryDate(testData_paymentCardExpiryDate);
        await paymentPage.clickPay();
     });
 
     await test.step('Arrive to the result page', async () => {
         await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Result');
     });
});

test('Gadget as Pertenencias journey test', async ({ page, skye, banorte }) => {
    const mainPage = new MainPage(page);
    const gadgetPersonalPage = new GadgetPersonalPage(page,skye);
    const paymentPage = new PaymentPage(page,skye);

    // TEST DATAS
    const testData_Instrument_Type = "Viento";
    const testData_Instrument = "Fargot";
    const testData_Instrument_Value = "$15,000";
    const testData_paymentCardType = "Débito";
    const testData_paymentCardNumber = "4242 4242 4242 4242";
    const testData_paymentCardExpiryDate = "08/32";
    const testData_paymentCardCVV = "123";
    const testData_paymentExpectedPriceAmount = 60.78;

    await test.step('Load the page',async ()=>{
        await mainPage.goto();
        expect(await mainPage.isLoaded()).toBe(true);
        await banorte.checkGeo();
    });

    await test.step('Click on gadget product',async ({})=>{
        await mainPage.selectProductByAlt('Secure things');
        await skye.verifyProcessStepIsLoaded('CreateGadgetQuotePublicProcess:LandingPage');
    });

    await test.step('Click on "Pertenencias", then "Iniciar Cotizactión" button', async () => {
        await page.locator('a[href*="CreatePersonalItemsQuotePublicProcess"]').click();
        await skye.verifyProcessStepIsLoaded('CreatePersonalItemsQuotePublicProcess:1');
        await gadgetPersonalPage.clickOnButton('INICIAR COTIZACIÓN');
        await skye.verifyProcessStepIsLoaded('CreatePersonalItemsQuotePublicProcess:2');
    });

    await test.step('Increment Personal (Pertenencias) items', async () => {
        await gadgetPersonalPage.enablePersonalPropertyInsurance();
        await gadgetPersonalPage.addInstrumentsAndFillData(1, 
            3, testData_Instrument_Type,
            2, testData_Instrument,
            2, testData_Instrument_Value);
        await gadgetPersonalPage.clickOnButton('SIGUIENTE');
        await banorte.handlePopupAceptar('sk-CreatePersonalItemsQuotePublicProcess2UI1-PopupDialog1', 'CreateSecureThingsProcess','ACEPTAR');
        await skye.verifyProcessStepIsLoaded('CreateSecureThingsProcess:AdditionalCoverages');
    });

    await test.step('Check if the payment amount is correct and go to payment details', async () => {
        expect(await banorte.getPayment('.price-message h4')).toEqual(testData_paymentExpectedPriceAmount);
        await gadgetPersonalPage.clickOnButton('Aceptar');
        await skye.verifyProcessStepIsLoaded('CreateSecureThingsProcess:Summary');
    });

    await test.step('Select debit card, accept the terms and go to the payment page', async () => {
        await gadgetPersonalPage.selectCardTypeAndAcceptTerms(testData_paymentCardType);
        await gadgetPersonalPage.clickOnButton('Ir a pagar');
        await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Payment');
    });

    await test.step('Fill debit card data and pay', async () => {
        await paymentPage.isPaymentAmountEqualsExpectedAmount(testData_paymentExpectedPriceAmount);
        await paymentPage.fillCardNumber(testData_paymentCardNumber);
        await paymentPage.fillCardNumberCVV(testData_paymentCardCVV);
        await paymentPage.fillCardNumberExpiryDate(testData_paymentCardExpiryDate);
        await paymentPage.clickPay();
     });
 
     await test.step('Arrive to the result page', async () => {
         await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Result');
     });
});
