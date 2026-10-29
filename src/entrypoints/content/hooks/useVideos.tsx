// this hook provides video links to Neetcode and Striver

import SolutionVideos from '@/components/SolutionVideos'
import type { Question } from '@/types'
import { getNeetcode, getStriver } from '@/utils/apis'
import { findElement, injectReactComponent } from '@/utils/lib'
import useSignalEffect from '@/utils/useSignalEffect'
import { useFeatureEnabled } from '@/utils/useStore'
import { type Root } from 'react-dom/client'

type Injected = {
	injectedDiv?: HTMLElement
	root?: Root
}

const SELECTOR = 'div:has(> button > div > svg[class*="pen-to-square"])'

async function inject(
	question: Question,
	signal: AbortSignal,
	injected: Injected,
) {
	// Locate the div with the "Pen" button 📝
	// Inject <SolutionVideos /> component

	const div = await findElement<HTMLDivElement>(SELECTOR, signal)

	if (!div) return

	const [striverLink, neetcodeLink] = await Promise.all([
		getStriver(question.slug),
		getNeetcode(question.slug),
	])

	if (signal.aborted) return

	const { root, div: injectedDiv } = injectReactComponent(
		<SolutionVideos
			question={question}
			striverLink={striverLink}
			neetcodeLink={neetcodeLink}
		/>,
	)
	div.after(injectedDiv)

	injected.injectedDiv = injectedDiv
	injected.root = root
}

export default function useVideoSolution(
	question: Question | null,
	url: string,
) {
	const [isEnabled] = useFeatureEnabled('videoSolutions')

	useSignalEffect(
		(signal) => {
			if (isEnabled === false || question == null || !url.includes('solutions'))
				return

			const injected: Injected = {}
			inject(question, signal, injected)

			return () => {
				injected.root?.unmount()
				injected.injectedDiv?.remove()
			}
		},
		[question, url, isEnabled],
	)
}
