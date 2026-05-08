import { test } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'


test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('navigate to form page', async ({ page }) => {

    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})



