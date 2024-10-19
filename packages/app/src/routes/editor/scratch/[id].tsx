import {
  cache,
  createAsync,
  redirect,
  type RouteDefinition,
  type RouteSectionProps,
} from '@solidjs/router';
import {EditorContext} from '~/components/Editor/editor.context';
import {Editor} from '~/components/Editor/Editor';
import {getGithubRepoFileContent} from '~/lib/api';
import {StateProvider} from 'statebuilder';
import {createEffect, createMemo} from 'solid-js';
import {getScratch} from '../../../lib/scratchApi';

export const route = {
  preload: ({params}) => {
    return getScratch(params.id);
  },
} satisfies RouteDefinition;

export default function EditorPage(props: RouteSectionProps) {
  const workflowContent = createAsync(() => getScratch(props.params.id));

  const content = createMemo(() => workflowContent()?.['code'] ?? '');

  return (
    <EditorContext.Provider
      value={{
        get source() {
          return content();
        },
      }}
    >
      <StateProvider>
        <Editor />
      </StateProvider>
    </EditorContext.Provider>
  );
}
