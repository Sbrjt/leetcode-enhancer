import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: 'tests',
	workers: '100%',
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',

	timeout: 60_000,
	expect: { timeout: 0 },
	use: {
		navigationTimeout: 0,
		video: 'on-first-retry',
	},
})

// https://github.com/wxt-dev/examples/blob/main/examples/playwright-e2e-testing/playwright.config.ts
// TODO: add firefox
