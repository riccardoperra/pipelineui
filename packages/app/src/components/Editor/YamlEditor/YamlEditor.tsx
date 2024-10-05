import {createCodeMirror, createEditorControlledValue} from 'solid-codemirror';
import {fleetDark} from './fleetTheme';
import {yaml} from '@codemirror/lang-yaml';
import {EditorView} from '@codemirror/view';

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
  createEditorControlledValue(editorView, () => props.code ?? '');

  return <div ref={setRef} style={{height: '100%', width: '100%'}}></div>;
}
