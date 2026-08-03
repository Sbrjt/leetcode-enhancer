// format code when user hovers over submit/run button

import { makeSignal } from '@/utils/lib'
import { useFeatureEnabled } from '@/utils/useStore'
import elementReady from 'element-ready'

export default function useFormatter(url: string) {
	const [isEnabled] = useFeatureEnabled('formatOnRun')

	useEffect(() => {
		if (isEnabled === false) return

		// Locate the "Run" button
		// Attach a click event handler
		// Do same for Ctrl + S
		const { controller, signal } = makeSignal()
		let runBtn: HTMLButtonElement | undefined

		//
		;(async () => {
			runBtn = await elementReady<HTMLButtonElement>(
				'button[aria-label="Run"]',
				{ signal, stopOnDomReady: false },
			)

			if (!runBtn || signal.aborted) return

			runBtn.addEventListener('click', formatCode)
		})()

		document.addEventListener('keydown', onKeyDown)

		return () => {
			controller.abort()
			runBtn?.removeEventListener('click', formatCode)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [url, isEnabled])
}

function formatCode() {
	const formatBtn = document.querySelector<HTMLButtonElement>(
		'button:has(svg[class*="align-left"])',
	)

	formatBtn?.click()
}

const onKeyDown = (e: KeyboardEvent) => {
	if ((e.ctrlKey || e.metaKey) && e.key === 's') formatCode()
}
