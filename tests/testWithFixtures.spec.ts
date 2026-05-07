import { test } from '../test-options' //import fixture from the newly created test-option instead of palywright tests (object), 
// test-options extends playwright test obejct

import { faker } from '@faker-js/faker'



test('parameterized methods', async ({ pageManager }) => {

    //const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}`
   
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'test123', 'Option 1')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)

})