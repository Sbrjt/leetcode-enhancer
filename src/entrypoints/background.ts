export default defineBackground(() => {
	browser.runtime.onMessage.addListener(async (msg, _sender, _sendResponse) => {
		if (msg.type === 'SEARCH') {
			browser.search.query({
				text: msg.query,
				disposition: 'NEW_TAB',
			})

			return
		}

		if (msg.type === 'RELOAD_TAB') {
			const tabs = await browser.tabs.query({ url: 'https://leetcode.com/*' })

			for (const tab of tabs) {
				browser.tabs.reload(tab.id!)
			}
		}
	})

	browser.storage.session.setAccessLevel({
		accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
	})

	browser.runtime.onInstalled.addListener(async () => {
		browser.runtime.setUninstallURL('https://tally.so/r/VLA4Bj')

		const premiumScreenshots = await storage.getItem('sync:premiumScreenshots')
		if (premiumScreenshots == null) {
			await storage.setItem('sync:premiumScreenshots', true)
		}

		const companyQuestions = await storage.getItem('sync:companyQuestions')
		if (companyQuestions == null) {
			await storage.setItem('sync:companyQuestions', true)
		}
	})
})
