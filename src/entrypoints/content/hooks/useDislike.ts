// show dislikes count

import type { Question } from '@/types'
import { formatDislikes, makeSignal } from '@/utils/lib'
import { useFeatureEnabled } from '@/utils/useStore'
import elementReady from 'element-ready'

export default function useDislike(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('returnDislike')

	useEffect(() => {
		if (isEnabled === false || question == null) return

		const { controller, signal } = makeSignal()

		// Find the div with dislike button
		// Inject the dislike count

		let injected: HTMLElement | null = null

		;(async () => {
			const div = await elementReady<HTMLDivElement>(
				'div:has(> svg[class*="thumbs-down"])',
				{
					signal,
					stopOnDomReady: false,
				},
			)

			const dislikeBtn = div?.closest('button')

			if (!div || !dislikeBtn) return

			injected = document.createElement('div')
			injected.textContent = formatDislikes(question.dislikes)

			if (signal.aborted) return

			div.after(injected)
			dislikeBtn.classList.remove('gap-2')
			dislikeBtn.classList.add('gap-1')
		})()

		return () => {
			controller.abort()
			injected?.remove()
		}
	}, [question, isEnabled])
}
