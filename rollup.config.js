import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'

const { name } = require('./package.json')

const ext = format =>
  format == 'dts' ? 'd.ts' : format == 'cjs' ? 'js' : 'mjs'

const bundle = (input, name, format) => ({
  input,
  output: {
    file: `dist/${name}.${ext(format)}`,
    format: format == 'cjs' ? 'cjs' : 'es',
    sourcemap: format != 'dts',
    sourcemapExcludeSources: true,
  },
  plugins:
    format == 'dts'
      ? [dts()]
      : [
          // resolve({
          //   extensions: ['.ts', '.tsx', '.d.ts'],
          // }),
          esbuild(),
        ],
  external: id => !/^[./]/.test(id),
})

const bundles = (input, name) => [
  bundle(input, name, 'es'),
  bundle(input, name, 'cjs'),
  bundle(input, name, 'dts'),
]

export default [
  ...bundles('src/index.ts', name),
  ...bundles('src/targets/web/index.ts', 'web'),
  ...bundles('src/targets/native/index.ts', 'native'),
]
