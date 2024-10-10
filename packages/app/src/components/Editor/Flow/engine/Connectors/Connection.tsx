import type {FlowConnection} from '../types';
import {createMemo} from 'solid-js';
import {getSmoothStepPath, Position} from '@xyflow/system';
import {getNodeContext} from '../store';
import {BaseEdge} from '../Edge/BaseEdge';
import {connection} from './Connection.css';

export interface ConnectionProps {
  connection: FlowConnection;
}

export function Connection(props: ConnectionProps) {
  const {nodes, sceneRef} = getNodeContext();

  const sourceNode = () => nodes[props.connection.source.nodeId];

  const targetNode = () => nodes[props.connection.target.nodeId];

  const path = createMemo(() => {
    const startX = sourceNode().position.x + 250;
    const startY = sourceNode().position.y + 25;
    const endX = targetNode().position.x;
    const endY = targetNode().position.y + 25;
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: startX,
      sourceY: startY,
      sourcePosition: Position.Right,
      targetX: endX,
      targetY: endY,
      targetPosition: Position.Left,
      // borderRadius: pathOptions?.borderRadius,
      // offset: pathOptions?.offset,
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
          id={`connection-${props.connection.source.connectorId}_${props.connection.target.connectorId}`}
          path={path()?.path}
          style={props.style}
          markerEnd={props.markerEnd}
          markerStart={props.markerStart}
          interactionWidth={props.interactionWidth}
        />
      </svg>
    </div>
  );
}
