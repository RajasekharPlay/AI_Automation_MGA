import { test } from '../fixtures/Fixtures';
import { expect } from "@playwright/test";
import MainPage from '../pages/MainPage';
import PetsPage from '../pages/PetsPage';
import PaymentPage from '../pages/PaymentPage';

test('Pet as Dog journey test', async ({ page, skye, banorte }) => {
    const mainPage = new MainPage(page);
    const petsPage = new PetsPage(page, skye);
    const paymentPage = new PaymentPage(page, skye);

    // Test Datas
    const testData_petName = "Buddy";
    const testData_petGender = "Macho";
    const testData_petBreed = "Shepadoodle";
    const testData_petAgeYear = "2 años";
    const testData_petAgeMonth = "2 meses";
    const testData_petColor = "Grey";
    const testData_petLifestyle = "Activo";
    const testData_paymentCardType = "Débito";
    const testData_paymentCardNumber = "4242 4242 4242 4242";
    const testData_paymentCardExpiryDate = "08/32";
    const testData_paymentCardCVV = "123";
    const testData_paymentExpectedPriceAmount = 168.36;

    await test.step('Load the page', async ()=>{
        await mainPage.goto();
        expect(await mainPage.isLoaded()).toBe(true);
        await banorte.checkGeo();
    });

    await test.step('Click on mascota product', async () => {
        await mainPage.selectProductByAlt('Vida Pets');
        await skye.verifyProcessStepIsLoaded('CreatePetQuotePublicProcess:PetData');
    });

    await test.step('Fill out the necessary fields and continue (click Siguente)', async () => {
        await skye.fillGenericTextbox('Pet-Product-PetData-Name', testData_petName);
        await skye.selectFromDropdown('sk-Pet-Product-PetData-Gender', 0, testData_petGender);
        await skye.selectFromFlexDataSearch('sk-Pet-Product-PetData-DogBreedFlexdata', testData_petBreed, testData_petBreed);
        await skye.selectFromDropdown('sk-Pet-Product-PetData-AgeDisplayed', 2, testData_petAgeYear);
        await skye.selectFromDropdown('sk-Pet-Product-PetData-AgeMonth', 2, testData_petAgeMonth);
        await skye.fillGenericTextbox('Pet-Product-PetData-Color', testData_petColor);
        await skye.selectFromDropdown('sk-Pet-Product-PetData-Lifestyle', 1, testData_petLifestyle)
        await skye.selectFromCheckbox('Pet-Product-PetData-NoJob-1checkbox');
        await petsPage.clickOnButton('Siguiente');
        await skye.verifyProcessStepIsLoaded('CreatePetQuotePublicProcess:PetSelections');
    });

    await test.step('Continue to summary', async () => {
        await petsPage.clickOnButton('Siguiente');
        await skye.verifyProcessStepIsLoaded('CreatePetQuotePublicProcess:Summary');
    });

    await test.step('Fill out the necessary fields and accept the terms, then click continue', async () => {
        await skye.selectFromDropdown('sk-Pet-Product-Payment-PaymentMethod', 1, testData_paymentCardType);
        await skye.selectFromCheckbox('Pet-Product-RecurringPayment-AcceptAndAuthorizeCard-1checkbox');
        await skye.selectFromCheckbox('Pet-Product-RecurringPayment-TermandConditionPayment-1checkbox');
        await petsPage.clickOnButton('IR A PAGAR');
        await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Payment');
    });

    await test.step('Complete payment', async () => {
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


test('Pet as Cat journey test', async ({ page, skye, banorte }) => {
    const mainPage = new MainPage(page);
    const petsPage = new PetsPage(page, skye);
    const paymentPage = new PaymentPage(page, skye);

    // Test Datas
    const testData_petName = "Coco";
    const testData_petGender = "Hembra";
    const testData_petBreed = "Burmés";
    const testData_petAgeYear = "1 año";
    const testData_petAgeMonth = "3 meses";
    const testData_petColor = "Cream";
    const testData_petLifestyle = "Activo";
    const testData_paymentCardType = "Débito";
    const testData_paymentCardNumber = "4242 4242 4242 4242";
    const testData_paymentCardExpiryDate = "08/32";
    const testData_paymentCardCVV = "123";
    const testData_paymentExpectedPriceAmount = 89.82;

    await test.step('Load the page', async ()=>{
        await mainPage.goto();
        expect(await mainPage.isLoaded()).toBe(true);
        await banorte.checkGeo();
    });

    await test.step('Click on mascota product', async () => {
        await mainPage.selectProductByAlt('Vida Pets');
        await skye.verifyProcessStepIsLoaded('CreatePetQuotePublicProcess:PetData');
    });

    await test.step('Fill out the necessary fields and continue (click Siguente)', async () => {
        skye.selectRadioOptionByTestId('Pet-Product-PetData-PetType-2');
        await skye.fillGenericTextbox('Pet-Product-PetData-Name', testData_petName);
        await skye.selectFromDropdown('sk-Pet-Product-PetData-Gender', 1, testData_petGender);
        await skye.selectFromFlexDataSearch('sk-Pet-Product-PetData-CatBreedFlexdata', testData_petBreed, testData_petBreed);
        await skye.selectFromDropdown('sk-Pet-Product-PetData-AgeDisplayed', 1, testData_petAgeYear);
        await skye.selectFromDropdown('sk-Pet-Product-PetData-AgeMonth', 3, testData_petAgeMonth);
        await skye.fillGenericTextbox('Pet-Product-PetData-Color', testData_petColor);
        await skye.selectFromDropdown('sk-Pet-Product-PetData-Lifestyle', 1, testData_petLifestyle)
        await skye.selectFromCheckbox('Pet-Product-PetData-NoJob-1checkbox');
        await petsPage.clickOnButton('Siguiente');
        await skye.verifyProcessStepIsLoaded('CreatePetQuotePublicProcess:PetSelections');
    });

    await test.step('Continue to summary', async () => {
        await petsPage.clickOnButton('Siguiente');
        await skye.verifyProcessStepIsLoaded('CreatePetQuotePublicProcess:Summary');
    });

    await test.step('Fill out the necessary fields and accept the terms, then click continue', async () => {
        await skye.selectFromDropdown('sk-Pet-Product-Payment-PaymentMethod', 1, testData_paymentCardType);
        await skye.selectFromCheckbox('Pet-Product-RecurringPayment-AcceptAndAuthorizeCard-1checkbox');
        await skye.selectFromCheckbox('Pet-Product-RecurringPayment-TermandConditionPayment-1checkbox');
        await petsPage.clickOnButton('IR A PAGAR');
        await skye.verifyProcessStepIsLoaded('ProductPaymentPublicProcess:Payment');
    });

    await test.step('Complete payment', async () => {
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