import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;
    private readonly ipField: Locator;
    private readonly continueBtn: Locator;
    public readonly totalPriceDueToday: Locator;
    private readonly orderSummary: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ipField = this.page.locator('//label[contains(., \'IP Address\')]/following-sibling::input\n');
        this.continueBtn = this.page.locator('//button[@id="btnCompleteProductConfig"]\n');
        this.totalPriceDueToday = this.page.locator('//div[contains(@class,"total-due-today")]/span[contains(@class,"amt")]');
        this.orderSummary = this.page.locator('//div[contains(@class,"summary-totals")]//span[contains(@class,"pull-right float-right")]');
    }

    async setIpAddress(ip: string, timeout = 10000) {
        await expect(this.ipField).toBeVisible({ timeout });
        await this.ipField.scrollIntoViewIfNeeded();
        await this.ipField.focus();
        await this.ipField.fill(ip);
        await this.ipField.press('Enter');
    }

    async selectAddonByName(addonName: string, timeout = 10000) {
        const addonCheckbox = this.page.locator(
            `//div[contains(@class,"icheckbox_square-blue") and following-sibling::text()[contains(., "${addonName}")]]`
        );
        await expect(addonCheckbox).toHaveCount(1, { timeout });
        await addonCheckbox.click();
    }

    async continue(timeout = 15000) {
        await expect(this.continueBtn.first()).toBeEnabled({ timeout });
        await this.continueBtn.first().click();
        await this.page.waitForURL(/\/cart\.php(\?.*)?$/, { timeout: 20000 });
    }

    async getAddonRecurringPriceByName(addonName: string, timeout = 10000): Promise<string> {
        const priceLocator = this.page.locator(
            `//div[contains(@class,"panel-addon-selected")]//div[contains(@class,"panel-body card-body")]//label[contains(., "${addonName}")]/../../div[contains(@class,"panel-price")]`
        );
        await expect(priceLocator).toBeVisible({ timeout });
        return (await priceLocator.textContent())?.trim() || '';
    }

    async verifyOrderSummaryUpdated(expectedTotal: number, timeout = 10000) {
        await expect(this.orderSummary).toBeVisible({ timeout });
        await expect(this.orderSummary).toHaveText(
            new RegExp(`${expectedTotal.toFixed(2)}`),
            { timeout }
        );
        const actualTotalStr = await this.orderSummary.textContent();
        const actualTotal = parseFloat((actualTotalStr || '').replace(/[^\d.]/g, ''));
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    }

    async getTotalDueToday(timeout = 20000): Promise<string> {
        await expect(this.totalPriceDueToday).toBeVisible({ timeout });
        const amountText = await this.totalPriceDueToday.textContent();
        return amountText ? amountText.trim() : '';
    }
    async verifyBalanceChanged (previousPrice: string, timeout: number = 20000){
        await expect(this.totalPriceDueToday).not.toHaveText(previousPrice, { timeout });
    }

}