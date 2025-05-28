import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly productsTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsTable = page.locator('div.products');
    }

    async goto() {
        await this.page.goto('/store/cpanel-licenses');
    }

    async selectProductByName(productName: string) {
        const productCard = this.productsTable.locator(
            `div.product.clearfix:has(span:has-text("${productName}"))`
        );
        await expect(productCard).toBeVisible({ timeout: 10000 });

        const orderNowBtn = productCard.locator('a.btn-success[id*="order-button"]');
        await expect(orderNowBtn).toBeVisible({ timeout: 10000 });
        await orderNowBtn.click();
    }
}
