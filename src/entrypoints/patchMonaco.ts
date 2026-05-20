import elementReady from 'element-ready'

export default defineUnlistedScript(async () => {
	await elementReady('.monaco-editor', { stopOnDomReady: false })

	const editors = window.monaco.editor.getEditors?.() || []

	for (const editor of editors) {
		editor.updateOptions({
			quickSuggestions: { other: true },
			selectionHighlight: true,
			bracketPairColorization: { enabled: true },
		})
	}
})

// TODO: Make language servers 😭
