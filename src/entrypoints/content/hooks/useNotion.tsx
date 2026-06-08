// show dislikes count

import Notion from '@/components/Notion'
import { makeSignal } from '@/utils/lib'
import elementReady from 'element-ready'
import { createRoot } from 'react-dom/client'

export default function useNotion() {
	// const [isEnabled, _] = useSyncStore('dislikeButton')

	useEffect(() => {
		// if (isEnabled === false || question == null) return

		const { controller, signal } = makeSignal()

		;(async () => {
			const div = await elementReady<HTMLAnchorElement>('div', {
				predicate: (i) => i.textContent === 'Auto',
				signal,
				stopOnDomReady: false,
			})

			console.log(div)

			if (!div) return

			const injected = document.createElement('div')
			createRoot(injected).render(<Notion />)

			await elementReady('.monaco-editor', { stopOnDomReady: false })

			const editors = window.monaco.editor.getEditors?.() || []

			console.log(editors)

			const code = editors[0]?.getValue() ?? ''
			console.log(code)

			if (signal.aborted) return

			div.after(injected)
		})()

		return () => {
			controller.abort()
		}
	}, [])
}
