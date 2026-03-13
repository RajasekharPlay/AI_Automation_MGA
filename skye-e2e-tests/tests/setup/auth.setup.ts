import {test as setup, expect, test} from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import {GenericUtils} from "../../utils/GenericUtils";
import LoginPage from '../../pages/LoginPage';

const storeStateFile = path.join(__dirname, '../../playwright/.auth/storeStateFile.json');
const loggedInUserFile = path.join(__dirname, '../../playwright/.auth/loggedInUser.json');

const runId = GenericUtils.generateUniqueString();
const userName = `${process.env.pw_TESTUSER}-${runId}`;

setup('login', async ({ page }) => {
    setup.setTimeout(90000)
    await test.step('Perform login', async () => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login(process.env.pw_EMAIL!,process.env.pw_PASSWORD);

        expect(await loginPage.isLoggedIn()).toBe(true);
        console.log(`Login with user ${process.env.pw_EMAIL} successful`)
});
    await test.step('Save files', async () => {
        const cookies = await page.context().cookies();
        const loggedInUsers = {
            userName: userName,
            cookies: cookies
        };
        fs.mkdirSync(path.dirname(loggedInUserFile), { recursive: true });
        fs.writeFileSync(loggedInUserFile, JSON.stringify(loggedInUsers, null, 2));
        console.log(`${loggedInUserFile} successfully saved`)

        await page.context().storageState({ path: storeStateFile });
        console.log(`${storeStateFile} successfully saved`)
    });
});
