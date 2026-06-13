// inject company tags

import Tags from '@/components/Tags'
import type { Question } from '@/types'
import { getCompanyTags } from '@/utils/api'
import { makeSignal } from '@/utils/lib'
import { useFeatureEnabled } from '@/utils/useStore'
import elementReady from 'element-ready'
import { createRoot, type Root } from 'react-dom/client'

export default function useTags(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('tags')

	useEffect(() => {
		if (isEnabled === false || question == null) return

		const { controller, signal } = makeSignal()
		let injected: HTMLElement | undefined
		let root: Root | null = null

		;(async () => {
			const div = await elementReady(
				'div:has(> img[alt="premium lock icon"])',
				{ signal, stopOnDomReady: false },
			)
			if (!div?.parentElement) return
			const companies = await getCompanyTags(question.id)
			if (!companies.length) return
			injected = div.parentElement.cloneNode() as HTMLElement
			root = createRoot(injected)
			root.render(<Tags companies={companies} />)
			if (signal.aborted) return
			div.parentElement.after(injected)
		})()

		return () => {
			controller.abort()
			root?.unmount()
			injected?.remove()
		}
	}, [question, isEnabled])
}
