import {defineConfig, ViteCustomizableConfig} from '@solidjs/start/config';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import remarkFrontmatter from 'remark-frontmatter';
import {mergeConfig} from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
// @ts-expect-error missing types
import pkg from '@vinxi/plugin-mdx';
const {default: vinxiMdx} = pkg;

import {nodeTypes} from '@mdx-js/mdx';
import rehypeAutoLinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import {rehypeBlockquote} from './rehype-custom/rehypeCustomBlockquote';

const defaultConfig: ViteCustomizableConfig = {
  plugins: [viteTsConfigPaths(), customMdxConfig()],
  optimizeDeps: {
    exclude: ['@codemirror/state', '@codemirror/view'],
  },
  ssr: {
    noExternal: [
      'vscode-languageserver-protocol',
      'web-worker',
      '@open-rpc/client-js',
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
      routes: ['/about', '/about/supported-workflow-features'],
      crawlLinks: true,
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

function customMdxConfig() {
  return vinxiMdx.withImports({})({
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
  });
}

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
