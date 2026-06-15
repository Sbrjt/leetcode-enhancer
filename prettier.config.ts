import type { Config } from 'prettier'

const config: Config = {
	jsxSingleQuote: true,
	singleQuote: true,
	semi: false,
	experimentalTernaries: true,
	useTabs: true,
	plugins: [
		'prettier-plugin-organize-imports',
		'prettier-plugin-tailwindcss',
		'prettier-plugin-classnames',
		'prettier-plugin-merge',
	],
}

export default config
