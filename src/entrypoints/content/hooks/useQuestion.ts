// this hook updates question state on url change

import { Question } from '@/types'
import { fetchQuestion, getTab, observeElement } from '@/utils/lib'
import { useSessionStore } from '@/utils/useStore'

export default function useQuestion() {
	const [url, setUrl] = useState(location.href)
	const slug = url.match(/problems\/([^/]+)/)?.[1]

	const [question, setQuestion] = useState<Question | null>(null)
	const [_, setQuestions] =
		useSessionStore<Record<number, Question>>('questions')

	useEffect(() => {
		const observer = observeElement(() => {
			setUrl(location.href)
		})
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		;(async () => {
			setQuestion(null)
			if (!slug) return

			const {
				questionFrontendId,
				title,
				isPaidOnly,
				dislikes,
				content,
				difficulty,
				topicTags,
			} = await fetchQuestion(slug)

			const q: Question = {
				id: Number(questionFrontendId),
				slug,
				title,
				difficulty,
				tags: topicTags.map((tag) => tag.name),
				dislikes,
				content,
				premium: isPaidOnly,
			}

			setQuestion(q)

			const t = await getTab()
			console.log(t)

			setQuestions((prev) => ({
				...(prev ?? {}),
				[t]: q,
			}))
		})()
	}, [slug])

	return { question, url }
}
