import * as styles from './LeftSidebar.css';
import type {FlowProps} from 'solid-js';

export function EditorSidebar(
  props: FlowProps<{
    position: 'left' | 'right';
  }>,
) {
  return (
    <div class={styles.sidebarWrapper}>
      <div
        class={styles.sidebar({
          position: props.position,
        })}
      >
        {props.children}
      </div>
    </div>
  );
}
