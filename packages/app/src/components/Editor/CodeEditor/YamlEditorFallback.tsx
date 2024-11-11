import {For, useContext} from 'solid-js';
import {EditorContext} from '../editor.context';
import * as fallbackStyles from '~/ui/components/Fallback.css';

export function YamlEditorFallback() {
  const editor = useContext(EditorContext);
  return (
    <div
      style={{
        'margin-top': '12px',
        display: 'flex',
        'flex-direction': 'column',
        gap: '4px',
      }}
    >
      <For each={editor?.source.split('\n')}>
        {(row, index) => {
          const match = row.match(/^(\s*)(\S.*)/)!;
          const leadingWhitespace = match ? match[1] : row;
          const text = match ? match[2] : null;

          return (
            <div
              style={{display: 'flex', 'flex-wrap': 'nowrap', height: '16px'}}
            >
              <span
                class={fallbackStyles.fallback}
                style={{
                  'margin-left': '24px',
                  'margin-right': '16px',
                  'font-size': '13.5px',
                  'line-height': '14px',
                }}
              >
                {String(index() + 1).padStart(3, '0')}
              </span>
              <span
                style={{
                  'font-size': '13.5px',
                  'line-height': '17px',
                  'white-space': 'pre-wrap',
                }}
              >
                {leadingWhitespace}
              </span>
              <span
                style={{
                  'font-size': '13.5px',
                  'line-height': '17px',
                  'white-space': 'nowrap',
                }}
                class={fallbackStyles.fallback}
              >
                {text || leadingWhitespace}
              </span>
            </div>
          );
        }}
      </For>
    </div>
  );
}
