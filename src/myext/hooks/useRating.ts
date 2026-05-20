// this hook searches for difficulty level and inserts difficulty rating

import { useStorageItem } from '@/src/lib/hooks'
import { Question } from '../types'
import { fetchRating, observeElement } from '../utils'

export default function useRating(question: Question | null) {
	const [isEnabled, _] = useStorageItem('rating')

	useEffect(() => {
		if (question == null || !isEnabled) return

		let injected: HTMLElement

		const observer = observeElement(async () => {
			const ratingDiv = document.querySelector<HTMLDivElement>(
				'div[class*="text-difficulty"]',
			)

			if (!ratingDiv) return

			let ratingSpan = ratingDiv.querySelector<HTMLSpanElement>('span')

			if (!ratingSpan) {
				ratingSpan = document.createElement('span')
				injected = ratingSpan
				ratingDiv.appendChild(ratingSpan)
			}

			const rating = await fetchRating(question.id)
			ratingSpan.textContent = `- ${rating}`

			observer.disconnect()
		})

		return () => {
			observer.disconnect()
			injected?.remove()
		}
	}, [question, isEnabled])
}
