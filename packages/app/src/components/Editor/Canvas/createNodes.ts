import type {ElkExtendedEdge, ElkNode} from 'elkjs';
import {FlowConnection, FlowNodeMap} from '~/lib/flowEngine/types';
import {WorkflowStructureJob} from '~/store/editor/editor.types';

export function createNodes(jobs: WorkflowStructureJob[]) {
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
            height: 100,
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
