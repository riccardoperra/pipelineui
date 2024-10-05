import * as styles from './EditorSidebar.css';
import {Component} from 'solid-js';

interface PanelHeaderProps {
  label: string;
}

export const PanelHeader: Component<PanelHeaderProps> = props => {
  return (
    <div class={styles.panelHeader}>
      <span>{props.label}</span>
    </div>
  );
};
