import eslintReact from '@eslint-react/eslint-plugin'
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import noUnsanitized from 'eslint-plugin-no-unsanitized'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
	eslint.configs.recommended,
	eslintConfigPrettier,
	tseslint.configs.recommended,
	noUnsanitized.configs.recommended,
	eslintReact.configs['recommended-typescript'],
	{
		languageOptions: { globals: { ...globals.webextensions } },
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/ban-ts-comment': 'warn',
		},
	},
)

// Docs: https://typescript-eslint.io/getting-started/#step-2-configuration
