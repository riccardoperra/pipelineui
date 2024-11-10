import {createStore} from 'solid-js/store';
import {NodeStoreContext, type RegisterNodeOptions} from './store';
import {createEffect, createSignal, JSX} from 'solid-js';
import type {FlowConnection, FlowNode, FlowNodeMap} from './types';
import {FlowScene} from './Scene';

export interface FlowRendererProps {
  nodes: FlowNodeMap;
  connections: FlowConnection[];
  renderNode: (node: FlowNode) => JSX.Element;
  width: number;
  height: number;
}

export function FlowRenderer(props: FlowRendererProps) {
  const [nodes, setNodes] = createSignal<FlowNodeMap>({...props.nodes});

  const [connections, setConnections] = createSignal<FlowConnection[]>(
    props.connections,
  );

  const [mountedNodes, setMountedNodes] = createStore<
    Record<
      string,
      {
        ref: HTMLElement;
      }
    >
  >();

  const [selectedNodeId, setSelectedNodeId] = createSignal<string | null>(null);

  const [scene, setScene] = createSignal<HTMLDivElement | null>(null);

  createEffect(() => {
    setNodes(props.nodes);
    setConnections(props.connections);
  });

  const registerNode = (data: RegisterNodeOptions) => {
    setMountedNodes(data.id, {ref: data.ref});
    return () => {
      setMountedNodes(store => {
        delete store[data.id];
        return {...store};
      });
    };
  };

  return (
    <NodeStoreContext.Provider
      value={{
        selectedNodeId,
        nodes,
        connections,
        renderNode: props.renderNode,
        registerNode,
        sceneRef: scene,
        setSceneRef: setScene,
      }}
    >
      <FlowScene />
    </NodeStoreContext.Provider>
  );
}
