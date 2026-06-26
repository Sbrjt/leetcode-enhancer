// show copy button
import type { Question } from '@/types'
import { copyQuestion, makeSignal } from '@/utils/lib'
import { useFeatureEnabled } from '@/utils/useStore'
import elementReady from 'element-ready'

export default function useCopy(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('copyCode')

	useEffect(() => {
		if (isEnabled === false || question == null) return

		const { controller, signal } = makeSignal()

		// Find the "Companies" button
		// Create a clone for "Copy" button

		let copyBtn: HTMLElement | undefined

			//
		;(async () => {
			const div = await elementReady(
				'div:has(> img[alt="premium lock icon"])',
				{ signal, stopOnDomReady: false },
			)

			if (!div) return

			copyBtn = div.cloneNode() as HTMLElement
			copyBtn.textContent = 'Copy'
			copyBtn.classList.add('copy-injected')
			copyBtn.onclick = () => copyQuestion(question!)

			if (signal.aborted) return

			div.parentElement!.append(copyBtn)
		})()

		return () => {
			controller.abort()
			copyBtn?.remove()
		}
	}, [question, isEnabled])
}
