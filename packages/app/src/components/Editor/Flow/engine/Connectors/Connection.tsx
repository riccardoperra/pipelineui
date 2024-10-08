import type {FlowConnection} from '../types';
import {createMemo} from 'solid-js';
import {getSmoothStepPath, Position} from '@xyflow/system';
import {getNodeContext} from '../store';
import {BaseEdge} from '../../Edge/BaseEdge';
import {connection} from '../Connection.css';

export interface ConnectionProps {
  connection: FlowConnection;
}

export function Connection(props: ConnectionProps) {
  const {nodes} = getNodeContext();

  const sourceNode = () => nodes[props.connection.source.nodeId];

  const targetNode = () => nodes[props.connection.target.nodeId];

  const path = createMemo(() => {
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: sourceNode().position.x + 250,
      sourceY: sourceNode().position.y + 25,
      sourcePosition: Position.Right,
      targetX: targetNode().position.x,
      targetY: targetNode().position.y + 25,
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
    <svg class={connection}>
      <BaseEdge
        id={`connection-${props.connection.source.connectorId}_${props.connection.target.connectorId}`}
        path={path().path}
        style={props.style}
        markerEnd={props.markerEnd}
        markerStart={props.markerStart}
        interactionWidth={props.interactionWidth}
      />
    </svg>
  );
}
