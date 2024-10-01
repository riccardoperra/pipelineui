import type {RouteSectionProps} from '@solidjs/router';
import {editorContainer} from './editor/editor-layout.css';

export default function EditorLayout(props: RouteSectionProps) {
  return <div class={editorContainer}>{props.children}</div>;
}
