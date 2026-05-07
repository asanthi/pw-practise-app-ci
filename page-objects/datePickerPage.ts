import { Page, expect } from "@playwright/test"
import { HelperBase } from "./helperBase";

export class DatePickerPage  extends HelperBase{

    //private readonly page: Page

    constructor(page: Page) {
        //You use super(page) only when your class extends a parent class
            super(page)
    }

    async selectCommonDatePickerDateFromToday(
        numberOfDaysFromToday: number
    ) {
        const calendarInputFiled = this.page.getByPlaceholder('Form Picker')
        await calendarInputFiled.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputFiled).toHaveValue(dateToAssert)

    }

    async selectDatePickerWithRangeFromToday(
        startDateFromToday: number,
        endDateFromToday: number
    ) {
        const calendarInputFiled = this.page.getByPlaceholder('Range Picker')
        await calendarInputFiled.click()

        const startDateToAssert = await this.selectDateInTheCalendar(startDateFromToday)
        const endDateToAssert = await this.selectDateInTheCalendar(endDateFromToday)

        const dateToAssert = `${startDateToAssert} - ${endDateToAssert}`
         await expect(calendarInputFiled).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(
        numberOfDaysFromToday: number
    ) {
        //use js date object
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()

        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).click()
        return dateToAssert
    }
}