import {
  createCodeMirror,
  createEditorControlledValue,
  createLazyCompartmentExtension,
} from 'solid-codemirror';
import {fleetDark} from './fleetTheme';
import {yaml} from '@codemirror/lang-yaml';
import {EditorView, keymap, lineNumbers} from '@codemirror/view';
import {search, searchKeymap} from '@codemirror/search';
import {lintGutter, lintKeymap} from '@codemirror/lint';
import {defaultKeymap} from '@codemirror/commands';
import {languageServerPlugin} from './lsp/plugin';
import {githubLanguageServerTransport} from './lsp/plugins/githubLanguageServerTransport';
import {diagnosticState} from './lsp/plugins/diagnostics';
import type {Diagnostic} from 'vscode-languageserver-protocol';
import {createEffect, onMount} from 'solid-js';

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

  createEffect(() => {
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

  createEditorControlledValue(editorView, () => props.code ?? '');
  return <div ref={setRef} style={{height: '100%', width: '100%'}}></div>;
}
