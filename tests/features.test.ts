import { expect, test } from './fixtures'

const PROBLEM_URL =
	'https://leetcode.com/problems/check-if-the-rectangle-corner-is-reachable/'

test('problem rating', async ({ page }) => {
	await page.goto(PROBLEM_URL)

	const rating = page.getByRole('link', { name: '3774' })
	await expect(rating).toBeVisible()
})

test('dislike', async ({ page }) => {
	await page.goto(PROBLEM_URL)

	const dislikes = page.locator('button:has(svg[class*="thumbs-down"])')
	await expect(dislikes).toHaveText(/\d+/)
})

test('copy button', async ({ page, context }) => {
	await page.goto(PROBLEM_URL)
	await context.grantPermissions(['clipboard-read', 'clipboard-write'])

	const copyBtn = page.getByRole('button', { name: 'Copy' })
	await copyBtn.click()

	const text = await page.evaluate(() => navigator.clipboard.readText())
	expect(text).toContain('Check if the Rectangle Corner Is Reachable')
})

test('auto complete', async ({ page }) => {
	await page.goto(PROBLEM_URL)

	const editor = page.locator('.monaco-editor').first()
	await editor.click()
	await page.keyboard.type('sol')

	const suggestions = page.locator('.suggest-widget')
	await expect(suggestions.first()).toBeVisible()
})

test('company tags', async ({ page }) => {
	await page.goto(PROBLEM_URL)

	const companyTags = page.getByText('amazongoogleuber')
	await expect(companyTags).toBeVisible()
})

test('company question', async ({ page }) => {
	await page.goto('https://leetcode.com/company/amd')

	const problemsTable = page.getByRole('table', { name: 'Company problems' })
	await expect(problemsTable).toBeVisible()
})

test('premium problem', async ({ page }) => {
	await page.goto('https://leetcode.com/problems/meeting-rooms-ii')

	const elements = [
		page.getByRole('link', { name: 'View question' }),
		page.getByRole('link', { name: 'View screenshot' }),
		page.getByRole('button', { name: 'Search on GfG' }),
		page.getByRole('button', { name: 'Search on LintCode' }),
	]

	await Promise.all(
		elements.map((btn) => expect(btn).toBeVisible()),
		//
	)
})

test('premium editorial', async ({ page }) => {
	await page.goto(
		'https://leetcode.com/problems/minimum-value-to-get-positive-step-by-step-sum/editorial',
	)

	const btn = page.getByRole('link', { name: 'View screenshot' })
	await expect(btn).toBeVisible()
})
