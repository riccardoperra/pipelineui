import {
  createAsync,
  type RouteDefinition,
  type RouteSectionProps,
} from '@solidjs/router';
import {EditorContext} from '~/components/Editor/editor.context';
import {Editor} from '~/components/Editor/Editor';
import {StateProvider} from 'statebuilder';
import {Show, Suspense} from 'solid-js';
import {getScratch} from '../../../lib/scratchApi';

export const route = {
  preload: ({params}) => {
    return getScratch(params.id);
  },
} satisfies RouteDefinition;

export default function EditorPage(props: RouteSectionProps) {
  const workflowContent = createAsync(() => getScratch(props.params.id));

  return (
    <Suspense fallback={<>Loading...</>}>
      <Show when={workflowContent()}>
        {workflowContent => (
          <EditorContext.Provider
            value={{
              get source() {
                return workflowContent().code ?? '';
              },
              repository: null,
              remoteId: props.params.id,
            }}
          >
            <StateProvider>
              <Editor type={'scratch'} />
            </StateProvider>
          </EditorContext.Provider>
        )}
      </Show>
    </Suspense>
  );
}
