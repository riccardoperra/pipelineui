import {cache, useSearchParams} from '@solidjs/router';
import {createEffect, createSignal, on} from 'solid-js';
import {isServer} from 'solid-js/web';
import {ɵdefineResource} from 'statebuilder';
import {getGithubRepo, getGithubRepoWorkflowFiles} from '~/lib/githubApi';

class SearchRepoError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export const searchRepo = cache(async (path: string) => {
  'use server';
  const result = await getGithubRepo(path);
  if (result.error) {
    throw new SearchRepoError(result.error.message);
  }
  const files = await getGithubRepoWorkflowFiles(
    result.data.repo.repo,
    result.data.repo.defaultBranch,
  );
  return {repo: result.data.repo, workflows: files};
}, 'search-repo');

export const RepoStore = ɵdefineResource(
  async (_, {refetching: fetchValue}) => {
    if (isServer && fetchValue === undefined) {
      const [params] = useSearchParams();
      if (!params || !(typeof params.repo === 'string')) {
        return null;
      }
      return searchRepo(params.repo);
    }
    if (typeof fetchValue !== 'string') {
      return null;
    }
    return searchRepo(fetchValue);
  },
).extend(_ => {
  const [params, setParams] = useSearchParams();
  const [searchTextValue, setSearchTextValue] = createSignal<string>('');
  // TODO defineResource should be reactive :(
  createEffect(
    on(
      () => params.repo,
      repo => _.refetch(repo),
      {defer: true},
    ),
  );

  return {
    search(term: string, replace?: boolean) {
      setParams({repo: term}, {replace: replace});
    },

    searchTextValue,
    setSearchTextValue,
  };
});
