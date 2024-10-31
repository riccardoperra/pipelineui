import {Facet} from '@codemirror/state';
import {
  type EditorView,
  type PluginValue,
  type ViewUpdate,
} from '@codemirror/view';
import {diagnosticsEffect} from './plugins/diagnostics';
import {lspClient, lspLanguage, Notification} from './client';
import {debounce} from './utils';

export const lspDocumentUri = Facet.define<string, string>({
  combine: value => value.reduce((acc, _) => _, ''),
});

export interface LanguageServerPluginOptions {
  view: EditorView;
}

export function languageServer(
  options: LanguageServerPluginOptions,
): PluginValue {
  const {view} = options;
  const {state} = view;

  const lsp = state.facet(lspClient);
  const languageId = state.facet(lspLanguage);
  const uri = state.facet(lspDocumentUri);
  const text = state.doc.toString();

  let authorityVersion = 0;

  lsp.initialize().then(() => {
    return lsp.textDocumentDidOpen({
      textDocument: {
        uri,
        languageId,
        text,
        version: authorityVersion,
      },
    });
  });

  const debouncedUpdate = debounce(() => {
    if (!lsp.ready) {
      return;
    }
    lsp
      .textDocumentDidChange({
        textDocument: {
          uri,
          version: authorityVersion++,
        },
        contentChanges: [
          // TODO: should pass from codemirror changeset?
          {
            text: view.state.doc.toString(),
          },
        ],
      })
      .catch(e => console.error(e));
  }, 500);

  lsp.client.onNotification(data => {
    const notification = data as unknown as Notification;
    switch (notification.method) {
      case 'textDocument/publishDiagnostics': {
        if (notification.params.uri !== uri) return;
        view.dispatch({
          effects: diagnosticsEffect.of(notification.params),
        });
        break;
      }
    }
  });

  return {
    update({docChanged}: ViewUpdate) {
      if (!docChanged) {
        return;
      }
      debouncedUpdate();
    },
    destroy() {
      lsp.close();
    },
  };
}
