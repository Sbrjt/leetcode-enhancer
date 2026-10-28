// message handlers used in background script

export function handleSearchWeb(query: string) {
	return browser.search.query({
		text: query,
		disposition: 'NEW_TAB',
	})
}

export async function handleReloadTabs() {
	const tabs = await browser.tabs.query({ url: 'https://leetcode.com/*' })

	for (const tab of tabs) {
		browser.tabs.reload(tab.id!)
	}
}
