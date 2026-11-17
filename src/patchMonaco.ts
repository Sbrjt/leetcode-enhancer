import elementReady from 'element-ready'
import { wirePyrightModel } from './myext/pyright'

const OPTIONS = {
	quickSuggestions: { other: true },
	selectionHighlight: true,
	bracketPairColorization: { enabled: true },
	wordBasedSuggestions: 'allDocuments',
}

export default defineUnlistedScript(async () => {
	await elementReady('.monaco-editor', { stopOnDomReady: false })

	for (const editor of window.monaco.editor.getEditors?.() || []) {
		editor.updateOptions(OPTIONS)
		editor.onDidChangeConfiguration(() => editor.updateOptions(OPTIONS))

		const model = editor.getModel()

		if (model?.getLanguageId() === 'python3') {
			wirePyrightModel(model)
		}
	}
})

// TODO: Make language servers 😭
