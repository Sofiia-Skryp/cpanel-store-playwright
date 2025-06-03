import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './src/tests',
    timeout: 60_000,
    expect: {
        timeout: 5_000,
    },
    retries: 1,
    reporter: [
        ['html', { open: 'never' }],
        ['list'],
    ],
    use: {
        baseURL: 'https://store.cpanel.net',
        headless: true,
        trace: 'on',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                browserName: 'chromium',
            },
        },
        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox'],
        //         browserName: 'firefox',
        //     },
        // },
        // {
        //     name: 'webkit',
        //     use: {
        //         ...devices['Desktop Safari'],
        //         browserName: 'webkit',
        //     },
        // },
    ],
});
