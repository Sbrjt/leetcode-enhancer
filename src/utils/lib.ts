import { type ClassValue, clsx } from 'clsx'
import Papa from 'papaparse'
import TurndownService from 'turndown'
import type { Question } from '../types'

export const SETTINGS = {
	enabled: { label: 'Extension enabled', default: true },
	showRating: { label: 'Problem difficulty rating', default: true },
	formatOnRun: { label: 'Format on run', default: true },
	autoComplete: { label: 'Enable auto-complete', default: true },
	copyCode: { label: 'Copy code button', default: true },
	returnDislike: { label: 'Return dislike button', default: true },
	premiumScreenshots: {
		label: 'Screenshots of premium editorials and questions',
		default: true,
	},
	companyQuestions: { label: 'Company questions and tags', default: true },
	videoSolution: {
		label: 'Video solutions from Neetcode and Striver',
		default: true,
	},
} as const

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs)
}

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))

export const makeSignal = (timeoutMs = 60 * 1000) => {
	const controller = new AbortController()

	return {
		controller,
		signal: AbortSignal.any([
			controller.signal,
			AbortSignal.timeout(timeoutMs),
		]),
	}
}

/**
 * My custom wrapper for MutationObserver
 */
export function observeElement(callback: MutationCallback) {
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

export async function getTab() {
	return await browser.runtime.sendMessage({
		type: 'GET_TAB',
	})
}

/**
 * Formats the number of dislikes compactly.
 *
 * @example
 * formatDislikes(1500) // '1.5K'
 * formatDislikes(9000000) // '9M'
 */
export function formatDislikes(n: number) {
	return new Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(n)
}

export async function copyQuestion(question: Question) {
	const text =
		'## ' +
		question.id +
		'. ' +
		question.title +
		'\n' +
		htmlToMd(question.content)

	await navigator.clipboard.writeText(text)
}

export function parseCsv<T>(csv: string) {
	return new Promise<T[]>((resolve) => {
		Papa.parse<T>(csv, {
			header: true,
			skipEmptyLines: 'greedy',
			worker: true,
			complete: (results) => resolve(results.data),
		})
	})
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

export async function getBrowserDetails() {
	if (import.meta.env.FIREFOX) {
		// @ts-ignore
		return await browser.runtime.getBrowserInfo()
	}

	if (import.meta.env.CHROME) {
		// @ts-ignore
		const ua = await navigator.userAgentData.getHighEntropyValues([
			'fullVersionList',
		])
		return ua.fullVersionList
	}

	//  fallback
	return {
		name: 'unknown',
		version: navigator.userAgent,
	}
}

/**
 * @example
 * getRange(500) // '1-999'
 * getRange(1500) // '1000-1999'
 */
export function getRange(num: number) {
	if (num <= 999) {
		return '1-999'
	} else if (num <= 1999) {
		return '1000-1999'
	} else if (num <= 2999) {
		return '2000-2999'
	} else if (num <= 3999) {
		return '3000-3999'
	}

	throw new Error(`Unsupported number: ${num}`)
}
