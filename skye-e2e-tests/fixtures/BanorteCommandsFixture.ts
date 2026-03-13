import { test as base } from  "@playwright/test"
import BanorteCommands from '../custom/BanorteCommands';
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";

export const banorte_test = base.extend<{
    banorte: BanorteCommands;
}>({
    banorte: async({page}, use) => {
        await use(new BanorteCommands(page, new SkyeAttributeCommands(page)))
    }
})