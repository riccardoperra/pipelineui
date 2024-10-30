import {IconButton, TextField} from '@codeui/kit';
import {createSignal, Show, useTransition} from 'solid-js';
import {Icon} from '#ui/components/Icon';
import {useSearchParams} from '@solidjs/router';
import {
  contentTitle,
  resetRepoSubmitButton,
  submitRepoInput,
  submitRepoInputContainer,
  submitRepoInputRoot,
  submitRepoSubmitButton,
  wrapper,
} from './RepoSearch.css';
import {provideState} from 'statebuilder';
import {RepoStore} from '../store';

export function RepoSearch() {
  const [searchTextValue, setSearchTextValue] = createSignal<string>('');
  const [, setParams] = useSearchParams();
  const [hasPendingTask] = useTransition();

  return (
    <div class={wrapper}>
      <h2 class={contentTitle}>Search for existing github repositories...</h2>
      <form
        role={'search'}
        onSubmit={e => {
          e.preventDefault();
          if (hasPendingTask()) {
            return;
          }
          const data = new FormData(e.target as HTMLFormElement);
          setParams({repo: (data.get('path') as string) ?? ''});
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
            value={searchTextValue()}
            onChange={setSearchTextValue}
          />
          <Show when={searchTextValue()}>
            <IconButton
              class={resetRepoSubmitButton}
              size={'sm'}
              aria-label={'Cancel'}
              type={'button'}
              variant={'ghost'}
              theme={'secondary'}
              onClick={() => {
                setSearchTextValue('');
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
            disabled={hasPendingTask()}
            theme={'secondary'}
          >
            <Icon name={'keyboard_return'} />
          </IconButton>
        </div>
      </form>
    </div>
  );
}
