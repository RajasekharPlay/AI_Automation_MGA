import {AxiosResponse} from 'axios';
import FormData from 'form-data';
import { HttpClient  } from '../HttpClient'
import {ApiUtils} from "../ApiUtils";
import {CookieJar} from "./CookieJar";
import {CustomPlaywrightError} from "../../errors/CustomPlaywrightError";

export class FedizAuthenticator {
    private static cookieJar = new CookieJar();
    private static IDP_COOKIE_NAME = 'idpCookieName'
    private static WS_FED_URI = '/idp/api/v2/public/en/US/wsfed'
    private static FEDIZ_SEC_CHECK_URI = '/skyeapp-admin/j_spring_fediz_security_check'

    public static async authenticateWithFediz(
        authenticatedEndpoint: string = '/skyeapp-admin/console',
        username: string,
        password: string,
        authenticatedCookieName: string
    ): Promise<void> {
        console.log(`Authentication started with ${authenticatedEndpoint}`);
        const fedizLoginUrl = await this.initiateFedizAuthentication(authenticatedEndpoint, authenticatedCookieName)
        const redirectUrl = await this.performIdpLoginForRedirectUrl(username, password, fedizLoginUrl)
        await this.completeFedizAuthentication(redirectUrl, authenticatedCookieName)
    }

    private static async initiateFedizAuthentication(
        authenticatedEndpoint: string,
        authenticatedCookieName: string
    ): Promise<string> {
        const endpoint = `${process.env.pw_HOST}${authenticatedEndpoint}`;
        const initialFedizParams: Record<string, string> = await this.startFedizAuthFlowToGetParams(
            endpoint,
            authenticatedCookieName
        );
        return this.getFedizUrlAndSetupSession(initialFedizParams);
    }

    private static async startFedizAuthFlowToGetParams(
        endpoint: string,
        authenticatedCookieName: string
    ): Promise<Record<string, string>> {
        const response = await this.getFedizAuthResponse(endpoint);
        const sessionId = ApiUtils.extractJSessionIdFromResponse(response);
        this.setAuthenticatedCookie(authenticatedCookieName, sessionId);
        const redirectUrl = this.extractRedirectUrlFromResponse(response);
        return ApiUtils.extractQueryParamsFromUrl(redirectUrl);
    }

    private static async getFedizAuthResponse(endpoint: string): Promise<AxiosResponse> {
        const allowRedirects = false;
        return HttpClient.makeGetRequest(endpoint, allowRedirects);
    }

    private static setAuthenticatedCookie(authenticatedCookieName: string, sessionId: string): void {
        this.cookieJar.setCookie(authenticatedCookieName, sessionId);
    }

    private static extractRedirectUrlFromResponse(response: AxiosResponse): string {
        const headerName = 'location';
        return ApiUtils.extractValueFromResponseHeader(response, headerName);
    }

    private static async getFedizUrlAndSetupSession(queryParams: Record<string, string>): Promise<string> {
        const response = await this.getFedizResponse(queryParams)
        this.setupFedizSession(response)
        return this.extractTargetUrlFromResponse(response)
    }

    private static async getFedizResponse(queryParams: Record<string, string>): Promise<AxiosResponse> {
        const endpoint = this.generateEndpointFromQueryParams(queryParams);
        return HttpClient.makeGetRequest(endpoint);
    }

    private static generateEndpointFromQueryParams(
        queryParams: Record<string, string>
    ): string {
        const host = process.env.pw_HOST;
        const queryString =  Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&')
        return `${host}${this.WS_FED_URI}?${queryString}`
    }

    private static setupFedizSession(response: AxiosResponse): void {
        const sessionId = ApiUtils.extractJSessionIdFromResponse(response)
        this.cookieJar.setCookie(this.IDP_COOKIE_NAME, sessionId)
    }

    private static extractTargetUrlFromResponse(response: AxiosResponse): string {
        if (response.data?.button?.targetUrl) {
            return response.data.button.targetUrl;
        } else {
            throw new CustomPlaywrightError('Extraction Error','TargetUrl not found in response', response)
        }
    }

    private static async performIdpLoginForRedirectUrl(
        username: string,
        password: string,
        fedizLoginUrl: string
    ): Promise<string> {
        const requestBody = this.prepareIdpLoginRequestBody(username, password);
        const requestHeader = this.prepareIdpLoginRequestHeader(requestBody);
        const response = await this.performLogin(fedizLoginUrl, requestHeader, requestBody)
        return this.extractIdpRedirectFromResponse(response)
    }

    private static prepareIdpLoginRequestBody(username: string, password: string): FormData {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('captcha', '');
        return formData;
    }

    private static prepareIdpLoginRequestHeader(requestBody: FormData): Record<string, string> {
        const sessionId = this.cookieJar.getCookie(this.IDP_COOKIE_NAME)
        return {
            'Cookie': `JSESSIONID=${sessionId}`,
            ...requestBody.getHeaders()
        }
    }
    private static async performLogin(
        fedizLoginUrl: string,
        requestHeader: Record<string, string>,
        requestBody: FormData
    ): Promise<AxiosResponse> {
        const allowRedirect = true
        return HttpClient.makePostRequest(fedizLoginUrl, requestHeader, allowRedirect, requestBody)
    }

    private static async completeFedizAuthentication(
        redirectUrl: string,
        authenticatedCookieName: string
    ): Promise<void> {
        const fedizParams = await this.getFedizParamsFromLoginRedirect(
            redirectUrl,
            authenticatedCookieName
        );
        const authCookie = await this.getFedizAuthCookie(fedizParams, authenticatedCookieName);
        this.setAuthenticatedCookie(authenticatedCookieName, authCookie);
    }

    private static async getFedizParamsFromLoginRedirect(
        endpoint: string,
        authenticatedCookieName: string
    ): Promise<Record<string,string>> {
        const requestHeader = this.prepareLoginRedirectRequestHeader(authenticatedCookieName)
        const response =await this.performLoginRedirect(endpoint, requestHeader)
        return ApiUtils.extractFedizParamsFromHtml(response)
    }

    private static prepareLoginRedirectRequestHeader(authenticatedCookieName: string): Record<string, string> {
        const idpSessionId = this.cookieJar.getCookie(this.IDP_COOKIE_NAME)
        const protectedResourceSessionId = this.cookieJar.getCookie(authenticatedCookieName)
        return {
            'Cookie': `JSESSIONID=${idpSessionId}; skyeapp_admin=${protectedResourceSessionId}`,
        }
    }

    private static performLoginRedirect(endpoint: string, requestHeader: Record<string, string>): Promise<AxiosResponse> {
        const allowRedirect = true
        return HttpClient.makeGetRequest(
            endpoint,
            allowRedirect,
            requestHeader
        )
    }

    private static async getFedizAuthCookie(
        fedizParams: Record<string, string>,
        authenticatedCookieName: string
    ): Promise<string> {
        const requestHeader = this.prepareFedizAuthCheckHeader(authenticatedCookieName)
        const requestBody = ApiUtils.createUrlSearchParamsFromRecord(fedizParams)
        const response = await this.performFedizSecurityCheck(requestHeader, requestBody)
        return ApiUtils.extractJSessionIdFromResponse(response)
    }

    private static prepareFedizAuthCheckHeader(authenticatedCookieName: string): Record<string, string> {
        const protectedResourceCookie = this.cookieJar.getCookie(authenticatedCookieName)
        const idpCookie = this.cookieJar.getCookie(this.IDP_COOKIE_NAME)
        const contentType = 'application/x-www-form-urlencoded'
        return {
            'Cookie': `JSESSIONID=${protectedResourceCookie};JSESSIONID=${idpCookie}`,
            'Content-Type': contentType
        };
    }

    private static performFedizSecurityCheck(
        requestHeader: Record<string, string>,
        requestBody: URLSearchParams
    ): Promise<AxiosResponse> {
        const skyeStageUrl = process.env.pw_HOST
        const fedizSecurityCheckUrl = `${skyeStageUrl}${this.FEDIZ_SEC_CHECK_URI}`
        const allowRedirect = false
        return HttpClient.makePostRequest(
            fedizSecurityCheckUrl,
            requestHeader,
            allowRedirect,
            requestBody
        )
    }

    private static extractIdpRedirectFromResponse(response: AxiosResponse): string {
        if (response.data?.redirectUrl) {
            return response.data.redirectUrl;
        } else {
            throw new CustomPlaywrightError('Extraction Error','RedirectUrl not found in response', response)
        }
    }
}
