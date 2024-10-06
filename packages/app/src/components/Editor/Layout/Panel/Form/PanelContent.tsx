import * as styles from './EditorSidebar.css';
import {Component, type FlowProps, JSX, type ParentProps, Show} from 'solid-js';
import {panelContent} from './EditorSidebar.css';

interface PanelContentProps {}

export const PanelContent: Component<
  ParentProps<PanelContentProps>
> = props => {
  return <div class={styles.panelContent}>{props.children}</div>;
};
