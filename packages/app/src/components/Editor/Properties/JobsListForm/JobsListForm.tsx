import {container, listItem} from './JobsListForm.css';
import {createSignal, For} from 'solid-js';
import {provideState} from 'statebuilder';
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@codeui/kit';
import {Icon} from '#ui/components/Icon';
import {EditorStore} from '#editor-store/editor.store';
import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {PanelPlusButton} from '#editor-layout/Panel/Form/PanelPlusButton';

export function JobsListForm() {
  const editorStore = provideState(EditorStore);

  const jobs = () => editorStore.get.structure.jobs;

  return (
    <>
      <PanelHeader
        label={'Jobs'}
        rightContent={() => (
          <PanelPlusButton aria-label={'Add job step'} onClick={() => {}} />
        )}
      />
      <ul class={container}>
        <For each={jobs()}>
          {job => {
            const [deleting, setDeleting] = createSignal(false);
            return (
              <li class={listItem}>
                {job.name || job.id}

                <div>
                  <IconButton
                    size={'xs'}
                    theme={'secondary'}
                    variant={'ghost'}
                    aria-label={`Edit job ${job.name || job.id}`}
                    onClick={() =>
                      editorStore.actions.setSelectedJobId(job.$nodeId)
                    }
                  >
                    <Icon name={'edit'} />
                  </IconButton>

                  <Popover open={deleting()} onOpenChange={setDeleting}>
                    <PopoverTrigger
                      as={triggerProps => (
                        <IconButton
                          size={'xs'}
                          theme={'negative'}
                          variant={'ghost'}
                          aria-label={`Delete job ${job.name || job.id}`}
                          {...triggerProps}
                        >
                          <Icon name={'delete'} />
                        </IconButton>
                      )}
                    />
                    <PopoverContent variant={'bordered'}>
                      <strong>Confirm deletion</strong>
                      <div>This action is not reversible.</div>

                      {/*TODO add component*/}
                      <div
                        style={{
                          'margin-top': '16px',
                          display: 'flex',
                          gap: '4px',
                        }}
                      >
                        <Button
                          theme={'secondary'}
                          size={'xs'}
                          onClick={() => setDeleting(false)}
                        >
                          Close
                        </Button>

                        <Button
                          theme={'negative'}
                          size={'xs'}
                          onClick={() => {
                            setDeleting(false);
                            // editorStore.actions.deleteJob({
                            //   jobId: editorStore.selectedJob().$nodeId,
                            //   stepId: step.$nodeId,
                            // });
                          }}
                        >
                          Confirm
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </li>
            );
          }}
        </For>
      </ul>
    </>
  );
}
