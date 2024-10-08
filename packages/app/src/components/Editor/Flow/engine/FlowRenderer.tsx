import {createStore} from 'solid-js/store';
import {NodeStoreContext, type RegisterNodeOptions} from './store';
import {createEffect, createSignal, JSX} from 'solid-js';
import type {FlowConnection, FlowNode, FlowNodeMap} from './types';
import {FlowScene} from './Scene';
import {trackStore} from '@solid-primitives/deep';

export interface FlowRendererProps {
  nodes: FlowNodeMap;
  connections: FlowConnection[];
  renderNode: (node: FlowNode) => JSX.Element;
}

export function FlowRenderer(props: FlowRendererProps) {
  const [nodes, setNodes] = createStore<FlowNodeMap>({...props.nodes});
  const [connections, setConnections] = createStore<FlowConnection[]>(
    props.connections,
  );

  const [selectedNodeId, setSelectedNodeId] = createSignal<string | null>(null);

  createEffect(() => {
    setNodes(props.nodes);
  });

  const registerNode = (data: RegisterNodeOptions) => {
    // setNodes(id, '');
  };

  return (
    <NodeStoreContext.Provider
      value={{
        selectedNodeId,
        nodes,
        connections,
        renderNode: props.renderNode,
        registerNode,
      }}
    >
      <FlowScene />
    </NodeStoreContext.Provider>
  );
}
