// AI generated code

import { MonacoPyrightProvider } from 'monaco-pyright-lsp'
import pyrightWorkerUrl from 'monaco-pyright-lsp/dist/worker.js?worker&url'

export async function wirePyrightModel(editor: any, model: any) {
	try {
		// Pyright expects 'python', while LeetCode uses 'python3'
		window.monaco.editor.setModelLanguage(model, 'python')

		const provider = await createProvider()
		await provider.setupDiagnostics(editor)

		// Sync existing editor content
		await provider.lspClient.updateDocVersion(model.getValue())
	} catch {
		console.error('Error in initiating Pyright')
	}
}

async function createProvider() {
	const worker = await loadWorker()
	const provider = new MonacoPyrightProvider(worker, { typeStubs })

	await provider.init(window.monaco as never)
	await provider.lspClient.connection.sendNotification(
		'workspace/didChangeConfiguration',
		{
			settings: {
				python: {
					analysis: {
						diagnosticMode: 'openFilesOnly',
						typeCheckingMode: 'basic',
						stubPath: '/typings',
						typeshedPaths: ['/typeshed-fallback'],
					},
				},
			},
		},
	)

	return provider
}

async function loadWorker() {
	const scriptUrl = (document.currentScript as HTMLScriptElement)?.src
	const url = new URL(pyrightWorkerUrl, new URL('.', scriptUrl))
	url.pathname += '.gz'
	const res = await fetch(url)
	if (!res.body) throw new Error('Could not load the Pyright worker')
	const stream = res.body.pipeThrough(new DecompressionStream('gzip'))
	const source = await new Response(stream).blob()
	return URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))

	// Note: the entire decompressed worker sits in memory.
}

const typeStubs = {
	'__builtins__.pyi': `
from bisect import *
from collections import *
from functools import *
from heapq import *
from itertools import *
from math import *
from typing import *
from sortedcontainers import * # not working

import bisect
import collections
import copy
import functools
import heapq
import itertools
import math
import random
import re
import string
import sys


class ListNode:
    val: int
    next: Optional["ListNode"]

    def __init__(
        self,
        val: int = 0,
        next: Optional["ListNode"] = None
    ) -> None: ...

class TreeNode:
    val: int
    left: Optional["TreeNode"]
    right: Optional["TreeNode"]

    def __init__(
        self,
        val: int = 0,
        left: Optional["TreeNode"] = None,
        right: Optional["TreeNode"] = None
    ) -> None: ...
`,
}

/* 
Pyright is a language server for Python. 
It provides language features such as autocomplete and diagnostics (errors and warnings shown as squiggly underlines)
Here, Pyright runs inside a Web Worker (This is to prevent it from blocking the main thread)
It's connected to Monaco Editor using monaco-pyright-lsp (LSP = Language Server Protocol)
*/
