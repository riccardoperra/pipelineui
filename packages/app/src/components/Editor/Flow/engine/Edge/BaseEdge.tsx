import {mergeClasses} from '@codeui/kit';
import * as styles from './BaseEdge.css';
import {JSX} from 'solid-js';

export interface BaseEdgeProps {
  path: string;
  markerEnd: string;
  markerStart: string;
  interactionWidth: number;
  id: string;
  style: JSX.CSSProperties;
}

export function BaseEdge(props: BaseEdgeProps) {
  return (
    <>
      <path
        id={props.id}
        style={props.style}
        d={props.path}
        fill="none"
        class={mergeClasses(styles.baseEdge)}
        marker-end={props.markerEnd}
        marker-start={props.markerStart}
      />
      {(props.interactionWidth ?? 20) && (
        <path
          d={props.path}
          fill="none"
          stroke-opacity={0}
          stroke-width={props.interactionWidth ?? 20}
          class="react-flow__edge-interaction"
        />
      )}
    </>
  );
}
