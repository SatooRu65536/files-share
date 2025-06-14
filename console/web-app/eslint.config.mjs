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
        project: './tsconfig.json',
      },
    },
    settings: {
      react: {
        version: 'detect',
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
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
  },
  {
    files: ['tests/**/*.{ts,tsx}', 'e2e/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.test.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    ignores: [
      'build/**/*',
      'functions/**/*',
      '.wrangler/**/*',
      'public/**/*',
      'worker-configuration.d.ts',
      'vite.config.ts',
      'eslint.config.mjs',
      'postcss.config.js',
      'knip.config.ts',
      'playwright.config.ts',
      'src/utils/matchMedia.js',
    ],
  },
);
