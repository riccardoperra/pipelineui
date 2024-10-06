import * as styles from './Resizable.css';
import Resizable from '@corvu/resizable';

export interface EditorResizableHandlerProps {
  hidden: boolean;
  position: 'left' | 'right';
}

export function EditorResizableHandler(props: EditorResizableHandlerProps) {
  return (
    <Resizable.Handle
      class={styles.resizableHandlerContainer({
        hidden: props.hidden,
        position: props.position,
      })}
      aria-label="Resize Handle"
    >
      <div class={styles.resizableHandlers} />
    </Resizable.Handle>
  );
}
