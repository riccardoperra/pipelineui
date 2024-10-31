import type {ClientCapabilities} from 'vscode-languageserver-protocol/lib/common/protocol';

export function getCapabilities(): ClientCapabilities {
  return {
    textDocument: {
      hover: {
        dynamicRegistration: true,
        contentFormat: ['plaintext', 'markdown'],
      },
      moniker: {},
      synchronization: {
        dynamicRegistration: true,
        willSave: false,
        didSave: false,
        willSaveWaitUntil: false,
      },
      // completion: {
      //   dynamicRegistration: true,
      //   completionItem: {
      //     snippetSupport: false,
      //     commitCharactersSupport: true,
      //     documentationFormat: ['plaintext', 'markdown'],
      //     deprecatedSupport: false,
      //     preselectSupport: false,
      //   },
      //   contextSupport: false,
      // },
      signatureHelp: {
        dynamicRegistration: true,
        signatureInformation: {
          documentationFormat: ['plaintext', 'markdown'],
        },
      },
      declaration: {
        dynamicRegistration: true,
        linkSupport: true,
      },
      definition: {
        dynamicRegistration: true,
        linkSupport: true,
      },
      typeDefinition: {
        dynamicRegistration: true,
        linkSupport: true,
      },
      implementation: {
        dynamicRegistration: true,
        linkSupport: true,
      },
    },
    workspace: {
      didChangeConfiguration: {
        dynamicRegistration: true,
      },
    },
  };
}
