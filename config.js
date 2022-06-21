const { devices } = require('@playwright/test');

const config = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    headless: false,
    trace: 'on-first-retry',
  },
  projects: [
      // "Pixel 4" tests use Chromium browser.
      {
        name: 'Pixel 4',
        use: {
          browserName: 'chromium',
          ...devices['Pixel 4'],
        },
      },
  
      // "iPhone 11" tests use WebKit browser.
      {
        name: 'iPhone 11',
        use: {
          browserName: 'webkit',
          ...devices['iPhone 11'],
        },
      },
  ],
};

module.exports = config;