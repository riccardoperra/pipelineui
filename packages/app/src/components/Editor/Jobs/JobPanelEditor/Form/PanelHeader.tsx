import * as styles from './EditorSidebar.css';
import {Component, JSX, Show} from 'solid-js';

interface PanelHeaderProps {
  label: string;
  rightContent?: JSX.Element;
}

export const PanelHeader: Component<PanelHeaderProps> = props => {
  return (
    <div class={styles.panelHeader}>
      <span>{props.label}</span>

      <Show when={props.rightContent}>
        {rightContent => (
          <div class={styles.panelHeaderRight}>{rightContent()}</div>
        )}
      </Show>
    </div>
  );
};
