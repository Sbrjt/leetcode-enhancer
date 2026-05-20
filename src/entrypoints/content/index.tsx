import { createRoot } from 'react-dom/client'
import App from './App'

export default defineContentScript({
	matches: ['https://leetcode.com/problems/*'],
	cssInjectionMode: 'ui',

	async main(ctx) {
		const enabled = await storage.getItem('sync:enabled')
		const autocomplete = await storage.getItem('sync:autocomplete')

		if (enabled === false) return

		if (autocomplete) {
			injectScript('/patchMonaco.js', { keepInDom: true })
		}

		const ui = createIntegratedUi(ctx, {
			position: 'inline',

			onMount(container) {
				createRoot(container).render(<App />)
			},
		})

		ui.mount()
	},
})
