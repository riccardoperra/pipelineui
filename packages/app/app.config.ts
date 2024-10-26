import {defineConfig, ViteCustomizableConfig} from '@solidjs/start/config';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import {mergeConfig} from 'vite';

const defaultConfig: ViteCustomizableConfig = {
  plugins: [viteTsConfigPaths()],
  optimizeDeps: {
    exclude: [
      '@codemirror/state',
      '@codemirror/view',
      '@pipelineui/workflow-parser',
      'yaml',
      'web-worker',
    ],
  },
  esbuild: {
    exclude: ['solid-js', 'solid-js/web', '@codeui/kit']
  }
};

const solidServerFnsPlugin = [
  'vinxi:routes',
  'react-rsc:handler',
  'tree-shake',
  'vinxi:manifest',
  'vinxi:inject-client-runtime',
  'virtual:http',
  'vinxi:config:appType',
  'vinxi:config:handler:base',
  'vinxi:config:user',
  'vite-server-references',
  'server-functions:build',
  // 'solid',
  'vinxi:config:app-server',
  'vinxi:build:router:config',
];

const solidClientBundlePlugin = [
  'vinxi:routes',
  'build:browser',
  'tree-shake',
  'vinxi:manifest',
  'vinxi:inject-client-runtime',
  'virtual:http',
  'vinxi:config:appType',
  'vinxi:config:user',
  'vite-server-references',
  'references-manifest',
  // 'solid',
  'vinxi:config:app-client',
  'vinxi:build:router:config',
];

// Solid SSR Bundle plugins
const solidSsrBundlePlugins = [
  'vinxi:routes',
  'react-rsc:handler',
  'tree-shake',
  'vinxi:manifest',
  'vinxi:inject-client-runtime',
  'virtual:http',
  'vinxi:config:appType',
  'vinxi:config:handler:base',
  'vinxi:config:user',
  'vite-server-references',
  // 'solid',
  'vinxi:config:app-server',
  'vinxi:build:router:config',
];

export default defineConfig({
  middleware: './src/middleware.ts',
  vite: ({router}) => {
    switch (router) {
      case 'server': {
        return mergeConfig(defaultConfig, {
          plugins: [
            vanillaExtractPlugin({
              incompatiblePlugins: [...solidSsrBundlePlugins],
            }),
          ],
        });
      }
      case 'server-function': {
        return mergeConfig(defaultConfig, {
          plugins: [
            vanillaExtractPlugin({
              incompatiblePlugins: [...solidServerFnsPlugin],
            }),
          ],
        });
      }
      case 'client': {
        return mergeConfig(defaultConfig, {
          plugins: [
            vanillaExtractPlugin({
              incompatiblePlugins: [...solidClientBundlePlugin],
            }),
          ],
        });
      }
    }
  },
});
