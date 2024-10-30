import {Button, Link} from '@codeui/kit';
import {A, cache, createAsync, useSubmission} from '@solidjs/router';
import {ErrorBoundary, Show, Suspense} from 'solid-js';
import {provideState, StateProvider} from 'statebuilder';
import {getGithubRepo, getGithubRepoWorkflowFiles} from '~/lib/githubApi';
import {createScratch} from '../../lib/scratchApi';
import {getLoggedInUser} from '../../lib/server/appwrite';
import {CurrentUserBar} from './CurrentUser/CurrentUser';
import {
  choiceSeparator,
  content,
  errorBanner,
  footer,
  footerContent,
  footerLink,
  footerLinks,
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
import {RepoStore} from './store';
import {HomeFooter} from './Footer/Footer';

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
  return (
    <StateProvider>
      {/* Nesting state provider in order to trigger suspense from this context */}
      {/* TODO: allow to provide state with current owner context */}
      <$Home />
    </StateProvider>
  );
}

export function $Home() {
  const user = createAsync(() => getLoggedInUser());
  const isCreatingScratch = useSubmission(createScratch);
  const repo = provideState(RepoStore);

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

              <Show when={!repo.loading && repo.latest}>
                {response => (
                  <RepoCard
                    repo={response().repo}
                    workflows={response().workflows}
                  />
                )}
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
