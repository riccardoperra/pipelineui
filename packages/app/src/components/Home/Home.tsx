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
import {OverlayLoader} from '~/ui/components/Loader/Loader';

export const searchRepo = cache(async (path: string | null) => {
  'use server';
  if (!path) {
    return null;
  }
  try {
    const result = await getGithubData(path);
    return {...result, error: null};
  } catch (e) {
    return {error: e as Error};
  }
}, 'repository');

export function Home() {
  const user = createAsync(() => loggedInUser(), {deferStream: true});
  const isCreatingScratch = useSubmission(createScratch);
  const [params] = useSearchParams();
  const repo = createAsync(() => searchRepo(params.repo as string | null));

  return (
    <Suspense fallback={<OverlayLoader />}>
      <div class={homeLayoutWrapper}>
        <div class={loggedInBar}>
          <CurrentUserBar user={user() || null} />
        </div>

        <div class={homeContainer}>
          <HomeTitle />
          <div class={content}>
            <RepoSearch />

            <Suspense fallback={<RepoCardFallback />}>
              <Show when={repo()} keyed>
                {repo => {
                  return (
                    <Show
                      fallback={
                        <div class={errorBanner}>{repo.error?.message}</div>
                      }
                      when={repo.error === null && repo}
                    >
                      {repo => (
                        <RepoCard
                          repo={repo().repo}
                          workflows={repo()!.workflows}
                        />
                      )}
                    </Show>
                  );
                }}
              </Show>
            </Suspense>

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
    </Suspense>
  );
}
