// add company tag buttons

import type { Question } from '@/types'
import { makeSignal } from '@/utils/lib'
import { useSyncStore } from '@/utils/useStore'
import elementReady from 'element-ready'

export default function useCompany(question: Question | null) {
	const [isEnabled, _] = useSyncStore<boolean>('premiumTags')

	useEffect(() => {
		if (isEnabled === false || question == null) return

		const { controller, signal } = makeSignal()

		let injected: HTMLElement | undefined

			//
		;(async () => {
			const div = await elementReady(
				'div:has(> img[alt="premium lock icon"])',
				{ signal, stopOnDomReady: false },
			)

			if (!div) return

			const companies = await getCompanies(question.id)

			if (!companies.length) return

			injected = div.parentElement!.cloneNode() as HTMLElement

			for (const company of companies) {
				const pill = div.cloneNode() as HTMLElement
				pill.classList.add('border')

				const img = document.createElement('img')
				img.width = img.height = 12
				img.src = `https://img.loadlogo.com/name/${company}`

				// Alternate: `https://logos-api.apistemic.com/linkedin:${company.toLowerCase()}`

				pill.appendChild(img)
				pill.appendChild(document.createTextNode(company))
				injected.append(pill)
			}

			if (signal.aborted) return
			div.parentElement!.after(injected)
		})()

		return () => {
			controller.abort()
			injected?.remove()
		}
	}, [question, isEnabled])
}
