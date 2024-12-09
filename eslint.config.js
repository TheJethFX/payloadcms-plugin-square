// @ts-check

import payloadEsLintConfig from '@payloadcms/eslint-config';

export const defaultESLintIgnores = [
	'**/.temp',
	'**/.*', // ignore all dotfiles
	'**/.git',
	'**/.hg',
	'**/.pnp.*',
	'**/.svn',
	'**/playwright.config.ts',
	'**/jest.config.js',
	'**/tsconfig.tsbuildinfo',
	'**/README.md',
	'**/eslint.config.js',
	'**/payload-types.ts',
	'**/dist/',
	'**/.yarn/',
	'**/build/',
	'**/node_modules/',
	'**/temp/',
];

export default [
	...payloadEsLintConfig,
	{
		// Modify any rules from payload's config that you want to override/disable
		rules: {
			'no-restricted-exports': 'off',
		},
	},
	// TODO: Bring in '@payloadcms/eslint-plugin' for 'payload/proper-payload-logger-usage' rule
	{
		ignores: defaultESLintIgnores,
	},
	{
		languageOptions: {
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest',
				projectService: {
					maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 40,
					allowDefaultProject: ['scripts/*.ts', '*.js', '*.mjs', '*.spec.ts', '*.d.ts'],
				},
				// projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];