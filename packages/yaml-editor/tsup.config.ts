import {defineConfig} from 'tsup';

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    outDir: 'dist',
  },
  {
    entry: ['./src/lsp/index.ts'],
    format: ['esm'],
    outDir: 'dist/lsp',
    treeshake: 'smallest',
    noExternal: [/vscode-languageserver-protocol/],
    dts: true,
  },
]);
