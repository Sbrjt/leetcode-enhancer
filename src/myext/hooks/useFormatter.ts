// format code when user hovers over submit/run button

import { useEffect } from 'react'
import { formatCode } from '../utils'

export default function useFormatter(url: string) {
	useEffect(() => {
		const runBtn = document.querySelector<HTMLDivElement>(
			'button[aria-label="Run"]',
		)

		runBtn?.addEventListener('click', formatCode)
	}, [url])
}
