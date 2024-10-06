import {defineConfig} from '@solidjs/start/config';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  vite: {
    plugins: [vanillaExtractPlugin(), viteTsConfigPaths()],
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
