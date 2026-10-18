import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      'holocene-timestamp-parser': fileURLToPath(new URL('./packages/holocene-timestamp-parser/src/index.ts', import.meta.url)),
    },
  },
  test: {
    globals: true,
    include: ['packages/{extension-chrome-legacy,holocene-timestamp-parser}/**/*.{test,spec}.ts', 'test/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/distribution/**'],
    allowOnly: false,
    environment: 'node',
  },
});
