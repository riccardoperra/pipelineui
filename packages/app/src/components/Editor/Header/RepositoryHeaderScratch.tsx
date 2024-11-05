import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TextField,
} from '@codeui/kit';
import {useAction, useSubmission} from '@solidjs/router';
import {createSignal, Show} from 'solid-js';
import {updateScratchName} from '~/lib/scratchApi';
import {Icon} from '~/ui/components/Icon';
import {useEditorContext} from '../editor.context';
import * as confirmPopoverStyles from '~/ui/components/ConfirmPopover/ConfirmPopover.css';
import {provideState} from 'statebuilder';
import {EditorStore} from '~/store/editor/editor.store';

export function EditorRepositoryHeaderScratch() {
  const editor = useEditorContext()!;
  const editorStore = provideState(EditorStore);
  const [editing, setEditing] = createSignal(false);

  const renamingScratch = useAction(updateScratchName);
  const renamingScratchSubsmission = useSubmission(updateScratchName);

  return (
    <Show when={editor.scratch?.()}>
      {scratch => (
        <span>
          {scratch().name}.yml
          <Show when={editorStore.canEditCurrent()}>
            <Popover open={editing()} onOpenChange={setEditing}>
              <PopoverTrigger
                as={triggerProps => (
                  <IconButton
                    aria-label="Rename"
                    size={'xs'}
                    variant={'ghost'}
                    theme={'secondary'}
                    {...triggerProps}
                  />
                )}
              >
                <Icon name={'edit'} />
              </PopoverTrigger>
              <PopoverContent>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const data = new FormData(e.target as HTMLFormElement);
                    renamingScratch(
                      editor.remoteId!,
                      data.get('name') as string,
                    ).finally(() => {
                      setEditing(false);
                    });
                  }}
                >
                  <TextField name={'name'} defaultValue={scratch().name} />
                  <div class={confirmPopoverStyles.contentFooter}>
                    <Button
                      type={'submit'}
                      size="xs"
                      theme={'primary'}
                      loading={renamingScratchSubsmission.pending}
                    >
                      Rename
                    </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </Show>
        </span>
      )}
    </Show>
  );
}
