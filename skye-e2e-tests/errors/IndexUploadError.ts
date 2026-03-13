export class IndexUploadError extends Error {
    constructor(message: string, originalError: any) {
        super(`${message}. Original error: ${originalError}`);
        this.name = 'IndexUploadError';
    }
}