import * as styles2 from '../Edge/core/NodeComponent.css';
import {mergeClasses} from '@codeui/kit';
import {mergeRefs} from '@kobalte/utils';
import {createMemo, onCleanup, onMount, type Ref} from 'solid-js';
import {getNodeContext} from './store';
import type {FlowNode} from './types';
import {baseNode, nodeVars} from './Node/Node.css';
import {assignVars} from '@vanilla-extract/css';
import {assignInlineVars} from '@vanilla-extract/dynamic';

export interface NodeProps {
  nodeId: string;
  value: FlowNode;
  ref?: Ref<HTMLDivElement>;
}

export function Node(props: NodeProps) {
  let internalRef!: HTMLDivElement;
  const context = getNodeContext();

  onMount(() => {
    const unsubscribe = context.registerNode({
      id: props.nodeId,
      ref: internalRef,
    });
    onCleanup(() => unsubscribe());
  });

  const node = createMemo(() => context.renderNode(props.value));

  return (
    <div
      ref={mergeRefs(internalRef, props.ref)}
      data-node={true}
      class={baseNode}
      data-selected={props.selected ? '' : null}
      style={assignInlineVars({
        [nodeVars.transformX]: `${props.value.position.x}px`,
        [nodeVars.transformY]: `${props.value.position.y}px`,
      })}
      // onMouseDown={props.onMouseDown}
      // use:clickOutside={() => props.onClickOutside()}
    >
      {node()}
    </div>
  );
}
