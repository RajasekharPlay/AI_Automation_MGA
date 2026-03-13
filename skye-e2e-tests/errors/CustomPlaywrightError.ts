
export class CustomPlaywrightError extends Error {
    /**
     * Creates an instance of CustomPlaywrightError.
     *
     * @param {string} errorName - A custom name for the error.
     * @param {string} error - A message describing the error.
     * @param {any} [relatedObject] - Optional object with additional context. Typically, the original error
     */
    constructor(errorName: string, error: string, relatedObject?: any) {
        super(`${errorName}: ${error}. Related object printed`);
        console.log(relatedObject);
        this.name = errorName;
    }
}