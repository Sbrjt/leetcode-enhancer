// show dislikes count

import type { Question } from '../types'
import { formatDislikes, observeElement } from '../utils'

export default function useDislike(question: Question | null) {
	useEffect(() => {
		if (question == null) return

		const observer = observeElement(async () => {
			const div = document
				.querySelector('svg[data-icon="thumbs-down"]')
				?.closest<HTMLDivElement>('div')

			const btn = div?.closest('button')

			if (div) {
				const newDiv = document.createElement('div')
				newDiv.textContent = formatDislikes(question.dislikes)
				div.insertAdjacentElement('afterend', newDiv)

				btn?.classList.remove('gap-2')
				btn?.classList.add('gap-1')
			}
			observer.disconnect()
		})

		return () => observer.disconnect()
	}, [question])
}
