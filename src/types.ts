import { SETTINGS } from '@/utils/lib'
import type { editor } from 'monaco-editor'

declare global {
	interface Window {
		monaco: {
			editor: typeof editor
		}
	}
}

type ValueOf<T> = T[keyof T]

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

export type ProblemRating = {
	Rating: number
	ID: number
	Title: string
	ContestSlug: string
	ProblemIndex: string
}

export type CompanyMapping = {
	ID: number
	company: string[]
}

export type CompanyQuestion = {
	ID: string
	URL: string
	Title: string
	Difficulty: string
	'Acceptance %': string
	'Frequency %': string
	Time?: string
}

export type SettingKey = keyof typeof SETTINGS

export type Setting = ValueOf<typeof SETTINGS> & { key: SettingKey }
