# @e1011/es-kit

[![npm version](https://img.shields.io/npm/v/@e1011/es-kit.svg)](https://www.npmjs.com/package/@e1011/es-kit)
[![License: MIT](https://img.shields.io/github/license/edgar0011/e1011-es-kit)](https://github.com/edgar0011/e1011-es-kit/blob/master/LICENSE)

A tree-shakeable utility library for **Vanilla JS** and **React** projects. Provides hooks, UI components, state management, and general-purpose helpers through granular entry points — import only what you need.

Built with **Vite** + **TypeScript**. ESM and CJS outputs with full type declarations.

## Installation

```sh
npm install @e1011/es-kit
# or
yarn add @e1011/es-kit
```

## Entry Points

The library is fully tree-shakeable with `"sideEffects": false` and exposes multiple entry points so you can import exactly what you need:

| Import path | Description | React required |
|---|---|---|
| `@e1011/es-kit` | Everything (hooks + utils + ui + constants) | Yes |
| `@e1011/es-kit/hooks` | React hooks (including store/MQ hooks) | Yes |
| `@e1011/es-kit/utils` | Utility functions, state management, helpers | No |
| `@e1011/es-kit/utils/ui` | UI helpers only (theme, classNames, noop, etc.) | No |
| `@e1011/es-kit/ui` | React UI components + style utilities | Yes |

### Vanilla JS usage

The `utils` entry point is fully React-free. Use it in any JavaScript project:

```js
import { observeThemePreference, setThemeClassNames } from '@e1011/es-kit/utils/ui'
import { createStore } from '@e1011/es-kit/utils'
import { debounce, memoize } from '@e1011/es-kit/utils'
import { PeregrineMQ } from '@e1011/es-kit/utils'
import { customElementDefine } from '@e1011/es-kit/utils'
```

React hooks for stores and message queues live in the `hooks` entry point:

```js
import { useStore, useStoreApi, usePeregrineMQ } from '@e1011/es-kit/hooks'
```

## Exports

### Hooks (`@e1011/es-kit/hooks`)

| Export | Description |
|---|---|
| `useApi` | Manages async API calls with loading/error/data states |
| `useToggle`, `useToggle2` | Boolean state with toggle/setTrue/setFalse controls |
| `useOutsideClick` | Detects clicks outside a referenced element |
| `useResize` | Observes element resize with debouncing |
| `useClassNames` | Memoized CSS class name composition |
| `useParseProps` | Separates `data-*` attributes from other props |
| `useThemePreference` | Observes system dark/light preference and applies theme |
| `useAnimation` | GSAP-powered animated number transitions |
| `useIntersectionObserver` | Observes element visibility in the viewport |
| `useTimeoutFn` | Managed `setTimeout` with ready/clear/set controls |
| `useStore`, `useStoreApi` | React hooks for subscribing to vanilla stores |
| `usePeregrineMQ` | React hook for PeregrineMQ pub/sub |

### Utils (`@e1011/es-kit/utils`)

All utils are **React-free** and safe to use in any JavaScript environment.

#### UI Helpers (`@e1011/es-kit/utils/ui`)

| Export | Description |
|---|---|
| `classNames` | Combine CSS class names, filtering falsy values |
| `parseProps` | Split props into `data-*` and rest categories |
| `generateId` | Token-based unique ID generator |
| `anchorClick` | Programmatic anchor navigation |
| `noop` | Event handler that prevents default and stops propagation |
| `mapSerReplacer` | JSON replacer for `Map` serialization |
| `getBaseThemes` | Read theme config from an element |
| `setThemeClassNames` | Set dark/light theme class names on an element |
| `switchColorTheme` | Switch between dark and light theme classes |
| `updateColorTheme` | Update theme based on current document state |
| `observeThemePreference` | Observe `prefers-color-scheme` and apply theme automatically |

#### Text & Value Operations

| Export | Description |
|---|---|
| `toLowerCase`, `toUpperCase` | Case conversion |
| `removeWhitespaces` | Strip all whitespace |
| `normalizeString` | Normalize unicode accents |
| `findStringInText` | Case/accent-insensitive search |
| `escapeRegExp` | Escape regex special characters |
| `truncateText` | Truncate text with indicator |
| `sanitizeId`, `sanitizePathId` | Sanitize strings for use as IDs or URL paths |
| `restrictNumberInLimits` | Clamp number between min/max |
| `numberOperation` | Arithmetic with optional limits |
| `incerementValue`, `decrementValue`, `setValue` | Number mutation with bounds |

#### Object & Array Operations

| Export | Description |
|---|---|
| `duplicatesInArray` | Find duplicate values |
| `formatJsonString` | Pretty-print JSON (with GraphQL option) |
| `formatObj`, `formatObj2` | Object-to-string formatting |
| `chunkArray` | Split array into chunks |
| `arrayToObjectTree` | Convert flat array to nested object tree |

#### Async & Timing

| Export | Description |
|---|---|
| `debounce` | Debounce function calls |
| `delay` | Promise-based delay |
| `memoize`, `memoizeComplex`, `memoizer` | Function memoization strategies |
| `cancelableSetInterval`, `cancelableSetTimeout` | Cancelable timers |

#### File & Validation

| Export | Description |
|---|---|
| `validateCSVFile`, `validateSDFFile`, `validateJSONFile` | File format validation |
| `parseCSVdata` | CSV string parsing |
| `cleanCsvLines` | Remove empty lines from CSV |
| `formatFilePath` | Extract filename from path |
| `isBirthNumberValid` | CZ/SK birth number validation |
| `emailMatcher` | Email domain matching |

#### Date & Time

| Export | Description |
|---|---|
| `getTimeFromNow`, `getTimeTo` | Relative time formatting |
| `getDateTime` | Date formatting with options |
| `dateRangeFormat` | Date range formatting |

#### Web Components

| Export | Description |
|---|---|
| `customElementDefine` / `ced` | Custom element define decorator |
| `createResolveAttribute`, `resolveAttributes` | Attribute resolvers for custom elements |

#### State Management

| Export | Description |
|---|---|
| `createStore` | Create a vanilla JS reactive store |
| `createDataStore` | Store with built-in data loading state |
| `PeregrineMQ` | Pub/sub message queue |
| `peregrineMQInstance` | Global shared PeregrineMQ instance |
| `TinyStateMachine` | Lightweight state machine |

#### Key Extraction

| Export | Description |
|---|---|
| `keyExtractor` | Memoized key extraction from objects (key, id, or index) |

### UI Components (`@e1011/es-kit/ui`)

#### Atoms
`Button`, `Text`, `Headline`, `Paragraph`, `Link`, `AnchorLink`, `Tag`, `Toggle`, `TextAndContent`, `Icon`, `IconBase`, `IconWC`

#### Molecules
`FlowLayout`, `PopoverLite`, `Tooltip`, `Popup`

#### Containers
`LayoutBox`, `LazyComponent`, `CollapsibleContainer`, `ResizableContainer`

#### Other
`Field`, `DividerLine`, `ErrorBoundary`

#### Style Utilities
`pxToRem`, `resolveStyleValue`, `toHex`, `convertHex`, `convertRGB`, `calculatePercColor`, `calculateColors`, `setDefaultFontSize`

### Constants

| Export | Description |
|---|---|
| `EventName` | Enum of DOM event names |
| `KeyCode` | Enum of keyboard key codes |
| `Alerts` | Enum of alert types (info, success, error, warning) |

## Development

```sh
yarn install       # install dependencies
yarn build         # full build (lint + typecheck + test + vite + sass)
yarn build:lib     # typecheck + vite build only
yarn test          # run tests (Jest)
yarn lint          # lint source (ESLint)
yarn storybook     # launch Storybook dev server
yarn watch         # vite build in watch mode
```

## Author

**Martin Weiser**
- GitHub: [@edgar0011](https://github.com/edgar0011)
- LinkedIn: [martinweiser](https://www.linkedin.com/in/martinweiser)

## License

[MIT](https://github.com/edgar0011/e1011-es-kit/blob/master/LICENSE)
