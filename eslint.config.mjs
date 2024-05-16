// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["src/**/*.{js,jsx,mjs,cjs,ts,tsx}"],
		plugins: {
			react,
			tseslint,
		},
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.serviceworker,
				...globals.browser,
				React: true,
				JSX: true,
			},
			parser: tseslint.parser,
		},
		rules: {
			...react.configs["jsx-runtime"].rules,
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"react/jsx-sort-props": ["warn"],
			"react/sort-default-props": ["warn"],
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	{
		plugins: {
			"@next/next": nextPlugin,
		},
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
		},
	},
	{
		ignores: [".next/*"],
	},
];
