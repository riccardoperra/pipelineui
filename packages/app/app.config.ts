import {defineConfig} from '@solidjs/start/config';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  middleware: './src/middleware.ts',
  vite: {
    plugins: [
      vanillaExtractPlugin({
        // TODO: this is a workaround
        unstable_mode: 'transform',
      }),
      viteTsConfigPaths(),
    ],
    optimizeDeps: {
      exclude: [
        '@codemirror/state',
        '@codemirror/view',
        '@pipelineui/workflow-parser',
        'yaml',
        'web-worker',
      ],
    },
  },
});
