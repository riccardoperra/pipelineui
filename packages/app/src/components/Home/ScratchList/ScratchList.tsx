import {A, createAsync, useAction, useSubmissions} from '@solidjs/router';
import {
  deleteScratch,
  listUserScratches,
  ScratchesListResponse,
} from '../../../lib/scratchApi';
import {createMemo, For, Match, Show, Switch} from 'solid-js';
import {Icon} from '#ui/components/Icon';
import {Button, buttonStyles, mergeClasses, PopoverTrigger} from '@codeui/kit';
import {
  scratchList,
  scratchListItem,
  scratchListItemActions,
  scratchListItemInfo,
  scratchListItemInfoName,
  scratchListItemInfoType,
  scratchListItemLink,
} from './ScratchList.css';
import {ConfirmPopover} from '#ui/components/ConfirmPopover/ConfirmPopover';
import {useI18n} from '~/locales/i18n';
import {msg} from '@lingui/macro';

function ScratchListForkLabel(props: {url: string}) {
  const parsedUrl = () => {
    const [owner, repoName, branchName, ...filePath] = props.url.split('/');

    const fileName = filePath[filePath.length - 1];
    return {
      owner,
      repoName,
      branchName,
      filePath,
      fileName,
    };
  };

  return (
    <Show when={parsedUrl()}>
      {parsedUrl => (
        <>
          @{parsedUrl().owner}/{parsedUrl().repoName}#{parsedUrl().branchName} -{' '}
          {parsedUrl().fileName}
        </>
      )}
    </Show>
  );
}

export interface ScratchListItemDeleteActionProps {
  scratchId: string;
  onDelete?: () => void;
}

function ScratchListItemDeleteAction(props: ScratchListItemDeleteActionProps) {
  const {_} = useI18n();
  const deleteScratchAction = useAction(deleteScratch);

  return (
    <ConfirmPopover
      actionType={'destructive'}
      description={_(msg`Do you want do delete this scratch file?`)}
      onConfirm={() => {
        deleteScratchAction(props.scratchId).then(props.onDelete);
      }}
    >
      <PopoverTrigger
        as={triggerProps => (
          <Button
            size={'xs'}
            theme={'negative'}
            variant={'ghost'}
            {...triggerProps}
          />
        )}
      >
        <Icon name={'delete'} />
      </PopoverTrigger>
    </ConfirmPopover>
  );
}

export function ScratchList() {
  const {_} = useI18n();
  const scratches = createAsync(() => listUserScratches(), {
    initialValue: {documents: [], total: 0},
  });

  const deleteSubmissions = useSubmissions(deleteScratch);

  const optimisticScratches = createMemo<ScratchesListResponse>(() => {
    const $scratches = scratches();
    if (deleteSubmissions.pending) {
      const deleteIds = deleteSubmissions.map(deletion => deletion.input[0]);
      return {
        total: $scratches.total - deleteSubmissions.length,
        documents: $scratches.documents.filter(
          scratch => !deleteIds.includes(scratch.$id),
        ),
      };
    }
    return $scratches;
  });

  return (
    <Show when={optimisticScratches()}>
      {scratches => (
        <ul class={scratchList}>
          <For each={scratches().documents}>
            {scratch => (
              <li
                class={mergeClasses(
                  buttonStyles.button({
                    size: 'md',
                    theme: 'secondary',
                  }),
                  scratchListItem,
                )}
              >
                <A
                  aria-label={`Edit ${scratch.name}.yml`}
                  href={`/editor/scratch/${scratch.$id}`}
                  class={scratchListItemLink}
                />
                <span class={scratchListItemInfo}>
                  <span class={scratchListItemInfoName}>
                    {scratch.name}.yml
                  </span>
                  <small class={scratchListItemInfoType}>
                    <Switch>
                      <Match when={scratch.type === 'fork'}>
                        <ScratchListForkLabel url={scratch.forkUrl} />
                      </Match>

                      <Match when={scratch.type === 'scratch'}>
                        {_(msg`Scratch file`)}
                      </Match>
                    </Switch>
                  </small>
                </span>

                <span class={scratchListItemActions}>
                  <ScratchListItemDeleteAction scratchId={scratch.$id} />
                </span>
              </li>
            )}
          </For>
        </ul>
      )}
    </Show>
  );
}
