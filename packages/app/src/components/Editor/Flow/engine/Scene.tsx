import {Entries} from '@solid-primitives/keyed';
import {Node} from './Node';
import {getNodeContext} from './store';

export function FlowScene() {
  const {nodes} = getNodeContext();

  return (
    <div style={{width: '100%', height: '100%'}}>
      <Entries of={nodes}>
        {(key, value) => <Node nodeId={key} value={value()} />}
      </Entries>
    </div>
  );
}
