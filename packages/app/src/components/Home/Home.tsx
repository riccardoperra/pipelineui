import {
  choiceSeparator,
  content,
  homeContainer,
  errorBanner,
  homeLayoutWrapper,
} from './Home.css';
import {Button} from '@codeui/kit';
import {cache, createAsync, useSearchParams} from '@solidjs/router';
import {Show, Suspense} from 'solid-js';
import {getGithubRepo} from '../../lib/api';
import {RepoCard} from './RepoCard/RepoCard';
import {RepoCardFallback} from './RepoCard/RepoCardFallback';
import {RepoSearch} from './RepoSearch/RepoSearch';
import {HomeTitle} from './HomeTitle/HomeTitle';

export const searchRepo = cache((path: string) => {
  return getGithubRepo(path);
}, 'search-repo');

export function Home() {
  const [params] = useSearchParams();
  const repo = createAsync(() => {
    return !params.repo ? Promise.resolve(null) : searchRepo(params.repo);
  });

  return (
    <div class={homeLayoutWrapper}>
      <div class={homeContainer}>
        <HomeTitle />
        <div class={content}>
          <RepoSearch />

          <Suspense fallback={<RepoCardFallback />}>
            <Show when={repo()} keyed>
              {response => (
                <Show
                  fallback={
                    <div class={errorBanner}>{response.error?.message}</div>
                  }
                  when={!response.failed && response}
                >
                  {response => <RepoCard repo={response().data.repo} />}
                </Show>
              )}
            </Show>
          </Suspense>

          <div role={'separator'} class={choiceSeparator}>
            Or
          </div>
          <Button size={'lg'} theme={'tertiary'}>
            Create from scratch
          </Button>
        </div>
      </div>
    </div>
  );
}
