import {Button} from '@codeui/kit';
import {
  cache,
  createAsync,
  useSearchParams,
  useSubmission,
} from '@solidjs/router';
import {ErrorBoundary, Show, Suspense, useTransition} from 'solid-js';
import {getGithubData} from '~/lib/githubApi';
import {loggedInUser} from '~/lib/session';
import {createScratch} from '../../lib/scratchApi';
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

export const searchRepo = cache(
  async (path: string | null) => (path ? getGithubData(path) : null),
  'search-repo',
);

export function Home() {
  const user = createAsync(() => loggedInUser());
  const isCreatingScratch = useSubmission(createScratch);
  const [params] = useSearchParams();
  const repo = createAsync(() => searchRepo(params.repo as string | null));

  return (
    <div class={homeLayoutWrapper}>
      <div class={loggedInBar}>
        <Suspense>
          <CurrentUserBar user={user() || null} />
        </Suspense>
      </div>

      <div class={homeContainer}>
        <HomeTitle />
        <div class={content}>
          <Suspense>
            <RepoSearch />
          </Suspense>

          <ErrorBoundary
            fallback={(err, reset) => (
              <div class={errorBanner}>{err.message}</div>
            )}
          >
            <Suspense fallback={<RepoCardFallback />}>
              <Show when={repo()}>
                {repo => {
                  const [pendingTask] = useTransition();
                  pendingTask();
                  return (
                    <RepoCard
                      repo={repo()!.repo}
                      workflows={repo()!.workflows}
                    />
                  );
                }}
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
