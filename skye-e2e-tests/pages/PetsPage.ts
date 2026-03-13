import { Page } from "@playwright/test";
import SkyeAttributeCommands from "../custom/SkyeAttributeCommands";
import BasePage from "./BasePage";

export default class PetsPage extends BasePage {
    constructor(page:Page, skye:SkyeAttributeCommands) {
        super(page, skye);
    }
}