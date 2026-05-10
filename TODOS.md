# ES-Kit Library Audit & Improvement Plan

## A. Issues & Improvements for `@e1011/es-kit` (Main Library)

### A1. Package Exports & Distribution

- [ ] **Exports field uses deep `src/` paths in dist**: All export paths contain `src/` segments (e.g. `dist/lib/esm/src/index.js`). This leaks internal structure. With tsdown, output should flatten to `dist/esm/index.js`, `dist/cjs/index.js`, etc.
- [ ] **Missing `"type": "module"` field**: Package doesn't declare module type. ESM-first libraries should set `"type": "module"` and use `.cjs` extension for CommonJS fallback.
- [ ] **`"./dist/*"` wildcard export is a tree-shaking escape hatch**: Consumers can deep-import anything, bypassing the public API. Remove or restrict once subpath exports are correct.
- [ ] **`typesVersions` duplicates `exports` conditions**: With modern TypeScript (5+) and `"exports"` with `"types"` conditions, `typesVersions` is redundant. Keep only if supporting TS < 4.7.
- [ ] **No `./appState`, `./store`, `./peregrineMQ` subpath exports**: These are significant standalone modules but aren't independently importable without pulling in the entire `utils` entry.
- [ ] **`sideEffects: false` is correct** — keep it.

### A2. TypeScript Configuration

- [ ] **`moduleResolution: "node"` is outdated for libraries**: Should use `"bundler"` or `"node16"` for proper ESM resolution. `"node"` doesn't enforce `.js` extensions in imports and doesn't understand `exports` field correctly.
- [ ] **`allowImportingTsExtensions: true`** combined with `emitDeclarationOnly: true` works, but tsdown handles this natively — can simplify.
- [ ] **`baseUrl: "./src"` with path aliases**: Path aliases (`utils`, `hooks`, `core`, etc.) require runtime resolution (bundler plugin). These don't work for consumers and complicate builds. For the extracted library, prefer relative imports.
- [ ] **`strictPropertyInitialization: false`**: Weakens strict mode. Audit usages and fix where possible.
- [ ] **`experimentalDecorators` + `emitDecoratorMetadata`**: Legacy decorators. If not actively used in store/peregrineMQ, don't carry them to the new library. Prefer TC39 stage 3 decorators if needed.

### A3. Build Tooling — Migration to tsdown

- [ ] **Replace Vite build script (`scripts/build.mjs`) + rollup config with tsdown**: tsdown handles multi-entry, dual CJS/ESM, `.d.ts` generation, and tree-shaking out of the box.
- [ ] **Remove Babel entirely for the library build**: tsdown uses esbuild/SWC — Babel is unnecessary overhead. Keep only if Storybook or Jest requires it.
- [ ] **Drop `rollup.config.mjs`**: Redundant once tsdown is in place.
- [ ] **Consolidate 4 separate build entries into tsdown config**: `src/index.ts`, `src/core/hooks/index.ts`, `src/core/utils/index.ts`, `src/core/ui/index.ts` — tsdown handles this with `entry` array.

### A4. Dependencies

- [ ] **Heavy runtime deps for a utility library**: `gsap`, `sanitize-html`, `@popperjs/core`, `immer`, `ramda`, `lodash-es` — these should NOT be bundled. Verify they are all externalized correctly. For the extracted store/MQ library, none of these should be present.
- [ ] **`core-js` as dependency AND peer dependency**: Pick one. For a library, it should be a peer dependency or removed entirely (let the consumer polyfill).
- [ ] **`uuid` dependency in peregrineMQ**: `crypto.randomUUID()` is available in all modern runtimes (Node 19+, all browsers). For a new standalone library, replace `uuid` with `crypto.randomUUID()` to eliminate the dependency.

### A5. Tree-Shaking Concerns

- [ ] **Deep barrel re-exports chain**: `src/index.ts` → `src/core/index.ts` → `src/core/utils/index.ts` → `src/core/utils/appState/store/index.ts`. Every `export *` at each level pulls in the entire subtree. While `sideEffects: false` helps, bundlers still struggle with deeply nested barrels. The extracted library should have flat, explicit exports.
- [ ] **`peregrineMQInstance` singleton exported from barrel**: `peregrineMQ/index.ts` instantiates `new PeregrineMQ()` at module level. This is a side effect that defeats tree-shaking — if any consumer imports anything from `utils`, they get this instance allocated. Move to a separate `createDefaultInstance()` or a dedicated entry point.
- [ ] **React hooks re-exported from non-React entry points**: `hooks/index.ts` re-exports `useStore.react` and `usePeregrineMQ.react`. The `utils` barrel also re-exports store (which includes vanilla + React code). This means importing from `@e1011/es-kit/utils` pulls in React as a dependency even for vanilla JS consumers.

### A6. Type Safety Issues

- [ ] **`store.vanillajs.templates.ts` uses `@ts-ignore` (lines 62, 65)**: Replace with proper type narrowing.
- [ ] **`DefaultES = { [key: string]: any }`**: Use `Record<string, unknown>` instead of `any`.
- [ ] **`SelectedValueType<T>` is overly broad**: Union of `Partial<T> | Partial<keyof T> | string | number | boolean | undefined | string[] | number[]...` — this type essentially accepts anything, providing no real type safety for selectors. Needs redesign.
- [ ] **`ActionHandlerCaller<T>` uses `...args: unknown[]`**: Loses type information for action arguments. Should use generics or mapped types to infer action signatures.
- [ ] **`StoreWithActions` uses `{ [actionName: string]: ActionHandlerCaller<T> }`**: Action names aren't inferred from the `actions` argument passed to `createStore`. A mapped type over the actions keys would provide autocomplete and type safety.
- [ ] **`SET_STATE_MERGE` module-level mutable state**: Global mutable state (`canSetStateMerge`/`getSetStateMerge`) is shared across all store instances. This is a footgun in SSR, tests, and multi-tenant apps. Should be per-store config.
- [ ] **`PublishReturnType` is too loose**: `NON_EXISTENT_CHANNEL_TYPE | undefined | boolean | unknown | Array<...>` — the `unknown` swallows all other types. Needs discriminated union or generic.

### A7. API Design Issues

- [ ] **`store.setState` is async but most callers don't need it**: Awaiting all listeners serially in `setState` (line 182: `await listener(...)`) makes every state update async. This is unusual for synchronous state management and complicates `useSyncExternalStore` integration.
- [ ] **`useStore` hook passes `store.subscribe` directly to `useSyncExternalStore`**: But `store.subscribe` signature is `(listener, selector?, equalityFn?) => unsubscribe` while `useSyncExternalStore` expects `(callback) => unsubscribe`. This works by accident because extra params are optional, but it means the selector/equalityFn from the store's subscribe are never used in the React path — the hook re-selects via `getSnapshot` instead. This is confusing and the two selection mechanisms could conflict.
- [ ] **`Listener<T>` type extends `ListenerCallBack<T>` via intersection**: A function with extra properties attached. This is fragile — properties attached to function objects can be lost through wrapping/proxying.
- [ ] **`createStore` return type is `Store<T> | StoreWithActions<T>`**: This union forces consumers to narrow/cast. Should use overloads: `createStore(state)` returns `Store<T>`, `createStore(state, actions)` returns `StoreWithActions<T>`.

---

## B. Plan for Extracting `store` + `peregrineMQ` into a Standalone Library

### Phase 1: Project Setup

- [ ] **1.1** Create new repository/package (e.g. `@e1011/app-state` or `@e1011/tiny-store`)
- [ ] **1.2** Initialize with `tsdown` as the build tool from day one
  ```
  tsdown.config.ts:
    entry: {
      index: 'src/index.ts',           // everything
      store: 'src/store/index.ts',      // vanilla store only
      mq: 'src/mq/index.ts',           // peregrineMQ only
      react: 'src/react/index.ts',      // React bindings
    }
    format: ['esm', 'cjs']
    dts: true
    clean: true
    splitting: true
    treeshake: true
  ```
- [ ] **1.3** Set up `package.json` with proper exports map:
  ```json
  {
    "type": "module",
    "exports": {
      ".": { "types": "./dist/index.d.ts", "import": "./dist/index.mjs", "require": "./dist/index.cjs" },
      "./store": { "types": "./dist/store.d.ts", "import": "./dist/store.mjs", "require": "./dist/store.cjs" },
      "./mq": { "types": "./dist/mq.d.ts", "import": "./dist/mq.mjs", "require": "./dist/mq.cjs" },
      "./react": { "types": "./dist/react.d.ts", "import": "./dist/react.mjs", "require": "./dist/react.cjs" }
    },
    "sideEffects": false
  }
  ```
- [ ] **1.4** Configure `tsconfig.json`:
  - `target: "es2022"`, `module: "esnext"`, `moduleResolution: "bundler"`
  - `strict: true` (all sub-flags enabled, no exceptions)
  - No path aliases — relative imports only
  - `isolatedModules: true`, `verbatimModuleSyntax: true`
- [ ] **1.5** Set up Vitest (not Jest) — aligns with tsdown/Vite ecosystem, no Babel needed
- [ ] **1.6** Set up ESLint flat config + Prettier
- [ ] **1.7** Add `react` and `react-dom` as peer dependencies (optional peer deps — the vanilla entry should work without React)

### Phase 2: Migrate & Refactor Store

- [ ] **2.1** Move `store.vanillajs.ts` → `src/store/createStore.ts`, rename file (drop `.vanillajs` suffix)
- [ ] **2.2** Inline `isFunctionAsync` utility (2 lines) rather than importing from a separate helpers package
- [ ] **2.3** Replace module-level `SET_STATE_MERGE` with per-store config option:
  ```ts
  createStore<T>(initialState, { merge?: boolean, actions?, reducer? })
  ```
- [ ] **2.4** Fix `createStore` return type — use function overloads:
  ```ts
  function createStore<T>(state: T): Store<T>
  function createStore<T, A extends Actions<T>>(state: T, opts: { actions: A }): StoreWithActions<T, A>
  ```
- [ ] **2.5** Infer action names from the actions object using mapped types:
  ```ts
  type StoreWithActions<T, A extends Actions<T>> = Store<T> & {
    actions: { [K in keyof A]: ActionHandlerCaller<T, Parameters<A[K]>> }
  }
  ```
- [ ] **2.6** Make `setState` synchronous by default. Listener notification should be sync (matching `useSyncExternalStore` expectations). Provide `setStateAsync` or middleware for async listener support.
- [ ] **2.7** Redesign `Listener<T>` — don't attach properties to functions. Use a wrapper:
  ```ts
  type Subscription<T> = {
    callback: (state: Partial<T>) => void
    selector?: Selector<T>
    equalityFn?: EqualityFn<T>
    previousValue?: unknown
  }
  ```
- [ ] **2.8** Fix `SelectedValueType<T>` — make selector return type generic:
  ```ts
  type Selector<T, R = T> = (state: T) => R
  ```
- [ ] **2.9** Remove `@ts-ignore` in templates, fix type narrowing for `response.data`
- [ ] **2.10** Replace `DefaultES = { [key: string]: any }` with `Record<string, unknown>`
- [ ] **2.11** Move `store.vanillajs.templates.ts` → `src/store/createDataStore.ts`

### Phase 3: Migrate & Refactor PeregrineMQ

- [ ] **3.1** Move `peregrineMQ.ts` → `src/mq/PeregrineMQ.ts`
- [ ] **3.2** Move `peregrineMQ.types.ts` → `src/mq/types.ts`
- [ ] **3.3** Replace `uuid` dependency with `crypto.randomUUID()`:
  ```ts
  private id = id ?? crypto.randomUUID()
  ```
  Add fallback for environments without `crypto.randomUUID` if needed (React Native).
- [ ] **3.4** Fix `PublishReturnType` — remove `unknown` from the union, use proper discriminated types
- [ ] **3.5** Remove the singleton `peregrineMQInstance` from the barrel export — let consumers create their own instances. Provide a `createPeregrineMQ()` factory if desired.
- [ ] **3.6** Tighten `CallbackPayload` type — `Record<any, any>` should be `Record<string, unknown>`

### Phase 4: React Bindings (Separate Entry Point)

- [ ] **4.1** Move `useStore.react.ts` → `src/react/useStore.ts`
- [ ] **4.2** Move `usePeregrineMQ.react.ts` → `src/react/usePeregrineMQ.ts`
- [ ] **4.3** Fix `useStore` + `useSyncExternalStore` integration:
  - `store.subscribe` signature doesn't match `useSyncExternalStore`'s expected `subscribe(onStoreChange) => unsubscribe`. Create an adapter:
    ```ts
    const subscribe = (onStoreChange: () => void) => store.subscribe(onStoreChange)
    const getSnapshot = () => selector(store.getState())
    return useSyncExternalStore(subscribe, getSnapshot)
    ```
  - Support `getServerSnapshot` for SSR
- [ ] **4.4** Add `usePeregrineMQ` stability fix — `useCallback(callback, [callback])` is a no-op (deps = the function itself, always new). Should accept a stable callback or use `useRef`.
- [ ] **4.5** Export `src/react/index.ts` as the `./react` subpath — consumers who don't use React never import this entry.

### Phase 5: Testing & Quality

- [ ] **5.1** Migrate all existing tests from Jest to Vitest (minimal changes — API is nearly identical)
- [ ] **5.2** Port peregrineMQ tests: `*.spec.ts`, `*.perf.spec.ts`
- [ ] **5.3** Port store tests: `store.vanillajs.spec.ts`, `store.vanillajs.templates.spec.ts`, coverage specs
- [ ] **5.4** Port React component tests (`SimpleComponent.test.tsx`) — use `@testing-library/react`
- [ ] **5.5** Add tests for edge cases identified during refactor:
  - Store: concurrent `setState` calls, selector memoization, equality function behavior
  - MQ: nested channel publish order, prune during iteration, memory leaks from listener maps
- [ ] **5.6** Set up coverage thresholds (aim for 90%+ on core logic)
- [ ] **5.7** Add `publint` to CI — validates package.json exports are correct and resolvable
- [ ] **5.8** Add `arethetypeswrong` to CI — validates type declarations resolve correctly for all export conditions
- [ ] **5.9** Add `size-limit` — track bundle size per entry point

### Phase 6: Documentation & Release

- [ ] **6.1** Write README with usage examples for each entry point (store, mq, react)
- [ ] **6.2** Add JSDoc to all public API surfaces
- [ ] **6.3** Add CHANGELOG.md
- [ ] **6.4** Set up `changesets` or `semantic-release` for versioning
- [ ] **6.5** Publish to npm with provenance (`--provenance` flag)
- [ ] **6.6** Update `@e1011/es-kit` to depend on the new package, re-export for backwards compat, add deprecation notices on the old paths

### Phase 7: Back-port tsdown to es-kit (Main Library)

- [ ] **7.1** Replace `scripts/build.mjs` + `rollup.config.mjs` with `tsdown.config.ts`
- [ ] **7.2** Remove Babel from the library build pipeline (keep for Storybook/Jest if needed)
- [ ] **7.3** Update `package.json` exports to use flattened dist paths (no `src/` in output)
- [ ] **7.4** Set `"type": "module"` 
- [ ] **7.5** Update `tsconfig.json`: `moduleResolution: "bundler"`, remove path aliases from library build
- [ ] **7.6** Remove `typesVersions` if dropping TS < 4.7 support
- [ ] **7.7** Remove store/peregrineMQ source from es-kit, re-export from the new package
- [ ] **7.8** Validate tree-shaking with bundler analysis tools (e.g. `esbuild --analyze`, webpack bundle analyzer)

---

## Summary of Critical Issues (Priority Order)

1. **Singleton side effect in barrel** — breaks tree-shaking for all consumers
2. **React hooks mixed into vanilla entry points** — forces React dependency on non-React consumers  
3. **`useSyncExternalStore` subscribe signature mismatch** — works by accident, will break with stricter React versions
4. **Global mutable `SET_STATE_MERGE`** — shared state across all store instances
5. **Async `setState` with serial listener awaiting** — performance bottleneck, incompatible with sync external store contract
6. **`@ts-ignore` and `any` types** — type safety holes
7. **`uuid` dependency** — unnecessary for modern runtimes
8. **Deep barrel re-exports** — tree-shaking degradation
9. **`moduleResolution: "node"`** — doesn't validate ESM correctness
10. **No bundle size tracking** — regressions go unnoticed
