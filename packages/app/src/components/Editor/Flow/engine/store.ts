import {type Accessor, createContext, JSX, useContext} from 'solid-js';
import type {FlowConnection, FlowNode, FlowNodeMap} from './types';

export interface RegisterNodeOptions {
  ref: HTMLDivElement;
  id: string;
}

export interface NodeStoreContextValue {
  selectedNodeId: Accessor<string | null>;
  registerNode: (data: RegisterNodeOptions) => () => void;
  nodes: FlowNodeMap;
  renderNode: (node: FlowNode) => JSX.Element;
  connections: FlowConnection[];
}

export const NodeStoreContext = createContext<NodeStoreContextValue>();

export function getNodeContext() {
  const context = useContext(NodeStoreContext);
  return context!;
}
