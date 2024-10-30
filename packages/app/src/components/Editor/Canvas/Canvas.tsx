import {EditorStore} from '#editor-store/editor.store';
import type {WorkflowStructureJob} from '#editor-store/editor.types';
import type {ElkExtendedEdge, ElkNode} from 'elkjs';
import {createResource, onCleanup, onMount, Suspense, untrack} from 'solid-js';
import {provideState} from 'statebuilder';
import {FlowRenderer} from '../Flow/engine/FlowRenderer';
import type {FlowConnection, FlowNodeMap} from '../Flow/engine/types';
import {FlowContainer} from '../Flow/FlowContainer';
import {FlowItem} from '../Flow/FlowItem';
import * as styles from './Canvas.css';

function createNodes(jobs: WorkflowStructureJob[]) {
  const mappedNodes: FlowNodeMap = jobs.reduce((acc, job) => {
    acc[job.id] = {
      id: job.id,
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

  console.log('my jobs', jobs);

  return import('elkjs').then(({default: ELK}) => {
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
        const nodeJob = jobs.find(job => node.id === `${job.id!.toString()}`);
        if (nodeJob && nodeJob.needs?.length) {
          const targets = nodeJob.needs.reduce((acc, need) => {
            const job = jobs.find(n => n.id.toString() === need.toString());
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
    return new ELK()
      .layout(graph)
      .then(layout => {
        layout.children?.forEach(child => {
          const node = mappedNodes[child.id];
          if (node) {
            node.position.x = child.x ?? 0;
            node.position.y = child.y ?? 0;
          }
        });

        const edges = jobs.reduce((acc, job) => {
          const jobEdge: FlowConnection[] = (job.needs ?? []).reduce(
            (acc, need) => {
              const cJob = jobs.find(n => n.id.toString() === need.toString());
              if (!cJob) {
                return acc;
              }
              return [
                ...acc,
                {
                  target: {
                    nodeId: job.id,
                    connectorId: `${job.id}-output`,
                    connectorType: 'output',
                  },
                  source: {
                    nodeId: need,
                    connectorId: `${need}-input`,
                    connectorType: 'input',
                  },
                } satisfies FlowConnection,
              ];
            },
            [] as FlowConnection[],
          );

          return [...acc, ...jobEdge];
        }, [] as FlowConnection[]);

        console.log(mappedNodes);

        return {
          size: {
            width: layout.width!,
            height: layout.height!,
          },
          mappedNodes,
          edges,
        };
      })
      .catch(console.error);
  });
}

export default function Canvas() {
  const editor = provideState(EditorStore);

  const [data, {refetch}] = createResource(
    () => editor.initialized(),
    async () => {
      const result = await createNodes(
        untrack(() => editor().structure.jobs ?? []),
      );
      return result;
    },
  );

  const mappedNodes = () => data.latest?.mappedNodes ?? {};
  const connections = () => data.latest?.edges ?? [];
  const size = () => data.latest?.size ?? {width: 0, height: 0};

  onMount(() => {
    const {unsubscribe} = editor
      .watchCommand([
        editor.commands.updateJobNeeds,
        editor.commands.addNewJob,
        editor.commands.deleteJob,
      ])
      .subscribe(() => {
        refetch();
      });
    onCleanup(() => unsubscribe());
  });

  return (
    <div
      class={styles.canvasContainer}
      onClick={e => {
        const target = e.composedPath();
        const containsNode = target.find(node =>
          (node as Element).hasAttribute?.('data-flow-node'),
        );
        if (!containsNode) {
          editor.actions.setSelectedJobId(null);
        }
      }}
    >
      <FlowContainer size={size()}>
        <FlowRenderer
          renderNode={node => (
            <FlowItem job={node.data.job as WorkflowStructureJob} />
          )}
          connections={connections()}
          nodes={mappedNodes()}
          width={size().width}
          height={size().height}
        />
      </FlowContainer>
    </div>
  );
}
