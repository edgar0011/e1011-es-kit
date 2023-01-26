import babelPlugin from 'rollup-plugin-babel'
import resolvePlugin from 'rollup-plugin-node-resolve'
import commonjsPlugin from 'rollup-plugin-commonjs'
import jsonPlugin from 'rollup-plugin-json'

// import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const commonConfig = {
  plugins: [
    resolvePlugin({
      extensions,
    }),
    babelPlugin({
      extensions,
      exclude: [
        'node_modules/**',
      ],
    }),
    jsonPlugin(),
    commonjsPlugin(),
  ],
  external: [
    'react',
    'ramda',
    'lodash-es',
    'i18next',
    'core-js',
    'react-i18next',
    'styled-components',
    'sanitize-html',
  ],
  watch: {
    include: 'src/**',
  },
}

export default [
  {
    input: ['src/index.ts'],
    output: [
      {
        dir: 'dist/lib/cjs',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
      },
      {
        dir: 'dist/lib/esm',
        format: 'es',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    ...commonConfig,
  },
  {
    input: ['src/core/hooks/index.ts'],
    output: [
      {
        dir: 'dist/hooks',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
      },
      {
        dir: 'dist/hooks/esm',
        format: 'es',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    ...commonConfig,
  },
  {
    input: ['src/core/utils/index.ts'],
    output: [
      {
        dir: 'dist/utils',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
      },
      {
        dir: 'dist/utils/esm',
        format: 'es',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    ...commonConfig,
  },
  {
    input: ['src/core/ui/index.ts'],
    output: [
      {
        dir: 'dist/ui',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
      },
      {
        dir: 'dist/ui/esm',
        format: 'es',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    ...commonConfig,
  },
]
