import {Tooltip} from '@codemirror/view';
import {compile, run} from '@mdx-js/mdx';
import * as runtime from 'solid-js/h/jsx-runtime';
import {render} from 'solid-js/web';
import type {EditorState} from '@codemirror/state';
import type * as LSP from 'vscode-languageserver-protocol';
import {offsetToPos, posToOffset} from '../utils';
import {lspClient} from '../client';
import {lspDocumentUri} from '../languageServer';

export async function lspHoverTooltipPlugin(
  state: EditorState,
  pos: number,
): Promise<Tooltip | null> {
  const client = state.facet(lspClient);
  if (!client.ready || !client.capabilities.hoverProvider) {
    return null;
  }

  const position = offsetToPos(state.doc, pos);
  const hover = await client.textDocumentHover({
    textDocument: {uri: state.facet(lspDocumentUri)},
    position,
  });

  if (!hover) return null;

  pos = posToOffset(state.doc, position)!;
  let end!: number;
  if (hover.range) {
    pos = posToOffset(state.doc, hover.range.start)!;
    end = posToOffset(state.doc, hover.range.end)!;
  }
  if (pos === null) return null;
  const content = formatContents(hover.contents);

  const compiled = await compile(content, {
    outputFormat: 'function-body',
  });

  const {default: Content} = await run(compiled, {
    ...runtime,
    baseUrl: window.location.href,
  });

  return {
    pos,
    end,
    create() {
      const dom = document.createElement('div');
      render(() => Content({components: {}}), dom);
      return {
        dom,
      };
    },
    above: false,
  };
}

function formatContents(
  contents: LSP.MarkupContent | LSP.MarkedString | LSP.MarkedString[],
): string {
  if (Array.isArray(contents)) {
    return contents.map(c => formatContents(c) + '\n\n').join('');
  } else if (typeof contents === 'string') {
    return contents;
  } else {
    return contents.value;
  }
}
