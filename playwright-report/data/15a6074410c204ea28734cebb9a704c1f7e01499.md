# Test info

- Name: cPanel Store Cart Flow >> Add product & addon to cart, verify checkout
- Location: /Users/tjhelpers/IdeaProjects/cpanel-store-playwright/src/tests/productAddToCart.spec.ts:9:9

# Error details

```
Error: locator.fill: Target page, context or browser has been closed
Call log:
  - waiting for locator('input[name="configoption[1]"]')

    at ProductPage.setIpAddress (/Users/tjhelpers/IdeaProjects/cpanel-store-playwright/src/pages/ProductPage.ts:17:28)
    at /Users/tjhelpers/IdeaProjects/cpanel-store-playwright/src/tests/productAddToCart.spec.ts:20:27
```

# Test source

```ts
   1 | import { Page, Locator } from '@playwright/test';
   2 |
   3 | export class ProductPage {
   4 |     readonly page: Page;
   5 |     ipField: Locator;
   6 |     addonCheckboxes: Locator;
   7 |     continueBtn: Locator;
   8 |
   9 |     constructor(page: Page) {
  10 |         this.page = page;
  11 |         this.ipField = this.page.locator('input[name="configoption[1]"]');
  12 |         this.addonCheckboxes = this.page.locator('input[type="checkbox"][name^="addon"]');
  13 |         this.continueBtn = this.page.locator('button, input[type="submit"]', { hasText: 'Continue' });
  14 |     }
  15 |
  16 |     async setIpAddress(ip: string) {
> 17 |         await this.ipField.fill(ip);
     |                            ^ Error: locator.fill: Target page, context or browser has been closed
  18 |     }
  19 |
  20 |     async selectFirstAddon() {
  21 |         const firstAddon = this.addonCheckboxes.first();
  22 |         await firstAddon.check();
  23 |     }
  24 |
  25 |     async continue() {
  26 |         await this.continueBtn.first().click();
  27 |     }
  28 | }
  29 |
```