import * as fs from 'fs/promises';
import * as fs_root from 'fs';
import { DateManager } from './DateManager';
import {CustomPlaywrightError} from "../errors/CustomPlaywrightError";

export class GenericUtils {
    static async replacePlaceholders(
        template: string,
        values: { [key: string]: string }
    ): Promise<string> {
        return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || 'VALUE NOT FOUND');
    }

    static async importStringFromFile(
        filePath:string,
        encoding:string
    ): Promise<string> {
        try {
            return await fs.readFile(filePath, encoding as BufferEncoding);
        } catch (err) {
            throw new Error(`Error while reading from xml template: ${filePath} with error ${err.message}`);
        }
    }

    static generateUniqueString(
    ):string {
        const currentDate = DateManager.increaseCurrDateWithDays(0);
        const randomInt = Math.floor(Math.random() * 9000000);
        return `${currentDate}-${randomInt}`;
    }

    static removeSkPrefix(skTestId: string): string {
        return skTestId.startsWith('sk-') ? skTestId.slice(3) : skTestId;
    }

    static async verifyLocalFilePresence(filePath: string): Promise<boolean> {
        if (fs_root.existsSync(filePath)){
            console.log(`Auth file exists at ${filePath}`)
            return true
        } else {
            console.log(`Auth file does not exists at ${filePath}`)
            return false;
        }
    }

    static async extractUsernameFromLoggedInUsers(filePath: string): Promise<string> {
        console.log(`Reading file: ${filePath}`);

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const loggedInUserJson = JSON.parse(fileContent);
            return loggedInUserJson.userName
        } catch (error) {
            console.error(`Error reading or parsing ${filePath}:`, error.message || error);
            throw new CustomPlaywrightError(
                'ExtractionError',
                `Could not extract username from ${filePath}`,
                error
            )
        }
    }

}
