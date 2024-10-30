import {defineConfig, ViteCustomizableConfig} from '@solidjs/start/config';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import {mergeConfig} from 'vite';
import remarkFrontmatter from 'remark-frontmatter';
// @ts-expect-error missing types
import pkg from '@vinxi/plugin-mdx';
const {default: vinxiMdx} = pkg;

import rehypeRaw from 'rehype-raw';
import {nodeTypes} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import remarkExpressiveCode, {
  ExpressiveCodeTheme,
} from 'remark-expressive-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutoLinkHeadings from 'rehype-autolink-headings';

import {rehypeBlockquote} from './rehype-custom/rehypeCustomBlockquote';

const defaultConfig: ViteCustomizableConfig = {
  plugins: [
    viteTsConfigPaths(),
    vinxiMdx.withImports({})({
      define: {
        'import.meta.env': "'import.meta.env'",
      },
      jsx: true,
      jsxImportSource: 'solid-js',
      providerImportSource: 'solid-mdx',
      rehypePlugins: [
        [
          rehypeRaw,
          {
            passThrough: nodeTypes,
          },
        ],
        [rehypeBlockquote],
        [rehypeSlug],
        [
          rehypeAutoLinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: 'heading',
            },
          },
        ],
      ],
      remarkPlugins: [remarkFrontmatter, remarkGfm],
    }),
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
  esbuild: {
    exclude: ['solid-js', 'solid-js/web', '@codeui/kit'],
  },
};

export default defineConfig({
  middleware: './src/middleware.ts',
  server: {
    prerender: {
      routes: ['/about'],
    },
  },
  extensions: ['mdx', 'md', 'tsx'],
  vite: ({router}) => {
    switch (router) {
      case 'server': {
        return mergeConfig(defaultConfig, {
          plugins: [vanillaExtractServerPlugin()],
        });
      }
      case 'server-function': {
        return mergeConfig(defaultConfig, {
          plugins: [vanillaExtractServerFnsPlugin()],
        });
      }
      case 'client': {
        return mergeConfig(defaultConfig, {
          plugins: [vanillaExtractClientPlugin()],
        });
      }
    }
  },
});

function vanillaExtractServerPlugin() {
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
  return {
    ...vanillaExtractPlugin({
      incompatiblePlugins: [...solidSsrBundlePlugins],
    }),
    enforce: 'pre',
  };
}

function vanillaExtractServerFnsPlugin() {
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
  return {
    ...vanillaExtractPlugin({
      incompatiblePlugins: [...solidServerFnsPlugin],
    }),
    enforce: 'pre',
  };
}
function vanillaExtractClientPlugin() {
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
  return {
    ...vanillaExtractPlugin({
      incompatiblePlugins: [...solidClientBundlePlugin],
    }),
    enforce: 'pre',
  };
}
