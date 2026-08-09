import { type Page } from '@playwright/test'
import { test as base, expect } from './fixtures'

const test = base.extend<{ extensionUrl: string }>({
	extensionUrl: async ({ background }, use) => {
		const extensionId = background.url().split('/')[2]
		await use(`chrome-extension://${extensionId}`)
	},
})

test.describe(() => {
	let page: Page

	test.beforeAll(async ({ extensionContext }) => {
		page = await extensionContext.newPage()
	})

	test('popup page', async ({ extensionUrl }) => {
		await page.goto(`${extensionUrl}/popup.html`)
		await expect(page.locator('h1')).toHaveText('LeetCode Enhancer')
	})

	test('options page', async ({ extensionUrl }) => {
		await page.goto(`${extensionUrl}/options.html`)
		await expect(page.locator('h1')).toHaveText('LeetCode Enhancer Options')
	})
})

/* 
// To record/inspect:

test('record', async ({ page }) => {
	test.setTimeout(0)
	await page.pause()
})
 */
