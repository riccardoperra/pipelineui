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

const getWorkflowFromUrl = cache(async (path: string) => {
  'use server';

  const [owner, repoName, branchName, ...filePath] = path.split('/');
  return getGithubRepoFileContent(
    `${owner}/${repoName}`,
    branchName,
    filePath.join('/'),
  )
    .then(response => {
      if (response.failed) {
        throw redirect('/not-found');
      }
      return response.data;
    })
    .catch(() => {
      throw redirect('/not-found');
    });
}, 'github-workflow');

export const route = {
  preload: ({params}) => {
    return getWorkflowFromUrl(params.path);
  },
} satisfies RouteDefinition;

export default function EditorPage(props: RouteSectionProps) {
  const workflowContent = createAsync(() =>
    getWorkflowFromUrl(props.params.path),
  );

  return (
    <EditorContext.Provider
      value={{
        source: workflowContent()?.file.contents ?? '',
      }}
    >
      <StateProvider>
        <Editor />
      </StateProvider>
    </EditorContext.Provider>
  );
}
