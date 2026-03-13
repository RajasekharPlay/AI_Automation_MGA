import { test as setup } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs'; // Import the Node.js File System module

const storeStateFile = path.join(__dirname, '../../playwright/.auth/storeStateFile.json');
const loggedInUserFile = path.join(__dirname, '../../playwright/.auth/loggedInUser.json');


setup('Delete storage state', async ({ }) => {
    deleteStorageFilesIfPresent(storeStateFile)
    deleteStorageFilesIfPresent(loggedInUserFile)
});

setup('Verify presence of environment variables', async ({  }) => {
    const envArray = [
        'pw_HOST',
        'pw_TESTUSER',
        'pw_PASSWORD',
        'pw_EMAIL'
    ];

    for (const env of envArray) {
        verifyEnvVariableIsPresent(env);
    }

});

function verifyEnvVariableIsPresent(
    envVariable: string) {

    if (process.env[envVariable] !== undefined) {
        console.log(`Environment variable ${envVariable} is present with value ${process.env[envVariable]}`)
    } else {
        const errorMessage = 'Error: Environment variable: ' + envVariable + ' is not present. It gets resolved to: ' + process.env[envVariable]  ;
        throw new Error (errorMessage);
    }
}

function deleteStorageFilesIfPresent(filePath: string) {
    try {
        if (fs.existsSync(filePath)) {
            console.log(`User storage file found.`);
            fs.unlinkSync(filePath);
            console.log(`Successfully deleted user storage file: ${filePath}`);
        } else {
            console.log(`${filePath} file not found. No deletion needed.`);
        }
    } catch (error) {
        console.error(`Error during storage state file check/deletion: ${error}`);
    }
}

