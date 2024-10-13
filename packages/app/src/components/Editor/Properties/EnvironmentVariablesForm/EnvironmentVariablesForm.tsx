import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {For, Show} from 'solid-js';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import type {WorkflowStructureEnvItem} from '../../store/editor.types';
import {PanelPlusButton} from '#editor-layout/Panel/Form/PanelPlusButton';
import {EnvironmentVariablesItemForm} from './EnvironmentVariablesItemForm';
import {PanelAccordion} from '#editor-layout/Panel/Form/PanelAccordion/PanelAccordion';
import {PanelContent} from '#editor-layout/Panel/Form/PanelContent';

export function EnvironmentVariablesForm() {
  const editor = provideState(EditorStore);
  const envItems = () => editor.get.structure.env.array;

  const addNew = () => {
    const draftInput: WorkflowStructureEnvItem = {
      name: '',
      value: '',
      type: 'string',
    };
    editor.actions.addNewEnvironmentVariable({value: draftInput});
  };

  return (
    <>
      <PanelHeader
        label={'Environment variables'}
        rightContent={() => (
          <PanelPlusButton
            aria-label={'Add environment variable'}
            onClick={addNew}
          />
        )}
      />

      <Show when={envItems().length}>
        <PanelContent>
          <PanelAccordion>
            <For each={envItems()}>
              {(input, index) => {
                return (
                  <EnvironmentVariablesItemForm
                    value={input}
                    index={index()}
                    onChange={value =>
                      editor.actions.updateEnvironmentVariableByIndex({
                        index: index(),
                        value,
                      })
                    }
                    onDelete={() => {}}
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
