export default defineBackground(() => {
	browser.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
		if (msg.type === 'SEARCH') {
			browser.search.query({
				text: msg.query,
				disposition: 'NEW_TAB',
			})

			return
		}

		// if (msg.type === 'FETCH_PAGE') {
		// 	fetch(msg.url)
		// 		.then((r) => r.text())
		// 		.then((html) => sendResponse({ html }))
		// 		.catch((err) => sendResponse({ error: err.message }))

		// 	return
		// }
	})
})
