import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
    private readonly page: Page;
    private readonly price: Locator;
    private readonly completeOrderBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.price = this.page.locator('//div[@id="totalCartPrice"]');
        this.completeOrderBtn = this.page.locator('//button[@id="btnCompleteOrder"]\n');
    }

    private section(sectionName: string): Locator {
        return this.page.locator('section', { hasText: sectionName });
    }

    async verifyProductDetails({name, ip, recurringPrice, dueToday,}: { name: string; ip: string; recurringPrice: number; dueToday: number; }, timeout = 7000): Promise<void> {
        const row = this.page.locator(
            `//tr[td[contains(normalize-space(), "${name}")]]`
        );

        await expect(row.locator('xpath=.//td[1]')).toContainText(name, { timeout });

        const ipText = await row.locator('xpath=.//td[3]').textContent();
        expect(ipText?.trim()).toBe(ip);

        const recurringPriceText = await row.locator('xpath=.//td[4]').textContent();
        const recurringPriceNumber = parseFloat(
            recurringPriceText?.replace(/[^\d.]/g, '') || '0'
        );
        expect(recurringPriceNumber).toBeCloseTo(recurringPrice, 2);

        const dueTodayText = await row.locator('xpath=.//td[5]').textContent();
        const dueTodayNumber = parseFloat(
            dueTodayText?.replace(/[^\d.]/g, '') || '0'
        );
        expect(dueTodayNumber).toBeCloseTo(dueToday, 2);
    }

    async verifySections(timeout = 5000) {
        for (const section of [
            'Personal Information',
            'Billing Address',
            'Account Security',
            'Terms & Conditions',
            'Payment Details',
        ]) {
            await expect(this.section(section)).toBeVisible({ timeout });
        }
        await expect(this.completeOrderBtn).toBeDisabled({ timeout });
    }

    async verifyTotalDueToday(expectedDueToday: number, timeout = 10000) {
        await expect(this.price).toBeVisible({ timeout });
        const actualTotalStr = (await this.price.textContent())?.trim() || '';
        const actualTotal = parseFloat(actualTotalStr.replace(/[^\d.]/g, ''));
        expect(actualTotal).toBeCloseTo(expectedDueToday, 2);
    }
}
