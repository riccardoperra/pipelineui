import {
  type Accessor,
  createContext,
  JSX,
  type Setter,
  useContext,
} from 'solid-js';
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
  sceneRef: Accessor<HTMLDivElement>;
  setSceneRef: Setter<HTMLDivElement>;
  connections: FlowConnection[];
  width: number;
  height: number;
}

export const NodeStoreContext = createContext<NodeStoreContextValue>();

export function getNodeContext() {
  const context = useContext(NodeStoreContext);
  return context!;
}
