import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {For, Show} from 'solid-js';
import {WorkflowDispatchItemForm} from './WorkflowDispatchItemForm';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import type {WorkflowDispatchInput} from '../../store/editor.types';
import {PanelPlusButton} from '#editor-layout/Panel/Form/PanelPlusButton';
import {PanelAccordion} from '#editor-layout/Panel/Form/PanelAccordion/PanelAccordion';
import {PanelContent} from '#editor-layout/Panel/Form/PanelContent';

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
          <PanelPlusButton
            aria-label={'Add workflow dispatch item'}
            onClick={addNew}
          />
        }
      />

      <Show when={workflowDispatchInputs().length}>
        <PanelContent>
          <PanelAccordion>
            <For each={workflowDispatchInputs()}>
              {(input, index) => {
                return (
                  <WorkflowDispatchItemForm
                    value={input}
                    index={index()}
                    onDelete={() =>
                      editor.actions.workflowDispatch.deleteByIndex(index())
                    }
                    onChange={value => {
                      editor.actions.workflowDispatch.updateByIndex(
                        index(),
                        value,
                      );
                    }}
                  />
                );
              }}
            </For>
          </PanelAccordion>
        </PanelContent>
      </Show>
    </>
  );
}
