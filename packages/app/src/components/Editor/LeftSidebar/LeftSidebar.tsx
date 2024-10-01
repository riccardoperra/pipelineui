import * as styles from './LeftSidebar.css';

export function LeftSidebar() {
  return (
    <div
      class={styles.sidebar({
        position: 'left',
      })}
    >
      My content
    </div>
  );
}
