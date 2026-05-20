// show copy button

import { useStorageItem } from '@/src/lib/hooks'
import type { Question } from '../types'
import { htmlToMd, observeElement } from '../utils'

export default function useCopy(question: Question | null) {
	const [isEnabled, _] = useStorageItem('copyButton')

	useEffect(() => {
		if (question == null || !isEnabled) return

		const observer = observeElement(async () => {
			const div = document.querySelector(
				'img[alt="premium lock icon"]',
			)?.parentElement

			if (div) {
				const copy = div.cloneNode() as HTMLElement
				copy.textContent = 'Copy'
				copy.onclick = () => copyQuestion(question)
				div.parentElement!.append(copy)
			}

			observer.disconnect()
		})

		return () => observer.disconnect()
	}, [question, isEnabled])
}

async function copyQuestion(question: Question) {
	const text =
		'## ' +
		question.id +
		'. ' +
		question.title +
		'\n' +
		htmlToMd(question.content)

	await navigator.clipboard.writeText(text)
}
