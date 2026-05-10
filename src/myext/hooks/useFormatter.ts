// format code when user hovers over submit/run button

import { useEffect } from 'react'

export default function useFormatter(url: string) {
	useEffect(() => {
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
	}, [url])
}
