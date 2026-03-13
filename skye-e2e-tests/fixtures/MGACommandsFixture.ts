import { test as base } from  "@playwright/test"
import MGACommands from '../custom/MGACommands';
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";

export const mga_test = base.extend<{
    mga: MGACommands;
}>({
    mga: async({page}, use) => {
        await use(new MGACommands(page, new SkyeAttributeCommands(page)))
    }
})
