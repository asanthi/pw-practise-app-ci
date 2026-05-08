import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'

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

test('parameterized methods', async ({ page }) => {

    const pm = new PageManager(page)

    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}`
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'test123', 'Option 1')

    //**************-------------------- SCREENSHOTS ---------------------- ***************** */
    //screenshots of the entire window
    await page.screenshot({ path: 'screenshots/formLayoutsPage.png' })
    //save screenshot in binary form
    const buffer = await page.screenshot()
   // console.log(buffer.toString('base64'))


    //  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('John Smith', 'John@test.com', true)
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)

    //screenshot of a part of a specific part
    await page.locator('nb-card', { hasText: "Inline form" }).screenshot({ path: 'screenshots/inLineForm.png' })

    await pm.navigateTo().datePickerPage()
    await pm.ondatePickerPage().selectCommonDatePickerDateFromToday(1)
    await pm.ondatePickerPage().selectDatePickerWithRangeFromToday(1, 2)

})

