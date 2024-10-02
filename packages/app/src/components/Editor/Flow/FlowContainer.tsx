import * as styles from './FlowContainer.css';
import {onMount, type ParentProps} from 'solid-js';
import {provideState} from 'statebuilder';
import {CanvasStore} from '../store/canvas.store';

export function FlowContainer(props: ParentProps) {
  const canvasStore = provideState(CanvasStore);
  let ref!: HTMLDivElement;

  onMount(() => {
    canvasStore.connectRef(ref);
  });

  return (
    <div class={styles.flowContainer} ref={ref}>
      {props.children}
    </div>
  );
}
