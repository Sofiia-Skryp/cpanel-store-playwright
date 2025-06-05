import {test as base} from './fixtureBase'
import {ProductPage, } from "@/pages/ProductPage";
import {HomePage} from "@/pages/HomePage";
import {CartPage} from "@/pages/CartPage";
import {CheckoutPage} from "@/pages/CheckoutPage";

type Pages = {
    homePage: HomePage,
    productPage: ProductPage,
    cartPage: CartPage,
    checkoutPage: CheckoutPage
}

export const test = base.extend<Pages>({

    homePage: ({page}, use) => {
        const homePage = new HomePage(page);
        use(homePage);
    },
    productPage: ({page}, use) => {
        const productPage = new ProductPage(page);
        use(productPage);
    },
    cartPage: ({page}, use) => {
        const cartPage = new CartPage(page);
        use(cartPage);
    },
    checkoutPage: ({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        use(checkoutPage);
    },
})