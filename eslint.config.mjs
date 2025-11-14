// @ts-check

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ['client/**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
        },
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                React: 'readonly',
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            'react/jsx-no-script-url': 'error',
            'react/jsx-no-target-blank': 'error',
            'react/no-danger': 'warn',
        },
    },
    {
        files: ['server/**/*.{ts,js}'],
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            '@typescript-eslint/no-var-requires': 'off',
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            import: importPlugin,
            perfectionist,
        },
        rules: {
            'import/no-duplicates': 'error',

            'perfectionist/sort-imports': [
                'error',
                {
                    order: 'asc',
                    type: 'natural',
                },
            ],
        },
    },
    prettier,
    globalIgnores(['node_modules/**', '.next/**', 'dist/**', 'build/**', 'coverage/**', 'out/**']),
);
