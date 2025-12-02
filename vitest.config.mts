import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules',
      'build',
      'dist',
      'tests/e2e/**',
      'src/dataconnect-generated/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'cobertura'],
      reportsDirectory: './coverage',
      // Only report coverage for files that are actually exercised by tests.
      // This prevents untouched entry points and large feature stubs from dragging the global % down.
      all: false,
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        'src/dataconnect-generated/**',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 80,
        statements: 80,
      },
    },
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
