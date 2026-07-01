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

		let ratingAnchor: HTMLAnchorElement | null

		const { controller, signal } = makeSignal()

		;(async () => {
			const ratingDiv = await elementReady<HTMLDivElement>(
				'div[class*="text-difficulty"]',
				{ signal, stopOnDomReady: false },
			)

			if (!ratingDiv) return

			ratingAnchor = document.createElement('a')
			const rating = await fetchRating(question.id)

			ratingAnchor.textContent = `- ${rating?.toFixed(0) ?? 'N/A'}`
			ratingAnchor.href = 'https://zerotrac.github.io/leetcode_problem_rating/'
			ratingAnchor.target = '_blank'

			if (signal.aborted) return

			ratingDiv.appendChild(ratingAnchor)
		})()

		return () => {
			controller.abort()
			ratingAnchor?.remove()
		}
	}, [question, isEnabled])
}
