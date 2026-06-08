import type { editor } from 'monaco-editor'
declare global {
	interface Window {
		monaco: {
			editor: typeof editor
		}
	}
}

export type Question = {
	id: number
	slug: string
	title: string
	content: string
	difficulty: 'Easy' | 'Medium' | 'Hard'
	tags: string[]
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
		difficulty: 'Easy' | 'Medium' | 'Hard'
		topicTags: { name: string }[]
		dislikes: number
		isPaidOnly: boolean
		questionFrontendId: string
	}
}
