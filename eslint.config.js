import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '*.tsbuildinfo'],
  },

  // Base rules for every TypeScript / TSX file
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Enforce arrow-style function expressions everywhere instead of
      // `function foo() {}` declarations.
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration',
          message:
            'Use arrow function expressions instead of function declarations.',
        },
        {
          // Block free-standing `function () {}` expressions but allow them
          // inside class method definitions (constructors!) and object
          // method shorthand — those are not "function declarations".
          selector:
            'FunctionExpression:not(MethodDefinition > FunctionExpression):not(Property > FunctionExpression)',
          message:
            'Use arrow function expressions instead of `function` expressions.',
        },
      ],

      // Allow unused args that start with `_` (matches the typescript-eslint convention)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // React-specific rules for the app source (not tests, not server)
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: 'detect' } },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // React 18 JSX runtime — no need to import React just for JSX
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Anonymous arrow inside `memo(...)` is the idiomatic shape we use here;
      // DevTools picks the name up from the exported `const`. No need to
      // duplicate it via `.displayName`.
      'react/display-name': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // React Compiler analysis is informational only — we don't run
      // the compiler, so these noisy advisories from eslint-plugin-react-hooks
      // v7 don't apply to our project.
      'react-hooks/incompatible-library': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/static-components': 'off',
    },
  },

  // Tests are allowed to do test-only things (e.g. unused destructured props)
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Node server code
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
