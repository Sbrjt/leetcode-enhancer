// AI Generated

import pyrightWorkerUrl from '@typefox/pyright-browser/dist/pyright.worker.js?url'

const models = new Map<string, any>()
let completionProvider: { dispose(): void } | undefined

async function createServer() {
	const worker = await fetch(new URL(pyrightWorkerUrl, import.meta.url))
		.then((res) => res.blob())
		.then((blob) => new Worker(URL.createObjectURL(blob)))

	worker.postMessage({ type: 'browser/boot', mode: 'foreground' })

	const pending = new Map<
		number,
		{ resolve: (res: any) => void; reject: (reason: unknown) => void }
	>()
	let id = 1

	worker.onmessage = (e) => {
		const { id: msgId, method, params, result } = e.data
		if (msgId != null && ('result' in e.data || 'error' in e.data)) {
			const request = pending.get(msgId)
			if (e.data.error) {
				request?.reject(new Error(e.data.error.message || 'Pyright request failed'))
			} else {
				request?.resolve(result)
			}
			pending.delete(msgId)
		} else if (method === 'textDocument/publishDiagnostics') {
			const model = models.get(params.uri)
			const monaco = (window as any).monaco
			if (model && monaco) {
				monaco.editor.setModelMarkers(
					model,
					'pyright',
					params.diagnostics.map((d: any) => ({
						startLineNumber: d.range.start.line + 1,
						startColumn: d.range.start.character + 1,
						endLineNumber: d.range.end.line + 1,
						endColumn: d.range.end.character + 1,
						message: d.message,
						severity:
							d.severity === 1 ? 8
							: d.severity === 2 ? 4
							: 2,
						source: 'pyright',
					})),
				)
			}
		} else if (method === 'workspace/configuration') {
			worker.postMessage({
				id: msgId,
				result: params.items.map(() => ({
					python: {
						analysis: {
							diagnosticMode: 'openFilesOnly',
							typeCheckingMode: 'basic',
						},
					},
				})),
			})
		}
	}

	const call = (method: string, params = {}) => {
		const cur = id++
		worker.postMessage({ id: cur, method, params })
		return new Promise<any>((resolve, reject) =>
			pending.set(cur, { resolve, reject }),
		)
	}
	const notify = (method: string, params = {}) =>
		worker.postMessage({ method, params })

	await call('initialize', {
		capabilities: {
			workspace: { configuration: true },
			textDocument: { completion: { completionItem: { snippetSupport: true } } },
		},
	})
	notify('initialized')
	return { call, notify }
}

function toMonacoRange(range: any) {
	return {
		startLineNumber: range.start.line + 1,
		startColumn: range.start.character + 1,
		endLineNumber: range.end.line + 1,
		endColumn: range.end.character + 1,
	}
}

function completionDocumentation(documentation: any) {
	if (typeof documentation === 'string') return documentation
	if (documentation?.value) return { value: documentation.value, isTrusted: false }
	return undefined
}

function ensureCompletionProvider() {
	if (completionProvider) return

	const monaco = (window as any).monaco
	completionProvider = monaco.languages.registerCompletionItemProvider('python3', {
		triggerCharacters: ['.'],
		provideCompletionItems: async (model: any, position: any) => {
			try {
				const response = await getServer().then(({ call }) =>
					call('textDocument/completion', {
						textDocument: { uri: model.uri.toString() },
						position: {
							line: position.lineNumber - 1,
							character: position.column - 1,
						},
					}),
				)
				const items = Array.isArray(response) ? response : response?.items || []

				return {
					suggestions: items.map((item: any) => {
						const textEdit = item.textEdit
						return {
							label: item.label,
							kind: item.kind,
							detail: item.detail,
							documentation: completionDocumentation(item.documentation),
							insertText: textEdit?.newText ?? item.insertText ?? item.label,
							insertTextRules: item.insertTextFormat === 2 ? 4 : undefined,
							range: textEdit ? toMonacoRange(textEdit.range) : undefined,
							filterText: item.filterText,
							sortText: item.sortText,
							preselect: item.preselect,
							commitCharacters: item.commitCharacters,
							additionalTextEdits: item.additionalTextEdits?.map((edit: any) => ({
								range: toMonacoRange(edit.range),
								text: edit.newText,
							})),
						}
					}),
				}
			} catch (error) {
				console.error('Pyright completion request failed', error)
				return { suggestions: [] }
			}
		},
	})
}

// For singleton pattern (WXT does not support content scripts as ESM :(
let serverPromise: ReturnType<typeof createServer>

export function getServer() {
	if (!serverPromise) {
		serverPromise = createServer()
	}
	return serverPromise
}

/**
 * Connects a Monaco model to the Pyright language server.
 */
export async function wirePyrightModel(model: any) {
	const uri = model.uri.toString()
	if (models.has(uri)) return
	ensureCompletionProvider()
	const server = await getServer()
	const { notify } = server
	models.set(uri, model)

	notify('textDocument/didOpen', {
		textDocument: {
			uri,
			languageId: 'python',
			version: model.getVersionId(),
			text: model.getValue(),
		},
	})

	const sub = model.onDidChangeContent((e: any) =>
		notify('textDocument/didChange', {
			textDocument: { uri, version: model.getVersionId() },
			contentChanges: e.changes.map((c: any) => ({
				range: {
					start: {
						line: c.range.startLineNumber - 1,
						character: c.range.startColumn - 1,
					},
					end: {
						line: c.range.endLineNumber - 1,
						character: c.range.endColumn - 1,
					},
				},
				text: c.text,
			})),
		}),
	)

	model.onWillDispose(() => {
		sub.dispose()
		models.delete(uri)
		notify('textDocument/didClose', { textDocument: { uri } })
	})
}
