// show company questions

import QuestionsTable from '@/components/QuestionsTable'
import { Question } from '@/types'
import { getQuestions } from '@/utils/api'
import elementReady from 'element-ready'
import { createRoot, type Root } from 'react-dom/client'

export default function useCompany(url: string) {
	const company = url.match(/company\/([^/]+)/)?.[1]
	const [questions, setQuestions] = useState<Question[] | null>(null)

	useEffect(() => {
		;(async () => {
			setQuestions(null)
			if (!company) return

			const q = await getQuestions(company)
			setQuestions(q)
		})()
	}, [company])

	useEffect(() => {
		if (!questions) return

		const { controller, signal } = makeSignal()

		let root: Root | null = null

		;(async () => {
			const div = await elementReady<HTMLDivElement>(
				'div[class*="company_subscribe"]',
				{ signal, stopOnDomReady: false },
			)

			if (!div?.parentElement) return

			root = createRoot(div.parentElement)
			root.render(<QuestionsTable questions={questions} />)
		})()

		return () => {
			controller.abort()
			root?.unmount()
		}
	}, [questions])
}
