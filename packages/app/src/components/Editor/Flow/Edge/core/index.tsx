import {Component, createEffect, createSignal} from 'solid-js';
import {createStore, produce} from 'solid-js/store';
import EdgesBoard from './EdgesBoard';
import NodesBoard from './NodesBoard';
import styles from './styles.module.css';

interface Position {
  x: number;
  y: number;
}

interface Vector {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface NodeData {
  id: string;
  data: {label?: string; content: any};
  inputs: number;
  outputs: number;
  edgesIn: string[];
  edgesOut: string[];
}

interface EdgesNodes {
  [id: string]: {
    outNodeId: string;
    outputIndex: number;
    inNodeId: string;
    inputIndex: number;
  };
}

interface EdgesPositions {
  [id: string]: Vector;
}

interface EdgesActive {
  [id: string]: boolean;
}

export interface NodeProps {
  id: string;
  position: {x: number; y: number};
  data: {label?: string; content: any};
  inputs: number;
  outputs: number;
  actions?: {delete: boolean};
}

export interface EdgeProps {
  id: string;
  sourceNode: string;
  targetNode: string;
  sourceOutput: number;
  targetInput: number;
}

interface Props {
  nodes: NodeProps[];
  edges: EdgeProps[];
  onNodesChange: (newNodes: NodeProps[]) => void;
  onEdgesChange: (newEdges: EdgeProps[]) => void;
}

function getEdgeId(
  nodeOutId: string,
  outputIndex: number,
  nodeInId: string,
  inputIndex: number,
) {
  return `edge_${nodeOutId}:${outputIndex}_${nodeInId}:${inputIndex}`;
}

function getInitialEdges(nodes: NodeProps[]): {
  initEdgesNodes: EdgesNodes;
  initEdgesPositions: EdgesPositions;
  initEdgesActives: EdgesActive;
} {
  const initEdgesNodes: EdgesNodes = {};
  const initEdgesPositions: EdgesPositions = {};
  const initEdgesActives: EdgesActive = {};

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j) {
        const nodeI = nodes[i];
        const nodeJ = nodes[j];

        for (let x = 0; x < nodeI.outputs; x++) {
          for (let y = 0; y < nodeJ.inputs; y++) {
            const edgeId = getEdgeId(nodeI.id, x, nodeJ.id, y);
            initEdgesPositions[edgeId] = {x0: 0, y0: 0, x1: 0, y1: 0};
            initEdgesActives[edgeId] = false;
            initEdgesNodes[edgeId] = {
              outNodeId: nodeI.id,
              outputIndex: x,
              inNodeId: nodeJ.id,
              inputIndex: y,
            };
          }
        }
      }
    }
  }
  return {initEdgesNodes, initEdgesPositions, initEdgesActives};
}

function getInitialNodes(
  nodes: NodeProps[],
  edges: EdgeProps[],
): {
  initNodesPositions: Position[];
  initNodesData: NodeData[];
  initNodesOffsets: {
    inputs: {offset: Position}[];
    outputs: {offset: Position}[];
  }[];
} {
  const initNodesPositions = nodes.map((node: NodeProps) => node.position);
  const initNodesData = nodes.map((node: NodeProps) => {
    return {
      edgesIn: edges
        .map((edge: EdgeProps) => {
          if (edge.targetNode === node.id)
            return getEdgeId(
              edge.sourceNode,
              edge.sourceOutput,
              edge.targetNode,
              edge.targetInput,
            );
          return 'null';
        })
        .filter((elem: string) => elem !== 'null'),
      edgesOut: edges
        .map((edge: EdgeProps) => {
          if (edge.sourceNode === node.id)
            return getEdgeId(
              edge.sourceNode,
              edge.sourceOutput,
              edge.targetNode,
              edge.targetInput,
            );
          return 'null';
        })
        .filter((elem: string) => elem !== 'null'),
      ...node,
    };
  });
  const initNodesOffsets = nodes.map((node: NodeProps) => {
    return {
      inputs: [...Array(node.inputs)].map(() => {
        return {offset: {x: 0, y: 0}};
      }),
      outputs: [...Array(node.outputs)].map(() => {
        return {offset: {x: 0, y: 0}};
      }),
    };
  });

  return {initNodesPositions, initNodesData, initNodesOffsets};
}

const FlowChart: Component<Props> = (props: Props) => {
  // EDGES
  const {initEdgesNodes, initEdgesPositions, initEdgesActives} =
    getInitialEdges(props.nodes);
  const [edgesNodes, setEdgesNodes] = createSignal<EdgesNodes>(initEdgesNodes);
  const [edgesPositions, setEdgesPositions] =
    createSignal<EdgesPositions>(initEdgesPositions);
  const [edgesActives, setEdgesActives] =
    createSignal<EdgesActive>(initEdgesActives);

  // NODES
  const {initNodesPositions, initNodesData, initNodesOffsets} = getInitialNodes(
    props.nodes,
    props.edges,
  );
  const [nodesPositions, setNodesPositions] =
    createSignal<Position[]>(initNodesPositions);
  const [nodesData, setNodesData] = createStore<NodeData[]>(initNodesData);
  const [nodesOffsets, setNodesOffsets] =
    createStore<
      {inputs: {offset: Position}[]; outputs: {offset: Position}[]}[]
    >(initNodesOffsets);

  const [clickedDelta, setClickedDelta] = createSignal<Position>({x: 0, y: 0});
  const [newEdge, setNewEdge] = createSignal<{
    position: Vector;
    sourceNode: number;
    sourceOutput: number;
  } | null>(null);

  createEffect(() => {
    const nextNodesLength = props.nodes.length;
    const prevNodesLength = nodesData.length;

    if (nextNodesLength !== prevNodesLength) {
      const {initEdgesNodes, initEdgesPositions, initEdgesActives} =
        getInitialEdges(props.nodes);
      setEdgesNodes(initEdgesNodes);
      setEdgesPositions(initEdgesPositions);
      setEdgesActives(initEdgesActives);
      const {initNodesPositions, initNodesData, initNodesOffsets} =
        getInitialNodes(props.nodes, props.edges);
      setNodesPositions(initNodesPositions);
      setNodesData(initNodesData);
      setNodesOffsets(initNodesOffsets);
    }
  });

  // NODE HANDLERS
  function handleOnNodeMount(values: {
    nodeIndex: number;
    inputs: {offset: {x: number; y: number}}[];
    outputs: {offset: {x: number; y: number}}[];
  }) {
    setNodesOffsets(
      produce(
        (
          nodesOffsets: {
            inputs: {offset: {x: number; y: number}}[];
            outputs: {offset: {x: number; y: number}}[];
          }[],
        ) => {
          nodesOffsets[values.nodeIndex].inputs = values.inputs;
          nodesOffsets[values.nodeIndex].outputs = values.outputs;
        },
      ),
    );

    setEdgesActives((prev: EdgesActive) => {
      const next = {...prev};
      nodesData[values.nodeIndex].edgesIn.map((edgeId: string) => {
        next[edgeId] = true;
      });
      nodesData[values.nodeIndex].edgesOut.map((edgeId: string) => {
        next[edgeId] = true;
      });
      return next;
    });

    setEdgesPositions((prev: EdgesPositions) => {
      const next = {...prev};
      nodesData[values.nodeIndex].edgesIn.map((edgeId: string) => {
        next[edgeId] = {
          x0: prev[edgeId]?.x0 || 0,
          y0: prev[edgeId]?.y0 || 0,
          x1:
            nodesPositions()[values.nodeIndex].x +
            values.inputs[edgesNodes()[edgeId].inputIndex].offset.x,
          y1:
            nodesPositions()[values.nodeIndex].y +
            values.inputs[edgesNodes()[edgeId].inputIndex].offset.y,
        };
      });
      nodesData[values.nodeIndex].edgesOut.map((edgeId: string) => {
        next[edgeId] = {
          x0:
            nodesPositions()[values.nodeIndex].x +
            values.outputs[edgesNodes()[edgeId].outputIndex].offset.x,
          y0:
            nodesPositions()[values.nodeIndex].y +
            values.outputs[edgesNodes()[edgeId].outputIndex].offset.y,
          x1: prev[edgeId]?.x1 || 0,
          y1: prev[edgeId]?.y1 || 0,
        };
      });
      return next;
    });
  }

  function handleOnNodePress(deltaX: number, deltaY: number) {
    setClickedDelta({x: deltaX, y: deltaY});
  }

  function handleOnNodeDelete(nodeId: string) {
    const newNodes = props.nodes.filter(
      (node: NodeProps) => node.id !== nodeId,
    );
    const newEdges = props.edges.filter(
      (edge: EdgeProps) =>
        edge.sourceNode !== nodeId && edge.targetNode !== nodeId,
    );
    props.onEdgesChange(newEdges);
    props.onNodesChange(newNodes);
  }

  // EDGE HANDLERS
  function handleOnDeleteEdge(edgeId: string) {
    setNodesData(
      produce((nodesData: NodeData[]) => {
        const nodeSourceId = edgesNodes()[edgeId].outNodeId;
        const nodeTargetId = edgesNodes()[edgeId].inNodeId;

        const nodeSourceIndex = nodesData.findIndex(
          (node: NodeData) => node.id === nodeSourceId,
        );
        const nodeTargetIndex = nodesData.findIndex(
          (node: NodeData) => node.id === nodeTargetId,
        );

        nodesData[nodeTargetIndex].edgesIn = nodesData[
          nodeTargetIndex
        ].edgesIn.filter((elem: string) => elem !== edgeId);
        nodesData[nodeSourceIndex].edgesOut = nodesData[
          nodeSourceIndex
        ].edgesOut.filter((elem: string) => elem !== edgeId);
      }),
    );
    setEdgesActives((prev: EdgesActive) => {
      const next = {...prev};
      next[edgeId] = false;
      return next;
    });

    const activeEdgesKeys = Object.keys(edgesActives());
    const activeEdges: EdgeProps[] = [];
    for (let i = 0; i < activeEdgesKeys.length; i++) {
      if (edgesActives()[activeEdgesKeys[i]]) {
        const edgeInfo = edgesNodes()[activeEdgesKeys[i]];
        activeEdges.push({
          id: activeEdgesKeys[i],
          sourceNode: edgeInfo.outNodeId,
          sourceOutput: edgeInfo.outputIndex,
          targetNode: edgeInfo.inNodeId,
          targetInput: edgeInfo.inputIndex,
        });
      }
    }
    props.onEdgesChange(activeEdges);
  }

  return (
    <div class={styles.main}>
      <div class={styles.wrapper}>
        <div
          class={styles.content}
          style={{cursor: newEdge() !== null ? 'crosshair' : 'inherit'}}
        >
          <NodesBoard
            nodesPositions={nodesPositions()}
            nodes={nodesData}
            onNodeMount={handleOnNodeMount}
            onNodePress={handleOnNodePress}
            onNodeDelete={handleOnNodeDelete}
          />
          <EdgesBoard
            newEdge={newEdge()}
            edgesActives={edgesActives()}
            edgesPositions={edgesPositions()}
            onDeleteEdge={handleOnDeleteEdge}
          />
        </div>
      </div>
    </div>
  );
};

export default FlowChart;
