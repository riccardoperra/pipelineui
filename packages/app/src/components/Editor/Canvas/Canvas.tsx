import {createResource, onCleanup, onMount, untrack} from 'solid-js';
import {provideState} from 'statebuilder';
import {EditorStore} from '~/store/editor/editor.store';
import type {WorkflowStructureJob} from '~/store/editor/editor.types';
import {FlowRenderer} from '~/lib/flowEngine/FlowRenderer';
import {FlowContainer} from '../Canvas/Flow/FlowContainer';
import {FlowItem} from '../Canvas/Flow/FlowItem';
import * as styles from './Canvas.css';
import {createNodes} from './createNodes';

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
