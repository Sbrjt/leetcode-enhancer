import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'wxt'

export default defineConfig({
	modules: ['@wxt-dev/module-react'],
	manifest: {
		// web_accessible_resources: [
		// 	{
		// 		resources: ['patchfetch.js'],
		// 		matches: ['https://leetcode.com/problems/*'],
		// 	},
		// ],
		icons: {
			'16': 'logo.png',
			'32': 'logo.png',
			'48': 'logo.png',
			'128': 'logo.png',
		},
		permissions: ['search'],
		browser_specific_settings: {
			gecko: {
				id: 'leetcode-enhancer@sbrjt',
				data_collection_permissions: {
					required: ['none'],
					optional: [],
				},
			},
		},
	},
	entrypointsDir: 'src',
	vite: () => ({
		plugins: [tailwindcss()],
	}),
	webExt: {
		chromiumProfile: resolve('.wxt/chrome-data'),
		keepProfileChanges: true,
		// 	disabled: true,
	},
})
