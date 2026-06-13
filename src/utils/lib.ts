import { type ClassValue, clsx } from 'clsx'
import Papa from 'papaparse'
import { twMerge } from 'tailwind-merge'
import TurndownService from 'turndown'
import type { Question } from '../types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const SETTINGS = [
	{ key: 'enabled', label: 'Extension enabled' },
	{ key: 'rating', label: 'Problem difficulty rating' },
	{ key: 'formatOnRun', label: 'Format on run' },
	{ key: 'autocomplete', label: 'Enable autocomplete' },
	{ key: 'copyButton', label: 'Copy code button' },
	{ key: 'dislikeButton', label: 'Return dislike button' },
	{
		key: 'premiumQuestion',
		label: 'Alternate links to premium problems',
	},
	{ key: 'editorial', label: 'Screenshots of premium editorials' },
	{ key: 'tags', label: 'Company tags of question' },
	{ key: 'questionBank', label: 'Company-wise questions' },
] as const

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
