import {FlowComponent, JSXElement, Show} from 'solid-js';
import * as styles from './EditorSidebar.css';
import {panelRowContent} from './EditorSidebar.css';

interface PanelRowProps {}

export const FullWidthPanelRow: FlowComponent = props => (
  <div class={panelRowContent({threeColumn: true})}>{props.children}</div>
);

export const TwoColumnPanelRow: FlowComponent = props => (
  <div class={panelRowContent({twoColumn: true})}>{props.children}</div>
);

export const PanelRow: FlowComponent<PanelRowProps> = props => {
  return <div class={styles.panelRow}>{props.children}</div>;
};
