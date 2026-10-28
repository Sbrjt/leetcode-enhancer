// show company questions

import QuestionsTable from '@/components/QuestionsTable'
import { fetchAllQuestionStatuses, getQuestions } from '@/utils/apis'
import { findElement, injectReactComponent } from '@/utils/lib'
import useSignalEffect from '@/utils/useSignalEffect'
import { useFeatureEnabled } from '@/utils/useStore'
import { type Root } from 'react-dom/client'

type Injected = { root?: Root }

const SELECTOR = 'div:has(> div[class*="company_subscribe"])'

async function inject(
	company: string,
	signal: AbortSignal,
	injected: Injected,
) {
	// Find the div for company questions 📈
	// Inject <QuestionsTable /> component

	const div = await findElement<HTMLDivElement>(
		SELECTOR,
		signal,
		(div) => div.textContent.includes('Subscribe'), //
	)

	if (!div) return

	const [fetchedQuestions, statuses] = await Promise.all([
		getQuestions(company),
		fetchAllQuestionStatuses(),
	])

	const questions = fetchedQuestions.map((question) => ({
		...question,
		Status: statuses[question.ID] ?? null,
	}))

	if (signal.aborted) return

	const { root } = injectReactComponent(
		<QuestionsTable questions={questions} />,
		div,
	)

	injected.root = root
}

export default function useCompany(url: string) {
	const company = url.match(/company\/([^/]+)/)?.[1]
	const [isEnabled] = useFeatureEnabled('companyQuestions')

	useSignalEffect(
		(signal) => {
			if (isEnabled === false || !company) return

			const injected: Injected = {}
			inject(company, signal, injected)

			return () => injected.root?.unmount()
		},
		[company, isEnabled],
	)
}

// Inspired from: https://hitarth-gg.github.io/visor-leetcode/company/245
