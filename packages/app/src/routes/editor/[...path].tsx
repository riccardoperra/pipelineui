import {
  createAsync,
  query,
  redirect,
  type RouteDefinition,
  type RouteSectionProps,
} from '@solidjs/router';
import {createEffect} from 'solid-js';
import {provideState, StateProvider} from 'statebuilder';
import {Editor} from '~/components/Editor/Editor';
import {
  EditorContext,
  type EditorParsedRepository,
} from '~/components/Editor/editor.context';
import {getGithubRepoFileContent} from '~/lib/githubApi';
import {loggedInUser} from '~/lib/session';
import {UserStore} from '~/store/user.store';

const getWorkflowFromUrl = query(async (path: string) => {
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

  const user = provideState(UserStore);

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
        user,
      }}
    >
      <StateProvider>
        <Editor type={'repository'} />
      </StateProvider>
    </EditorContext.Provider>
  );
}
