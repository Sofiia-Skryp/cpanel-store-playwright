import {test as base } from '@playwright/test'

export const test = base.extend({

    page:async ({page}, use) => {
        await page.setViewportSize({width: 1720, height: 980});

        await use(page);
    }

})