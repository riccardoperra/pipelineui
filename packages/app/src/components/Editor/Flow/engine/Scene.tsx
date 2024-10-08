import {Entries} from '@solid-primitives/keyed';
import {Node} from './Node';
import {getNodeContext} from './store';
import {For} from 'solid-js';
import {Connection} from './Connectors/Connection';

export function FlowScene() {
  const {nodes, connections} = getNodeContext();

  return (
    <div style={{width: '100%', height: '100%'}}>
      <Entries of={nodes}>
        {(key, value) => <Node nodeId={key} value={value()} />}
      </Entries>

      <For each={connections}>
        {connection => <Connection connection={connection} />}
      </For>
    </div>
  );
}
