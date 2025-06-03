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

    async verifyProductPresent(productName: string, timeout = 10000) {
        const locator = this.page.locator(
            `//span[contains(@class,"item-title") and contains(., "${productName}")]`
        );
        await expect(locator).toBeVisible({ timeout });
    }

    async verifyAddonPresent(addonName: string, timeout = 20000) {
        const locator = this.page.locator(
            `//span[normalize-space()="${addonName}"]`
        );
        await expect(locator).toBeVisible({ timeout });
    }

    async proceedToCheckout(timeout = 20000) {
        await expect(this.continueBtn).toBeVisible({ timeout });
        await expect(this.continueBtn).toBeEnabled({ timeout });
        await this.continueBtn.click({ timeout });
        await this.page.waitForURL('**/cart.php?a=checkout**', { timeout });
    }

    async verifyOrderSummary(expectedTotal: number, timeout = 10000) {
        await expect(this.orderSummary).toBeVisible({ timeout });
        await expect(this.orderSummary).toHaveText(
            new RegExp(`${expectedTotal.toFixed(2)}`),
            { timeout }
        );
        const actualTotalStr = await this.orderSummary.textContent();
        const actualTotal = parseFloat((actualTotalStr || '').replace(/[^\d.]/g, ''));
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    }

    async verifyMonthlyOrderSummar(expectedTotal: number, timeout = 10000) {
        await expect(this.monthlySummary).toBeVisible({ timeout });
        await expect(this.monthlySummary).toHaveText(
            new RegExp(`${expectedTotal.toFixed(2)}`),
            { timeout }
        );
        const actualTotalStr = (await this.monthlySummary.textContent())?.trim() || '';
        const actualTotal = parseFloat(actualTotalStr.replace(/[^\d.]/g, ''));
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    }
}
