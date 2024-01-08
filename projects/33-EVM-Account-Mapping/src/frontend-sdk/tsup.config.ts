import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { defineConfig } from 'tsup'

export default defineConfig({
  esbuildPlugins: [
    NodeModulesPolyfillPlugin(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
    }),
  ],
  entry: ['src/index.ts'],
  outDir: './dist/',
  dts: true,
  format: ['cjs', 'esm'],
  ignoreWatch: ['*.test.ts'],
  target: 'node18',
  clean: true,
  platform: 'browser',
  noExternal: ['randombytes', 'browserify-cipher'],
  metafile: true,
})
