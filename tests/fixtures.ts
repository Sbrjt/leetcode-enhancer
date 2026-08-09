// Test setup
// https://playwright.dev/docs/chrome-extensions#testing
// Using patchright to prevent bot detection
// Make sure to run npm run build before running tests

import {
	test as base,
	type BrowserContext,
	type Worker,
} from '@playwright/test'
import { chromium } from 'patchright'
import path from 'path'

const extension = path.resolve('.output/chrome-mv3')

type WorkerFixtures = { extensionContext: BrowserContext }
type Fixtures = { background: Worker }

export const test = base.extend<Fixtures, WorkerFixtures>({
	extensionContext: [
		async ({}, use) => {
			const context = await chromium.launchPersistentContext('', {
				channel: 'chromium',
				args: [
					`--disable-extensions-except=${extension}`,
					`--load-extension=${extension}`,
				],
				headless: false,
			})

			// @ts-ignore
			await use(context)
			await context.close()
		},
		{ scope: 'worker' },
	],

	background: async ({ extensionContext }, use) => {
		let [sw] = extensionContext.serviceWorkers()
		if (!sw) sw = await extensionContext.waitForEvent('serviceworker')
		await use(sw)
	},
})

export const { expect } = test
