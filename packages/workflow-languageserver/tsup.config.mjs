import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  target: 'es2022',
  keepNames: true,
  treeshake: false,
  platform: 'browser',
  noExternal: [/@actions/],
  dts: true,
  esbuildOptions(options, context) {
    (options.alias ??= {}).global = 'globalThis';
  },
});
