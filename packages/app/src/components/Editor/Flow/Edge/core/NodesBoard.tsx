import {Accessor, Component, createSignal, For} from 'solid-js';
import NodeComponent from './NodeComponent';
import styles from './styles.module.css';

interface NodeProps {
  id: string;
  data: {label?: string; content: any};
  inputs: number;
  outputs: number;
  actions?: {delete: boolean};
}

interface Props {
  nodesPositions: {x: number; y: number}[];
  nodes: NodeProps[];
  onNodeMount: (values: {
    nodeIndex: number;
    inputs: {offset: {x: number; y: number}}[];
    outputs: {offset: {x: number; y: number}}[];
  }) => void;
  onNodePress: (x: number, y: number) => void;
  onNodeMove: (nodeIndex: number, x: number, y: number) => void;
  onNodeDelete: (nodeId: string) => void;
}

const NodesBoard: Component<Props> = (props: Props) => {
  const [grabbing, setGrabbing] = createSignal<number | null>(null);
  const [selected, setSelected] = createSignal<number | null>(null);

  let scene: any;

  function handleOnMouseDownNode(index: number) {
    setSelected(index);
  }

  return (
    <div ref={scene} class={styles.main}>
      <For each={props.nodes}>
        {(node: NodeProps, index: Accessor<number>) => (
          <NodeComponent
            x={props.nodesPositions[index()].x}
            y={props.nodesPositions[index()].y}
            selected={selected() === index()}
            actions={node.actions}
            label={node.data.label}
            content={node.data.content}
            inputs={node.inputs}
            outputs={node.outputs}
            onMouseDown={event => handleOnMouseDownNode(index())}
            onNodeMount={(
              inputs: {offset: {x: number; y: number}}[],
              outputs: {offset: {x: number; y: number}}[],
            ) =>
              props.onNodeMount({
                nodeIndex: index(),
                inputs: inputs.map(
                  (values: {offset: {x: number; y: number}}) => {
                    return {
                      offset: {
                        x:
                          values.offset.x -
                          scene.getBoundingClientRect().x -
                          props.nodesPositions[index()].x +
                          6,
                        y:
                          values.offset.y -
                          scene.getBoundingClientRect().y -
                          props.nodesPositions[index()].y +
                          6,
                      },
                    };
                  },
                ),
                outputs: outputs.map(
                  (values: {offset: {x: number; y: number}}) => {
                    return {
                      offset: {
                        x:
                          values.offset.x -
                          scene.getBoundingClientRect().x -
                          props.nodesPositions[index()].x +
                          6,
                        y:
                          values.offset.y -
                          scene.getBoundingClientRect().y -
                          props.nodesPositions[index()].y +
                          6,
                      },
                    };
                  },
                ),
              })
            }
            onClickOutside={() => {
              if (index() === selected()) setSelected(null);
            }}
            onClickDelete={() => {
              setSelected(null);
              props.onNodeDelete(node.id);
            }}
          />
        )}
      </For>
    </div>
  );
};

export default NodesBoard;
