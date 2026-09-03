// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * E2E runs against the production build, not `npm start`. Note for anyone
 * running this outside the sandbox this was authored in: webpack-dev-server
 * (react-scripts start) can fail with an "allowedHosts" schema error in some
 * containerized/proxied environments - `serve`-ing the static build sidesteps
 * that entirely and is closer to what actually ships anyway.
 */
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    // This repo was authored in a sandbox with a pre-installed Chromium at
    // this path (env: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers) rather than
    // the headless-shell build `npx playwright install` normally fetches.
    // Remove this override if running with a standard Playwright install.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run build && npx serve -s build -l 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
    env: { REACT_APP_BASE_URL: 'http://localhost:8800' },
  },
});
