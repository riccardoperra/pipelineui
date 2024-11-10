import {PanelHeader} from '~/components/Editor/layout1/Panel/Form/PanelHeader';
import {PanelPlusButton} from '~/components/Editor/layout1/Panel/Form/PanelPlusButton';
import {EditorStore} from '~/store/editor/editor.store';
import {Icon} from '#ui/components/Icon';
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@codeui/kit';
import {createSignal, For} from 'solid-js';
import {provideState} from 'statebuilder';
import {PanelEditorStore} from '../panel-editor.store';
import {
  container,
  listItem,
  listItemActions,
  listItemName,
} from './JobStepsForm.css';

export function JobStepsForm() {
  const panelStore = provideState(PanelEditorStore);
  const editorStore = provideState(EditorStore);

  const steps = () => panelStore.selectedJob().steps;

  return (
    <>
      <PanelHeader
        label={'Steps'}
        rightContent={() => (
          <PanelPlusButton
            aria-label={'Add job step'}
            onClick={() => {
              editorStore.actions.addNewJobStep({
                jobId: editorStore.selectedJob().$nodeId,
              });
            }}
          />
        )}
      />
      <ul class={container}>
        <For each={steps()}>
          {step => {
            const [deleting, setDeleting] = createSignal(false);
            return (
              <li class={listItem}>
                <span class={listItemName}>{step.name || step.id}</span>

                <div class={listItemActions}>
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
                            editorStore.actions.deleteJobStep({
                              jobId: editorStore.selectedJob().$nodeId,
                              stepId: step.$nodeId,
                            });
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
