import { expect, Locator } from '@playwright/test';
import { Page } from 'playwright';
import { NoBackendResponseError } from "../errors/NoBackendResponseError";
import {DateManager} from "../utils/DateManager";
import {test} from "../fixtures/Fixtures";
import {GenericUtils} from "../utils/GenericUtils";

export default class SkyeAttributeCommands {
    page: Page

    constructor(page: Page) {
        this.page = page;
    }

    public async inputToSkyeAndWaitForBackendResponse(
        element: Locator,
        action: () => Promise<void>,
        urlPattern = '/update?',
        timeout = 20000)
    {
        const responsePromise = this.page.waitForResponse(
            response => response.url().includes(urlPattern),
            { timeout }
        );
        await action();
        try {
            return await responsePromise;
        } catch (error) {
            throw new NoBackendResponseError(element, timeout, error)
        }
    }

    public async selectFromDropdown(
        testId: string,
        optionIndex: number,
        expectedValue: string) {

        const dropdownAsReactSelect = this.page.locator(`[data-testid=${testId}] .react-select`);
        await dropdownAsReactSelect.waitFor();
        await dropdownAsReactSelect.click();

        const dropdownMenu = this.page.locator('.react-select__menu');
        await dropdownMenu.waitFor();

        const dropdownItem = this.page.locator('.react-select__menu-list > div').nth(optionIndex);
        await expect(dropdownItem).toBeEnabled();
        await dropdownItem.hover();

        await this.inputToSkyeAndWaitForBackendResponse(
            dropdownItem,
            () => dropdownItem.dispatchEvent('click')
        )

        const selectedDropdownElement = this.page.locator(`[data-testid=${testId}][data-loading="false"] .sk-dropdownlist-option-label`);
        await selectedDropdownElement.waitFor();

        const selectedValue = await selectedDropdownElement.innerText();
        expect(selectedValue,'Dropdown has wrong value. This is most likely the test being flaky.').toBe(expectedValue);
    }

    public async selectRadioOptionByTestId(
        testId: string) {

        const responsePromise = this.page.waitForResponse(response => response.url().includes('/update?'),{timeout:5000});
        await this.page.getByTestId(testId).click();
        await responsePromise;

    };

    /**
     * @param testId - non-sk data-testid
     * @param inputDate - The date to input in `ddMMyyyy` format (e.g. 07042025).
     */
    public async fillDateToDatepicker(
        testId: string,
        inputDate:string) {
        const datePicker = this.page.locator(`[data-testid="${testId}"]`);
        await datePicker.clear();

        await this.inputToSkyeAndWaitForBackendResponse(
            datePicker,
            () => datePicker.fill(inputDate)
        )

        const datePickerValue = await datePicker.inputValue();
        const trimmedTextboxValue = datePickerValue.replace(/[./]/g, "");

        const errorMessage=`The input date is not matching with the fields value. Field: ${testId}`;
        expect(trimmedTextboxValue,errorMessage).toEqual(inputDate);
    }

    public async fillDateMaskedTextbox(
        testId: string,
        inputDate:string) {
        const maskedDate = this.page.locator(`[data-testid="${testId}"] input`);
        await maskedDate.clear();

        await this.inputToSkyeAndWaitForBackendResponse(
            maskedDate,
            () => maskedDate.fill(inputDate)
        )

        await maskedDate.blur();

        const textboxValue = await maskedDate.inputValue();
        const trimmedTextboxValue = textboxValue.replace(/[./]/g, "");

        const errorMessage='The input date is not set to the field. Likely reasons are input value not within value range (it blanks it out) OR field using a date format which uses other then . or /';
        expect(trimmedTextboxValue,errorMessage).toEqual(inputDate);
    }

    public async selectDateViaYearAndMonthPicker(
        testId: string,
        inputDate:string,
    ) {
        const parts = inputDate.split('.');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];


        const datepicker = this.page.getByTestId(testId);
        await datepicker.click();

        await this.page.locator('div.react-datepicker__year-text', { hasText: year }).click();
        await this.page.locator('div.react-datepicker__month-text', { hasText: month }).click();

        const selectedDate = this.page.locator(
            'div.react-datepicker__day:not(.react-datepicker__day--outside-month)',
            { hasText: new RegExp(`^${day}$`) }
        )

        await this.inputToSkyeAndWaitForBackendResponse(
            selectedDate,
            () => selectedDate.click()
        )

        const currentDate = DateManager.getCurrentDateFormatted('dd.MM.yyyy')
        await expect(datepicker).toHaveValue(currentDate);
    }

    public async selectDateRangeDates(
        testId: string,
        dateFrom: string,
        dateTo: string
    ) {
        console.log('date range tests are disabled until SKYE-16492 is resolved')
        //
        // const dateFromDay = Number(DateManager.formatDate(dateFrom,'dd.MM.yyyy','d'))
        // const fromDaySuffix = DateManager.calculateDateSuffix(dateFromDay)
        // const dateFromFormat = `EEEE, MMMM d\'${fromDaySuffix}\', yyyy`
        // const dateFromFormatted = `Choose ${DateManager.formatDate(dateFrom,'dd.MM.yyyy', dateFromFormat)}`
        //
        // const dateToDay = Number(DateManager.formatDate(dateTo,'dd.MM.yyyy','d'))
        // const toDaySuffix = DateManager.calculateDateSuffix(dateToDay)
        // const dateToFormat = `EEEE, MMMM d\'${toDaySuffix}\', yyyy`
        // const dateToFormatted = `Choose ${DateManager.formatDate(dateTo,'dd.MM.yyyy', dateToFormat)}`
        //
        // const dateRange = this.page.getByTestId(testId)
        // const dateRangeInput = dateRange.locator('input.sk-daterange.sk-input')
        // await dateRangeInput.click()
        //
        // const dateFromField = this.page.locator(`[aria-label='${dateFromFormatted}']`);
        // await dateFromField.click()
        //
        // const dateToField = this.page.locator(`[aria-label='${dateToFormatted}']`);
        // await this.inputToSkyeAndWaitForBackendResponse(
        //     dateToField,
        //     () => dateToField.click()
        // )
        //
        // const expectedValue = `${dateFrom}  ${dateTo}`
        // await expect(dateRangeInput).toHaveValue(expectedValue)
    }

    public async uploadToResource(
        skTestId: string,
        filePaths: string | string[]
    ) {
        await test.step(`Uploading file(s) to resource attribute `, async () => {
            const resourceAttribute = this.page.getByTestId(skTestId);

            const uploadedFiles = resourceAttribute.locator(`.sk-upload-files .sk-file`);
            const existingFileCount = await uploadedFiles.count();

            const resourceAttributeInput = resourceAttribute.locator('input.sk-file-input')
            await expect(resourceAttributeInput,`Resource attribute ${skTestId} is not enabled.`).toBeEnabled();

            await this.inputToSkyeAndWaitForBackendResponse(
                resourceAttributeInput,
                () => resourceAttributeInput.setInputFiles(filePaths),
                "/resource/",
                10000
            )

            const currentlyUploadedFileCount = Array.isArray(filePaths) ? filePaths.length : 1;
            const errorMessage =
                `Before uploading the files ${existingFileCount} were already uploaded. Currently tried to upload ${currentlyUploadedFileCount} files. 
                The final uploaded files should the sum of these but it isn't.`;
            await expect(uploadedFiles,errorMessage).toHaveCount(existingFileCount + currentlyUploadedFileCount);
        }, { box: true });
    }

    public async addMultibrickWithButton(
        buttonLabel: string,
        newMultibrickTestId:string
    ) {
        const addMultibrickButton = this.page.locator(`a.sk-multi-brick-link[title="${buttonLabel}"]`);
        await addMultibrickButton.waitFor();

        await this.inputToSkyeAndWaitForBackendResponse(
            addMultibrickButton,
            () => addMultibrickButton.click(),
            "?brickTextId="
        )

        try {
            const newMultibrick = this.page.getByTestId(newMultibrickTestId);
            await newMultibrick.waitFor();
        } catch (error) {
            throw new Error(`Failed to add multibrick ${buttonLabel}: ${error}`);
        }
    }

    public async removeMultibrickWithButton(
            multibrickTestId:string,
    ) {
        const multibrick = this.page.getByTestId(multibrickTestId);
        const removeMultibrickButton = multibrick.locator('a.sk-multi-brick-link--remove')
        await this.inputToSkyeAndWaitForBackendResponse(
            removeMultibrickButton,
            () => removeMultibrickButton.click(),
            "removeBrick?brickTextId="
        )
        await expect(multibrick).toHaveCount(0)
    }

    public async verifyNumberOfMultibricks(
        testId: string,
        expectedNrOfMultibricks: number
    ) {
        await test.step(`Verifying that the number of multibricks is ${expectedNrOfMultibricks}`, async () => {
            const multibrickParent = this.page.getByTestId(testId)
            const multibrick = multibrickParent.locator('div.sk-multi-brick-item')
            await expect(multibrick).toHaveCount(expectedNrOfMultibricks)
        },{ box: true });
    }

    public async selectFromPackageSelector(
        testId: string,
        searchedLabel: string
    ) {
        const selectedPackageElement = this.page.locator(`[data-testid="${testId}"] .sk-packageselector-item-header div:has-text("${searchedLabel}")`);
        await selectedPackageElement.waitFor();

        await this.inputToSkyeAndWaitForBackendResponse(
            selectedPackageElement,
            () => selectedPackageElement.click())
    }

    /**
     * @param testId - data-testid, non-sk form
     * @param inputValue - value filled to the field
     * @param expectedOutputValue - expected value in case it is different then inputValue (example for formatters)
     */
    public async fillGenericTextbox(
        testId: string,
        inputValue: string,
        expectedOutputValue: string = inputValue
    ) {
        await test.step(`Generic Textbox: Filling value ${inputValue}`, async () => {
            const textbox = this.page.getByTestId(testId);
            await this.inputToSkyeAndWaitForBackendResponse(
                textbox,
                async () => {
                    await textbox.fill(inputValue);
                    await textbox.blur();
                }
            )
            const errorMessage =
                `The input value is not matching with the final value of the textbox ${testId}. 
                Most likely due to validation error or test flakiness.`;
            await expect(textbox, errorMessage).toHaveValue(expectedOutputValue, { timeout:10000 });
        }, { box: true, timeout: 10000 });
    };


    /**
     * @param testId - data-testid, non-sk form
     * @param expectedValue - expected value of the field
     */
    public async verifyGenericTextboxValue(
        testId: string,
        expectedValue: string
    ) {
        await test.step(`Verifying if field's value is ${expectedValue}`, async () => {
            const textboxWrapper = this.page.getByTestId(testId);
            const textbox = textboxWrapper.locator('div.sk-field span')
            await expect(textbox).toHaveText(expectedValue);
        }, { box: true });
    };

    public async verifyCounterValue(
        testId: string,
        expectedValueRegexp: string,
        expectedValue?:string
    ) {
        const counter = this.page.getByTestId(testId)
        const counterValue = counter.locator('.sk-field span')
        await expect(counterValue).toHaveText(new RegExp(expectedValueRegexp));

        if (expectedValue != null) {
            await expect(counterValue).toHaveText(expectedValue);
        }
    }

    public async selectFromFlexDataSearch (
        testId: string,
        inputValue: string,
        expectedValue: string
    ) {
        const flexDataDropdown = this.page.locator(`[data-testid="${testId}"] input`);
        await flexDataDropdown.focus();
        await this.page.waitForTimeout(1500);
        await flexDataDropdown.pressSequentially(inputValue,{ delay: 100 });

        const dropdownItem = this.page.locator(`[data-testid="${testId}"] li[role="option"]`);
        await dropdownItem.waitFor();


        await this.inputToSkyeAndWaitForBackendResponse(
            flexDataDropdown,
            () => flexDataDropdown.press('Enter'))

        const selectedValue = await this.page.locator(`[data-testid="${testId}"] input`).inputValue();
        const errorMessage =
            `Final value and expected value not matching. 
            Most likely due to test flakiness OR the input value was not found in the index`;
        expect(selectedValue,errorMessage).toEqual(expectedValue);
    }

    public async selectFromFlexDataDropdown(
        skTestId: string,
        inputValue: string,
        expectedValueSavedToDb: string
    ) {
        await test.step(`Selecting ${expectedValueSavedToDb} in flexdata dropdown`, async () => {
            const flexData = this.page.getByTestId(skTestId)
            const flexDataInput = flexData.locator('input.react-select__input')

            await flexDataInput.pressSequentially(inputValue)
            await this.inputToSkyeAndWaitForBackendResponse(
                flexDataInput,
                () => flexDataInput.press('Enter')
            )

            const flexDataHiddenInput =
                flexData.locator(`#${GenericUtils.removeSkPrefix(skTestId)}`);  
            await expect(flexDataHiddenInput).toHaveValue(expectedValueSavedToDb,{timeout:10000});
        },{box: true});
    }

    public async verifyMessageAttributeContent(
        testId: string,
        expectedMessageContent: string
    ) {
        const messageAttribute = this.page.locator(`[data-testid="${testId}"] .sk-message-content`);
        const actualMessageContent = await messageAttribute.innerText();
        const errorMessage = 'The message doesnt contain the expected content. Most likely the message can not be found or the content changed.';
        expect(actualMessageContent,errorMessage).toContain(expectedMessageContent);
    }

    public async verifyHtmlJsAttributeContent(
        skTestId: string,
        expectedMessageContent: string
    ) {
        await test.step('Verify content of HTML/JS attribute', async () => {
            const messageAttribute = this.page.getByTestId(skTestId)
            const actualMessageContent = await messageAttribute.innerText();
            const errorMessage = 'The message doesnt contain the expected content. Most likely the message can not be found or the content changed.';
            expect(actualMessageContent,errorMessage).toContain(expectedMessageContent);
        },{box: true});
    }

    public async clickOnActionButton(
        buttonId: string,
        expectValidationErrors: boolean = false
    ) {
        const actionButton = this.page.locator(`#${buttonId}`);
        await actionButton.waitFor();
        await expect(actionButton).toBeEnabled();

        await this.inputToSkyeAndWaitForBackendResponse(
            actionButton,
            () => actionButton.click(),
            "?stepId="
        )

        const  errors = this.page.locator('div.sk-error-validation');

        if (expectValidationErrors) {
            await expect(errors).not.toHaveCount(0);
        } else {
            await expect(errors).toHaveCount(0);
        }
    }

    public async verifyProcessStepIsLoaded(
        processStepId: string
    ) {
        const processStepDiv = this.page.locator(`[data-process-step-id="${processStepId}"]`);
        try {
            await processStepDiv.waitFor({timeout:50000});
        } catch (error) {
            const errorMessage = `Process step: ${processStepId} is not loaded. Most likely causes are either timeout due to slowness OR the action button clicking was unsuccessful`;            throw new Error(errorMessage);
        }
    }

    public async clickOnUiTab(
        testId:string
    ) {
        const tab = this.page.getByTestId(testId);
        await tab.waitFor();
        await tab.click();

        const selectedTab = this.page.locator(`li.sk-tab--selected > a[data-testid="${testId}"]`);
        await selectedTab.waitFor();
    }

    public async clickOnUiPanel(
        id:string
    ) {
        const panel = this.page.locator(`#${id}`)
        await panel.waitFor();
        await panel.click();
        await expect(panel).toHaveAttribute('aria-expanded', 'true');
    }

    public async selectFromCheckbox(
        testId:string
    ) {
        const checkboxItem = this.page.getByTestId(testId);
        await checkboxItem.waitFor();
        await this.inputToSkyeAndWaitForBackendResponse(
            checkboxItem,
            () => checkboxItem.click())

        const isCheckboxSelected = checkboxItem.getAttribute('data-selected');
        expect(isCheckboxSelected).toBeTruthy();
    }

    public async verifySliderRanges(
        testId: string,
        valueMin: string,
        valueMax: string,
    ) {
        const slider = this.page.getByTestId(testId)
        const sliderHandler = slider.locator('div.rc-slider-handle')
        await expect(sliderHandler).toHaveAttribute("aria-valuemin", valueMin);
        await expect(sliderHandler).toHaveAttribute("aria-valuemax", valueMax);
    }

    public async verifyValidationMessage(
        testId: string,
        message: string,
        expectValidationErrors: boolean
    ) {
        const field = this.page.getByTestId(testId);
        const validationMessage = field.locator('.sk-error-validation span')
        if (expectValidationErrors) {
            await expect(validationMessage).toHaveText(message)
        } else {
            await expect(validationMessage).toHaveCount(0)
        }
    }

    public async fillRichTextArea(
        testId: string,
        inputValue: string,
        validateText: string
    ) {
        const richTextEditor = this.page.getByTestId(testId)
        const contentEditable = richTextEditor.locator('.fr-element.fr-view[contenteditable="true"]')
        await contentEditable.pressSequentially(inputValue)
        await this.inputToSkyeAndWaitForBackendResponse(
            contentEditable,
            () => contentEditable.press('Tab')
        )
        await expect(contentEditable).toContainText(validateText);
    }

    public async verifyLinkAttribute(
        skTestId: string,
        expectedLabel: string
    ) {
        await test.step(`Verify that link attribute has text ${expectedLabel}`, async () => {
            const linkAttribute = this.page.getByTestId(skTestId)
            const linkLabel = linkAttribute.locator('a.sk-process-link span')
            await expect(linkLabel).toHaveText(expectedLabel)
        }, { box: true });
    }

    /**
     * @param processId - id of the process, in sk-process-{processName} form
     * @returns uuid of current process object (your product/generic/user)
     */
    public async extractImplementationUuidBasedOnProcessId(
        processId: string
    ): Promise<string> {
        const process = this.page.locator(`#${processId}`);
        return process.getAttribute('data-process-object-uuid')
    }

    /**
     * @param skTestId - skTestId of the UI group that is expected to be visible in the popup
     */
    public async verifyPopupIsLoaded(skTestId: string) {
        await test.step(`Verify popup is loaded`, async () => {
            const modalWrapper = this.page.locator('.sk-modal-group');
            await expect(modalWrapper).toBeVisible()
            const closeIcon = modalWrapper.locator('i.close')
            await expect(closeIcon).toBeVisible()
            const uiGroup = modalWrapper.locator(`[data-testid="${skTestId}"]`);
            await expect(uiGroup).toBeVisible()
        }, { box: true });
    }

    public async closePopup() {
        const closeIcon = this.page.locator('i.close');
        await closeIcon.click();
        await expect(closeIcon).toHaveCount(0)
    }

    public async verifyNoLoadingIcon(skTestId: string) {
        const field = this.page.getByTestId(skTestId)
        const loadingIcon = field.locator('i.icon-loading')
        await expect(loadingIcon).toHaveCount(0)
    }

    public async setSliderValue(containerTestId: string, inputValue: number) {
        const containerDivElement = this.page.locator(`[data-testid="${containerTestId}"]`);
        const sliderDivElement = containerDivElement.locator(`div.rc-slider-handle`);
        await sliderDivElement.scrollIntoViewIfNeeded();
        const minValue = parseInt(await sliderDivElement.getAttribute('aria-valuemin'));
        const maxValue = parseInt(await sliderDivElement.getAttribute('aria-valuemax'));
        if (inputValue > maxValue || inputValue < minValue)
            throw Error(`The intended input value is out of slider [${containerTestId}]'s range!`);
        
        let style = await sliderDivElement.getAttribute('style');
        let position = style?.match(/left: (\d+)%/)?.[1];
        let currentValue = Math.round(minValue + ((maxValue - minValue) * parseFloat(position) / 100));

        let incrementByAmount = await this.calculateIncrementAmount(sliderDivElement, currentValue, minValue, maxValue);
        const difference = (currentValue > inputValue) ? currentValue - inputValue : inputValue - currentValue;
        const step = difference / incrementByAmount;
        console.log(
            'IncrementAmount: ' + incrementByAmount + '\n' +
            'Differene: ' + difference + '\n' +
            'Step: ' + step
        );

        const shouldMoveLeft = (inputValue < currentValue) ? true : false;
        let changingValue = currentValue;
        for (let i = 1; i <= step; i++) {
            if (shouldMoveLeft) {
                await this.moveSliderByOne(sliderDivElement, 'Left');
                changingValue = changingValue - incrementByAmount;
            }
            else {
                await this.moveSliderByOne(sliderDivElement, 'Right');
                changingValue = changingValue + incrementByAmount;
            }
            console.log('Step #' + i + ' done.');
            console.log('Value ' + changingValue)
        }
        
        style = await sliderDivElement.getAttribute('style');
        position = style?.match(/left: (\d+)%/)?.[1];
        currentValue = Math.round(minValue + ((maxValue - minValue) * parseFloat(position) / 100));

        expect(changingValue).toEqual(inputValue);
        expect(currentValue).toEqual(inputValue);
    }

    private async calculateIncrementAmount(sliderDivElement: Locator, currentValue, minValue: number, maxValue: number) {
        await this.moveSliderByOne(sliderDivElement, 'Right');

        const style = await sliderDivElement.getAttribute('style');
        const position = style?.match(/left: (\d+)%/)?.[1];
        const newValue = Math.round(minValue + ((maxValue - minValue) * parseFloat(position) / 100));

        const incrementByAmount = (newValue > currentValue) ? (newValue - currentValue) : (currentValue - newValue);
        
        if (newValue != currentValue) {
            // Reset
            await this.moveSliderByOne(sliderDivElement, 'Left');
        }
        else throw Error("Something went wrong!");

        return Math.round(incrementByAmount);
    }
    
    private async moveSliderByOne(sliderDivElement: Locator, direction: "Left" | "Right") {
        await sliderDivElement.waitFor();
        let box = await sliderDivElement.boundingBox();
        if (!box) {
            throw new Error('Could not find slider handle bounding box');
        }
        await this.page.mouse.move(box.x, box.y);
        await this.page.waitForTimeout(100);
        await this.page.mouse.down();
        await this.page.waitForTimeout(100);
        await this.page.keyboard.press(`Arrow${direction}`);
        await this.page.waitForTimeout(100);
        await this.page.mouse.up();
        await this.page.waitForTimeout(100);
        await sliderDivElement.waitFor();
        box = await sliderDivElement.boundingBox();
        if (!box) {
            throw new Error('Could not find slider handle bounding box');
        }
        await this.page.mouse.move(box.x, box.y);
        await this.page.mouse.down();
        await this.inputToSkyeAndWaitForBackendResponse(
            sliderDivElement,
            () => this.page.mouse.up(),
        );
    }
}

