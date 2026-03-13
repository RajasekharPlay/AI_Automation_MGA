import axios, { AxiosResponse } from 'axios';
import {XMLParser} from "fast-xml-parser";
const prettier = require('pretty-data').pd;


export class SoapImplementationApiClient {
    static async makeSoapCall(
        url:string,
        requestBody: string,
    ): Promise<AxiosResponse<any,any>> {
        return await axios.post(url,requestBody, {
            headers: {
                "Content-Type":"text/xml; charset=utf-8"
            },
        })
            .catch(function(error) {
                if(error.response.data) {
                    if (SoapImplementationApiClient.isUserAlreadyExistsError(error.response.data)) {
                        console.log(`User already exists. Continuing without throwing error`)
                        return error.response
                    } else {
                        const url = error.config?.url;
                        const requestBody = prettier.xml(error.config?.data);
                        const responseBody = prettier.xml(error.response.data);
                        const errorMessage = `Request was sent to the stage but the stage responded with an error. 
                        Url: ${url}
                        Request: ${requestBody}
                        Response: ${responseBody}`
                        throw new Error(errorMessage);
                    }
                } else if (error.request) {
                    const url = error.config?.url;
                    const requestBody = error.config?.data;
                    const errorMessage =
                        `Request was sent but there was no response. Likely invalid URL, timeout, or request error.
                        URL: ${url}
                        Request body: ${requestBody || 'No request body available'}`;
                    throw new Error(errorMessage);
                } else {
                    const errorMessage = `There was an unexpected error. ${error.message}`
                    throw new Error(errorMessage);
                }
            });
    }

    static async extractUuidFromXmlResponse(
        xmlString:string
    ):Promise<string> {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_'
        });
        const parsedXml = parser.parse(xmlString);
        const implementation = parsedXml['soap:Envelope']['soap:Body']['ns3:createImplementationResponse']['ns3:implementation'];
        const uuid = implementation['@_uuid'];
        if ( uuid === undefined ) {
            throw new Error(`Was unable to extract uuid from xml response: ${prettier.xml(xmlString)}`);    }
        return uuid ;
    }

    static isUserAlreadyExistsError(xmlString: string): boolean {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_'
        });
        const parsedXml = parser.parse(xmlString);

        const fault = parsedXml?.['soap:Envelope']?.['soap:Body']?.['soap:Fault'];
        const error = fault?.detail?.['ns3:ImplementationValidationException']?.error;

        const attribute = error?.attribute;
        const errorType = error?.validationErrorType;
        const message = error?.validationMessage;

        return (
            attribute === 'InternalUser.@Username' &&
            errorType === 'typeValidationError' &&
            typeof message === 'string' &&
            message.includes('There is already an user with this name')
        );
    }

}