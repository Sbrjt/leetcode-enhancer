// this hook updates question state on url change

import { Question } from '../../../types'
import { fetchQuestion, observeElement } from '../../../utils/lib'

export default function useQuestion() {
	const [url, setUrl] = useState(location.href)
	const slug = url.match(/problems\/([^/]+)/)?.[1] ?? ''

	const [question, setQuestion] = useState<Question | null>(null)

	useEffect(() => {
		const observer = observeElement(() => {
			setUrl(location.href)
		})
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		;(async () => {
			setQuestion(null)

			const { questionFrontendId, title, isPaidOnly, dislikes, content } =
				await fetchQuestion(slug)

			const q = {
				id: Number(questionFrontendId),
				slug,
				title,
				dislikes,
				content,
				premium: isPaidOnly,
			}

			setQuestion(q)
			// console.log('question:', q.id)
		})()
	}, [slug])

	return { question, url }
}
