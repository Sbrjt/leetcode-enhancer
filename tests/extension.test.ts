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

	test('service worker', async ({ extensionContext }) => {
		// Check for startup errors in the background service worker
		// Since Playwright's 'pageerror' event doesn't cover service workers,
		// use CDP to listen for runtime exceptions
		// (AI-generated code)

		const cdp = await extensionContext.newCDPSession(page)
		const { targetInfos } = await cdp.send('Target.getTargets')
		const sw = targetInfos.find((t) => t.type === 'service_worker')!

		const errors: string[] = []

		const { sessionId } = await cdp.send('Target.attachToTarget', {
			targetId: sw.targetId,
			flatten: false,
		})

		cdp.on('Target.receivedMessageFromTarget', (params) => {
			const msg = JSON.parse(params.message)

			if (msg.method === 'Runtime.exceptionThrown') {
				errors.push(
					msg.params.exceptionDetails.exception?.description ??
						msg.params.exceptionDetails.text,
				)
			}
		})

		await cdp.send('Target.sendMessageToTarget', {
			sessionId,
			message: JSON.stringify({ id: 1, method: 'Runtime.enable' }),
		})

		await page.waitForTimeout(1000)
		expect(errors).toEqual([])
	})
})

/* 
// To record/inspect:

test('record', async ({ page }) => {
	test.setTimeout(0)
	await page.pause()
})
 */
