import {EditorStore} from '~/store/editor/editor.store';
import {Icon} from '#ui/components/Icon';
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@codeui/kit';
import {A, useSubmission} from '@solidjs/router';
import {createSignal, JSX, type ParentProps, Show, useContext} from 'solid-js';
import {provideState} from 'statebuilder';
import {UserStore} from '~/store/user.store';
import {createScratchFork, updateScratch} from '../../../lib/scratchApi';
import {EditorContext} from '../editor.context';
import {EditorUiStore} from '../../../store/editor/ui.store';
import * as styles from './EditorHeader.css';
import {EditorHeaderCurrentUser} from './CurrentUser/CurrentUser';
import {useI18n} from '~/locales/i18n';
import {msg} from '@lingui/macro';

export interface EditorHeaderProps {
  showBack: boolean;
  name: JSX.Element;
}

function EditorHeaderActionButton(
  props: ParentProps<{
    active: boolean;
    onClick: () => void;
  }>,
) {
  return (
    <Button
      class={styles.subHeaderAction()}
      theme={'secondary'}
      variant={!props.active ? 'ghost' : undefined}
      size={'xs'}
      onClick={() => props.onClick()}
    >
      {props.children}
    </Button>
  );
}

function EditorHeaderForkButton() {
  const {_} = useI18n();
  const [isOpen, setOpen] = createSignal(false);
  const editorStore = provideState(EditorStore);
  const editorContext = useContext(EditorContext)!;

  return (
    <Popover open={isOpen()} onOpenChange={setOpen}>
      <PopoverTrigger
        as={triggerProps => (
          <Button theme={'primary'} size={'sm'} {...triggerProps}>
            {_(msg`Fork`)}
          </Button>
        )}
      />
      <PopoverContent variant={'bordered'}>
        {_(
          msg`Forking this source will create a new scratch remotely connected to your profile, that can be modified only by you`,
        )}
        <div style={{'margin-top': '8px'}}>
          {/* TODO: fix this inline style */}
          <form
            method={'post'}
            action={createScratchFork.with(
              editorContext.repository!,
              editorStore.yamlSession.initialSource(),
              editorStore.yamlSession.source(),
            )}
          >
            <Button size={'xs'} theme={'primary'} type={'submit'}>
              {_(msg`Confirm`)}
            </Button>
            <Button
              size={'xs'}
              theme={'secondary'}
              type={'button'}
              onClick={() => setOpen(false)}
            >
              {_(msg`Cancel`)}
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function EditorHeader(props: EditorHeaderProps) {
  const {_} = useI18n();
  const editorUi = provideState(EditorUiStore);
  const editorStore = provideState(EditorStore);
  const user = provideState(UserStore);

  const isUpdating = useSubmission(updateScratch);

  return (
    <>
      <header class={styles.header}>
        <Show when={props.showBack}>
          <IconButton
            aria-label={_(msg`Go back`)}
            size={'xs'}
            theme={'secondary'}
            pill
            as={A}
            href={'/'}
            style={{'text-decoration': 'none'}}
          >
            <Icon name={'arrow_left_alt'} />
          </IconButton>
        </Show>

        {props.name}

        <div class={styles.headerRightSide}>
          <Show when={user()}>
            <Show
              fallback={
                <>
                  <EditorHeaderForkButton />
                </>
              }
              when={editorStore.get.remoteId}
            >
              {remoteId => (
                <Show when={editorStore.scratch()?.canEdit}>
                  <form
                    action={updateScratch.with(
                      remoteId(),
                      editorStore.yamlSession.source(),
                    )}
                    method={'post'}
                  >
                    <Button
                      type={'submit'}
                      theme={'primary'}
                      size={'sm'}
                      loading={isUpdating.pending}
                    >
                      {_(msg`Save`)}
                    </Button>
                  </form>
                </Show>
              )}
            </Show>
          </Show>

          <EditorHeaderCurrentUser user={user() ?? null} />
        </div>
      </header>
      <div class={styles.subHeader}>
        <EditorHeaderActionButton
          active={editorUi.get.leftPanel === 'code'}
          onClick={() => editorUi.actions.toggleLeftPanel('code')}
        >
          {_(msg`Code`)}
        </EditorHeaderActionButton>
        <EditorHeaderActionButton
          active={editorUi.get.leftPanel === 'merge'}
          onClick={() => editorUi.actions.toggleLeftPanel('merge')}
        >
          {_(msg`Merge view`)}
        </EditorHeaderActionButton>

        <div class={styles.subHeaderRightContent}>
          <EditorHeaderActionButton
            active={editorUi.get.rightPanel === 'properties'}
            onClick={() => editorUi.actions.toggleRightPanel('properties')}
          >
            {_(msg`Properties`)}
          </EditorHeaderActionButton>
        </div>
      </div>
    </>
  );
}
