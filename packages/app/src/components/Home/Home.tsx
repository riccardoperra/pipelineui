import {
  choiceSeparator,
  content,
  errorBanner,
  form,
  homeContainer,
  homeLayoutWrapper,
  loggedInBar,
} from './Home.css';
import {Button} from '@codeui/kit';
import {
  cache,
  createAsync,
  useSearchParams,
  useSubmission,
} from '@solidjs/router';
import {Show, Suspense} from 'solid-js';
import {getGithubRepo} from '~/lib/githubApi';
import {RepoCard} from './RepoCard/RepoCard';
import {RepoCardFallback} from './RepoCard/RepoCardFallback';
import {RepoSearch} from './RepoSearch/RepoSearch';
import {HomeTitle} from './HomeTitle/HomeTitle';
import {createScratch} from '../../lib/scratchApi';
import {CurrentUserBar} from './CurrentUser/CurrentUser';
import {ScratchList} from './ScratchList/ScratchList';
import {getLoggedInUser} from '../../lib/server/appwrite';

export const searchRepo = cache((path: string) => {
  return getGithubRepo(path);
}, 'search-repo');

export function Home() {
  const [params] = useSearchParams();

  const user = createAsync(() => getLoggedInUser(), {deferStream: true});

  const repo = createAsync(() => {
    return !params.repo ? Promise.resolve(null) : searchRepo(params.repo);
  });

  const isCreateScratch = useSubmission(createScratch);

  return (
    <div class={homeLayoutWrapper}>
      <div class={loggedInBar}>
        <CurrentUserBar />
      </div>

      <div class={homeContainer}>
        <HomeTitle />
        <div class={content}>
          <RepoSearch />

          <Suspense fallback={<RepoCardFallback />}>
            <Show when={repo()}>
              {response => (
                <Show
                  fallback={
                    <div class={errorBanner}>{response().error?.message}</div>
                  }
                  when={!response().failed && response()}
                >
                  {response => <RepoCard repo={response().data!.repo} />}
                </Show>
              )}
            </Show>
          </Suspense>

          <div class={choiceSeparator}>Or</div>

          <form action={createScratch.with()} class={form} method={'post'}>
            <Button block theme={'tertiary'} type={'submit'} size={'lg'}>
              Create from scratch
            </Button>
          </form>

          <Show when={user()}>
            <div class={choiceSeparator}>Your scratches & forks</div>

            <ScratchList />
          </Show>
        </div>
      </div>
    </div>
  );
}
