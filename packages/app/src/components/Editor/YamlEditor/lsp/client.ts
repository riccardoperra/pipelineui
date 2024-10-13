import type {Transport} from '@open-rpc/client-js/build/transports/Transport';
import {
  Client,
  RequestManager,
  type WebSocketTransport,
} from '@open-rpc/client-js';
import type * as LSP from 'vscode-languageserver-protocol';
import {getCapabilities} from './capabilities';
import {Facet} from '@codemirror/state';

export interface LspClientOptions {
  rootUri: string | null;
  workspaceFolders: string[] | null;
  transport: Transport;
}

// https://microsoft.github.io/language-server-protocol/specifications/specification-current/

// Client to server then server to client
interface LSPRequestMap {
  initialize: [LSP.InitializeParams, LSP.InitializeResult];
  'textDocument/hover': [LSP.HoverParams, LSP.Hover];
  'textDocument/completion': [
    LSP.CompletionParams,
    LSP.CompletionItem[] | LSP.CompletionList | null,
  ];
}

// Client to server
interface LSPNotifyMap {
  initialized: LSP.InitializedParams;
  'textDocument/didChange': LSP.DidChangeTextDocumentParams;
  'textDocument/didOpen': LSP.DidOpenTextDocumentParams;
}

// Server to client
interface LSPEventMap {
  'textDocument/publishDiagnostics': LSP.PublishDiagnosticsParams;
}

export type Notification = {
  [key in keyof LSPEventMap]: {
    jsonrpc: '2.0';
    id?: null | undefined;
    method: key;
    params: LSPEventMap[key];
  };
}[keyof LSPEventMap];

export function request<K extends keyof LSPRequestMap>(
  client: Client,
  method: K,
  params: LSPRequestMap[K][0],
  timeout: number,
): Promise<LSPRequestMap[K][1]> {
  return client.request({method, params}, timeout);
}

export const lspClient = Facet.define<
  ReturnType<typeof createLspClient>,
  ReturnType<typeof createLspClient>
>({
  combine: value => value.reduce((_, v) => v, null as any),
});

export const lspLanguage = Facet.define<string, string>({
  combine: value => value.reduce((_, v) => v, ''),
});

export function createLspClient(options: LspClientOptions) {
  const {transport, workspaceFolders, rootUri} = options;

  const requestManager = new RequestManager([transport]);
  const client = new Client(requestManager);

  let ready = false;
  let capabilities: LSP.ServerCapabilities;

  const notify = <K extends keyof LSPNotifyMap>(
    method: K,
    params: LSPNotifyMap[K],
  ): Promise<LSPNotifyMap[K]> => {
    return client.notify({method, params});
  };

  const close = () => client.close();

  const wsTransport = transport as WebSocketTransport;
  if (wsTransport && wsTransport.connection) {
    wsTransport.connection.addEventListener('message', message => {
      const data = JSON.parse(message.data as string);
      if (data.method && data.id) {
        wsTransport.connection.send(
          JSON.stringify({
            jsonrpc: '2.0',
            id: data.id,
            result: null,
          }),
        );
      }
    });
  }

  return {
    requestManager,
    client,
    close,
    get capabilities() {
      return capabilities;
    },
    get ready() {
      return ready;
    },
    async initialize() {
      const result = await request(
        client,
        'initialize',
        {
          capabilities: getCapabilities(),
          initializationOptions: {},
          processId: null,
          rootUri: null,
          workspaceFolders: null,
        },
        10_000 * 3,
      );

      capabilities = result.capabilities;
      ready = true;
      notify('initialized', {});
    },
    textDocumentDidOpen(params: LSP.DidOpenTextDocumentParams) {
      return notify('textDocument/didOpen', params);
    },
    textDocumentDidChange(params: LSP.DidChangeTextDocumentParams) {
      return notify('textDocument/didChange', params);
    },
    async textDocumentHover(params: LSP.HoverParams) {
      return await request(client, 'textDocument/hover', params, 10_000);
    },
  };
}
