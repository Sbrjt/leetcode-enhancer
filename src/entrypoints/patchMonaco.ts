import { wirePyrightModel } from '@/utils/pyright'
import elementReady from 'element-ready'

const OPTIONS = {
	quickSuggestions: { other: true },
	selectionHighlight: true,
	bracketPairColorization: { enabled: true },
	wordBasedSuggestions: 'allDocuments',
}

export default defineUnlistedScript(async () => {
	await elementReady('.monaco-editor', { stopOnDomReady: false })

	const editors = window.monaco.editor.getEditors?.() || []

	for (const editor of editors) {
		editor.updateOptions(OPTIONS)
		editor.onDidChangeConfiguration(() => editor.updateOptions(OPTIONS))

		const model = editor.getModel()
		const language = model?.getLanguageId()

		if (language === 'python3') {
			wirePyrightModel(editor, model)
		}
	}
})

// TODO: Make language servers 😭
