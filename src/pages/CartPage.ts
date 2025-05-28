import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    orderSummary: Locator;
    productNames: Locator;
    addonNames: Locator;
    totalPrice: Locator;
    continueBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.orderSummary = this.page.locator('.cart-summary');
        this.productNames = this.page.locator('.cart-item .item-title');
        this.addonNames = this.page.locator('.cart-item .item-addons li');
        this.totalPrice = this.page.locator('.summary-total .amount');
        this.continueBtn = this.page.getByRole('button', { name: /Checkout|Continue/i });
    }

    async verifyProductAndAddonPresent(product: string, addon: string) {
        await this.productNames.filter({ hasText: product }).waitFor();
        await this.addonNames.filter({ hasText: addon }).waitFor();
    }

    async getTotalPrice(): Promise<string> {
        const price = await this.totalPrice.textContent();
        return price ?? '';
    }


    async proceedToCheckout() {
        await this.continueBtn.click();
    }
}
