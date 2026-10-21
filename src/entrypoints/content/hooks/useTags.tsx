// inject company tags

import Tags from '@/components/Tags'
import type { Question } from '@/types'
import { getCompanyTags } from '@/utils/api'
import { findElement, injectReactComponent } from '@/utils/lib'
import useSignalEffect from '@/utils/useSignalEffect'
import { useFeatureEnabled } from '@/utils/useStore'
import { type Root } from 'react-dom/client'

type Injected = {
	injectedDiv?: HTMLElement
	root?: Root
}

const SELECTOR = 'div:has(> div > img[alt="premium lock icon"])'

async function inject(
	question: Question,
	signal: AbortSignal,
	injected: Injected,
) {
	// Find the div with the companies badge 🔒
	// Inject company tags below it

	const badgesDiv = await findElement<HTMLDivElement>(SELECTOR, signal)

	if (!badgesDiv) return

	const companies = await getCompanyTags(question.id)
	if (!companies.length) return

	if (signal.aborted) return

	const { root, div: injectedDiv } = injectReactComponent(
		<Tags companies={companies} />,
	)
	injectedDiv.className = badgesDiv.className
	badgesDiv.after(injectedDiv)

	injected.injectedDiv = injectedDiv
	injected.root = root
}

export default function useTags(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('companyQuestions')

	useSignalEffect(
		(signal) => {
			if (isEnabled === false || question == null) return

			const injected: Injected = {}
			inject(question, signal, injected)

			return () => {
				injected.root?.unmount()
				injected.injectedDiv?.remove()
			}
		},
		[question, isEnabled],
	)
}
