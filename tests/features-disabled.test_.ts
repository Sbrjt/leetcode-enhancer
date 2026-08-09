import { type Page } from '@playwright/test'
import { expect, test } from './fixtures'

const PROBLEM_1 = 'https://leetcode.com/problems/stone-game-iii'

test.describe(() => {
	let page: Page

	test.beforeAll(async ({ extensionContext, background }) => {
		page = await extensionContext.newPage()

		await background.evaluate(() =>
			browser.storage.sync.set({
				showRating: false,
				returnDislike: false,
				companyQuestions: false,
			}),
		)

		await page.goto(PROBLEM_1)
	})

	test('problem rating hidden', async () => {
		const rating = page.getByRole('link', { name: '2027' })
		await expect(rating).toBeHidden()
	})

	test('dislike hidden', async () => {
		const dislikes = page.locator('button:has(svg[class*="thumbs-down"])')
		await expect(dislikes).not.toHaveText(/\d+/)
	})

	test('company tags hidden', async () => {
		const companyTags = page.getByText('googlemeta')
		await expect(companyTags).toBeHidden()
	})
})

// Too lazy to write the rest...
