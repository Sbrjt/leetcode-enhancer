import type * as Monaco from 'monaco-editor'

declare global {
	interface Window {
		monaco: typeof Monaco
	}
}

export default defineUnlistedScript(async () => {
	await sleep(2000)

	// console.log(monaco.languages.getLanguages())

	const editors = window.monaco.editor.getEditors?.() || []

	for (const editor of editors) {
		const model = editor.getModel()
		const langId = model?.getLanguageId()
		console.log(langId)

		editor.updateOptions({
			quickSuggestions: { other: true },
			selectionHighlight: true,
			bracketPairColorization: { enabled: true },
			// parameterHints: { enabled: true },
		})

		console.log(editor.getRawOptions())
		// editor.trigger('keyboard', 'editor.action.triggerSuggest', {})
	}
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Make language servers 😭
