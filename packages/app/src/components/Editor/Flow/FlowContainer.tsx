import {flowContainer} from './FlowContainer.css';
import {createEffect, type ParentProps} from 'solid-js';
import ELK, {type ElkExtendedEdge, type ElkNode} from 'elkjs';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';

export function FlowContainer(
  props: ParentProps<{template: WorkflowTemplate}>,
) {
  const elk = new ELK();

  createEffect(() => {
    const nodes = props.template.jobs.map(
      (job, index) =>
        ({
          id: `job-${job.id!.toString()}`,
          position: {
            x: 50,
            y: 100 + 50 * index,
          },
          data: {
            get label() {
              return job.name?.toString() ?? '';
            },
          },
          inputs: 1,
          outputs: 1,
        }) satisfies Node,
    );

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
        const nodeJob = props.template.jobs.find(
          job => node.id === `job-${job.id!.toString()}`,
        );
        if (nodeJob && nodeJob.needs?.length) {
          const targets = nodeJob.needs.reduce((acc, need) => {
            const job = props.template.jobs.find(
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

    elk.layout(graph).then(console.log);
  });

  return <div class={flowContainer}>{props.children}</div>;
}
