import replace from '@rollup/plugin-replace'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import removeConsole from 'vite-plugin-remove-console'
import { defineConfig } from 'wxt'
import pkg from './package.json'

export default defineConfig({
	manifest: () => {
		const { CHROME_PUBLIC_KEY, FIREFOX_EXTENSION_ID } = pkg.config

		return {
			web_accessible_resources: [
				{
					resources: ['patchMonaco.js'],
					matches: ['https://leetcode.com/*'],
					use_dynamic_url: true,
				},
			],
			permissions: ['search', 'storage', '<all_urls>'],
			key: CHROME_PUBLIC_KEY,
			browser_specific_settings: {
				gecko: {
					id: FIREFOX_EXTENSION_ID,
					data_collection_permissions: { required: ['none'] },
				},
			},
			homepage_url: 'https://github.com/Sbrjt/leetcode-enhancer',
		}
	},
	modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
	srcDir: 'src',
	autoIcons: { baseIconPath: resolve('public/icon.svg') },
	vite: (configEnv) => {
		const isProd = configEnv.mode === 'production'

		return {
			plugins: [
				tailwindcss(),
				// https://github.com/SardineFish/monaco-pyright-lsp/issues/8
				replace({
					include: '**/monaco-pyright-lsp/**/client.js',
					preventAssignment: true,
					values: {
						'new URL("./worker.js", import.meta.url)': '""',
					},
				}),
				...(isProd ? [removeConsole({ includes: ['log'] })] : []),
			],
		}
	},
	webExt: {
		chromiumProfile: resolve('.wxt/chrome-data'),
		keepProfileChanges: true,
		startUrls: ['leetcode.com/problems/two-sum'],
	},
})
