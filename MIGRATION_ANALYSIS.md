# Rollup → Vite Migration Analysis for @e1011/es-kit

## Executive Summary

This document analyzes migrating the @e1011/es-kit library build from Rollup to Vite's library mode. Vite uses Rollup under the hood for production builds, so the migration is largely a configuration translation — but several areas need careful handling: multiple entry points, CJS+ESM dual output, `preserveModules`, legacy decorator support, and SCSS module extraction.

**Overall assessment: Feasible with moderate complexity.** The main risks center around multiple entry points with `preserveModules` (Vite's library mode doesn't natively support this combination well) and legacy decorator support (requires keeping Babel in the pipeline).

---

## 1. Vite Library Mode Assessment

Vite's [library mode](https://vitejs.dev/guide/build.html#library-mode) (`build.lib`) is designed for building libraries. Under the hood, it delegates to Rollup for production builds, so all Rollup options are available via `build.rollupOptions`.

### What maps cleanly
| Rollup Feature | Vite Equivalent |
|---|---|
| `external` | `build.rollupOptions.external` |
| `output.format` | `build.lib.formats` or `build.rollupOptions.output[].format` |
| `output.sourcemap` | `build.sourcemap` |
| `output.dir` | `build.outDir` or `build.rollupOptions.output[].dir` |
| `@rollup/plugin-terser` | `build.minify` (uses esbuild by default, or `'terser'`) |
| `@rollup/plugin-node-resolve` | Built-in (Vite resolves modules natively) |
| `@rollup/plugin-commonjs` | Built-in (Vite handles CJS→ESM conversion) |
| `@rollup/plugin-json` | Built-in (Vite handles JSON imports natively) |

### What needs special handling
- **Multiple entry points with separate output directories** — Vite's `build.lib.entry` supports multiple entries but writes them all to the same `outDir`. The current setup needs 4 separate output directory trees.
- **`preserveModules: true`** — Not exposed as a first-class Vite option but passable via `build.rollupOptions.output.preserveModules`.
- **CJS output** — Vite 5 library mode doesn't produce CJS by default. You must explicitly configure it.
- **Babel integration** — Vite uses esbuild for transforms by default. Legacy decorators require Babel, which needs `@vitejs/plugin-babel` or `vite-plugin-babel`.

---

## 2. Multiple Entry Points Strategy

### Current Rollup setup
4 independent Rollup configurations, each with its own `input` and `output` arrays:
- `src/index.ts` → `dist/lib/{cjs,esm}/`
- `src/core/hooks/index.ts` → `dist/hooks/{cjs,esm}/` (CJS root, ESM in `/esm`)
- `src/core/utils/index.ts` → `dist/utils/{cjs,esm}/`
- `src/core/ui/index.ts` → `dist/ui/{cjs,esm}/`

### Vite options

#### Option A: Single config with multiple `rollupOptions.input` entries
```js
build: {
  lib: {
    entry: {
      'index': 'src/index.ts',
      'hooks': 'src/core/hooks/index.ts',
      'utils': 'src/core/utils/index.ts',
      'ui': 'src/core/ui/index.ts',
    },
    formats: ['es', 'cjs'],
  }
}
```
**Problem:** All outputs land in a single `outDir`. The current package.json `exports` map expects separate directory structures (`dist/lib/`, `dist/hooks/`, `dist/utils/`, `dist/ui/`). With `preserveModules: true` and multiple entries, the output structure becomes hard to control.

#### Option B: Multiple Vite build passes (Recommended)
Export an array of configs or use a build script that runs `vite build` multiple times:

```js
// vite.config.ts
export default defineConfig(({ mode }) => {
  const entry = process.env.LIB_ENTRY || 'index'
  // ... return config for that entry
})
```

Or use a **build script** that invokes Vite 4 times:
```json
"build:lib": "node scripts/build.mjs"
```

```js
// scripts/build.mjs
import { build } from 'vite'

const entries = [
  { entry: 'src/index.ts', outDir: 'dist/lib' },
  { entry: 'src/core/hooks/index.ts', outDir: 'dist/hooks' },
  { entry: 'src/core/utils/index.ts', outDir: 'dist/utils' },
  { entry: 'src/core/ui/index.ts', outDir: 'dist/ui' },
]

for (const e of entries) {
  await build({ /* config for this entry */ })
}
```

**This is the recommended approach** because it preserves the existing output directory structure and `package.json` exports exactly as-is, minimizing downstream breaking changes.

#### Option C: Single entry + restructured exports
Use a single build with all entries and restructure `package.json` exports to match Vite's flat output. This would be a **breaking change** for consumers and is not recommended for a first migration.

### Recommendation: **Option B** — multiple build passes via a script calling `vite.build()` programmatically.

---

## 3. CJS + ESM Dual Output

### Current behavior
Each Rollup entry produces two outputs: `format: 'cjs'` and `format: 'es'`, into separate directories.

### Vite approach
Vite's `build.lib.formats` supports `['es', 'cjs']`. With `preserveModules: true`, each format gets its own output configuration:

```js
build: {
  rollupOptions: {
    output: [
      {
        dir: 'dist/lib/esm',
        format: 'es',
        preserveModules: true,
        sourcemap: true,
        exports: 'named',
        entryFileNames: '[name].js',
      },
      {
        dir: 'dist/lib/cjs',
        format: 'cjs',
        preserveModules: true,
        sourcemap: true,
        exports: 'named',
        entryFileNames: '[name].js',
      },
    ],
  },
}
```

**Note:** When using `build.rollupOptions.output` as an array, do NOT set `build.lib.formats` — it conflicts. Use the raw Rollup output array instead.

### CJS consideration
Vite 6+ is moving toward ESM-only for library mode. Vite 5 (currently installed at `^5.2.6`) still supports CJS output. If upgrading to Vite 6+ in the future, CJS generation may need the [`vite-plugin-dts`](https://github.com/nicepkg/vite-plugin-lib) approach or a separate build step. For now, Vite 5 handles this fine.

---

## 4. preserveModules Equivalent

### Current behavior
`preserveModules: true` in every Rollup output — the dist retains the full `src/` folder structure instead of bundling into a single file. This is critical for tree-shaking by consumers.

### Vite approach
Pass it through `build.rollupOptions.output`:

```js
output: {
  preserveModules: true,
  preserveModulesRoot: 'src', // strips the 'src/' prefix from output paths
}
```

**`preserveModulesRoot`** is key — without it, the output mirrors the full path from repo root (e.g., `dist/lib/esm/src/core/hooks/index.js`). Setting `preserveModulesRoot: 'src'` produces `dist/lib/esm/core/hooks/index.js` instead.

**Important:** The current package.json exports include `src/` in the paths (e.g., `./dist/lib/esm/src/index.js`). If we set `preserveModulesRoot: 'src'`, the output paths change and `package.json` exports must be updated. Two options:

1. **Don't set `preserveModulesRoot`** — output keeps `src/` prefix, exports stay the same.
2. **Set `preserveModulesRoot: 'src'`** — cleaner output, but update all export paths.

**Recommendation:** Set `preserveModulesRoot: 'src'` for cleaner output and update `package.json` exports accordingly. This is a **non-breaking change** for consumers (they import from `@e1011/es-kit/hooks`, not the internal dist paths).

---

## 5. Decorator Support (Critical Risk Area)

### Current setup
- `.babelrc` uses `@babel/plugin-proposal-decorators` with `{ "legacy": true }`
- `babel-plugin-transform-typescript-metadata` for `emitDecoratorMetadata` support
- `@babel/plugin-transform-class-properties` with `{ "loose": true }`
- These are required for `src/core/utils/decorators/convert.ts` which uses `@logger`, `@convertor`, and `@converting('invert')` decorators

### Vite's default: esbuild
Vite uses esbuild for TypeScript transformation. esbuild supports TC39 decorators (Stage 3, the new standard) but does **NOT** support legacy/experimental TypeScript decorators (`experimentalDecorators: true`). Since this project uses legacy decorators, esbuild alone won't work.

### Solution: Use `@vitejs/plugin-babel` or `vite-plugin-babel`

**Option A: `vite-plugin-babel` (recommended)**
```js
import babel from 'vite-plugin-babel'

plugins: [
  babel({
    babelConfig: {
      plugins: [
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
      ],
    },
  }),
]
```

**Option B: Disable esbuild, use Babel for everything**
```js
esbuild: false, // disable esbuild transforms
plugins: [
  babel({ /* full .babelrc config */ }),
]
```

This is slower but guarantees identical output to the current Rollup build.

### Additional Babel plugins to preserve
- `react-html-attrs` — transforms `class` → `className` in JSX. Vite's esbuild JSX transform doesn't do this, so Babel must handle JSX if this plugin is needed.
- `transform-remove-console` (production only) — must be conditionally applied.
- `@babel/plugin-transform-async-to-generator` — esbuild handles async/await natively for es2022 target, so this may be unnecessary. But keeping it ensures consistency.

### Recommendation
Use `vite-plugin-babel` with a targeted configuration. Let esbuild handle the bulk of transforms (faster), and use Babel only for files that need decorator/metadata support. This can be done by filtering:

```js
babel({
  filter: /\.tsx?$/,
  babelConfig: {
    // decorator plugins only
  },
})
```

However, since `react-html-attrs` and `transform-remove-console` affect more files, it may be simpler to use Babel for all `.ts/.tsx/.jsx` files in the library build.

---

## 6. SCSS / CSS Modules

### Current setup
```js
postcss({
  extract: true,    // CSS extracted to separate files
  modules: true,    // CSS Modules enabled
  use: ['sass'],    // SCSS preprocessing
})
```
Plus a separate `build:css` script: `sass src/core/ui/styles:dist/ui/styles`

The project has ~23 `.scss` files, mostly `.module.scss` (CSS Modules).

### Vite's built-in support
Vite has **native support** for:
- **SCSS**: Automatically preprocesses `.scss` files if `sass` is installed (it is: `^1.59.3`)
- **CSS Modules**: Any file named `*.module.scss` is treated as a CSS module automatically
- **CSS extraction**: In library mode, CSS is extracted by default (`build.cssCodeSplit`)

No additional plugins needed for basic SCSS + CSS Modules. This is a **simplification**.

### Configuration
```js
css: {
  modules: {
    localsConvention: 'camelCaseOnly', // or match current behavior
  },
  preprocessorOptions: {
    scss: {
      // any global SCSS variables or imports
    },
  },
},
```

### The `build:css` script
The current `build:css` script (`sass src/core/ui/styles:dist/ui/styles`) compiles standalone SCSS files (not imported by JS) into CSS for the `./css/*` export. This is **separate from the Vite build** and should remain as-is. Vite only processes CSS that is imported by JavaScript modules.

### Risk
- CSS extraction behavior might differ slightly (file naming, chunk splitting). Test that the `./css/*` export in `package.json` still resolves correctly.
- `rollup-plugin-postcss`'s `extract: true` creates one CSS file per entry. Vite may inline or split differently. Set `build.cssCodeSplit: true` to maintain per-chunk CSS files.

---

## 7. External Dependencies

### Current setup
```js
external: ['react', 'ramda', 'lodash-es', 'dayjs', 'core-js', 'sanitize-html']
```

### Vite equivalent
```js
build: {
  rollupOptions: {
    external: ['react', 'ramda', 'lodash-es', 'dayjs', 'core-js', 'sanitize-html'],
  },
}
```

Identical — this passes straight through to Rollup.

### Improvement opportunity
The current config hardcodes externals but doesn't include all `peerDependencies` (missing: `uuid`). Also, `dependencies` like `@popperjs/core`, `gsap`, `immer` are not externalized — they get bundled. Consider:

```js
external: [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
  // Also externalize sub-paths like 'lodash-es/merge'
  /^react(\/.*)?$/,
  /^ramda(\/.*)?$/,
  /^lodash-es(\/.*)?$/,
  /^dayjs(\/.*)?$/,
  /^core-js(\/.*)?$/,
],
```

Using regex patterns catches deep imports (e.g., `lodash-es/merge`, `core-js/modules/es.array.iterator`).

---

## 8. Source Maps

### Current setup
`sourcemap: true` on every Rollup output.

### Vite equivalent
```js
build: {
  sourcemap: true,
}
```

This generates `.js.map` files alongside each output file. Identical behavior.

---

## 9. Path Aliases

### Current tsconfig.json paths
```json
"baseUrl": "./src",
"paths": {
  "components": ["/core/ui/components/*"],
  "types": ["/types/*"],
  "ui": ["/core/ui/*"],
  "utils": ["/core/utils/*"],
  "constants": ["/core/constants/*"],
  "hooks": ["/core/hooks/*"],
  "core": ["/core/*"]
}
```

**Note:** These paths look potentially misconfigured (leading `/` without `*` glob in keys, and absolute-looking values). The current Rollup build comments out `rollup-plugin-tsconfig-paths` with a note saying "not good for result bundle, absolute path not transformed to relative inside bundle." This suggests path aliases may not actually be used in import statements, or they're resolved by the IDE/tsc only.

### Vite approach
Vite has built-in `resolve.alias`:
```js
resolve: {
  alias: {
    components: path.resolve(__dirname, 'src/core/ui/components'),
    types: path.resolve(__dirname, 'src/types'),
    ui: path.resolve(__dirname, 'src/core/ui'),
    utils: path.resolve(__dirname, 'src/core/utils'),
    constants: path.resolve(__dirname, 'src/core/constants'),
    hooks: path.resolve(__dirname, 'src/core/hooks'),
    core: path.resolve(__dirname, 'src/core'),
  },
}
```

Or use `vite-tsconfig-paths` plugin which reads tsconfig.json automatically:
```js
import tsconfigPaths from 'vite-tsconfig-paths'
plugins: [tsconfigPaths()]
```

### Recommendation
First, verify if any source files actually use these aliases in imports. If they do, use `vite-tsconfig-paths`. If not (likely given the commented-out Rollup plugin), skip this — it's a non-issue.

**Important for library output:** If aliases are used in source and resolved at build time, the output will contain resolved relative paths — which is correct. But if `preserveModules` is on, ensure the resolved paths don't break module boundaries.

---

## 10. Risks & Breaking Changes

### High Risk
| Risk | Impact | Mitigation |
|---|---|---|
| **Legacy decorator transformation** | Build failure or runtime breakage in `convert.ts` | Test decorator output carefully; keep Babel in pipeline |
| **Output path changes** | Breaks consumers if `package.json` exports don't match new output structure | Use `preserveModulesRoot` carefully; verify all export paths |
| **CSS extraction differences** | Missing or differently-named CSS files | Compare `dist/` output before and after migration |
| **`react-html-attrs` plugin** | `class` attributes in JSX won't be transformed to `className` without Babel | Must keep Babel for JSX files that rely on this |

### Medium Risk
| Risk | Impact | Mitigation |
|---|---|---|
| **`core-js` polyfill injection** | `@babel/preset-env` with `useBuiltIns: 'usage'` injects polyfills based on browserslist. Removing Babel means no auto-polyfilling | Since `core-js` is a peerDep, consumers handle polyfills. Verify this assumption |
| **`interop: 'auto'`** | Rollup's `interop: 'auto'` handles CJS/ESM interop quirks. Vite may use different defaults | Explicitly set `interop: 'auto'` in `rollupOptions.output` |
| **Minification differences** | Current uses `@rollup/plugin-terser`. Vite defaults to esbuild minification. Output may differ slightly | Set `build.minify: 'terser'` if exact parity is needed, or accept esbuild's faster minification |
| **Storybook compatibility** | Storybook already uses Vite, but sharing a `vite.config.ts` may cause conflicts | Storybook has its own Vite config via `viteFinal` — keep them separate |

### Low Risk
| Risk | Impact | Mitigation |
|---|---|---|
| **Watch mode** | `rollup --config --watch` becomes `vite build --watch` | Straightforward replacement |
| **Build speed** | May be slightly faster (esbuild parsing) or similar (still Rollup for output) | Benchmark |
| **Node resolve / CommonJS / JSON** | Built into Vite, no plugins needed | Simplification, low risk |

---

## 11. Proposed vite.config.ts

```ts
// vite.config.ts
import { defineConfig, type UserConfig } from 'vite'
import babel from 'vite-plugin-babel'
import { resolve } from 'path'

// Shared configuration factory
function createLibConfig(
  entry: string,
  outDir: string,
  name: string,
): UserConfig {
  return {
    plugins: [
      babel({
        filter: /\.[jt]sx?$/,
        babelConfig: {
          presets: [
            '@babel/preset-typescript',
            '@babel/preset-react',
          ],
          plugins: [
            'react-html-attrs',
            'babel-plugin-transform-typescript-metadata',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-transform-class-properties', { loose: true }],
            ['@babel/plugin-proposal-private-methods', { loose: true }],
            ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
            ...(process.env.NODE_ENV === 'production'
              ? ['transform-remove-console']
              : []),
          ],
        },
      }),
    ],

    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: true,
      minify: 'terser', // match current terser output; or use 'esbuild' for speed
      lib: {
        entry: resolve(__dirname, entry),
        name,
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
          /^uuid(\/.*)?$/,
          /^@popperjs\/core(\/.*)?$/,
          /^gsap(\/.*)?$/,
          /^immer(\/.*)?$/,
        ],
        output: [
          {
            dir: resolve(__dirname, outDir, 'esm'),
            format: 'es',
            preserveModules: true,
            preserveModulesRoot: 'src',
            sourcemap: true,
            exports: 'named',
            entryFileNames: '[name].js',
          },
          {
            dir: resolve(__dirname, outDir, 'cjs'),
            format: 'cjs',
            preserveModules: true,
            preserveModulesRoot: 'src',
            sourcemap: true,
            exports: 'named',
            entryFileNames: '[name].js',
            interop: 'auto',
          },
        ],
      },
    },

    // Disable esbuild transforms — let Babel handle everything
    // (needed for legacy decorators + react-html-attrs)
    esbuild: false,

    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
  }
}

// Default export for `vite build` — builds the main entry
// For multi-entry builds, use scripts/build.mjs
export default defineConfig(createLibConfig('src/index.ts', 'dist/lib', 'EsKit'))
```

### Build script: `scripts/build.mjs`

```js
// scripts/build.mjs
import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const entries = [
  { entry: 'src/index.ts', outDir: 'dist/lib', name: 'EsKit' },
  { entry: 'src/core/hooks/index.ts', outDir: 'dist/hooks', name: 'EsKitHooks' },
  { entry: 'src/core/utils/index.ts', outDir: 'dist/utils', name: 'EsKitUtils' },
  { entry: 'src/core/ui/index.ts', outDir: 'dist/ui', name: 'EsKitUI' },
]

for (const { entry, outDir, name } of entries) {
  console.log(`\nBuilding ${name} (${entry})...`)
  await build({
    configFile: resolve(__dirname, '..', 'vite.config.ts'),
    build: {
      outDir,
      lib: {
        entry: resolve(__dirname, '..', entry),
        name,
      },
    },
  })
}

console.log('\nAll builds complete.')
```

---

## 12. Package.json Changes

### Script updates
```jsonc
{
  "scripts": {
    // BEFORE
    "build:lib": "yarn tsc -b && BABEL_ENV=production NODE_ENV=production rollup --config --environment INCLUDE_DEPS,BUILD:production",
    "watch": "rollup --config --watch",

    // AFTER
    "build:lib": "yarn tsc -b && NODE_ENV=production node scripts/build.mjs",
    "watch": "vite build --watch",
  }
}
```

All other scripts (`build:css`, `build`, `clean`, etc.) remain unchanged.

### Export path updates (if using `preserveModulesRoot: 'src'`)

The `src/` segment would be stripped from output paths. Updated exports:

```jsonc
{
  "main": "dist/lib/cjs/index.js",
  "module": "dist/lib/esm/index.js",
  "types": "dist/types/src/index.d.ts",  // tsc output unchanged
  "exports": {
    ".": {
      "types": "./dist/types/src/index.d.ts",
      "import": "./dist/lib/esm/index.js",
      "require": "./dist/lib/cjs/index.js"
    },
    "./hooks": {
      "types": "./dist/types/src/core/hooks/index.d.ts",
      "import": "./dist/hooks/esm/core/hooks/index.js",
      "require": "./dist/hooks/cjs/core/hooks/index.js"
    },
    "./utils": {
      "types": "./dist/types/src/core/utils/index.d.ts",
      "import": "./dist/utils/esm/core/utils/index.js",
      "require": "./dist/utils/cjs/core/utils/index.js"
    },
    "./utils/ui": {
      "types": "./dist/types/src/core/utils/helpers/ui.d.ts",
      "import": "./dist/utils/esm/core/utils/helpers/ui.js",
      "require": "./dist/utils/cjs/core/utils/helpers/ui.js"
    },
    "./ui": {
      "types": "./dist/types/src/core/ui/index.d.ts",
      "import": "./dist/ui/esm/core/ui/index.js",
      "require": "./dist/ui/cjs/core/ui/index.js"
    },
    "./dist/*": "./dist/*",
    "./css/*": "./dist/ui/styles/*",
    "./package.json": "./package.json"
  }
}
```

**Note:** The `types` paths remain unchanged because `tsc` generates declarations independently — it's not affected by the Vite migration.

**Alternative:** If `preserveModulesRoot` is NOT set, the current export paths remain valid (they already include the `src/` segment).

---

## 13. Dependencies to Add/Remove

### Add
| Package | Purpose |
|---|---|
| `vite-plugin-babel` | Babel integration for legacy decorators + react-html-attrs |
| `vite-plugin-dts` (optional) | Generate `.d.ts` from Vite build (currently `tsc -b` handles this, so optional) |
| `vite-tsconfig-paths` (optional) | Only if path aliases are actually used in imports |
| `terser` (optional) | Only if using `minify: 'terser'` — Vite doesn't bundle terser by default |

### Remove (after migration is verified)
| Package | Reason |
|---|---|
| `@rollup/plugin-babel` | Replaced by `vite-plugin-babel` |
| `@rollup/plugin-commonjs` | Built into Vite |
| `@rollup/plugin-json` | Built into Vite |
| `@rollup/plugin-node-resolve` | Built into Vite |
| `@rollup/plugin-terser` | Replaced by Vite's built-in minification |
| `rollup` | Vite bundles its own Rollup |
| `rollup-plugin-postcss` | Vite handles CSS/SCSS natively |
| `rollup-plugin-peer-deps-external` | Not currently used (commented out) |
| `rollup-plugin-tsconfig-paths` | Not currently used (commented out) |

### Keep
| Package | Reason |
|---|---|
| `vite` (upgrade to latest 5.x) | Already a devDep at `^5.2.6` |
| `@babel/core` | Still needed for `vite-plugin-babel` |
| `@babel/preset-typescript` | Still needed |
| `@babel/preset-react` | Still needed |
| `@babel/plugin-proposal-decorators` | Still needed for legacy decorators |
| `@babel/plugin-transform-class-properties` | Still needed |
| `babel-plugin-transform-typescript-metadata` | Still needed for `emitDecoratorMetadata` |
| `babel-plugin-react-html-attrs` | Still needed |
| `babel-plugin-transform-remove-console` | Still needed for production builds |
| `sass` | Still needed (Vite uses it as a preprocessor) |

### Potentially removable Babel packages
| Package | Notes |
|---|---|
| `@babel/preset-env` | Only needed if you want polyfill injection / browserslist-based transforms. With `target: es2022`, likely unnecessary |
| `@babel/plugin-transform-async-to-generator` | es2022 supports async/await natively |
| `@babel/plugin-proposal-optional-chaining` | es2022 supports optional chaining natively |
| `@babel/plugin-syntax-optional-chaining` | Same as above |
| `@babel/plugin-proposal-private-methods` | May still be needed depending on class usage |
| `@babel/plugin-proposal-private-property-in-object` | May still be needed depending on class usage |
| `@babel/cli` | Not needed if Babel is only used via Vite plugin |

---

## 14. Migration Steps (Recommended Order)

1. **Create export snapshot tests** (pre-migration baseline)
   - Snapshot all exports from each entry point
   - Snapshot the `dist/` directory structure
   - This allows verifying the migration doesn't break public API

2. **Install new dependencies**
   ```bash
   yarn add -D vite-plugin-babel terser
   ```

3. **Create `vite.config.ts`** with the proposed configuration

4. **Create `scripts/build.mjs`** for multi-entry builds

5. **Update `package.json` scripts**
   - Change `build:lib` to use Vite
   - Keep old `rollup.config.mjs` for rollback

6. **Run the build and compare output**
   - Diff the `dist/` directory structure
   - Verify all `package.json` export paths resolve to existing files
   - Run export snapshot tests

7. **Test decorator functionality**
   - Build and verify `convert.ts` decorator output works at runtime
   - Run existing tests

8. **Test CSS output**
   - Verify SCSS modules compile correctly
   - Verify extracted CSS files are present
   - Verify `./css/*` export still works

9. **Test in a consuming project**
   - `yarn link` and import from each entry point
   - Verify tree-shaking works

10. **Clean up**
    - Remove `rollup.config.mjs`
    - Remove unused Rollup dependencies
    - Update `package.json` exports if using `preserveModulesRoot`

---

## 15. Decision Matrix

| Question | Recommendation | Alternative |
|---|---|---|
| Single vs. multiple build passes? | Multiple (Option B) | Single with restructured exports |
| Keep Babel or go esbuild-only? | Keep Babel (decorators require it) | esbuild-only if decorators are removed |
| `preserveModulesRoot` or keep `src/` prefix? | Set `preserveModulesRoot: 'src'` | Omit it and keep current export paths |
| Minify with terser or esbuild? | esbuild (faster, good enough) | terser (exact parity with current) |
| Remove `@babel/preset-env`? | Yes (es2022 target doesn't need it) | Keep if polyfill injection is desired |
| Keep `build:css` separate? | Yes (standalone SCSS compilation) | Integrate into Vite if possible |
