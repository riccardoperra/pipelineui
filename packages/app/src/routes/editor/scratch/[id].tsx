import {
  createAsync,
  type RouteDefinition,
  type RouteSectionProps,
} from '@solidjs/router';
import {Show, Suspense} from 'solid-js';
import {provideState, StateProvider} from 'statebuilder';
import {Editor} from '~/components/Editor/Editor';
import {EditorContext} from '~/components/Editor/editor.context';
import {UserStore} from '~/store/user.store';
import {OverlayLoader} from '~/ui/components/Loader/Loader';
import {getScratch} from '../../../lib/scratchApi';

export const route = {
  preload: ({params}) => {
    return getScratch(params.id);
  },
} satisfies RouteDefinition;

export default function EditorPage(props: RouteSectionProps) {
  const scratch = createAsync(() => getScratch(props.params.id));
  const user = provideState(UserStore);

  return (
    <Suspense fallback={<OverlayLoader />}>
      <Show when={scratch()}>
        {scratch => (
          <EditorContext.Provider
            value={{
              get source() {
                return scratch()?.code ?? '';
              },
              repository: null,
              remoteId: props.params.id,
              scratch: scratch,
              user,
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
