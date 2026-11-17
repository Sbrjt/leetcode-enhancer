import pyrightWorkerUrl from 'browser-basedpyright/dist/pyright.worker.js?url'
import {
	BrowserMessageReader,
	BrowserMessageWriter,
	createProtocolConnection,
} from 'vscode-languageserver-protocol/browser'

const WORKSPACE_URI = 'file:///workspace'
const ANALYSIS_OPTIONS = {
	diagnosticMode: 'openFilesOnly',
	typeCheckingMode: 'basic',
}

const models = new Map<string, any>()
let completionProvider: { dispose(): void } | undefined
let monaco: any

// LSP and Monaco assign different numeric values to the same completion kinds.
const LSP_COMPLETION_KINDS = [
	undefined,
	'Text', 'Method', 'Function', 'Constructor', 'Field', 'Variable', 'Class',
	'Interface', 'Module', 'Property', 'Unit', 'Value', 'Enum', 'Keyword',
	'Snippet', 'Color', 'File', 'Reference', 'Folder', 'EnumMember', 'Constant',
	'Struct', 'Event', 'Operator', 'TypeParameter',
] as const

const pyrightUri = (model: any) =>
	`${WORKSPACE_URI}/${encodeURIComponent(model.uri.toString()).replaceAll('%', '_')}.py`

const toMonacoRange = (range: any) => ({
	startLineNumber: range.start.line + 1,
	startColumn: range.start.character + 1,
	endLineNumber: range.end.line + 1,
	endColumn: range.end.character + 1,
})

async function createServer() {
	monaco ??= window.monaco
	const workerUrl = await fetch(new URL(pyrightWorkerUrl, import.meta.url))
		.then((response) => response.blob())
		.then(URL.createObjectURL)
	const worker = new Worker(workerUrl)
	const channel = new MessageChannel()
	const backgroundWorkers = new Set<Worker>()
	const { MarkerSeverity, editor } = monaco
	const severities = [
		MarkerSeverity.Hint,
		MarkerSeverity.Error,
		MarkerSeverity.Warning,
		MarkerSeverity.Info,
		MarkerSeverity.Hint,
	]

	worker.onmessage = ({ data }) => {
		if (data.type !== 'browser/newWorker') {
			channel.port2.postMessage(data)
			return
		}

		const backgroundWorker = new Worker(workerUrl)
		backgroundWorkers.add(backgroundWorker)
		backgroundWorker.addEventListener('error', (error) =>
			console.error('Basedpyright background worker failed', error),
		)
		backgroundWorker.postMessage(
			{
				type: 'browser/boot',
				mode: 'background',
				initialData: data.initialData,
				port: data.port,
			},
			[data.port],
		)
	}

	const connection = createProtocolConnection(
		new BrowserMessageReader(channel.port1),
		new BrowserMessageWriter(worker),
	)
	connection.onNotification(
		'textDocument/publishDiagnostics',
		(params: any) => {
			const model = models.get(params.uri)
			if (!model) return

			editor.setModelMarkers(
				model,
				'pyright',
				params.diagnostics.map((diagnostic: any) => ({
					...toMonacoRange(diagnostic.range),
					message: diagnostic.message,
					severity: severities[diagnostic.severity] ?? MarkerSeverity.Info,
					source: 'pyright',
				})),
			)
		},
	)
	connection.onRequest('workspace/configuration', (params: any) =>
		params.items.map(({ section }: { section?: string }) =>
			section === 'python' || section === 'basedpyright' ?
				{ analysis: ANALYSIS_OPTIONS }
			:	null,
		),
	)

	worker.postMessage({ type: 'browser/boot', mode: 'foreground' })
	connection.listen()
	await connection.sendRequest('initialize', {
		rootUri: WORKSPACE_URI,
		workspaceFolders: [{ uri: WORKSPACE_URI, name: 'leetcode' }],
		capabilities: {
			workspace: { configuration: true, workspaceFolders: true },
			textDocument: {
				publishDiagnostics: { versionSupport: true },
				completion: { completionItem: { snippetSupport: true } },
			},
		},
		initializationOptions: { files: { '/workspace/.gitkeep': '' } },
	})
	connection.sendNotification('initialized')
	return connection
}

let serverPromise: ReturnType<typeof createServer>

export const getServer = () => (serverPromise ??= createServer())

function ensureCompletionProvider() {
	if (completionProvider) return

	monaco ??= window.monaco
	completionProvider = monaco.languages.registerCompletionItemProvider(
		'python3',
		{
			triggerCharacters: ['.'],
			provideCompletionItems: async (model: any, position: any) => {
				try {
					const server = await getServer()
					const response: any = await server.sendRequest(
						'textDocument/completion',
						{
							textDocument: { uri: pyrightUri(model) },
							position: {
								line: position.lineNumber - 1,
								character: position.column - 1,
							},
						},
					)
					const items =
						Array.isArray(response) ? response : (response?.items ?? [])

					return {
						suggestions: items.map((item: any) => {
							const textEdit = item.textEdit
							const documentation = item.documentation
							const word = model.getWordUntilPosition(position)
							return {
								label: item.label,
								kind:
									monaco.languages.CompletionItemKind[
										LSP_COMPLETION_KINDS[item.kind] ?? 'Text'
									],
								detail: item.detail,
								documentation:
									typeof documentation === 'string' ? documentation : (
										documentation?.value && {
											value: documentation.value,
											isTrusted: false,
										}
									),
								insertText: textEdit?.newText ?? item.insertText ?? item.label,
								insertTextRules:
									item.insertTextFormat === 2 ?
										monaco.languages.CompletionItemInsertTextRule
											.InsertAsSnippet
									:	undefined,
								range: textEdit ? toMonacoRange(textEdit.range) : {
									startLineNumber: position.lineNumber,
									endLineNumber: position.lineNumber,
									startColumn: word.startColumn,
									endColumn: word.endColumn,
								},
								filterText: item.filterText,
								sortText: item.sortText,
								preselect: item.preselect,
								commitCharacters: item.commitCharacters,
								additionalTextEdits: item.additionalTextEdits?.map(
									(edit: any) => ({
										range: toMonacoRange(edit.range),
										text: edit.newText,
									}),
								),
							}
						}),
					}
				} catch (error) {
					console.error('Pyright completion request failed', error)
					return { suggestions: [] }
				}
			},
		},
	)
}

export async function wirePyrightModel(model: any) {
	const uri = pyrightUri(model)
	if (models.has(uri)) return

	// Reserve the URI before awaiting so concurrent calls open it only once.
	models.set(uri, model)
	ensureCompletionProvider()
	const server = await getServer()

	server.sendNotification('textDocument/didOpen', {
		textDocument: {
			uri,
			languageId: 'python',
			version: model.getVersionId(),
			text: model.getValue(),
		},
	})

	const subscription = model.onDidChangeContent(() =>
		server.sendNotification('textDocument/didChange', {
			textDocument: { uri, version: model.getVersionId() },
			contentChanges: [{ text: model.getValue() }],
		}),
	)

	model.onWillDispose(() => {
		subscription.dispose()
		models.delete(uri)
		server.sendNotification('textDocument/didClose', { textDocument: { uri } })
	})
}
