/// <reference types="vitest" />

import { defineConfig } from 'vite';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert { type: 'json' };
import dts from 'vite-plugin-dts';

const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolvePath('./src/index.ts'),
      name: pkg.name,
      fileName: () => `index.js`,
      formats: ['es'],
    },
    rollupOptions: {
      plugins: [typescript()],
      external: [...Object.keys(pkg.dependencies || {})],
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      include: ['src/'],
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
});
