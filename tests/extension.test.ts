import { expect, test as base } from './fixtures'

const test = base.extend<{ extensionUrl: string }>({
	extensionUrl: async ({ background }, use) => {
		const extensionId = background.url().split('/')[2]
		await use(`chrome-extension://${extensionId}`)
	},
})

test('popup page', async ({ page, extensionUrl }) => {
	await page.goto(`${extensionUrl}/popup.html`)
	await expect(page.locator('h1')).toHaveText('LeetCode Enhancer')
})

test('options page', async ({ page, extensionUrl }) => {
	await page.goto(`${extensionUrl}/options.html`)
	await expect(page.locator('h1')).toHaveText('LeetCode Enhancer Options')
})

/* 
To record/inspect:

test('record', async ({ page }) => {
	test.setTimeout(0)
	await page.pause()
})	
*/
