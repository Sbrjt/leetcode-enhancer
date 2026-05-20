// this hook provides alternate link for premium editorial

import { Question } from '../../../types'
import { getEditorialLink, observeElement } from '../../../utils/lib'

export default function useEditorial(question: Question | null, url: string) {
	const [isEnabled, _] = useStorageItem('premiumEditorial')

	useEffect(() => {
		if (
			question == null ||
			question.premium ||
			!url.includes('editorial') ||
			!isEnabled
		)
			return

		const run = () => {
			const subBtn = Array.from(
				document.querySelectorAll<HTMLAnchorElement>('a[href^="/subscribe"]'),
			).find((a) => a.textContent === 'Subscribe')

			if (!subBtn) return false
			// console.log('editorial', question.id)

			subBtn.href = getEditorialLink(question.id, question.title)
			subBtn.innerText = 'View screenshot'
			return true
		}

		if (run()) {
			return
		}

		const observer = observeElement(() => {
			if (run()) observer.disconnect()
		})

		return () => observer.disconnect()
	}, [question, url, isEnabled])
}
