import {defaultKeymap} from '@codemirror/commands';
import {lintGutter} from '@codemirror/lint';
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import {
  createCodeMirror,
  createEditorControlledValue,
  createLazyCompartmentExtension,
} from 'solid-codemirror';
import {fleetDark} from './fleetTheme';

interface ExpressionEditorProps {
  code: string;
  setCode?: (code: string) => void;

  onMount?: (editorView: EditorView) => void;

  showLineNumbers?: boolean;
}

export function ExpressionEditor(props: ExpressionEditorProps) {
  const {
    editorView,
    ref: setRef,
    createExtension,
  } = createCodeMirror({
    onValueChange: code => {
      props.setCode?.(code);
    },
  });

  createEditorControlledValue(editorView, () => props.code);
  createExtension(() => [
    fleetDark,
    EditorView.theme({
      '&': {
        fontSize: '13px',
        height: '100%',
      },
    }),
    keymap.of([...defaultKeymap]),
    highlightActiveLine(),
    highlightActiveLineGutter(),
  ]);
  createExtension(() => (props.showLineNumbers ? lineNumbers() : undefined));

  createLazyCompartmentExtension(
    () =>
      Promise.all([
        import('@codemirror/language'),
        import('@codemirror/legacy-modes/mode/shell'),
      ]).then(([{StreamLanguage}, {shell}]) => {
        return StreamLanguage.define(shell);
      }),
    editorView,
  );

  return (
    <div
      ref={setRef}
      style={{
        height: '100%',
        width: '100%',
        'border-radius': '8px',
        overflow: 'hidden',
      }}
    ></div>
  );
}
