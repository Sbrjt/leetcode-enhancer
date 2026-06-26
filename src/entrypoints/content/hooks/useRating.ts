// this hook searches for difficulty level and inserts difficulty rating
import { Question } from '@/types'
import { fetchRating } from '@/utils/api'
import { makeSignal } from '@/utils/lib'
import { useFeatureEnabled } from '@/utils/useStore'
import elementReady from 'element-ready'

export default function useRating(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('showRating')

	useEffect(() => {
		if (isEnabled === false || question == null) return

		let ratingSpan: HTMLAnchorElement | null

		const { controller, signal } = makeSignal()

		;(async () => {
			const ratingDiv = await elementReady<HTMLDivElement>(
				'div[class*="text-difficulty"]',
				{ signal, stopOnDomReady: false },
			)

			if (!ratingDiv) return

			ratingSpan = document.createElement('a')
			const rating = await fetchRating(question.id)

			ratingSpan.textContent = `- ${rating?.toFixed(0) ?? 'N/A'}`
			ratingSpan.href = 'https://zerotrac.github.io/leetcode_problem_rating/'
			ratingSpan.target = '_blank'

			if (signal.aborted) return

			ratingDiv.appendChild(ratingSpan)
		})()

		return () => {
			controller.abort()
			ratingSpan?.remove()
		}
	}, [question, isEnabled])
}
