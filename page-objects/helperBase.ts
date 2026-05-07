import { Page } from "@playwright/test"
import { time } from "console"


export class HelperBase{

    readonly page: Page

    constructor(page){
        this.page = page
    }

    async waitForNumberOfSeconds(timeInSeconds:number){
        await this.page.waitForTimeout(timeInSeconds * 1000)
    }
}