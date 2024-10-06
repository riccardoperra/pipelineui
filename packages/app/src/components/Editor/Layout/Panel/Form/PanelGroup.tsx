import * as styles from './Form.css';
import type {FlowProps} from 'solid-js';

export function PanelGroup(props: FlowProps) {
  return <div class={styles.panelForm}>{props.children}</div>;
}
