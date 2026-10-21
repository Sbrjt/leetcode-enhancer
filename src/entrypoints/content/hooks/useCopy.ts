// show copy button

import type { Question } from '@/types'
import { copyQuestion, findElement } from '@/utils/lib'
import useSignalEffect from '@/utils/useSignalEffect'
import { useFeatureEnabled } from '@/utils/useStore'

type Injected = { copyBtn?: HTMLElement }
const SELECTOR = 'div:has(> img[alt="premium lock icon"])'

export default function useCopy(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('copyCode')

	useSignalEffect(
		(signal) => {
			if (isEnabled === false || question == null) return

			const injected: Injected = {}

			inject(question, signal, injected)

			return () => injected.copyBtn?.remove()
		},
		[question, isEnabled],
	)
}

async function inject(
	question: Question,
	signal: AbortSignal,
	injected: Injected,
) {
	// Find the "Companies" badge 🔒
	// Clone it as "Copy" button

	const companyDiv = await findElement(SELECTOR, signal)

	if (!companyDiv || signal.aborted) return

	const copyBtn = companyDiv.cloneNode() as HTMLElement
	copyBtn.textContent = 'Copy'
	copyBtn.classList.add('copy-injected')
	copyBtn.setAttribute('role', 'button')
	copyBtn.onclick = () => copyQuestion(question)

	if (signal.aborted) return

	companyDiv.parentElement?.append(copyBtn)
	injected.copyBtn = copyBtn
}
