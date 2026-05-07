import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {

    //declares a property named page, of type Page
    //readonly page: Page

    //receives the playwright's page
    constructor(page: Page) {
        //You use super(page) only when your class extends a parent class
            super(page)
    }

    async formLayoutsPage() {

        await this.selectGroupMenuItem('Forms')
        //await this.page.getByText('Forms').click()
        await this.page.getByText('Form Layouts').click()

        await this.waitForNumberOfSeconds(2)
    }

    async datePickerPage() {

         await this.selectGroupMenuItem('Forms')
       // await this.page.getByText('Forms').click()
        await this.page.waitForTimeout(1000)
        await this.page.getByText(' Datepicker').click()
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        //await this.page.getByText('Tables & Data').click()
        await this.page.getByText('Smart Table').click()

    }
    async toastrPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
       // await this.page.getByText('Modal & Overlays').click()
        await this.page.getByText('Toastr').click()

    }
    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
       // await this.page.getByText('Modal & Overlays').click()
        await this.page.getByText('Tooltip').click()

    }

    //private since this is  a helper methods used only by methods related to this page object
    //smart metho to see if menu item is expanded or collapsed
    private async selectGroupMenuItem(groupItemTitle : string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == "false"){
            await groupMenuItem.click()
        }
    }


}