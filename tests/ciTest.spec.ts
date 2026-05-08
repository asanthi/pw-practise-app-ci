import { test } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { argosScreenshot } from "@argos-ci/playwright";


test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('navigate to form page', async ({ page }) => {

    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
     await argosScreenshot(page, "formLayoutsPage");
    await pm.navigateTo().datePickerPage()
     await argosScreenshot(page, "datePickerPage");
    await pm.navigateTo().smartTablePage()
     await argosScreenshot(page, "smartTablePage");
    await pm.navigateTo().toastrPage()
     await argosScreenshot(page, "toastrPage");
    await pm.navigateTo().tooltipPage()
     await argosScreenshot(page, "tooltipPage"):
     
})



