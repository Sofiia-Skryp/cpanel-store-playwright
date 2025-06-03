import { test, expect } from '@playwright/test';
import { HomePage } from '@/pages/HomePage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { PRODUCT_CLOUD_LINUX } from '@/data/testData';
import { PRODUCT_CPANEL_PREMIER } from '@/data/testData';
import { getRandomIP } from '@/fixtures/dataFactory';

let homePage: HomePage;
let productPage: ProductPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
});



test('Add product & addon to cart, verify checkout', async ({ page }) => {

    const TIMEOUT = 20000;
    const testIP = getRandomIP();

    await homePage.goto();

    const productRecurringPriceStr = await homePage.getProductRecurringPriceByName(PRODUCT_CPANEL_PREMIER);
    const productRecurringPrice = parseFloat(productRecurringPriceStr.replace(/[^\d.]/g, ''));

    await homePage.selectProductByName(PRODUCT_CPANEL_PREMIER);
    await productPage.setIpAddress(testIP, TIMEOUT);

    const priceDueTodayBeforeAddonStr = await productPage.getTotalDueToday(TIMEOUT);
    const priceDueTodayBeforeAddon = parseFloat(priceDueTodayBeforeAddonStr.replace(/[^\d.]/g, ''));

    await productPage.selectAddonByName(PRODUCT_CLOUD_LINUX, TIMEOUT);

    const addonRecurringPriceStr = await productPage.getAddonRecurringPriceByName(PRODUCT_CLOUD_LINUX, TIMEOUT);
    const addonRecurringPrice = parseFloat(addonRecurringPriceStr.replace(/[^\d.]/g, ''));

    await expect(productPage.totalPriceDueToday).not.toHaveText(priceDueTodayBeforeAddonStr, { timeout: TIMEOUT });

    const priceDueTodayAfterAddonStr = await productPage.getTotalDueToday();
    const priceDueTodayAfterAddon = parseFloat(priceDueTodayAfterAddonStr.replace(/[^\d.]/g, ''));

    const addonDueToday = priceDueTodayAfterAddon - priceDueTodayBeforeAddon;
    const expectedTotalRecurring = productRecurringPrice + addonRecurringPrice;
    const expectedTotalDueToday = priceDueTodayAfterAddon;

    await productPage.verifyOrderSummaryUpdated(expectedTotalRecurring, TIMEOUT);
    await productPage.continue(TIMEOUT);

    await cartPage.verifyMonthlyOrderSummar(expectedTotalRecurring, TIMEOUT);
    await cartPage.verifyOrderSummary(expectedTotalDueToday, TIMEOUT);

    await cartPage.verifyProductPresent(PRODUCT_CPANEL_PREMIER, TIMEOUT);
    await cartPage.verifyAddonPresent(PRODUCT_CLOUD_LINUX, TIMEOUT);

    await cartPage.proceedToCheckout(TIMEOUT);

    await checkoutPage.verifyProductDetails({
        name: PRODUCT_CPANEL_PREMIER,
        ip: testIP,
        recurringPrice: expectedTotalRecurring,
        dueToday: priceDueTodayBeforeAddon,
    }, TIMEOUT);

    await checkoutPage.verifyProductDetails({
        name: PRODUCT_CLOUD_LINUX,
        ip: testIP,
        recurringPrice: addonRecurringPrice,
        dueToday: addonDueToday,
    }, TIMEOUT);

    await checkoutPage.verifyTotalDueToday(expectedTotalDueToday, TIMEOUT);
    await checkoutPage.verifySections(TIMEOUT);
});
