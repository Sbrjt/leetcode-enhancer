// Test setup
// https://playwright.dev/docs/chrome-extensions#testing
// Using patchright to prevent bot detection

import {
	test as base,
	type BrowserContext,
	type Worker,
} from '@playwright/test'
import { chromium } from 'patchright'
import path from 'path'

const extension = path.resolve('.output/chrome-mv3')

type Fixtures = { context: BrowserContext; background: Worker }

export const test = base.extend<Fixtures>({
	context: async ({}, use) => {
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

	background: async ({ context }, use) => {
		let [sw] = context.serviceWorkers()
		if (!sw) sw = await context.waitForEvent('serviceworker')
		await use(sw)
	},
})

export const { expect } = test
