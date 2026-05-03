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
	premium: boolean
}
