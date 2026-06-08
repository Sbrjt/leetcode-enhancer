// this hook searches for difficulty level and inserts difficulty rating
import { Question } from '@/types'
import { fetchRating, makeSignal } from '@/utils/lib'
import { useSyncStore } from '@/utils/useStore'
import elementReady from 'element-ready'

export default function useRating(question: Question | null) {
	const [isEnabled, _] = useSyncStore('rating')

	useEffect(() => {
		if (isEnabled === false || question == null) return

		let ratingSpan: HTMLSpanElement | null

		const { controller, signal } = makeSignal()

		;(async () => {
			const ratingDiv = await elementReady<HTMLDivElement>(
				'div[class*="text-difficulty"]',
				{ signal, stopOnDomReady: false },
			)

			if (!ratingDiv) return

			ratingSpan = document.createElement('span')
			const rating = await fetchRating(question.id)
			ratingSpan.textContent = `- ${rating}`

			if (signal.aborted) return

			ratingDiv.appendChild(ratingSpan)
		})()

		return () => {
			controller.abort()
			ratingSpan?.remove()
		}
	}, [question, isEnabled])
}
