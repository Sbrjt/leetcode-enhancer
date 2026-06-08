// this hook provides alternate link for premium editorial

import { Question } from '@/types'
import { getEditorialLink, makeSignal } from '@/utils/lib'
import { useSyncStore } from '@/utils/useStore'
import elementReady from 'element-ready'

export default function useEditorial(question: Question | null, url: string) {
	const [isEnabled, _] = useSyncStore('premiumEditorial')

	useEffect(() => {
		if (
			isEnabled === false ||
			question == null ||
			question.premium ||
			!url.includes('editorial')
		)
			return

		const { controller, signal } = makeSignal()

		// Find the "Subscribe" button, hide it
		// Create a clone for "View screenshot" button
		let subBtn: HTMLElement | undefined
		let ssBtn: HTMLAnchorElement | undefined

			//
		;(async () => {
			subBtn = await elementReady<HTMLAnchorElement>('a[href^="/subscribe"]', {
				predicate: (a) => a.textContent === 'Subscribe',
				signal,
				stopOnDomReady: false,
			})

			if (!subBtn) return

			ssBtn = subBtn.cloneNode(true) as HTMLAnchorElement
			ssBtn.href = getEditorialLink(question.id, question.title)
			ssBtn.innerText = 'View screenshot'

			if (signal.aborted) return

			subBtn.after(ssBtn)
			subBtn.hidden = true
		})()

		return () => {
			controller.abort()
			ssBtn?.remove()
			if (subBtn) subBtn.hidden = false
		}
	}, [question, url, isEnabled])
}
