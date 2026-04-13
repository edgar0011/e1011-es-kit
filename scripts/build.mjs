import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

const externalPatterns = [
  /^react(\/.*)?$/,
  /^ramda(\/.*)?$/,
  /^lodash-es(\/.*)?$/,
  /^dayjs(\/.*)?$/,
  /^core-js(\/.*)?$/,
  /^sanitize-html(\/.*)?$/,
]

const entries = [
  { entry: 'src/index.ts', cjsDir: 'dist/lib/cjs', esmDir: 'dist/lib/esm', name: 'EsKit' },
  { entry: 'src/core/hooks/index.ts', cjsDir: 'dist/hooks', esmDir: 'dist/hooks/esm', name: 'EsKitHooks' },
  { entry: 'src/core/utils/index.ts', cjsDir: 'dist/utils', esmDir: 'dist/utils/esm', name: 'EsKitUtils' },
  { entry: 'src/core/ui/index.ts', cjsDir: 'dist/ui', esmDir: 'dist/ui/esm', name: 'EsKitUI' },
]

for (const { entry, cjsDir, esmDir, name } of entries) {
  console.log(`\nBuilding ${name} (${entry})...`)
  await build({
    configFile: false,
    root,
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
    build: {
      emptyOutDir: false,
      sourcemap: true,
      minify: 'esbuild',
      lib: {
        entry: resolve(root, entry),
        name,
      },
      rollupOptions: {
        external: externalPatterns,
        output: [
          {
            dir: resolve(root, esmDir),
            format: 'es',
            preserveModules: true,
            exports: 'named',
            entryFileNames: '[name].js',
            interop: 'auto',
          },
          {
            dir: resolve(root, cjsDir),
            format: 'cjs',
            preserveModules: true,
            exports: 'named',
            entryFileNames: '[name].js',
            interop: 'auto',
          },
        ],
      },
    },
  })
}

console.log('\nAll builds complete.')
