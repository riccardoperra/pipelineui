import {container, listItem} from './JobStepsForm.css';
import {createEffect, createSignal, For} from 'solid-js';
import {provideState} from 'statebuilder';
import {PanelEditorStore} from '../panel-editor.store';
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@codeui/kit';
import {Icon} from '#ui/components/Icon';
import {EditorStore} from '#editor-store/editor.store';

export function JobStepsForm() {
  const panelStore = provideState(PanelEditorStore);
  const editorStore = provideState(EditorStore);

  const steps = () => panelStore.selectedJob().steps;

  return (
    <ul class={container}>
      <For each={steps()}>
        {step => {
          const [deleting, setDeleting] = createSignal(false);
          return (
            <li class={listItem}>
              {step.name || step.id}

              <div>
                <IconButton
                  size={'xs'}
                  theme={'secondary'}
                  variant={'ghost'}
                  aria-label={`Edit step ${step.name || step.id}`}
                  onClick={() =>
                    panelStore.actions.setActiveStepId(step.$nodeId)
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
                        aria-label={`Edit step ${step.name || step.id}`}
                        {...triggerProps}
                      >
                        <Icon name={'delete'} />
                      </IconButton>
                    )}
                  />
                  <PopoverContent variant={'bordered'}>
                    <strong>Do you want to delete the job?</strong>
                    <span>This action is not reversible.</span>

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
                        editorStore.actions.deleteJobStep({
                          jobId: editorStore.selectedJob().$nodeId,
                          stepId: step.$nodeId,
                        });
                      }}
                    >
                      Confirm
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </li>
          );
        }}
      </For>
    </ul>
  );
}
