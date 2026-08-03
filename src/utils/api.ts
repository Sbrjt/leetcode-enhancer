import type {
	CompanyMapping,
	CompanyQuestion,
	GraphQLResponse,
	NeetcodeData,
	ProblemRating,
	QuestionData,
	StriverData,
} from '@/types'
import { getRange, parseCsv } from '@/utils/lib'

/**
 * Fetches the question details from LeetCode's GraphQL API
 */
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
	const res = await fetch(
		'https://zerotrac.github.io/leetcode_problem_rating/data.json',
	)
	const arr: ProblemRating[] = await res.json()
	const problem = arr.find(({ ID }) => ID === id)
	return problem?.Rating
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

function getVideoId(ytLink: string) {
	const url = new URL(ytLink)

	if (url.hostname === 'youtu.be') {
		return url.pathname.slice(1)
	} else if (url.hostname.includes('youtube.com')) {
		return url.searchParams.get('v')
	}
}

/**
 * Fetches video links of Striver from [hitarth-gg/CP](https://github.com/hitarth-gg/CP)
 */
export async function getStriver(problemSlug: string) {
	const lcLink = `https://leetcode.com/problems/${problemSlug}/`

	const res = await fetch(
		'https://raw.githubusercontent.com/hitarth-gg/CP/main/striver-a2z.json',
	)
	const json: StriverData[] = await res.json()

	const ytLink = json
		.flatMap((step) => step.sub_steps)
		.flatMap((subStep) => subStep.topics)
		.find((topic) => topic.lc_link === lcLink)?.yt_link

	if (ytLink == null) {
		return undefined
	}

	return getVideoId(ytLink) ?? undefined
}

/**
 * Fetches video links from [neetcode-gh/leetcode](https://github.com/neetcode-gh/leetcode)
 */
export async function getNeetcode(problemSlug: string) {
	const res = await fetch(
		'https://raw.githubusercontent.com/neetcode-gh/leetcode/main/.problemSiteData.json',
	)
	const json: NeetcodeData = await res.json()
	const videoId = json.find(({ link }) => link === `${problemSlug}/`)?.video
	return videoId
}

// TODO: cache the apis!
