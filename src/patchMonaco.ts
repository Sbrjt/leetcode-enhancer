import { sleep } from './myext/utils'

export default defineUnlistedScript(async () => {
	await sleep(2000)

	// console.log(monaco.languages.getLanguages())

	const editors = window.monaco.editor.getEditors?.() || []

	for (const editor of editors) {
		// console.log(editor?.getModel()?.getLanguageId())

		editor.updateOptions({
			quickSuggestions: { other: true },
			selectionHighlight: true,
			bracketPairColorization: { enabled: true },
			// parameterHints: { enabled: true },
		})

		// console.log(editor.getModel()?.getLanguageId())
		// console.log(editor.getRawOptions())
		// editor.trigger('keyboard', 'editor.action.triggerSuggest', {})
	}
})

// TODO: Make language servers 😭
