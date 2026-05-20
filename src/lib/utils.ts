export const SETTINGS = [
	{ key: 'rating', label: 'Problem difficulty rating' },
	{ key: 'formatOnRun', label: 'Format on run' },
	{ key: 'autocomplete', label: 'Enable autocomplete' },
	{ key: 'copyButton', label: 'Copy code button' },
	{ key: 'dislikeButton', label: 'Return dislike button' },
	{
		key: 'premiumLinks',
		label: 'Links to similar problems on other platforms',
	},
	{ key: 'premiumEditorial', label: 'Screenshots of premium editorials' },
]

export async function getBrowserDetails() {
	if (import.meta.env.FIREFOX) {
		// @ts-ignore
		return await browser.runtime.getBrowserInfo()
	}

	if (import.meta.env.CHROME) {
		// @ts-ignore
		const ua = await navigator.userAgentData.getHighEntropyValues([
			'fullVersionList',
		])
		return ua.fullVersionList
	}

	//  fallback
	return {
		name: 'unknown',
		version: navigator.userAgent,
	}
}
