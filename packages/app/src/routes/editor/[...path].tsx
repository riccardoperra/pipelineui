import {
  cache,
  createAsync,
  redirect,
  type RouteDefinition,
  type RouteSectionProps,
} from '@solidjs/router';
import {
  EditorContext,
  type EditorParsedRepository,
} from '~/components/Editor/editor.context';
import {Editor} from '~/components/Editor/Editor';
import {getGithubRepoFileContent} from '~/lib/githubApi';
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
      return {
        ...response.data,
        repository: {
          owner,
          repoName,
          branchName,
          filePath,
        } as EditorParsedRepository,
      };
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
        get source() {
          return workflowContent()?.file.contents ?? '';
        },
        remoteId: null,
        get repository() {
          return workflowContent()?.repository ?? null;
        },
      }}
    >
      <StateProvider>
        <Editor type={'repository'} />
      </StateProvider>
    </EditorContext.Provider>
  );
}
