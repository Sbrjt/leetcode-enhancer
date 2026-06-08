import type { GraphQLResponse, QuestionData } from '@/types'

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

export async function fetchRating(id: number) {
	const res = await fetch(
		'https://zerotrac.github.io/leetcode_problem_rating/data.json',
	)
	const arr = await res.json()

	const result = arr.find(({ ID }: { ID: number }) => ID === id)

	if (result == null) {
		return 'N/A'
	}

	return result.Rating.toFixed(0)
}

export function getScreenshotLink(questionId: number, questionTitle: string) {
	const range = getRange(questionId)
	const paddedNum = String(questionId).padStart(3, '0')
	const base =
		'https://github.com/akhilkammila/leetcode-screenshotter/blob/main/problem-screenshots/'

	const link = `${base}${range}/${paddedNum}. ${questionTitle}.png`
	return link
}

export function getEditorialLink(questionId: number, questionTitle: string) {
	const range = getRange(questionId)
	const paddedNum = String(questionId).padStart(3, '0')
	const base =
		'https://github.com/akhilkammila/leetcode-screenshotter/blob/main/editorial-screenshots/'

	const link = `${base}${range}/${paddedNum}. ${questionTitle}.png`
	return link
}

export async function getCompanies(id: number) {
	const res = await fetch(
		'https://raw.githubusercontent.com/zubyj/leetcode-explained/main/src/assets/data/problem_data.json',
	)
	const { questions } = await res.json()

	if (questions == null) return 'N/A'

	const result = questions
		.find((q: any) => q.frontend_id === id)
		?.companies?.map(({ name }: any) => name)

	return result ?? []
}
