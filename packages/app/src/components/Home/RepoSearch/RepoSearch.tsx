import {
  contentTitle,
  resetRepoSubmitButton,
  submitRepoInput,
  submitRepoInputContainer,
  submitRepoInputRoot,
  submitRepoSubmitButton,
  wrapper,
} from './RepoSearch.css';
import {IconButton, TextField} from '@codeui/kit';
import {createSignal, Show, useTransition} from 'solid-js';
import {Icon} from '#ui/components/Icon';
import {useSearchParams} from '@solidjs/router';

export function RepoSearch() {
  const [repoSearchValue, setRepoSearchValue] = createSignal('');
  const [isSearching] = useTransition();
  const [, setParams] = useSearchParams();

  return (
    <div class={wrapper}>
      <h2 class={contentTitle}>Search for existing github repositories...</h2>
      <form
        role={'search'}
        onSubmit={e => {
          e.preventDefault();
          if (isSearching()) {
            return;
          }
          const data = new FormData(e.target as HTMLFormElement);
          setParams({
            repo: (data.get('path') as string) ?? '',
          });
        }}
        $ServerOnly
      >
        <div class={submitRepoInputContainer}>
          <TextField
            name={'path'}
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
            disabled={isSearching()}
          >
            <Icon name={'keyboard_return'} />
          </IconButton>
        </div>
      </form>
    </div>
  );
}
