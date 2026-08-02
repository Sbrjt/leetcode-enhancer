// this hook provides video links to Neetcode and Striver

import SolutionVideos from '@/components/SolutionVideos'
import { Question } from '@/types'
import { getNeetcode, getStriver } from '@/utils/api'
import { makeSignal } from '@/utils/lib'
import { useFeatureEnabled } from '@/utils/useStore'
import elementReady from 'element-ready'
import { createRoot, Root } from 'react-dom/client'

export default function useSolutionVideos(
	question: Question | null,
	url: string,
) {
	const [isEnabled] = useFeatureEnabled('videoSolution')

	useEffect(() => {
		if (isEnabled === false || question == null || !url.includes('solutions'))
			return

		const { controller, signal } = makeSignal()
		let injected: HTMLElement | undefined
		let root: Root | null = null

		// Locate the div with the "Pen" button
		// Inject SolutionVideos component
		;(async () => {
			const div = await elementReady<HTMLDivElement>(
				'div:has(> button > div > svg[class*="pen-to-square"])',
				{ signal, stopOnDomReady: false },
			)

			if (!div) return

			const striverLink = await getStriver(question.slug)
			const neetcodeLink = await getNeetcode(question.slug)

			injected = document.createElement('div')
			root = createRoot(injected)
			root.render(
				<SolutionVideos
					question={question}
					striverLink={striverLink}
					neetcodeLink={neetcodeLink}
				/>,
			)

			if (signal.aborted) return
			div.after(injected)
		})()

		return () => {
			controller.abort()
			root?.unmount()
			injected?.remove()
		}
	}, [question, url, isEnabled])
}
