# TODO

export default defineUnlistedScript(() => {
	const originalFetch = window.fetch

	window.fetch = async function (...args) {
		const response = await originalFetch(...args)
		const [resource, config] = args

		if (typeof resource === 'string' && isSubmission(resource)) {
			// once a response is read, it’s consumed and the page can’t use it anymore. so clone it
			const cloned = response.clone()
			const json = await cloned.json()
			console.log(json)
		}

		return response
	}
})

function isSubmission(url: string) {
	// intercept runcode fetch calls

	const pattern = /^\/submissions\/detail\/runcode.*\/check\/$/
	return pattern.test(url)
}
