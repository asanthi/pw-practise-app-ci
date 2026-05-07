import { test, expect } from '@playwright/test'
import { platform } from 'os'


test.beforeEach(async ({ page }) => {
   await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

})

test('Locator syntax rules', async ({ page }) => {
    //by tag name
    await page.locator('input').first().click()

    //by ID
    await page.locator('#inputEmail1').click()

    //by clas value - add a dot in front of the clsss value, if you remove the dot it'll be a tag.
    page.locator('.shape-rectanlge')

    // by attribute
    page.locator('[placeholder="Email"]')

    //by entire class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition]')

    //conbine different selectors - conbime input(tag) and attribute put them together with no space in between
    page.locator('input[placeholder="Email"][nbinput]')

    //by xpath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')

})


test('User facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: "Email" }).first().click()
    await page.getByRole('button', { name: "Sign in" }).first().click()

    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').first().click()

    await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignIn').click()
})

test('Locating child elements', async ({ page }) => {

    // by specifying elements one by one
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', { name: "Sign in" }).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async ({ page }) => {
    //using text filter
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click()
    //using locator filter
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: "Email" }).click()

    //use filter method : to chain multiple filters one by one narrowing down to the desired element
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: "Password" }).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: "Email" }).click()
})



test('Reusing locators', async({page})=> {

    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const emailField = basicForm.getByRole('textbox', { name: "Email" })

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', { name: "Password" }).fill('test@123')

    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')

} )


test ('Extracting value', async ({page})=> {
    //single text value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent()
    expect (buttonText).toEqual('Submit')

    //all test values
    const allRadioLabels = await page.locator('nb-radio').allTextContents()
    expect (allRadioLabels).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue  = await emailField.inputValue()
    expect (emailValue).toEqual('test@test.com')


    const placeHolderValue = await emailField.getAttribute('placeholder')
    expect(placeHolderValue).toEqual('Email')



})

test ('assertions', async({page})=>{

    // General assertions

    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')
    const text = await basicFormButton.textContent()
     expect(text).toEqual("Submit")
    
    const value = 5
    expect(value).toEqual(5)

    //Locator assertion
    expect(basicFormButton).toHaveText('Submit')

    //Soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()
})