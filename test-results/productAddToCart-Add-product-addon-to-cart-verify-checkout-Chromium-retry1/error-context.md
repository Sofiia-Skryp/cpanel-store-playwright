# Test info

- Name: Add product & addon to cart, verify checkout
- Location: /Users/tjhelpers/IdeaProjects/cpanel-store-playwright/src/tests/productAddToCart.spec.ts:24:5

# Error details

```
Error: Error reading storage state from auth.json:
ENOENT: no such file or directory, open 'auth.json'
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { HomePage } from '@/pages/HomePage';
   3 | import { ProductPage } from '@/pages/ProductPage';
   4 | import { CartPage } from '@/pages/CartPage';
   5 | import { CheckoutPage } from '@/pages/CheckoutPage';
   6 | import { PRODUCT_CLOUD_LINUX } from '@/data/testData';
   7 | import { PRODUCT_CPANEL_PREMIER } from '@/data/testData';
   8 | import { getRandomIP } from '@/fixtures/dataFactory';
   9 |
  10 | let homePage: HomePage;
  11 | let productPage: ProductPage;
  12 | let cartPage: CartPage;
  13 | let checkoutPage: CheckoutPage;
  14 |
  15 | test.beforeEach(async ({ page }) => {
  16 |     homePage = new HomePage(page);
  17 |     productPage = new ProductPage(page);
  18 |     cartPage = new CartPage(page);
  19 |     checkoutPage = new CheckoutPage(page);
  20 | });
  21 |
  22 |
  23 |
> 24 | test('Add product & addon to cart, verify checkout', async ({ page }) => {
     |     ^ Error: Error reading storage state from auth.json:
  25 |
  26 |     const TIMEOUT = 20000;
  27 |     const testIP = getRandomIP();
  28 |
  29 |     await homePage.goto();
  30 |
  31 |     const productRecurringPriceStr = await homePage.getProductRecurringPriceByName(PRODUCT_CPANEL_PREMIER);
  32 |     const productRecurringPrice = parseFloat(productRecurringPriceStr.replace(/[^\d.]/g, ''));
  33 |
  34 |     await homePage.selectProductByName(PRODUCT_CPANEL_PREMIER);
  35 |     await productPage.setIpAddress(testIP, TIMEOUT);
  36 |
  37 |     const priceDueTodayBeforeAddonStr = await productPage.getTotalDueToday(TIMEOUT);
  38 |     const priceDueTodayBeforeAddon = parseFloat(priceDueTodayBeforeAddonStr.replace(/[^\d.]/g, ''));
  39 |
  40 |     await productPage.selectAddonByName(PRODUCT_CLOUD_LINUX, TIMEOUT);
  41 |
  42 |     const addonRecurringPriceStr = await productPage.getAddonRecurringPriceByName(PRODUCT_CLOUD_LINUX, TIMEOUT);
  43 |     const addonRecurringPrice = parseFloat(addonRecurringPriceStr.replace(/[^\d.]/g, ''));
  44 |
  45 |     await expect(productPage.totalPriceDueToday).not.toHaveText(priceDueTodayBeforeAddonStr, { timeout: TIMEOUT });
  46 |
  47 |     const priceDueTodayAfterAddonStr = await productPage.getTotalDueToday();
  48 |     const priceDueTodayAfterAddon = parseFloat(priceDueTodayAfterAddonStr.replace(/[^\d.]/g, ''));
  49 |
  50 |     const addonDueToday = priceDueTodayAfterAddon - priceDueTodayBeforeAddon;
  51 |     const expectedTotalRecurring = productRecurringPrice + addonRecurringPrice;
  52 |     const expectedTotalDueToday = priceDueTodayAfterAddon;
  53 |
  54 |     await productPage.verifyOrderSummaryUpdated(expectedTotalRecurring, TIMEOUT);
  55 |     await productPage.continue(TIMEOUT);
  56 |
  57 |     await cartPage.verifyMonthlyOrderSummar(expectedTotalRecurring, TIMEOUT);
  58 |     await cartPage.verifyOrderSummary(expectedTotalDueToday, TIMEOUT);
  59 |
  60 |     await cartPage.verifyProductPresent(PRODUCT_CPANEL_PREMIER, TIMEOUT);
  61 |     await cartPage.verifyAddonPresent(PRODUCT_CLOUD_LINUX, TIMEOUT);
  62 |
  63 |     await cartPage.proceedToCheckout(TIMEOUT);
  64 |
  65 |     await checkoutPage.verifyProductDetails({
  66 |         name: PRODUCT_CPANEL_PREMIER,
  67 |         ip: testIP,
  68 |         recurringPrice: expectedTotalRecurring,
  69 |         dueToday: priceDueTodayBeforeAddon,
  70 |     }, TIMEOUT);
  71 |
  72 |     await checkoutPage.verifyProductDetails({
  73 |         name: PRODUCT_CLOUD_LINUX,
  74 |         ip: testIP,
  75 |         recurringPrice: addonRecurringPrice,
  76 |         dueToday: addonDueToday,
  77 |     }, TIMEOUT);
  78 |
  79 |     await checkoutPage.verifyTotalDueToday(expectedTotalDueToday, TIMEOUT);
  80 |     await checkoutPage.verifySections(TIMEOUT);
  81 | });
  82 |
```