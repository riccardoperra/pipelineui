import {getSmoothStepPath, Position} from '@xyflow/system';
import {createMemo, Show} from 'solid-js';
import {BaseEdge} from '../Edge/BaseEdge';
import {getNodeContext} from '../store';
import type {
  FlowConnection,
  FlowNode,
} from '../../../components/Editor/Flow/engine/types';
import {connection} from './Connection.css';

export interface ConnectionProps {
  connection: FlowConnection;
}

function ConnectionNode(props: {source: FlowNode; target: FlowNode}) {
  const path = createMemo(() => {
    const startX = props.source.position.x + 250;
    const startY = props.source.position.y + 25;
    const endX = props.target.position.x;
    const endY = props.target.position.y + 25;
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: startX,
      sourceY: startY,
      sourcePosition: Position.Right,
      targetX: endX,
      targetY: endY,
      targetPosition: Position.Left,
    });
    return {
      path,
      labelX,
      labelY,
      offsetX,
      offsetY,
    };
  });

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'inline-size': '100%',
        'block-size': '100%',
        'user-select': 'none',
      }}
    >
      <svg class={connection}>
        <BaseEdge
          id={`connection-${props.source.id}_${props.target.id}`}
          path={path()?.path}
        />
      </svg>
    </div>
  );
}

export function Connection(props: ConnectionProps) {
  const {nodes, sceneRef} = getNodeContext();

  const sourceNode = createMemo(() => {
    return nodes()[props.connection.source.nodeId];
  });

  const targetNode = createMemo(() => {
    return nodes()[props.connection.target.nodeId];
  });

  return (
    <Show when={sourceNode() && targetNode()}>
      <ConnectionNode source={sourceNode()} target={targetNode()} />
    </Show>
  );
}
