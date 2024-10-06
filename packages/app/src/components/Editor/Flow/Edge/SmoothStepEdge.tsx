import {BaseEdge} from './BaseEdge';
import {EdgePosition, getSmoothStepPath} from '@xyflow/system';
import {createMemo} from 'solid-js';

/**
 * Helper type for edge components that get exported by the library
 * @public
 */
export type EdgeComponentProps = EdgePosition & {
  id?: EdgeProps['id'];
  markerStart?: EdgeProps['markerStart'];
  markerEnd?: EdgeProps['markerEnd'];
  interactionWidth?: EdgeProps['interactionWidth'];
  style?: EdgeProps['style'];
  sourceHandleId?: EdgeProps['sourceHandleId'];
  targetHandleId?: EdgeProps['targetHandleId'];
};

export function SmoothStep(props: EdgeComponentProps) {
  const path = createMemo(() => {
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      sourcePosition: props.sourcePosition,
      targetX: props.targetX,
      targetY: props.targetY,
      targetPosition: props.targetPosition,
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
    <BaseEdge
      id={'base-edge-id'}
      path={path().path}
      style={props.style}
      markerEnd={props.markerEnd}
      markerStart={props.markerStart}
      interactionWidth={props.interactionWidth}
    />
  );
}
