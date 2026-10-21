// this hook searches for difficulty level and inserts difficulty rating
import type { Question } from '@/types'
import { fetchRating } from '@/utils/api'
import { findElement } from '@/utils/lib'
import useSignalEffect from '@/utils/useSignalEffect'
import { useFeatureEnabled } from '@/utils/useStore'

type Injected = { ratingAnchor?: HTMLAnchorElement }

const SELECTOR = 'div[class*="text-difficulty"]'

async function inject(
	question: Question,
	signal: AbortSignal,
	injected: Injected,
) {
	// Find rating badge
	// Inject numeric rating

	const ratingDiv = await findElement<HTMLDivElement>(SELECTOR, signal)

	if (!ratingDiv) return

	const ratingAnchor = document.createElement('a')
	const rating = await fetchRating(question.id)

	ratingAnchor.textContent = `- ${rating?.toFixed(0) ?? 'N/A'}`
	ratingAnchor.href = 'https://zerotrac.github.io/leetcode_problem_rating/'
	ratingAnchor.target = '_blank'

	if (signal.aborted) return

	ratingDiv.appendChild(ratingAnchor)
	injected.ratingAnchor = ratingAnchor
}

export default function useRating(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('showRating')

	useSignalEffect(
		(signal) => {
			if (isEnabled === false || question == null) return

			const injected: Injected = {}
			inject(question, signal, injected)
			return () => injected.ratingAnchor?.remove()
		},
		[question, isEnabled],
	)
}
