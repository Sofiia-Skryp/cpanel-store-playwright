import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    private readonly page: Page;
    private readonly productsTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsTable = page.locator('div.products');
    }

    async goto() {
        await this.page.goto('/store/cpanel-licenses');
        await expect(this.productsTable).toBeVisible({ timeout: 20000 });
    }

    async selectProductByName(productName: string) {
        const productCard = this.productsTable.locator(
            `div.product.clearfix:has(span:has-text("${productName}"))`,
        );
        await expect(productCard).toBeVisible();

        const orderNowBtn = productCard.locator(
            'a.btn-success[id*="order-button"]',
        );
        await expect(orderNowBtn).toBeVisible();
        await orderNowBtn.click();

        await this.page.waitForURL('**/cart.php?a=confproduct**', { timeout: 50000 });
    }

    async getProductRecurringPriceByName(productName: string): Promise<string> {
        const priceLocator = this.page.locator(
            `//div[contains(@class, "product clearfix")][.//span[contains(text(), "${productName}")]]//span[contains(@class, "price")]`
        );
        await expect(priceLocator).toBeVisible();
        return (await priceLocator.textContent())?.trim() || '';
    }
}
