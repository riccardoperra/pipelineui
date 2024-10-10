import * as styles from './Canvas.css';
import {FlowContainer} from '../Flow/FlowContainer';
import {batch, createEffect, createSignal} from 'solid-js';
import type {ElkExtendedEdge, ElkNode} from 'elkjs';
import {useEditorContext} from '../editor.context';
import {provideState} from 'statebuilder';
import {EditorStore} from '#editor-store/editor.store';
import {FlowRenderer} from '../Flow/engine/FlowRenderer';
import type {FlowConnection, FlowNodeMap} from '../Flow/engine/types';
import {FlowItem} from '../Flow/FlowItem';

export function Canvas() {
  const {template} = useEditorContext();
  const editor = provideState(EditorStore);

  const [mappedNodes, setMappedNodes] = createSignal<FlowNodeMap>({});
  const [connections, setConnections] = createSignal<FlowConnection[]>([]);
  const [size, setSize] = createSignal({width: 0, height: 0});
  const [elkNode, setElkNode] = createSignal<ElkNode | null>(null);

  createEffect(() => {
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
              height: 150,
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
          setSize(() => ({width: layout.width!, height: layout.height!}));
          setMappedNodes(mappedNodes);
          setConnections(edges);
        });
      });
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
      </FlowContainer>
    </div>
  );
}
