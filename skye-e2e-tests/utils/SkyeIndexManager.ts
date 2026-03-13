import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { IndexUploadError } from '../errors/IndexUploadError';

export class SkyeIndexManager {
    static async uploadIndexToStage(
        host:string,
        indexName: string,
        indexRelativePath: string
    ): Promise<void> {

        const csvFilePath = SkyeIndexManager.constructFilePath(indexRelativePath);
        const encodedIndexContent = await SkyeIndexManager.convertFileToBase64(csvFilePath);
        await SkyeIndexManager.callSkyeToUploadIndex(
            host,
            indexName,
            encodedIndexContent);
    }

    private static constructFilePath(
        relPath: string
    ): string {
        return path.join(__dirname, '..', relPath);
    }

    private static async convertFileToBase64(
        filePath: string
    ): Promise<string> {
        let fileBuffer: Buffer;
        try {
            fileBuffer = await fs.promises.readFile(filePath);
        } catch (error) {
            throw new IndexUploadError(`Could not convert file to base64. FilePath: ${filePath}`,error);
        }
        return fileBuffer.toString('base64');
    }

    private static async callSkyeToUploadIndex(
        host:string,
        indexName: string,
        indexContent: string
    ): Promise<void> {

        const requestBody = {
            name: indexName,
            content: indexContent
        };

        await axios
            .post(
                host + '/apis/index',
                requestBody)
            .then(function (response) {
                console.log('Response:', response.data);
                //TODO improve logging alltogether
                })
            .catch(function (error) {
                const errorDetails = error.response ?
                    JSON.stringify(error.response.data, null, 2) :
                    (error.message || String(error));
                throw new IndexUploadError(`Uploading index ${indexName} failed.`, errorDetails);            })
    }
}