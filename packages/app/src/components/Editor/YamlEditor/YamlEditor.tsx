import {
  createCodeMirror,
  createEditorControlledValue,
  createLazyCompartmentExtension,
} from 'solid-codemirror';
import {fleetDark} from './fleetTheme';
import {yaml} from '@codemirror/lang-yaml';
import {EditorView, keymap} from '@codemirror/view';
import {search, searchKeymap} from '@codemirror/search';
import PostMessageWorkerTransport from './lsp/protocol';
import {lintGutter, lintKeymap} from '@codemirror/lint';
import {defaultKeymap} from '@codemirror/commands';
import {languageServerPlugin} from './lsp/plugin';
import {githubLanguageServerTransport} from './lsp/plugins/githubLanguageServerTransport';

interface YamlEditorProps {
  code: string;
  setCode: (code: string) => void;
}

export function YamlEditor(props: YamlEditorProps) {
  const {
    editorView,
    ref: setRef,
    createExtension,
  } = createCodeMirror({
    onValueChange: props.setCode,
  });
  createExtension(() => fleetDark);
  createExtension(() => yaml());
  createExtension(() =>
    EditorView.theme({
      '&': {
        fontSize: '13px',
      },
    }),
  );
  createExtension(() => [keymap.of(searchKeymap), search({})]);
  createEditorControlledValue(editorView, () => props.code ?? '');
  createExtension(() => lintGutter());

  createExtension(() => [
    keymap.of([...defaultKeymap, ...searchKeymap, ...lintKeymap]),
  ]);

  createLazyCompartmentExtension(async () => {
    return languageServerPlugin({
      transport: await githubLanguageServerTransport(),
      workspaceFolders: ['file:///'],
      documentUri: `file:///action.yaml`,
      languageId: 'yaml',
    });
  }, editorView);

  return <div ref={setRef} style={{height: '100%', width: '100%'}}></div>;
}
