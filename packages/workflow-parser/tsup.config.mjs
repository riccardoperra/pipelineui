import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  shims: false,
  target: 'es2022',
  keepNames: true,
  treeshake: false,
  platform: 'browser',
  cjsInterop: false,
  legacyOutput: false,
  bundle: true,
  splitting: true,
  minify: false,
  noExternal: [/@actions/],
  dts: true,
});
