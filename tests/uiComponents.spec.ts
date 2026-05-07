import { test, expect } from '@playwright/test'
import { getUnpackedSettings } from 'http2'
import { using } from 'rxjs'

test.beforeEach(async ({ page }) => {

    await page.goto('/')

})

test.describe('Form Layouts page', () => {
    //if you need to overide retry settings in playwright.config.ts
    test.describe.configure({retries: 2})

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }, testInfo) => {
        if (testInfo.retry){
            console.log("******************RETRIED****************")
        }
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })
        await usingTheGridEmailInput.fill('test@test.com')
        //you cant chain the clear command to the fill command
        await usingTheGridEmailInput.clear()
        //type one character at a time (and also introduce a delay between keystokres) instead of copying the text alltogether
        await usingTheGridEmailInput.pressSequentially('test2@test.com')

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test.only('radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid" })

        // await usingTheGridEmailInput.getByLabel('Option 1').check({force:true})
        // using force:true cz the button is hidden
        await usingTheGridForm.getByRole('radio', { name: "Option 1" }).check({ force: true })
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: "Option 1" }).isChecked()
        
        await expect(usingTheGridForm).toHaveScreenshot()
         /** 
        expect(radioStatus).toBeTruthy()

        await expect(usingTheGridForm.getByRole('radio', { name: "Option 1" })).toBeChecked()


        //validate option 1 is unhecked when you select option 2
       
        await usingTheGridForm.getByRole('radio', { name: "Option 2" }).check({ force: true })
        expect(await usingTheGridForm.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy()
*/
    })

})
    test('check boxes', async ({ page }) => {

        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
        await page.getByRole('checkbox', { name: "Hide on click" }).uncheck({ force: true })
        await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast" }).check({ force: true })

        //apply to all check boxes

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()) {
            await box.uncheck({ force: true })
            expect(await box.isChecked()).toBeFalsy()
        }

    })


test('Lists and dropdowns', async ({ page }) => {

    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()
    page.getByRole('list') // when the ust has a UL tag
    page.getByRole('listitem') // when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({ hasText: "Cosmic" }).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)",
    }

    await dropDownMenu.click()
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])

        if (color != "Corporate") {
            await dropDownMenu.click()
        }

    }



})

test('Tooltip', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    // Select the tooltip , Go to sources and press "cmd+\" , this freezes the page. And then go to Elements and find the element for the tooltip
    const toolTipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })
    await toolTipCard.getByRole('button', { name: "Top" }).hover()

    page.getByRole('tooltip') // if you have a role tooltip created

    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')

})

test('dialog box', async ({ page }) => {

    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //the dialog box opened here is cancelled by playwright becase its a brower dialog. 
    // So we need to create a listener

    //create a listener
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        //to accept the dialog instead of cancelling it
        dialog.accept()
    })

    //this is a browser dialog box
    await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com")

})

test('table navigation', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1 get the row  by any test in this row
    const targetRow = page.getByRole('row', { name: "snow@gmail.com" })
    await targetRow.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //get row based on a specific column value
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowByID = page.getByRole('row').filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetRowByID.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('asanthi@akk.com')
    await page.locator('.nb-checkmark').click()

    //assert
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('asanthi@akk.com')

    //filter from the table

    const ages = ["20", "30", "40", "200"]

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }
            else {
                expect(cellValue).toEqual(age)
            }
        }

    }

})

test('Date picker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText(' Datepicker').click()

    const calendarInputFiled = page.getByPlaceholder('Form Picker')
    await calendarInputFiled.click()

    //use js date object

    let date = new Date()
    date.setDate(date.getDate() + 500)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()


    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()

    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    await expect(calendarInputFiled).toHaveValue(dateToAssert)

    //to avoid dates from the previous month that are shown at the beginning , use the correct class

    // await page.locator('[class="day-cell ng-star-inserted"]').getByText('14').click()

    //if you give '1' it will look for particla text, so you need to give exact:true
    // await page.locator('[class="day-cell ng-star-inserted"]').getByText('1',{exact:true}).click()
    // await expect(calendarInputFiled).toHaveValue('Apr 1, 2026')

})

test('sliders', async ({ page }) => {
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })

    //to reflect the above change on the UI
    await tempGauge.click()

    //Mouse movement
    //define the are where we want to move our mouse
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()

    await expect(tempBox).toContainText('30')

})















