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
		console.log('installed')

		const { premium } = await browser.storage.sync.get(['premiumScreenshots'])

		if (premium == null) {
			browser.storage.sync.set({ premium: true })
		}

		const { company } = await browser.storage.sync.get(['companyQuestions'])
		if (company == null) {
			browser.storage.sync.set({ company: true })
		}
	})
})
