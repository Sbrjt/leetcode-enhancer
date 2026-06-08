import type { Question } from '@/types'

export default function useQuestion() {
	const [question, setQuestion] = useState<Question | null>(null)
	const [questions, _] = useSessionStore<Record<number, Question>>('questions')

	useEffect(() => {
		;(async () => {
			setQuestion(null)

			const [tab] = await browser.tabs.query({
				active: true,
				currentWindow: true,
			})

			if (questions) {
				setQuestion(questions[tab.id])
			}
		})()
	}, [questions])

	return { question }
}
