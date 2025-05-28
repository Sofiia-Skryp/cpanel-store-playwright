import { Page, Locator } from '@playwright/test';

export class ProductPage {
    readonly page: Page;
    ipField: Locator;
    addonCheckboxes: Locator;
    continueBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ipField = this.page.locator('input[name="configoption[1]"]');
        this.addonCheckboxes = this.page.locator('input[type="checkbox"][name^="addon"]');
        this.continueBtn = this.page.locator('button, input[type="submit"]', { hasText: 'Continue' });
    }

    async setIpAddress(ip: string) {
        await this.ipField.fill(ip);
    }

    async selectFirstAddon() {
        const firstAddon = this.addonCheckboxes.first();
        await firstAddon.check();
    }

    async continue() {
        await this.continueBtn.first().click();
    }
}
