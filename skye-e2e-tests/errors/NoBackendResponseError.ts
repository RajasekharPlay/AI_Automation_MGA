export class NoBackendResponseError extends Error {
    constructor(element: any, timeout: number, originalError: any) {
        super(`No response in ${timeout} ms from backend after setting value for ${element}. Original error: ${originalError}`);
        this.name = 'NoBackendResponseError';
    }
}