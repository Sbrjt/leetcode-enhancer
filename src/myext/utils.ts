import TurndownService from 'turndown'
import type { GraphQLResponse, QuestionData } from './types'

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))

export function observeElement(callback: MutationCallback) {
	// my custom wrapper for MutationObserver

	const observer = new MutationObserver(callback)
	// const observer = new MutationObserver(debounce(callback, 200))
	observer.observe(document.body, { childList: true, subtree: true })

	return {
		disconnect: () => {
			observer.disconnect()
			observer.takeRecords()
		},
	}
}

/**
 * @example getRange(1500) // "1000-1999"
 */
export function getRange(num: number) {
	const start = Math.floor((num - 1) / 999) * 999 + 1
	const end = start + 999
	return `${start}-${end}`
}

export async function fetchQuestion(slug: string) {
	const res = await fetch('https://leetcode.com/graphql', {
		body: JSON.stringify({
			query: `query {
					question(titleSlug: "${slug}") {
						questionFrontendId
						title
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
	const result = arr.find((item: any) => item.ID === id)

	if (result == null) return 'N/A'

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

export function searchGfG(question: string) {
	browser.runtime.sendMessage({
		type: 'SEARCH',
		query: `${question} site:geeksforgeeks.org "Practice"`,
	})
}

export function searchLintCode(question: string) {
	browser.runtime.sendMessage({
		type: 'SEARCH',
		query: `${question} site:lintcode.com`,
	})
}

export function formatDislikes(n: number) {
	return new Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(n)
}

const turndownService = new TurndownService()

turndownService.addRule('exampleAsBlockquote', {
	filter: 'pre',
	replacement: (content) =>
		'\n' +
		content
			.trim()
			.split('\n')
			.map((line) => '> ' + line + '\n>\n')
			.join('') +
		'\n',
})

export const htmlToMd = (html: string) => turndownService.turndown(html)
