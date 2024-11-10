import {mergeClasses} from '@codeui/kit';
import * as styles from './BaseEdge.css';
import {JSX} from 'solid-js';

export interface BaseEdgeProps {
  path: string;
  id: string;
}

export function BaseEdge(props: BaseEdgeProps) {
  return (
    <>
      <path
        id={props.id}
        d={props.path}
        fill="none"
        class={mergeClasses(styles.baseEdge)}
      />
    </>
  );
}
