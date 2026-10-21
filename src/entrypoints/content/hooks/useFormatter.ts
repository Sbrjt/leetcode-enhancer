// format code when user clicks on run button

import { findElement, makeSignal } from '@/utils/lib'
import { useFeatureEnabled } from '@/utils/useStore'

const RUN_SELECTOR = 'button[aria-label="Run"]'
const FORMAT_SELECTOR = 'button:has(svg[class*="align-left"])'

export default function useFormatter(url: string) {
	const [isEnabled] = useFeatureEnabled('formatOnRun')

	useEffect(() => {
		if (isEnabled === false) return

		// Locate the "Run" button ▶️
		// Attach a click event handler
		// Do same for Ctrl + S

		const { controller, signal } = makeSignal()
		let runBtn: HTMLButtonElement | undefined

		;(async () => {
			runBtn = await findElement<HTMLButtonElement>(RUN_SELECTOR, signal)

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
	const formatBtn = document.querySelector<HTMLButtonElement>(FORMAT_SELECTOR)
	formatBtn?.click()
}

const onKeyDown = (e: KeyboardEvent) => {
	// Format code if user presses Ctrl + S
	if ((e.ctrlKey || e.metaKey) && e.key === 's') formatCode()
}
