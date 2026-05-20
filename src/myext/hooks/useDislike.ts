// show dislikes count

import { useStorageItem } from '@/src/lib/hooks'
import type { Question } from '../types'
import { formatDislikes, observeElement } from '../utils'

export default function useDislike(question: Question | null) {
	const [isEnabled, _] = useStorageItem('dislikeButton')

	useEffect(() => {
		if (question == null || !isEnabled) return

		let injected: HTMLElement | null = null

		const observer = observeElement(async () => {
			// find the div with dislike button
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
				injected = newDiv
				observer.disconnect()
			}
		})

		return () => {
			observer.disconnect()
			injected?.remove()
		}
	}, [question, isEnabled])
}
