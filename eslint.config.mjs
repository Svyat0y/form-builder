import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			globals: globals.browser,
		},
		plugins: {
			react: pluginReact,
		},
		rules: {
			"no-unused-vars": "warn",
			"no-console": "error",
			"semi": ["error", "always"],
			"quotes": ["error", "single"],
			"indent": ["error", 2],
			"react/react-in-jsx-scope": [
				'off'
			],
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		ignores: ["package.json", "package-lock.json", "config/*"]
	},
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
];