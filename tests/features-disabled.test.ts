import { expect, test } from './fixtures'

test.beforeEach(async ({ page, background }) => {
	await background.evaluate(() =>
		browser.storage.sync.set({
			showRating: false,
			returnDislike: false,
			companyQuestions: false,
		}),
	)

	await page.goto(
		'https://leetcode.com/problems/check-if-the-rectangle-corner-is-reachable/',
	)
})

test('problem rating hidden', async ({ page }) => {
	const rating = page.getByRole('link', { name: '3774' })
	await expect(rating).toBeHidden()
})

test('dislike hidden', async ({ page }) => {
	const dislikes = page.locator('button:has(svg[class*="thumbs-down"])')
	await expect(dislikes).toBeHidden()
})

test('company tags hidden', async ({ page }) => {
	const companyTags = page.getByText('amazongoogleuber')
	await expect(companyTags).toBeHidden()
})

// Too lazy to write the rest...
