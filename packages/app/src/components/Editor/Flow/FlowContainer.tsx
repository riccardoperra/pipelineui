import {flowContainer} from './FlowContainer.css';
import type {ParentProps} from 'solid-js';

export function FlowContainer(props: ParentProps) {
  return <div class={flowContainer}>{props.children}</div>;
}
