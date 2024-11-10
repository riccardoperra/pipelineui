import {Entries} from '@solid-primitives/keyed';
import {createEffect, For} from 'solid-js';
import {Connection} from './Connectors/Connection';
import {Node} from './Node';
import {getNodeContext} from './store';

export function FlowScene() {
  const nodeContext = getNodeContext();

  return (
    <div style={{width: '100%', height: '100%'}} ref={nodeContext.setSceneRef}>
      <Entries of={nodeContext.nodes()}>
        {(key, value) => <Node nodeId={key} value={value()} />}
      </Entries>

      <For each={nodeContext.connections()}>
        {connection => <Connection connection={connection} />}
      </For>
    </div>
  );
}
