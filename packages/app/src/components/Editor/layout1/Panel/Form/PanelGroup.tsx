import * as styles from './Form.css';
import type {FlowProps} from 'solid-js';

export function PanelGroup(
  props: FlowProps<{
    noGap?: boolean;
  }>,
) {
  return (
    <div
      class={styles.panelForm({
        noGap: props.noGap ?? true,
      })}
    >
      {props.children}
    </div>
  );
}
