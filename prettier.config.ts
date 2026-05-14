import type { Config } from 'prettier'

const config: Config = {
	jsxSingleQuote: true,
	singleQuote: true,
	semi: false,
	experimentalTernaries: true,
	useTabs: true,
	plugins: ['prettier-plugin-organize-imports'],
}

export default config
