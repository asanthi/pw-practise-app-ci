import {test as base} from '@playwright/test'
import { PageManager } from './page-objects/pageManager'

export type TestOptions = {
    globalsQaURL : string
    formLayoutsPage : string // string becaouse w only return a URL
    pageManager : PageManager // Object type becasue we mighht use the methods etc
    
}

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', {option:true}],

    formLayoutsPage:async({page}, use) => {
         await page.goto('/')
         await page.getByText('Forms').click()
         await page.getByText('Form Layouts').click()
         await use('') //to activate the fixture
         console.log('Tear Down')
    }, 

    pageManager : async ({page, formLayoutsPage}, use) => {
        // will initiallize a formsLayouts Page instance first since its added as a dependency above
        const pm = new PageManager(page)
        await use(pm)
    }
})