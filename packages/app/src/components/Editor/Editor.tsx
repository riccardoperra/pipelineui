import {LeftSidebar} from './LeftSidebar/LeftSidebar';
import * as styles from './Editor.css';

export function Editor() {
  return (
    <div class={styles.editor}>
      <LeftSidebar />

      <div class={styles.canvas}>Content</div>
      <LeftSidebar />
    </div>
  );
}
