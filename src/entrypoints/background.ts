export default defineBackground(() => {
	browser.runtime.onMessage.addListener(async (msg, sender, _sendResponse) => {
		if (msg.type === 'SEARCH') {
			browser.search.query({
				text: msg.query,
				disposition: 'NEW_TAB',
			})
			return
		}

		if (msg.type === 'RELOAD_TAB') {
			const tabs = await browser.tabs.query({
				url: 'https://leetcode.com/*',
			})

			for (const tab of tabs) {
				browser.tabs.reload(tab.id!)
			}
			return
		}

		if (msg.type === 'GET_TAB') {
			return sender.tab?.id
		}
	})

	browser.storage.session?.setAccessLevel?.({
		accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
	})
})
