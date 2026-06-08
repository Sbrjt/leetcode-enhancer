import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'

export default defineContentScript({
	matches: ['https://leetcode.com/*'],

	async main(ctx) {
		const enabled = await storage.getItem<boolean>('sync:enabled')
		const autocomplete = await storage.getItem<boolean>('sync:autocomplete')

		if (enabled === false) return

		if (autocomplete !== false) {
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
