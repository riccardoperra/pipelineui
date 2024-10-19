import {
  diagnosticIcon,
  diagnosticList,
  diagnosticListItem,
  panel,
} from './DiagnosticPanel.css';
import {provideState} from 'statebuilder';
import {EditorStore} from '#editor-store/editor.store';
import {For} from 'solid-js';
import {Icon} from '#ui/components/Icon';
import type {Diagnostic} from 'vscode-languageserver-protocol';

const diagnosticIconSeverity = {
  1: 'error',
  2: 'warning',
  3: 'info',
  4: 'help',
} as const;

export function DiagnosticPanel() {
  const editorStore = provideState(EditorStore);

  const diagnostics = () => editorStore.get.diagnostics;

  const onRowClick = (diagnostic: Diagnostic) => {
    const view = editorStore.editorView();
    if (!view) {
      return;
    }
    const line = view.state.doc.line(diagnostic.range.start.line + 1);
    const endLine = view.state.doc.line(diagnostic.range.end.line + 1);
    view.dispatch({
      selection: {
        head: line.from + diagnostic.range.start.character,
        anchor: endLine.from + diagnostic.range.end.character,
      },
      scrollIntoView: true,
    });
  };

  return (
    <div class={panel}>
      <ul class={diagnosticList}>
        <For
          each={diagnostics()}
          fallback={<>Your workflow file doesn't have any error</>}
        >
          {diagnostic => (
            <button
              class={diagnosticListItem}
              onClick={() => onRowClick(diagnostic)}
            >
              <Icon
                data-severity={diagnosticIconSeverity[diagnostic.severity ?? 1]}
                class={diagnosticIcon}
                name={diagnosticIconSeverity[diagnostic.severity ?? 1]}
              />
              <span>{diagnostic.message}</span>

              <span>-</span>

              <span>
                Row {diagnostic.range.start.line + 1}, Line{' '}
                {diagnostic.range.start.character}
              </span>
            </button>
          )}
        </For>
      </ul>
    </div>
  );
}
