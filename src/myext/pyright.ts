// AI Generated

import pyrightWorkerUrl from 'browser-basedpyright/dist/pyright.worker.js?url'

const models = new Map<string, any>()
const modelUris = new Map<string, string>()
let completionProvider: { dispose(): void } | undefined

const WORKSPACE_URI = 'file:///workspace'

// Language Server Protocol and Monaco use different numeric completion-kind
// enums, so passing the LSP value through labels methods as the wrong item type.
const LSP_TO_MONACO_COMPLETION_KIND: Record<number, number> = {
	1: 18, // Text
	2: 0, // Method
	3: 1, // Function
	4: 2, // Constructor
	5: 3, // Field
	6: 4, // Variable
	7: 5, // Class
	8: 7, // Interface
	9: 8, // Module
	10: 9, // Property
	11: 12, // Unit
	12: 13, // Value
	13: 15, // Enum
	14: 17, // Keyword
	15: 25, // Snippet
	16: 19, // Color
	17: 20, // File
	18: 21, // Reference
	19: 23, // Folder
	20: 16, // Enum member
	21: 14, // Constant
	22: 6, // Struct
	23: 10, // Event
	24: 11, // Operator
	25: 24, // Type parameter
}

function getPyrightUri(model: any) {
	const monacoUri = model.uri.toString()
	let uri = modelUris.get(monacoUri)
	if (!uri) {
		const fileName = encodeURIComponent(monacoUri).replaceAll('%', '_')
		uri = `${WORKSPACE_URI}/${fileName}.py`
		modelUris.set(monacoUri, uri)
	}
	return uri
}

async function createServer() {
	const workerUrl = await fetch(new URL(pyrightWorkerUrl, import.meta.url))
		.then((res) => res.blob())
		.then((blob) => URL.createObjectURL(blob))
	const worker = new Worker(workerUrl)
	const backgroundWorkers = new Set<Worker>()

	worker.postMessage({ type: 'browser/boot', mode: 'foreground' })

	const pending = new Map<
		number,
		{ resolve: (res: any) => void; reject: (reason: unknown) => void }
	>()
	let id = 1

	worker.onmessage = (e) => {
		const { id: msgId, method, params, result } = e.data
		if (e.data.type === 'browser/newWorker') {
			const backgroundWorker = new Worker(workerUrl)
			backgroundWorkers.add(backgroundWorker)
			backgroundWorker.addEventListener('error', (error) =>
				console.error('Basedpyright background worker failed', error),
			)
			backgroundWorker.postMessage(
				{
					type: 'browser/boot',
					mode: 'background',
					initialData: e.data.initialData,
					port: e.data.port,
				},
				[e.data.port],
			)
		} else if (msgId != null && ('result' in e.data || 'error' in e.data)) {
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
			const analysis = {
				diagnosticMode: 'openFilesOnly',
				typeCheckingMode: 'basic',
			}
			worker.postMessage({
				id: msgId,
				result: params.items.map(({ section }: { section?: string }) =>
					section === 'python' || section === 'basedpyright' ? { analysis } : null,
				),
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
		rootUri: WORKSPACE_URI,
		workspaceFolders: [{ uri: WORKSPACE_URI, name: 'leetcode' }],
		capabilities: {
			workspace: { configuration: true, workspaceFolders: true },
			textDocument: {
				publishDiagnostics: { versionSupport: true },
				completion: { completionItem: { snippetSupport: true } },
			},
		},
		// browser-basedpyright bundles typeshed, but the workspace still needs a
		// virtual file so the root directory exists in its in-memory filesystem.
		initializationOptions: { files: { '/workspace/.gitkeep': '' } },
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
						textDocument: { uri: getPyrightUri(model) },
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
						kind: LSP_TO_MONACO_COMPLETION_KIND[item.kind] ?? 18,
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
	const monacoUri = model.uri.toString()
	const uri = getPyrightUri(model)
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
		modelUris.delete(monacoUri)
		notify('textDocument/didClose', { textDocument: { uri } })
	})
}
