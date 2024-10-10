import * as styles from './Canvas.css';
import {FlowContainer} from '../Flow/FlowContainer';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';
import {batch, createEffect, createSignal, Show} from 'solid-js';
import type {ElkNode} from 'elkjs';
import {useEditorContext} from '../editor.context';
import {clientOnly} from '@solidjs/start';
import {provideState} from 'statebuilder';
import {EditorUiStore} from '#editor-store/ui.store';
import {EditorStore} from '#editor-store/editor.store';
import type {NodeProps} from '../Flow/Edge/core';
import {FlowRenderer} from '../Flow/engine/FlowRenderer';
import type {
  FlowConnection,
  FlowDataConnector,
  FlowNode,
  FlowNodeMap,
} from '../Flow/engine/types';
import {FlowItem} from '../Flow/FlowItem';

const FlowChart = clientOnly(() => import('../Flow/Edge/core'));

export function Canvas() {
  const {template} = useEditorContext();
  const editor = provideState(EditorStore);

  const [nodes, setNodes] = createSignal<Node[]>([]);
  const [mappedNodes, setMappedNodes] = createSignal<FlowNodeMap>({});
  const [connections, setConnections] = createSignal<FlowConnection[]>([]);
  const [size, setSize] = createSignal({width: 0, height: 0});
  const [elkNode, setElkNode] = createSignal<ElkNode | null>(null);

  const onSelectedChange = (node: NodeProps | null) => {
    const job = !node ? null : node.id.replace('job-', '');
    console.log(node);
    editor.set('selectedJobId', job);
  };

  createEffect(() => {
    const nodes = template.jobs.map(
      (job, index) =>
        ({
          id: `job-${job.id!.toString()}`,
          position: {
            x: 0,
            y: 0,
          },
          data: {
            get label() {
              return job.name?.toString() ?? '';
            },
            content: () => {
              const id = `job-${job.id!.toString()}`;
              const data = () =>
                elkNode()?.children?.find(child => child.id === id);
              console.log(job);
              return (
                <Show when={data()}>
                  {data => (
                    <div>
                      <span
                        style={{
                          padding: '2px 6px',
                          'background-color': '#2d2d2d',
                          'border-radius': '8px',
                        }}
                      >
                        {job?.steps?.length} steps
                      </span>

                      <span
                        style={{
                          padding: '2px 6px',
                          'background-color': '#2d2d2d',
                          'border-radius': '8px',
                        }}
                      >
                        {job.type === 'job' && job['runs-on']?.['value']}
                      </span>
                    </div>
                  )}
                </Show>
              );
            },
          },
          inputs: 1,
          outputs: 1,
        }) satisfies Node,
    );

    const mappedNodes: FlowNodeMap = template.jobs.reduce((acc, job) => {
      acc[job.id.value] = {
        id: job.id.value,
        position: {
          x: 0,
          y: 0,
        },
        data: {
          job,
        },
      };
      return acc;
    }, {} as FlowNodeMap);

    import('elkjs').then(({default: ELK}) => {
      const graph: ElkNode = {
        id: 'root',
        layoutOptions: {
          // "elk.algorithm": "mrtree",
          'elk.algorithm': 'layered',
          'elk.direction': 'RIGHT',
          'elk.alignment': 'TOP',
          'elk.layered.spacing.edgeNodeBetweenLayers': '40',
          // "elk.layered.nodePlacement.bk.fixedAlignment": "LEFTUP",
          // "elk.layered.nodePlacement.favorStraightEdges": 'false',
          'elk.spacing.nodeNode': '40',
          'elk.layered.nodePlacement.strategy': 'INTERACTIVE',
          'elk.layered.crossingMinimization.positionChoiceConstraint': '0',
          'elk.layered.crossingMinimization.strategy': 'NONE',
          // 'elk.layered.crossingMinimization.semiInteractive': 'true',
          'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
        },
        children: [
          ...Object.values(mappedNodes).map(node => {
            return {
              id: `${node.id}`,
              width: 250,
              height: 68,
              properties: {
                'org.eclipse.elk.portConstraints': 'FIXED_ORDER',
              },
            };
          }),
        ],
        edges: Object.values(mappedNodes).reduce((acc, node, index, array) => {
          const nodeJob = template.jobs.find(
            job => node.id === `${job.id!.toString()}`,
          );
          if (nodeJob && nodeJob.needs?.length) {
            const targets = nodeJob.needs.reduce((acc, need) => {
              const job = template.jobs.find(
                n => n.id.toString() === need.toString(),
              );
              if (!job) {
                return acc;
              }
              return [...acc, `${job.id!.toString()}`];
            }, [] as string[]);

            targets.forEach(target => {
              acc.push({
                id: `edge-${Math.random()}`,
                sources: [target],
                targets: [node.id],
              });
            });
          }

          return acc;
        }, [] as ElkExtendedEdge[]),
      };
      new ELK().layout(graph).then(layout => {
        layout.children?.forEach(child => {
          const node = mappedNodes[child.id];
          if (node) {
            node.position.x = child.x ?? 0;
            node.position.y = child.y ?? 0;
          }
        });

        const edges = template.jobs.reduce((acc, job) => {
          const jobEdge: FlowConnection[] = (job.needs ?? []).reduce(
            (acc, need) => {
              const cJob = template.jobs.find(
                n => n.id.toString() === need.toString(),
              );
              if (!cJob) {
                return acc;
              }
              return [
                ...acc,
                {
                  target: {
                    nodeId: job.id.value,
                    connectorId: `${job.id.value}-output`,
                    connectorType: 'output',
                  },
                  source: {
                    nodeId: need.value,
                    connectorId: `${need.value}-input`,
                    connectorType: 'input',
                  },
                } satisfies FlowConnection,
              ];
            },
            [] as FlowConnection[],
          );

          return [...acc, ...jobEdge];
        }, [] as FlowConnection[]);

        batch(() => {
          setSize(() => ({width: layout.width, height: layout.height}));
          setMappedNodes(mappedNodes);
          setConnections(edges);
        });
        console.warn(edges);
      });
    });

    const edges = template.jobs.reduce((acc, job) => {
      const jobEdge: Edge[] = (job.needs ?? []).reduce((acc, need) => {
        const cJob = template.jobs.find(
          n => n.id.toString() === need.toString(),
        );
        if (!cJob) {
          return acc;
        }
        return [
          ...acc,
          {
            id: `${Math.random()}`,
            sourceNode: `job-${cJob.id!.toString()}`,
            targetNode: `job-${job.id!.toString()}`,
            sourceOutput: 0,
            targetInput: 0,
          } satisfies Edge,
        ];
      }, [] as Edge[]);

      return [...acc, ...jobEdge];
    }, [] as Edge[]);

    import('elkjs').then(({default: ELK}) => {
      const elk = new ELK({});

      const graph: ElkNode = {
        id: 'root',
        layoutOptions: {
          // "elk.algorithm": "mrtree",
          'elk.algorithm': 'layered',
          'elk.direction': 'RIGHT',
          'elk.alignment': 'TOP',
          'elk.layered.spacing.edgeNodeBetweenLayers': '40',
          // "elk.layered.nodePlacement.bk.fixedAlignment": "LEFTUP",
          // "elk.layered.nodePlacement.favorStraightEdges": 'false',
          'elk.spacing.nodeNode': '40',
          'elk.layered.nodePlacement.strategy': 'INTERACTIVE',
          'elk.layered.crossingMinimization.positionChoiceConstraint': '0',
          'elk.layered.crossingMinimization.strategy': 'NONE',
          // 'elk.layered.crossingMinimization.semiInteractive': 'true',
          'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
        },
        children: [
          ...nodes.map(node => {
            return {
              id: node.id,
              width: 350,
              height: 150,
              properties: {
                'org.eclipse.elk.portConstraints': 'FIXED_ORDER',
              },
            };
          }),
        ],
        edges: nodes.reduce((acc, node, index, array) => {
          const nodeJob = template.jobs.find(
            job => node.id === `job-${job.id!.toString()}`,
          );
          if (nodeJob && nodeJob.needs?.length) {
            const targets = nodeJob.needs.reduce((acc, need) => {
              const job = template.jobs.find(
                n => n.id.toString() === need.toString(),
              );
              if (!job) {
                return acc;
              }
              return [...acc, `job-${job.id!.toString()}`];
            }, [] as string[]);

            targets.forEach(target => {
              acc.push({
                id: `edge-${Math.random()}`,
                sources: [target],
                targets: [node.id],
              });
            });
          }

          return acc;
        }, [] as ElkExtendedEdge[]),
      };

      elk
        .layout(graph)
        .then(layout => {
          console.log(layout);
          nodes.forEach(node => {
            const layoutNode = layout.children?.find(l => l.id === node.id);
            if (layoutNode) {
              node.position.x = layoutNode.x!;
              node.position.y = layoutNode.y!;
            }
          });
          batch(() => {
            setElkNode(layout);
            setNodes(nodes);
            setEdges(edges);
          });
        })
        .catch(console.warn);
    });
  });

  return (
    <div class={styles.canvasContainer}>
      <FlowContainer size={size()}>
        <FlowRenderer
          renderNode={node => <FlowItem job={node.data.job} />}
          connections={connections()}
          nodes={mappedNodes()}
          width={size().width}
          height={size().height}
        />

        {/*<FlowChart*/}
        {/*  edges={edges()}*/}
        {/*  nodes={nodes()}*/}
        {/*  onEdgesChange={setEdges}*/}
        {/*  onNodesChange={setNodes}*/}
        {/*  onSelectedChange={onSelectedChange}*/}
        {/*/>*/}

        {/*<For each={props.template.jobs}>{job => <FlowItem job={job} />}</For>*/}

        {/*<svg class={styles.canvasSvg}>*/}
        {/*  <SmoothStep*/}
        {/*    sourceX={343}*/}
        {/*    sourceY={309.3865966796875}*/}
        {/*    targetX={544.4347534179688}*/}
        {/*    targetY={453.50982666015625}*/}
        {/*  />*/}
        {/*</svg>*/}
      </FlowContainer>
    </div>
  );
}
