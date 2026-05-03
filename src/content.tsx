import { createRoot } from 'react-dom/client'
import App from './myext/App'

export default defineContentScript({
	matches: ['https://leetcode.com/problems/*'],
	cssInjectionMode: 'ui',

	async main(ctx) {
		injectScript('/patchMonaco.js', { keepInDom: true })

		const ui = createIntegratedUi(ctx, {
			position: 'inline',

			onMount(container) {
				createRoot(container).render(<App />)
			},
		})

		ui.mount()
	},
})
