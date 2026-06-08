import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { env } from 'process'
import { defineConfig } from 'wxt'

export default defineConfig({
	manifest: () => {
		const { CHROME_PUBLIC_KEY, FIREFOX_EXTENSION_ID } = env

		return {
			web_accessible_resources: [
				{
					resources: ['patchMonaco.js'],
					matches: ['https://leetcode.com/*'],
					use_dynamic_url: true,
				},
			],
			host_permissions: ['https://api.notion.com/*'],
			permissions: ['search', 'storage', 'sidePanel'],
			key: CHROME_PUBLIC_KEY,
			browser_specific_settings: {
				gecko: {
					id: FIREFOX_EXTENSION_ID,
					data_collection_permissions: { required: ['none'] },
				},
			},
		}
	},
	modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
	srcDir: 'src',
	autoIcons: { baseIconPath: resolve('public/icon.svg') },
	vite: () => ({ plugins: [tailwindcss()] }),
	webExt: {
		chromiumProfile: resolve('.wxt/chrome-data'),
		keepProfileChanges: true,
		startUrls: ['leetcode.com/problems/two-sum'],
	},
})
