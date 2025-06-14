import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import reactRefresh from 'eslint-plugin-react-refresh';
import reacteslint from 'eslint-plugin-react';

export default tseslint.config(
  jseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  ...tseslint.configs.recommendedTypeChecked,
  {
    ...reacteslint.configs.flat.recommended,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'sort-destructure-keys': sortDestructureKeys,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      curly: 'error',
      'react/react-in-jsx-scope': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^@?\\w'], ['^'], ['^@(?:libs|functions)/'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
      'sort-destructure-keys/sort-destructure-keys': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    ignores: [
      'build/**/*',
      'functions/**/*',
      '.wrangler/**/*',
      'worker-configuration.d.ts',
      'eslint.config.mjs',
      'postcss.config.js',
    ],
  },
);
