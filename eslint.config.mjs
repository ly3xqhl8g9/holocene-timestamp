import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['.cache/**', 'node_modules/**', '**/node_modules/**', '**/dist/**', '**/distribution/**', 'release/**', 'test-results/**', 'playwright-report/**', 'packages/extension-chrome/**', 'packages/web/**', '**/jquery-*.js', '**/rollup.config.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        chrome: 'readonly', document: 'readonly', window: 'readonly', console: 'readonly',
        setTimeout: 'readonly', clearTimeout: 'readonly', MutationObserver: 'readonly',
        Node: 'readonly', NodeFilter: 'readonly', HTMLElement: 'readonly', HTMLInputElement: 'readonly',
        Text: 'readonly', performance: 'readonly', URL: 'readonly', process: 'readonly', Buffer: 'readonly',
        describe: 'readonly', it: 'readonly', test: 'readonly', expect: 'readonly', vi: 'readonly',
        beforeEach: 'readonly', afterEach: 'readonly', beforeAll: 'readonly', afterAll: 'readonly',
        module: 'readonly', require: 'readonly', __dirname: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
