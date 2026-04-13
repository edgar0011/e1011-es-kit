import { defineConfig, type UserConfig } from 'vite'
import { resolve } from 'path'

export function createLibConfig(
  entry: string,
  cjsDir: string,
  esmDir: string,
): UserConfig {
  return {
    build: {
      sourcemap: true,
      minify: 'esbuild',
      lib: {
        entry: resolve(__dirname, entry),
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: [
          /^react(\/.*)?$/,
          /^ramda(\/.*)?$/,
          /^lodash-es(\/.*)?$/,
          /^dayjs(\/.*)?$/,
          /^core-js(\/.*)?$/,
          /^sanitize-html(\/.*)?$/,
        ],
        output: [
          {
            dir: resolve(__dirname, esmDir),
            format: 'es',
            preserveModules: true,
            exports: 'named',
            entryFileNames: '[name].js',
            interop: 'auto',
          },
          {
            dir: resolve(__dirname, cjsDir),
            format: 'cjs',
            preserveModules: true,
            exports: 'named',
            entryFileNames: '[name].js',
            interop: 'auto',
          },
        ],
      },
    },

    esbuild: {
      jsx: 'automatic',
      target: 'es2022',
      drop: process.env.NODE_ENV === 'production' ? ['console'] : [],
    },

    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
  }
}

// Default export for `vite build` / `vite build --watch`
export default defineConfig(createLibConfig('src/index.ts', 'dist/lib/cjs', 'dist/lib/esm'))
