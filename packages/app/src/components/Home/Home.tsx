import {
  choiceSeparator,
  content,
  contentTitle,
  homeContainer,
  homeLayoutWrapper,
  mainDescription,
  mainDescriptionHighlight,
  mainTitle,
  mainTitleContainer,
  resetRepoSubmitButton,
  submitRepoInput,
  submitRepoInputContainer,
  submitRepoInputRoot,
  submitRepoSubmitButton,
} from './Home.css';
import {Button, IconButton, TextField} from '@codeui/kit';
import {
  cache,
  createAsync,
  createAsyncStore,
  useSearchParams,
} from '@solidjs/router';
import {createSignal, Show, Suspense, useTransition} from 'solid-js';
import {Icon} from '#ui/components/Icon';
import {getGithubRepo} from '../../lib/api';
import {RepoCard} from './RepoCard/RepoCard';
import {RepoCardFallback} from './RepoCard/RepoCardFallback';

export const searchRepo = cache((path: string) => {
  return getGithubRepo(path);
}, 'search');

export function Home() {
  const [repoSearchValue, setRepoSearchValue] = createSignal<string>('');
  const [params, setParams] = useSearchParams();
  const repo = createAsync(() => {
    return !params.repo ? Promise.resolve(null) : searchRepo(params.repo);
  });

  return (
    <div class={homeLayoutWrapper}>
      <div class={homeContainer}>
        <div class={mainTitleContainer}>
          <h1 class={mainTitle}>
            <Icon name={'account_tree'} size={'lg'} />
            PipelineUI
          </h1>
          <span class={mainDescription}>
            <span class={mainDescriptionHighlight}>Visual workflow</span> for
            GitHub
          </span>
        </div>

        <div class={content}>
          <h2 class={contentTitle}>
            Search for existing github repositories...
          </h2>
          <form
            role={'search'}
            onSubmit={e => {
              e.preventDefault();
              const data = new FormData(e.target as HTMLFormElement);
              setParams({
                repo: (data.get('repository-path') as string) ?? '',
              });
            }}
          >
            <div class={submitRepoInputContainer}>
              <TextField
                name={'repository-path'}
                slotClasses={{
                  root: submitRepoInputRoot,
                  input: submitRepoInput,
                }}
                size={'lg'}
                placeholder={'e.g. riccardoperra/codeimage'}
                theme={'filled'}
                value={repoSearchValue()}
                onChange={e => {
                  setRepoSearchValue(e);
                }}
              />
              <Show when={repoSearchValue()}>
                <IconButton
                  class={resetRepoSubmitButton}
                  size={'sm'}
                  aria-label={'Cancel'}
                  type={'button'}
                  variant={'ghost'}
                  theme={'secondary'}
                  onClick={() => {
                    setRepoSearchValue('');
                    setParams({repo: ''}, {replace: true});
                  }}
                >
                  <Icon name={'close'} />
                </IconButton>
              </Show>

              <IconButton
                class={submitRepoSubmitButton}
                size={'lg'}
                aria-label={'Enter'}
                type={'submit'}
                theme={'secondary'}
              >
                <Icon name={'keyboard_return'} />
              </IconButton>
            </div>
          </form>

          <Suspense fallback={<RepoCardFallback />}>
            <Show when={repo()?.repo}>
              {response => <RepoCard repo={response()} />}
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
