export class CookieJar {
    private static instance: CookieJar;
    private cookies: Record<string, string> = {};

    constructor() {
        if (CookieJar.instance) {
            return CookieJar.instance;
        }
        CookieJar.instance = this;
    }

    setCookie(name: string, value: string): void {
        this.cookies[name] = value;
    }

    verifyCookieExists(name: string): boolean {
        return name in this.cookies;
    }

    getCookie(name: string): string {
        if (name in this.cookies) {
            return this.cookies[name];
        } else {
            throw new Error(`Error: ${name} does not exist`)
        }
    }

    deleteAllCookies(): void {
        this.cookies = {};
    }
}