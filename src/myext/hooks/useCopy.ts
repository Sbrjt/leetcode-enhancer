// show copy button

import type { Question } from '../types'
import { htmlToMd, observeElement } from '../utils'

export default function useCopy(question: Question | null) {
	useEffect(() => {
		if (question == null) return

		const observer = observeElement(async () => {
			const svg = document.querySelector('svg.fa-lightbulb')
			const div = svg?.parentElement?.parentElement

			if (div) {
				const copy = div.cloneNode() as HTMLElement
				copy.textContent = 'Copy'
				copy.onclick = () => copyQuestion(question)

				div.insertAdjacentElement('afterend', copy)
			}
			observer.disconnect()
		})

		return () => observer.disconnect()
	}, [question])
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
