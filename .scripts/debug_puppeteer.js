import puppeteer from 'puppeteer-core'
import { setTimeout as sleep } from 'timers/promises'

async function run() {
	let browser
	try {
		console.log('Connecting to browser...')
		browser = await puppeteer.connect({
			browserURL: 'http://localhost:9222',
			defaultViewport: null,
		})
		console.log('Connected.')

		const page = await browser.newPage()
		console.log('Navigating to LeetCode...')
		await page.evaluateOnNewDocument(() => {
			const captureProvider = () => {
				const languages = window.monaco?.languages
				if (!languages || languages.__pyrightCompletionCapture) return

				const register = languages.registerCompletionItemProvider.bind(languages)
				languages.__pyrightCompletionCapture = true
				languages.registerCompletionItemProvider = (language, provider) => {
					if (language === 'python3') {
						window.__pyrightCompletionProvider = provider
					}
					return register(language, provider)
				}
			}

			setInterval(captureProvider, 10)
		})

		page.on('console', (msg) => {
			if (msg.type() === 'error' || msg.text().includes('Pyright')) {
				console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`)
			}
		})

		page.on('pageerror', (err) => {
			console.error(`[BROWSER ERROR] ${err.message}`)
		})

		await page.goto('https://leetcode.com/problems/two-sum/', {
			waitUntil: 'networkidle2',
		})
		console.log('Page loaded. Waiting for monaco editor...')

		// Wait for monaco editor to be present
		await page.waitForSelector('.monaco-editor', { timeout: 30000 })
		console.log('Monaco editor found.')
		console.log('Waiting for the injected Pyright worker to initialize (5s)...')
		await sleep(5000)

		// The Python editor starts with LeetCode's template. Replace it with a
		// small class whose member Pyright can complete after `self.`.
		const editorInput = await page.waitForSelector('.monaco-editor textarea', {
			timeout: 30000,
		})
		await editorInput.click()
		await page.keyboard.down('Control')
		await page.keyboard.press('KeyA')
		await page.keyboard.up('Control')
		await page.keyboard.type('class Solution:')
		await page.keyboard.press('Enter')
		await page.keyboard.type('def twoSum(self, nums, target):')
		await page.keyboard.press('Enter')
		await page.keyboard.press('Tab')
		await page.keyboard.type('self.values = nums')
		await page.keyboard.press('Enter')
		await page.keyboard.type('self.')
		console.log(
			'Editor value after keystrokes:',
			await page.evaluate(() => window.monaco.editor.getEditors()[0]?.getModel()?.getValue()),
		)

		await page.waitForFunction(
			() => Boolean(window.__pyrightCompletionProvider),
			{ timeout: 10000 },
		)
		const suggestions = await page.evaluate(async () => {
			const editor = window.monaco.editor
				.getEditors()
				.find((candidate) => candidate.getModel()?.getLanguageId() === 'python3')
			const model = editor?.getModel()
			const provider = window.__pyrightCompletionProvider
			if (!editor || !model || !provider) throw new Error('Pyright provider was not registered')

			const result = await Promise.race([
				provider.provideCompletionItems(model, editor.getPosition()),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error('Pyright completion timed out')), 10000),
				),
			])
			return result.suggestions.map((item) => item.label)
		})
		const hasValues = suggestions.includes('values')
		console.log('Pyright completion labels:', suggestions.slice(0, 20))
		console.log(`Pyright member completion ${hasValues ? 'PASSED' : 'FAILED'}: self.values`)

		if (!hasValues) process.exitCode = 1
	} catch (err) {
		console.error('Error during puppeteer execution:', err)
	} finally {
		// if (browser) await browser.disconnect();
	}
}

run()
