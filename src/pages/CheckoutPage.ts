import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    productTable: Locator;
    licenseName: Locator;
    ip: Locator;
    price: Locator;
    completeOrderBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTable = this.page.locator('.checkout-summary');
        this.licenseName = this.page.locator('.checkout-summary .product-name');
        this.ip = this.page.locator('.checkout-summary .product-ip');
        this.price = this.page.locator('.checkout-summary .product-price');
        this.completeOrderBtn = this.page.locator('button', { hasText: 'Complete Order' });
    }

    section(sectionName: string) {
        return this.page.locator('section', { hasText: sectionName });
    }

    async verifyCheckoutInfo({ product, ip, price }: { product: string; ip: string; price: string }) {
        await this.licenseName.filter({ hasText: product }).waitFor();
        await this.ip.filter({ hasText: ip }).waitFor();
        await this.price.filter({ hasText: price }).waitFor();
    }

    async verifySections() {
        for (const section of [
            'Personal Information',
            'Billing Address',
            'Account Security',
            'Terms & Conditions',
            'Payment Details',
        ]) {
            await this.section(section).waitFor();
        }
        await this.completeOrderBtn.isDisabled();
    }
}
