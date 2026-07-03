import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: 'tests',
	workers: 1, // No parallel tests — extension context is shared
	retries: process.env.CI ? 5 : 0,
	reporter: process.env.CI ? 'github' : 'list',
})

// https://github.com/wxt-dev/examples/blob/main/examples/playwright-e2e-testing/playwright.config.ts
// TODO: add firefox
