// format code when user hovers over submit/run button

import { useStorageItem } from '@/src/lib/hooks'

export default function useFormatter(url: string) {
	const [isEnabled, _] = useStorageItem('formatOnRun')

	useEffect(() => {
		if (!isEnabled) return

		function formatCode() {
			const formatBtn = document.querySelector<HTMLButtonElement>(
				'button:has(svg[data-icon="align-left"])',
			)

			formatBtn?.click()
		}

		const runBtn = document.querySelector<HTMLDivElement>(
			'button[aria-label="Run"]',
		)

		runBtn?.addEventListener('click', formatCode)

		return () => runBtn?.removeEventListener('click', formatCode)
	}, [url, isEnabled])
}
