import elementReady from 'element-ready'

export default defineUnlistedScript(async () => {
	await elementReady('.monaco-editor', { stopOnDomReady: false })

	// console.log(window.monaco.languages.getLanguages())

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
