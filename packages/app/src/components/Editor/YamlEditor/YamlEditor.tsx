import {defaultKeymap} from '@codemirror/commands';
import {yaml} from '@codemirror/lang-yaml';
import {lintGutter, lintKeymap} from '@codemirror/lint';
import {search, searchKeymap} from '@codemirror/search';
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import {
  createWorkerProtocol,
  diagnosticState,
  languageServerPlugin,
  VscodeLspDiagnostic,
} from '@pipelineui/yaml-editor/language-server';
import {
  createCodeMirror,
  createLazyCompartmentExtension,
} from 'solid-codemirror';
import {createEffect, onMount} from 'solid-js';
import {fleetDark} from './fleetTheme';

const githubLanguageServerTransport = () =>
  createWorkerProtocol(() =>
    import('./serviceWorker?worker').then(
      ({default: LanguageServer}) => new LanguageServer(),
    ),
  );

interface YamlEditorProps {
  code: string;
  setCode: (code: string) => void;

  onMount: (editorView: EditorView) => void;
  onDiagnosticsChange?: (diagnostic: VscodeLspDiagnostic[]) => void;
}

export function YamlEditor(props: YamlEditorProps) {
  const {
    editorView,
    ref: setRef,
    createExtension,
  } = createCodeMirror({
    onValueChange: props.setCode,
  });

  createExtension(() => [
    fleetDark,
    yaml(),
    EditorView.theme({
      '&': {
        fontSize: '13px',
        height: '100%',
      },
    }),
    lintGutter(),
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
    props.onMount(editorView());
  });

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
