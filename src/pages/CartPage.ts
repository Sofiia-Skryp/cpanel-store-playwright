import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    private readonly page: Page;
    private readonly continueBtn: Locator;
    private readonly orderSummary: Locator;
    private readonly monthlySummary: Locator;

    constructor(page: Page) {
        this.page = page;
        this.continueBtn = this.page.locator('(//a[normalize-space()=\'Checkout\'])[1]\n');
        this.orderSummary = this.page.locator('//div[contains(@class,"total-due-today")]/span[contains(@class,"amt")]');
        this.monthlySummary = this.page.locator('(//div[contains(@class,"item-price")]/span[@class="cycle"])[1]\n');
    }

    async verifyProductPresent(productName: string) {
        const locator = this.page.locator(
            `//span[contains(@class,"item-title") and contains(., "${productName}")]`
        );
        await expect(locator).toBeVisible();
    }

    async verifyAddonPresent(addonName: string) {
        const locator = this.page.locator(
            `//span[normalize-space()="${addonName}"]`
        );
        await expect(locator).toBeVisible();
    }

    async proceedToCheckout() {
        await expect(this.continueBtn).toBeEnabled({ timeout: 20000 });
        await this.continueBtn.click();
        await this.page.waitForURL('**/cart.php?a=checkout**', { timeout: 50000 });
    }

    async verifyOrderSummary(expectedTotal: number) {
        await expect(this.orderSummary).toBeVisible();
        await expect(this.orderSummary).toHaveText(
            new RegExp(`${expectedTotal.toFixed(2)}`)
        );
        const actualTotalStr = await this.orderSummary.textContent();
        const actualTotal = parseFloat((actualTotalStr || '').replace(/[^\d.]/g, ''));
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    }

    async verifyMonthlyOrderSummar(expectedTotal: number) {
        await expect(this.monthlySummary).toBeVisible();
        await expect(this.monthlySummary).toHaveText(
            new RegExp(`${expectedTotal.toFixed(2)}`)
        );
        const actualTotalStr = (await this.monthlySummary.textContent())?.trim() || '';
        const actualTotal = parseFloat(actualTotalStr.replace(/[^\d.]/g, ''));
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    }
}
