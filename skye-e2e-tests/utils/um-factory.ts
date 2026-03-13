import path from "path";
import {GenericUtils} from "./GenericUtils";
import {SoapImplementationApiClient} from "./SoapImplementationApiClient";

const implementationCreationEndpoint = process.env.pw_HOST + '/skyeum/services/implementation-xml/implementation-xml';


export class UmFactory {
    static async createInternalOrg(
        runId: string
    ):Promise<string> {
        const internalOrgXmlTemplatePath = path.join(__dirname, '../resources/templates/createInternalOrganizationTemplate.xml');
        const internalOrgXmlTemplate = await GenericUtils.importStringFromFile(
            internalOrgXmlTemplatePath,
            'utf8'
        );


        const orgRequest = await GenericUtils.replacePlaceholders(
            internalOrgXmlTemplate,
            {
                organizationName:`intOrg-${runId}`
            }
        );

        const orgResponse = await SoapImplementationApiClient.makeSoapCall(
            implementationCreationEndpoint,
            orgRequest
        );

        const orgUuid = await SoapImplementationApiClient.extractUuidFromXmlResponse(orgResponse.data);
        console.log(`Internal Organization intOrg-${runId} with uuid ${orgUuid} successfully created`);
        return orgUuid;
    }

    static async createInternalUser(
        orgUuid:string,
        userName: string
    ) {
        const internalUserXmlTemplatePath = path.join(__dirname, '/../resources/templates/createInternalUserTemplate.xml');
        const internalUserXmlTemplate = await GenericUtils.importStringFromFile(
            internalUserXmlTemplatePath,
            'utf8'
        );

        const userRequest = await GenericUtils.replacePlaceholders(
            internalUserXmlTemplate,
            {
                userEmail:process.env.pw_EMAIL,
                username:userName,
                internalOrgUuid:orgUuid,
                password:process.env.pw_PASSWORD
            }
        );

        await SoapImplementationApiClient.makeSoapCall(
            implementationCreationEndpoint,
            userRequest
        );
        console.log(`User ${userName} is ready to be used`);
    }
}