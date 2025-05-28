import { test, expect } from '@playwright/test';
import { HomePage } from '@/pages/HomePage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { TEST_IP } from '@/fixtures/testData';

test.describe('cPanel Store Cart Flow', () => {
    test('Add product & addon to cart, verify checkout', async ({ page }) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await homePage.goto();

        const productName = 'cPanel Premier';
        await homePage.selectProductByName(productName);

        await productPage.setIpAddress(TEST_IP);

        await productPage.selectFirstAddon();

        await productPage.continue();

        const addonName = 'CloudLinux OS';
        await cartPage.verifyProductAndAddonPresent(productName, addonName);

        await cartPage.proceedToCheckout();

        const totalPrice = await cartPage.getTotalPrice();
        await checkoutPage.verifyCheckoutInfo({
            product: productName,
            ip: TEST_IP,
            price: totalPrice,
        });
        await checkoutPage.verifySections();
    });
});
