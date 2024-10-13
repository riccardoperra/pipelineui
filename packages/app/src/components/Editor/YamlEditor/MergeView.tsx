import {MergeView, unifiedMergeView} from '@codemirror/merge';
import {yaml} from '@codemirror/lang-yaml';
import {fleetDark} from './fleetTheme';
import {EditorView, keymap} from '@codemirror/view';
import {
  createEffect,
  createRenderEffect,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from 'solid-js';
import {EditorState} from '@codemirror/state';
import {search, searchKeymap} from '@codemirror/search';

const theme = EditorView.theme({
  '&': {
    fontSize: '13px',
  },
});

let doc = `one
two
three
four
five`;

export interface YamlMergeViewProps {
  leftSource: string;
  rightSource: string;
}

export function YamlMergeView(props: YamlMergeViewProps) {
  let ref!: HTMLDivElement;
  const [mergeView, setMergeView] = createSignal<MergeView | null>();

  createEffect(() => {
    if (!ref) return;

    const mergeView = new MergeView({
      a: {
        doc: props.leftSource,
        extensions: [
          yaml(),
          fleetDark,
          theme,
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          [keymap.of(searchKeymap), search({})],
        ],
      },
      gutter: true,
      b: {
        doc: props.rightSource,
        extensions: [
          yaml(),
          fleetDark,
          theme,
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          [keymap.of(searchKeymap), search({})],
        ],
      },
      parent: ref,
    });

    setMergeView(mergeView);

    onCleanup(() => {
      mergeView.destroy();
    });
  });

  return (
    <div
      style={{width: '100%', height: '100%', overflow: 'auto'}}
      ref={ref}
    ></div>
  );
}
