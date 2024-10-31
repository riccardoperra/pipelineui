import {
  createCodeMirror,
  createEditorControlledValue,
  createLazyCompartmentExtension,
} from 'solid-codemirror';
import {fleetDark} from './fleetTheme';
import {yaml} from '@codemirror/lang-yaml';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view';
import {search, searchKeymap} from '@codemirror/search';
import {lintGutter, lintKeymap} from '@codemirror/lint';
import {defaultKeymap} from '@codemirror/commands';
import {languageServerPlugin} from './lsp/plugin';
import {githubLanguageServerTransport} from './lsp/plugins/githubLanguageServerTransport';
import {diagnosticState} from './lsp/plugins/diagnostics';
import type {Diagnostic} from 'vscode-languageserver-protocol';
import {createEffect, onCleanup, onMount} from 'solid-js';
import {editor} from '../Editor.css';
import {SelectionRange} from '@codemirror/state';

interface YamlEditorProps {
  code: string;
  setCode: (code: string) => void;

  onMount: (editorView: EditorView) => void;
  onDiagnosticsChange?: (diagnostic: Diagnostic[]) => void;
}

export function YamlEditor(props: YamlEditorProps) {
  const {
    editorView,
    ref: setRef,
    createExtension,
  } = createCodeMirror({
    onValueChange: props.setCode,
  });

  onMount(() => {
    props.onMount(editorView());
  });

  createExtension(() => fleetDark);
  createExtension(() => yaml());
  createExtension(() =>
    EditorView.theme({
      '&': {
        fontSize: '13px',
        height: '100%',
      },
    }),
  );
  createExtension(() => lintGutter());

  createExtension(() => [
    keymap.of([...defaultKeymap, ...searchKeymap, ...lintKeymap]),
    search(),
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
  ]);

  createLazyCompartmentExtension(async () => {
    return [
      languageServerPlugin({
        transport: await githubLanguageServerTransport(),
        workspaceFolders: ['file:///'],
        documentUri: `file:///action.yaml`,
        languageId: 'yaml',
      }),
      EditorView.updateListener.from(diagnosticState, value => {
        props.onDiagnosticsChange?.(value);
        return () => {};
      }),
    ];
  }, editorView);

  createEffect(() => {
    const code = props.code;
    const view = editorView();
    if (!view) {
      return;
    }
    const to = view.state.doc.length;
    // TODO: should restore selection
    editorView().dispatch({
      changes: {
        from: 0,
        to: to,
        insert: code ?? '',
      },
    });
  });

  return <div ref={setRef} style={{height: '100%', width: '100%'}}></div>;
}
