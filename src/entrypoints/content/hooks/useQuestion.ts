// this hook updates question state on url change

import { Question } from '@/types'
import { fetchQuestion } from '@/utils/api'

export default function useQuestion(url: string) {
	const [question, setQuestion] = useState<Question | null>(null)
	// const [_, setQuestions] = useSessionStore<Record<number, Question>>('questions')
	const slug = url.match(/leetcode.com\/problems\/([^/]+)/)?.[1]

	useEffect(() => {
		;(async () => {
			setQuestion(null)
			if (!slug) return

			const { questionFrontendId, title, isPaidOnly, dislikes, content } =
				await fetchQuestion(slug)

			const q: Question = {
				id: Number(questionFrontendId),
				slug,
				title,
				dislikes,
				content,
				premium: isPaidOnly,
			}

			setQuestion(q)

			// bug: session store not working in firefox
			// const t = await getTab()

			// setQuestions((prev) => ({
			// 	...(prev ?? {}),
			// 	[t]: q,
			// }))
		})()
	}, [slug])

	return { question, url }
}
