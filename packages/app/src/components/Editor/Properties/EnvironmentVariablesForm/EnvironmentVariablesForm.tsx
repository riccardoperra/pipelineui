import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {createEffect, For} from 'solid-js';
import {Accordion} from '@kobalte/core/accordion';
import {workflowDispatchList} from './EnvironmentVariableForm.css';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import type {
  WorkflowDispatchInput,
  WorkflowStructureEnvItem,
} from '../../store/editor.types';
import {PanelPlusButton} from '#editor-layout/Panel/Form/PanelPlusButton';
import {EnvironmentVariablesItemForm} from './EnvironmentVariablesItemForm';

export function EnvironmentVariablesForm() {
  const editor = provideState(EditorStore);
  const envItems = () => editor.get.structure.env.array;

  const addNew = () => {
    const draftInput: WorkflowStructureEnvItem = {
      name: '',
      value: '',
      type: 'string',
    };
    editor.actions.environmentVariables.addNew(draftInput);
  };

  return (
    <>
      <PanelHeader
        label={'Environment variables'}
        rightContent={
          <PanelPlusButton
            aria-label={'Add environment variable'}
            onClick={addNew}
          />
        }
      />

      <Accordion class={workflowDispatchList} collapsible>
        <For each={envItems()}>
          {(input, index) => {
            return (
              <EnvironmentVariablesItemForm
                value={input}
                index={index()}
                onChange={value =>
                  editor.actions.environmentVariables.updateByIndex(
                    index(),
                    value,
                  )
                }
                onDelete={() => {}}
              />
            );
          }}
        </For>
      </Accordion>
    </>
  );
}
