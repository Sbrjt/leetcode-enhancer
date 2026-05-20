import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'wxt'

export default defineConfig({
	manifest: {
		web_accessible_resources: [
			{
				resources: ['patchMonaco.js'],
				matches: ['https://leetcode.com/*'],
				use_dynamic_url: true,
			},
		],
		permissions: ['search', 'storage'],
		browser_specific_settings: {
			gecko: {
				id: 'leetcode-enhancer@sbrjt',
				data_collection_permissions: { required: ['none'] },
			},
		},
	},
	modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
	srcDir: 'src',
	// entrypointsDir: 'src',
	autoIcons: {
		baseIconPath: resolve('public/icon.svg'),
	},
	vite: () => ({
		plugins: [tailwindcss()],
	}),
	webExt: {
		chromiumProfile: resolve('.wxt/chrome-data'),
		keepProfileChanges: true,
		// 	disabled: true,
	},
})
