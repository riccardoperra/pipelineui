import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {For, Show} from 'solid-js';
import type {WorkflowStructureEnvItem} from '../../store/editor.types';
import {PanelPlusButton} from '#editor-layout/Panel/Form/PanelPlusButton';
import {EnvironmentVariablesItemForm} from './EnvironmentVariablesItemForm';
import {PanelAccordion} from '#editor-layout/Panel/Form/PanelAccordion/PanelAccordion';
import {PanelContent} from '#editor-layout/Panel/Form/PanelContent';

export interface EnvironmentVariablesFormProps {
  onAddNew: () => void;
  items: readonly WorkflowStructureEnvItem[];
  onUpdate: (item: WorkflowStructureEnvItem, index: number) => void;
  onDelete: (item: WorkflowStructureEnvItem, index: number) => void;
}

export function EnvironmentVariablesForm(props: EnvironmentVariablesFormProps) {
  const envItems = () => props.items;

  const addNew = () => {
    props.onAddNew();
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

      <Show when={!!envItems().length && envItems()}>
        {envItems => (
          <PanelContent>
            <PanelAccordion>
              <For each={envItems()}>
                {(input, index) => {
                  return (
                    <EnvironmentVariablesItemForm
                      value={input}
                      index={index()}
                      onChange={value => props.onUpdate(value, index())}
                      onDelete={() => props.onDelete(input, index())}
                    />
                  );
                }}
              </For>
            </PanelAccordion>
          </PanelContent>
        )}
      </Show>
    </>
  );
}
