// Some extension APIs are only available in the background script
// These functions send messages to the background script
// The background script in turn executes them
// Kinda like an RPC

export function searchWeb(query: string) {
	return browser.runtime.sendMessage({
		type: 'SEARCH',
		query,
	})
}

export function reloadTabs() {
	return browser.runtime.sendMessage({ type: 'RELOAD_TAB' })
}
