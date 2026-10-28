// show dislikes count

import type { Question } from '@/types'
import { findElement, formatDislikes } from '@/utils/lib'
import useSignalEffect from '@/utils/useSignalEffect'
import { useFeatureEnabled } from '@/utils/useStore'

type Injected = {
	injectedDiv?: HTMLElement
	dislikeBtn?: HTMLElement
}

const SELECTOR = 'div:has(> svg[class*="thumbs-down"])'

async function inject(
	question: Question,
	signal: AbortSignal,
	injected: Injected,
) {
	// Find the div with dislike button 👎
	// Inject the dislike count

	const dislikeDiv = await findElement<HTMLDivElement>(SELECTOR, signal)
	const dislikeBtn = dislikeDiv?.closest('button')

	if (!dislikeDiv || !dislikeBtn) return

	const injectedDiv = document.createElement('div')
	injectedDiv.textContent = formatDislikes(question.dislikes)

	if (signal.aborted) return

	dislikeDiv.after(injectedDiv)
	dislikeBtn.classList.replace('gap-2', 'gap-1')

	injected.injectedDiv = injectedDiv
	injected.dislikeBtn = dislikeBtn
}

export default function useDislike(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('showDislikes')

	useSignalEffect(
		(signal) => {
			if (isEnabled === false || question == null) return

			const injected: Injected = {}

			inject(question, signal, injected)

			return () => {
				injected.injectedDiv?.remove()
				injected.dislikeBtn?.classList.replace('gap-1', 'gap-2')
			}
		},
		[question, isEnabled],
	)
}
