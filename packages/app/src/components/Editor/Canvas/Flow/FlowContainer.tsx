import * as styles from './FlowContainer.css';
import {onMount, type ParentProps} from 'solid-js';
import {provideState} from 'statebuilder';
import {CanvasStore} from '~/store/editor/canvas.store';

export function FlowContainer(
  props: ParentProps<{
    size: {
      width: number;
      height: number;
    };
  }>,
) {
  const canvasStore = provideState(CanvasStore);
  let ref!: HTMLDivElement;

  onMount(() => {
    canvasStore.connectRef(ref);
  });

  return (
    <div
      class={styles.flowContainer}
      style={{
        width: `${props.size.width}px`,
        height: `${props.size.height}px`,
      }}
    >
      <div class={styles.flowCanvas} ref={ref}>
        {props.children}
      </div>
    </div>
  );
}
