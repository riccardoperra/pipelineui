import {PanelHeader} from '../../Jobs/JobPanelEditor/Form/PanelHeader';
import {IconButton} from '@codeui/kit';
import {For} from 'solid-js';
import {Accordion} from '@kobalte/core/accordion';
import {workflowDispatchList} from './WorkflowDispatchForm.css';
import {WorkflowDispatchItemForm} from './WorkflowDispatchItemForm';
import {provideState} from 'statebuilder';
import {
  EditorStore,
  type WorkflowDispatchInput,
} from '../../store/editor.store';

export function WorkflowDispatchForm() {
  const editor = provideState(EditorStore);
  const workflowDispatchInputs = () =>
    editor.get.structure.events.workflowDispatch;

  const addNew = () => {
    const draftInput: WorkflowDispatchInput = {
      name: '',
      type: 'string',
      deprecationMessage: undefined,
      required: false,
      default: undefined,
      description: undefined,
      options: undefined,
    };
    editor.actions.workflowDispatch.addNew(draftInput);
  };

  return (
    <>
      <PanelHeader
        label={'Workflow Dispatch'}
        rightContent={
          <IconButton
            size={'xs'}
            theme={'secondary'}
            aria-label={'Add input'}
            onClick={addNew}
          >
            +
          </IconButton>
        }
      />

      <Accordion class={workflowDispatchList}>
        <For each={workflowDispatchInputs()}>
          {(input, index) => {
            return (
              <WorkflowDispatchItemForm
                value={input}
                index={index()}
                onChange={value => {
                  editor.actions.workflowDispatch.updateByIndex(index(), value);
                }}
              />
            );
          }}
        </For>
      </Accordion>
    </>
  );
}
