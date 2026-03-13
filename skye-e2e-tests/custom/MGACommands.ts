import { expect, Page } from '@playwright/test';
import SkyeAttributeCommands from "./SkyeAttributeCommands";

export default class MGACommands {
    page: Page;
    skye: SkyeAttributeCommands;

    constructor(page: Page, skye:SkyeAttributeCommands) {
        this.page = page;
        this.skye = skye;
    }

    public async handlePopupAceptar(skTestId: string, processName:string, buttonTitle:"ACEPTAR" | "Siguiente", isThereACheckbox?: boolean, checkboxTestId?: string) {
        const checkBox = isThereACheckbox ?? false;
        const uiGroup = this.page.locator(`[data-testid="${skTestId}"]`);
        await uiGroup.waitFor();
        await expect(uiGroup).toBeVisible();

        if (checkBox) await this.skye.selectFromCheckbox(checkboxTestId);

        const aceptarLink = uiGroup.locator(`[title*=${buttonTitle}][data-style="NEXT"]`);
        await expect(aceptarLink).toBeVisible();
        await aceptarLink.click();
        await this.page.waitForURL(`**/${processName}?**`);
    }

    public async selectFromRangeDates(testId:string,dateFrom:string,dateTo:string){

        const parseInputDate = (dateStr: string): Date => {
            const [day, month, year] = dateStr.split('.').map(Number);
            return new Date(year, month - 1, day);
        };

        const spanishDayNames: string[] = [
            "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"
        ];

        const spanishMonthNames: string[] = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        const formatForSpanishAriaLabel = (dateObj: Date): string => {
            const dayName = spanishDayNames[dateObj.getDay()];
            const dayOfMonth = dateObj.getDate();
            const monthName = spanishMonthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();
            return `Choose ${dayName}, ${dayOfMonth} de ${monthName} de ${year}`;
        };

        const fromDateObject = parseInputDate(dateFrom);
        const dateFromFormatted = formatForSpanishAriaLabel(fromDateObject);

        const toDateObject = parseInputDate(dateTo);
        const dateToFormatted = formatForSpanishAriaLabel(toDateObject);

        const dateRange = this.page.getByTestId(testId);
        const dateRangeInput = dateRange.locator('input.sk-daterange.sk-input');
        await dateRangeInput.click();

        const dateFromField = this.page.locator(`[aria-label='${dateFromFormatted}']`);
        await dateFromField.click();

        const dateToField = this.page.locator(`[aria-label='${dateToFormatted}']`);
        await this.skye.inputToSkyeAndWaitForBackendResponse(
            dateToField,
            () => dateToField.click()
        );

        const formattedDateFrom = dateFrom.replace(/\./g, '/');
        const formattedDateTo = dateTo.replace(/\./g, '/');
        const expectedValue = `${formattedDateFrom} - ${formattedDateTo}`; // Note: Original used U+00A0 (non-breaking space)
        await expect(dateRangeInput).toHaveValue(expectedValue);
    }

    public async increaseNumberInTextbox(testId:string){
        const kidsCounter = this.page.getByTestId(testId);
        const addButton = kidsCounter.locator('span.add-icon');
        const inputField = kidsCounter.locator('input[type="text"]');

        await addButton.waitFor({ state: 'visible' });
        await expect(addButton).toBeVisible();

        let isItTheDesiredNumber = false;
        while (!isItTheDesiredNumber) {
            if (Number(await inputField.inputValue()) === 1) {
                isItTheDesiredNumber = true;
                break;
            }

            const responsePromise = this.page.waitForResponse(
                response => response.url().includes('/update?'),
                { timeout: 10000 }
            );

            try {
                await Promise.all([
                    addButton.click(),
                    responsePromise
                ]);

                console.log('Successfully received response');
            } catch (error) {
                console.log('No response received, retrying...');
                continue;
            }
        }
    }

    public async getPayment(classId:string): Promise<Number>{
        const element = this.page.locator(classId);
        const text = await element.innerText();
        const amount = Number(text.split(' ')[1].split(',').join(""));
        return amount;
    }

    public async checkGeo(){
        const geo = await this.page.evaluate(() => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                (position) => resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }),
                (err) => reject(err)
                );
            });
            });
            
            expect(geo).toEqual({
            latitude: 47.1751,
            longitude: 18.9444
            });
    };

    public async checkToggle(dataTestId:string){
        const label = this.page.locator(`label[for=${dataTestId}]`);
        await label.waitFor();
        
        await this.skye.inputToSkyeAndWaitForBackendResponse(
            label,
            async () => {
                await label.click();
                const isToggleSelected = await label.locator('div.sk-input-toggle').getAttribute('data-selected');
                expect(isToggleSelected).toBeTruthy();
            }
        )
    }

}