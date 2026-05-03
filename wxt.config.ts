import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'wxt'

export default defineConfig({
	modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
	autoIcons: {
		baseIconPath: resolve('public/icon.svg'),
	},
	manifest: {
		web_accessible_resources: [
			{
				resources: ['patchMonaco.js'],
				matches: ['https://leetcode.com/*'],
			},
		],
		permissions: ['search'],
		browser_specific_settings: {
			gecko: {
				id: 'leetcode-enhancer@sbrjt',
				data_collection_permissions: { required: ['none'] },
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
