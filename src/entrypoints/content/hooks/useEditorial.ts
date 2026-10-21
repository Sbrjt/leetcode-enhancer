// this hook provides alternate link for premium editorial

import type { Question } from '@/types'
import { getEditorialLink } from '@/utils/api'
import { findElement } from '@/utils/lib'
import useSignalEffect from '@/utils/useSignalEffect'
import { useFeatureEnabled } from '@/utils/useStore'

type Injected = {
	subBtn?: HTMLElement
	ssBtn?: HTMLAnchorElement
}

const SELECTOR = 'a[href^="/subscribe"]'

async function inject(
	question: Question,
	signal: AbortSignal,
	injected: Injected,
) {
	// Find the "Subscribe" button, hide it
	// Create a clone for "View screenshot" button

	const subBtn = await findElement<HTMLAnchorElement>(
		SELECTOR,
		signal,
		(a) => a.textContent === 'Subscribe',
	)

	if (!subBtn) return

	const ssBtn = subBtn.cloneNode(true) as HTMLAnchorElement
	ssBtn.href = getEditorialLink(question.id, question.title)
	ssBtn.innerText = 'View screenshot'

	if (signal.aborted) return

	subBtn.after(ssBtn)
	subBtn.hidden = true

	injected.subBtn = subBtn
	injected.ssBtn = ssBtn
}

export default function useEditorial(question: Question | null, url: string) {
	const [isEnabled] = useFeatureEnabled('premiumScreenshots')

	useSignalEffect(
		(signal) => {
			if (
				isEnabled === false ||
				question == null ||
				question.premium ||
				!url.includes('editorial')
			)
				return

			const injected: Injected = {}

			inject(question, signal, injected)

			return () => {
				injected.ssBtn?.remove()
				if (injected.subBtn) injected.subBtn.hidden = false
			}
		},
		[question, url, isEnabled],
	)
}
