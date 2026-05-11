import type * as Monaco from 'monaco-editor'

declare global {
	interface Window {
		monaco: typeof Monaco
	}
}

export type Question = {
	id: number
	slug: string
	title: string
	content: string
	premium: boolean
	dislikes: number
}

export type GraphQLResponse<T> = {
	data: T
}

export type QuestionData = {
	question: {
		title: string
		content: string
		dislikes: number
		isPaidOnly: boolean
		questionFrontendId: string
	}
}
