
# cPanel Store Automation — Playwright & TypeScript

## Overview

This project contains automated end-to-end tests for the cPanel Store licensing workflow, implemented using [Playwright](https://playwright.dev/) and TypeScript. The solution covers the scenario of adding a product and addon to the cart, verifying product and pricing details during checkout, and ensuring UI consistency throughout the process.

## Features

- Modern Page Object Model (POM) architecture
- Reusable, maintainable, and robust code (Clean Code, SOLID, DRY principles)
- All locators are stored inside PageObjects — no hardcoded indexes or selectors in test steps
- Fixtures for test data preparation
- Centralized configuration for timeouts, baseUrl, and headers
- Reliable waits and assertions to prevent flaky tests
- ESLint & Prettier for code style and quality
- Ready for CI/CD and local runs

## Project Structure

```

.
├── src/
│   ├── fixtures/     # Test data and fixtures
│   ├── pages/        # Page Objects
│   ├── tests/        # Test specifications
│   └── utils/        # Helper utilities
├── .eslintrc.json
├── .prettierrc
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md

````

## Getting Started

### Prerequisites

- Node.js v18 or newer
- npm

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/cpanel-store-playwright.git
    cd cpanel-store-playwright
    ```

2. Install dependencies:
    ```sh
    npm ci
    ```

3. Install Playwright browsers:
    ```sh
    npx playwright install
    ```

### Running Tests

Run all tests:
```sh
npx playwright test
````

Run a specific test file:

```sh
npx playwright test src/tests/productAddToCart.spec.ts
```

Run in headed (UI) mode:

```sh
npx playwright test --headed --debug
```

View the last HTML report:

```sh
npx playwright show-report
```

### Running in CI/CD

* The project is ready to run in any CI pipeline.
* Use `npm ci` and `npx playwright install` before executing tests.
* See `.github/workflows/ci.yml` for a sample GitHub Actions workflow.

## Configuration

* All settings (baseUrl, timeouts, retries) are in `playwright.config.ts`.
* TypeScript path alias (`@`) is set up in `tsconfig.json`.

## Test Scenario Covered

1. Navigate to the cPanel licenses page.
2. Select a product by name and click "Order Now."
3. Enter an IP address and select addon(s).
4. Add the product and addon to the cart and proceed to checkout.
5. Verify the presence and correctness of selected products, addons, and prices.
6. Proceed to the final checkout step.
7. Verify all required checkout sections are visible and correct.
8. Ensure the "Complete Order" button is present but disabled.

## Code Quality

* All code formatted with Prettier and linted with ESLint
* Page Object Model is strictly followed
* No flaky waits or selectors; all actions are reliable and robust
* Well-commented non-trivial parts

## Author

Jhon Doe
