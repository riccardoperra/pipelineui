import * as styles from './LeftSidebar.css';
import type {FlowProps} from 'solid-js';

export function LeftSidebar(props: FlowProps) {
  return (
    <div
      class={styles.sidebar({
        position: 'left',
      })}
    >
      {props.children}
    </div>
  );
}
