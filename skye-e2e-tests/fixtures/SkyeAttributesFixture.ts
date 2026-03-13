import { test as base } from  "@playwright/test"
import SkyeAttributeCommands from '../custom/SkyeAttributeCommands';

export const test = base.extend<{
    skye:SkyeAttributeCommands;
}>({
    skye: async({page}, use) => {
        await use(new SkyeAttributeCommands(page))
    }
})