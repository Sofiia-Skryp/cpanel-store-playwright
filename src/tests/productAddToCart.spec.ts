import { test } from '@/fixtures/fixturePages';
import { PRODUCT_CLOUD_LINUX } from '@/data/testData';
import { PRODUCT_CPANEL_PREMIER } from '@/data/testData';
import { getRandomIP } from '@/utils/dataFactory';

test('Add product & addon to cart, verify checkout', async ({homePage, cartPage, checkoutPage, productPage}) => {

    const testIP = getRandomIP();

    await homePage.goto();

    const productRecurringPriceStr = await homePage.getProductRecurringPriceByName(PRODUCT_CPANEL_PREMIER);
    const productRecurringPrice = parseFloat(productRecurringPriceStr.replace(/[^\d.]/g, ''));

    await homePage.selectProductByName(PRODUCT_CPANEL_PREMIER);
    await productPage.setIpAddress(testIP);

    const priceDueTodayBeforeAddonStr = await productPage.getTotalDueToday();
    const priceDueTodayBeforeAddon = parseFloat(priceDueTodayBeforeAddonStr.replace(/[^\d.]/g, ''));

    await productPage.selectAddonByName(PRODUCT_CLOUD_LINUX);

    const addonRecurringPriceStr = await productPage.getAddonRecurringPriceByName(PRODUCT_CLOUD_LINUX);
    const addonRecurringPrice = parseFloat(addonRecurringPriceStr.replace(/[^\d.]/g, ''));

    await productPage.verifyBalanceChanged(priceDueTodayBeforeAddonStr);

    const priceDueTodayAfterAddonStr = await productPage.getTotalDueToday();
    const priceDueTodayAfterAddon = parseFloat(priceDueTodayAfterAddonStr.replace(/[^\d.]/g, ''));

    const addonDueToday = priceDueTodayAfterAddon - priceDueTodayBeforeAddon;
    const expectedTotalRecurring = productRecurringPrice + addonRecurringPrice;
    const expectedTotalDueToday = priceDueTodayAfterAddon;

    await productPage.verifyOrderSummaryUpdated(expectedTotalRecurring, );
    await productPage.continue();

    await cartPage.verifyMonthlyOrderSummar(expectedTotalRecurring);
    await cartPage.verifyOrderSummary(expectedTotalDueToday);

    await cartPage.verifyProductPresent(PRODUCT_CPANEL_PREMIER);
    await cartPage.verifyAddonPresent(PRODUCT_CLOUD_LINUX);

    await cartPage.proceedToCheckout();

    await checkoutPage.verifyProductDetails({
        name: PRODUCT_CPANEL_PREMIER,
        ip: testIP,
        recurringPrice: expectedTotalRecurring,
        dueToday: priceDueTodayBeforeAddon,
    });

    await checkoutPage.verifyProductDetails({
        name: PRODUCT_CLOUD_LINUX,
        ip: testIP,
        recurringPrice: addonRecurringPrice,
        dueToday: addonDueToday,
    });

    await checkoutPage.verifyTotalDueToday(expectedTotalDueToday, );
    await checkoutPage.verifySections();
});
