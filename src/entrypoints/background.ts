import { links } from '@/../package.json'

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
		browser.runtime.setUninstallURL(links.uninstall)

		// temporary
		browser.storage.sync.set({
			premiumScreenshots: true,
			companyQuestions: true,
		})
	})
})
