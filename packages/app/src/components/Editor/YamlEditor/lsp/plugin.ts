import {hoverTooltip, ViewPlugin} from '@codemirror/view';
import {lspHoverTooltipPlugin} from './plugins/hoverTooltip';
import {lspDiagnostics} from './plugins/diagnostics';
import {createLspClient, lspClient, lspLanguage} from './client';
import {languageServer, lspDocumentUri} from './languageServer';
import type {Transport} from '@open-rpc/client-js/build/transports/Transport';

export interface LanguageServerPluginOptions {
  transport: Transport;
  workspaceFolders: string[] | null;
  documentUri: string;
  languageId: string;
}

export function languageServerPlugin(options: LanguageServerPluginOptions) {
  const client = createLspClient({
    transport: options.transport,
    rootUri: null,
    workspaceFolders: options.workspaceFolders,
  });
  return [
    lspClient.of(client),
    lspDocumentUri.of(options.documentUri),
    lspLanguage.of(options.languageId),
    hoverTooltip((view, pos) => lspHoverTooltipPlugin(view.state, pos)),
    lspDiagnostics(),
    ViewPlugin.define(view =>
      languageServer({
        view,
      }),
    ),
  ];
}
