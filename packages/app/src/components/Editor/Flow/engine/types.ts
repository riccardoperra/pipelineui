export interface FlowNodePoint {
  x: number;
  y: number;
}

export type FlowNodeMap = Record<string, FlowNode>;

export interface FlowNode {
  id: string;
  data: {
    [key: string]: unknown;
  };
  position: FlowNodePoint;
}

export interface FlowDataConnector {
  readonly nodeId: string;
  readonly connectorType: 'input' | 'output';
  readonly connectorId: string;
}

export interface FlowConnection {
  source: FlowDataConnector;
  target: FlowDataConnector;
}
