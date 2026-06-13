import type {
	CompanyMapping,
	CompanyQuestion,
	GraphQLResponse,
	ProblemRating,
	QuestionData,
} from '@/types'
import { parseCsv } from '@/utils/lib'

function getRange(num: number) {
	if (num <= 999) {
		return '1-999'
	} else if (num <= 1999) {
		return '1000-1999'
	} else if (num <= 2999) {
		return '2000-2999'
	}

	throw new Error(`Unsupported number: ${num}`)
}

export async function fetchQuestion(slug: string) {
	const res = await fetch('https://leetcode.com/graphql', {
		body: JSON.stringify({
			query: `query {
					question(titleSlug: "${slug}") {
						questionFrontendId
						title
						difficulty
						topicTags {
							name
						}
						isPaidOnly
						dislikes
						content
					}
				}`,
		}),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	const { data }: GraphQLResponse<QuestionData> = await res.json()
	return data.question
}

/**
 * Fetches problem difficulty ratings from [zerotrac/leetcode_problem_rating](https://github.com/zerotrac/leetcode_problem_rating)
 */
export async function fetchRating(id: number) {
	// TODO: cache it!
	const res = await fetch(
		'https://zerotrac.github.io/leetcode_problem_rating/data.json',
	)
	const arr: ProblemRating[] = await res.json()
	const rating = arr.find(({ ID }) => ID === id)?.Rating.toFixed(0)
	return rating ?? 'N/A'
}

/**
 * Generates a link to the problem screenshot from [akhilkammila/leetcode-screenshotter](https://github.com/akhilkammila/leetcode-screenshotter)
 */
export function getScreenshotLink(questionId: number, questionTitle: string) {
	const range = getRange(questionId)
	const paddedNum = String(questionId).padStart(3, '0')
	const base =
		'https://github.com/akhilkammila/leetcode-screenshotter/blob/main/problem-screenshots/'

	const link = `${base}${range}/${paddedNum}. ${questionTitle}.png`
	return link
}

/**
 * Generates a link to the editorial screenshot from [akhilkammila/leetcode-screenshotter](https://github.com/akhilkammila/leetcode-screenshotter)
 */
export function getEditorialLink(questionId: number, questionTitle: string) {
	const range = getRange(questionId)
	const paddedNum = String(questionId).padStart(3, '0')
	const base =
		'https://github.com/akhilkammila/leetcode-screenshotter/blob/main/editorial-screenshots/'

	const link = `${base}${range}/${paddedNum}. ${questionTitle}.png`
	return link
}

export async function getCompanyTags(problemId: number) {
	const res = await fetch(
		'https://raw.githubusercontent.com/Sbrjt/leetcode-companywise-interview-questions/master/problem_company_mapping.json',
	)
	const arr: CompanyMapping[] = await res.json()
	const tags = arr.find(({ ID }) => ID === problemId)?.company
	return tags ?? []
}

/**
 * Fetches company-wise interview questions from [snehasishroy/leetcode-companywise-interview-questions](https://github.com/snehasishroy/leetcode-companywise-interview-questions)
 */
export async function getQuestions(company: string) {
	const baseUrl =
		'https://raw.githubusercontent.com/snehasishroy/leetcode-companywise-interview-questions/master'

	const files = {
		all: '',
		'more-than-six-months': '',
		'six-months': '6M',
		'three-months': '3M',
		'thirty-days': '30D',
	}

	const questions: Record<string, CompanyQuestion> = {}

	// Process questions from oldest → newest
	// Questions appear in multiple CSVs
	// The final Time value wins
	for (const [file, Time] of Object.entries(files)) {
		const res = await fetch(`${baseUrl}/${company.toLowerCase()}/${file}.csv`)
		const csv = await res.text()
		const rows = await parseCsv<CompanyQuestion>(csv)

		for (const row of rows) {
			questions[row.ID] = { ...row, Time }
		}
	}

	return Object.values(questions)
}
