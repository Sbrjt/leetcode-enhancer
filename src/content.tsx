import { createRoot } from 'react-dom/client'
import App from './myext/App'

export default defineContentScript({
	matches: ['https://leetcode.com/problems/*'],
	cssInjectionMode: 'ui',

	async main(ctx) {
		// injectScript('/patchfetch.js', { keepInDom: true })
		injectScript('/patchMonaco.js', { keepInDom: true })

		const ui = createIntegratedUi(ctx, {
			position: 'inline',
			// name: 'example-ui',
			// anchor: 'body',

			onMount(container) {
				createRoot(container).render(<App />)
			},
		})

		ui.mount()
	},
})
