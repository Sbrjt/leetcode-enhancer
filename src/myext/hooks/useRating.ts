// this hook searches for difficulty level and inserts difficulty rating

import { Question } from '../types'
import { fetchRating, observeElement } from '../utils'

export default function useRating(question: Question | null) {
	useEffect(() => {
		if (question == null) return

		const observer = observeElement(async () => {
			const ratingDiv = document.querySelector<HTMLDivElement>(
				'div[class*="text-difficulty"]',
			)

			if (!ratingDiv) return

			let ratingSpan = ratingDiv.querySelector<HTMLSpanElement>('span')

			if (!ratingSpan) {
				ratingSpan = document.createElement('span')
				ratingDiv.appendChild(ratingSpan)
			}

			const rating = await fetchRating(question.id)
			ratingSpan.textContent = `- ${rating}`

			observer.disconnect()
		})

		return () => observer.disconnect()
	}, [question])
}
