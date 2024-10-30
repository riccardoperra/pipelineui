import {Button} from '@codeui/kit';
import {
  cache,
  createAsync,
  useSearchParams,
  useSubmission,
} from '@solidjs/router';
import {
  createMemo,
  createResource,
  ErrorBoundary,
  Show,
  Suspense,
} from 'solid-js';
import {StateProvider} from 'statebuilder';
import {getGithubRepo, getGithubRepoWorkflowFiles} from '~/lib/githubApi';
import {createScratch} from '../../lib/scratchApi';
import {getLoggedInUser} from '../../lib/server/appwrite';
import {CurrentUserBar} from './CurrentUser/CurrentUser';
import {HomeFooter} from './Footer/Footer';
import {
  choiceSeparator,
  content,
  errorBanner,
  form,
  homeContainer,
  homeLayoutWrapper,
  loggedInBar,
} from './Home.css';
import {HomeTitle} from './HomeTitle/HomeTitle';
import {RepoCard} from './RepoCard/RepoCard';
import {RepoCardFallback} from './RepoCard/RepoCardFallback';
import {RepoSearch} from './RepoSearch/RepoSearch';
import {ScratchList} from './ScratchList/ScratchList';

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

export function Home() {
  const user = createAsync(() => getLoggedInUser(), {deferStream: true});
  const isCreatingScratch = useSubmission(createScratch);
  const [params] = useSearchParams();

  const [repo] = createResource(
    () => params.repo,
    repo => {
      if (!repo || !(typeof repo === 'string')) {
        return null;
      }
      return searchRepo(repo);
    },
    {deferStream: true},
  );

  const canViewList = createMemo(() => {
    const loading = repo.loading;
    const data = repo();
    return !loading && data;
  });

  return (
    <div class={homeLayoutWrapper}>
      <div class={loggedInBar}>
        <CurrentUserBar />
      </div>

      <div class={homeContainer}>
        <HomeTitle />
        <div class={content}>
          <RepoSearch />

          <ErrorBoundary
            fallback={<div class={errorBanner}>{repo.error?.message}</div>}
          >
            <Suspense fallback={<RepoCardFallback />}>
              <Show when={repo.loading}>
                <RepoCardFallback />
              </Show>

              <Show when={canViewList()}>
                <RepoCard repo={repo()!.repo} workflows={repo()!.workflows} />
              </Show>
            </Suspense>
          </ErrorBoundary>

          <div class={choiceSeparator}>Or</div>

          <form action={createScratch.with()} class={form} method={'post'}>
            <Button
              loading={isCreatingScratch.pending}
              block
              theme={'tertiary'}
              type={'submit'}
              size={'lg'}
            >
              Create from scratch
            </Button>
          </form>

          <Show when={user()}>
            <div class={choiceSeparator}>Your scratches & forks</div>

            <ScratchList />
          </Show>
        </div>

        <HomeFooter />
      </div>
    </div>
  );
}
