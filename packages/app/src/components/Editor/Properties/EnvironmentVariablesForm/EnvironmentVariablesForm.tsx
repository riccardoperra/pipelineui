import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import type {WorkflowStructureEnvItem} from '../../store/editor.types';
import {EnvironmentVariablesForm} from '../../common/EnvironmentVariables/EnvironmentVariablesForm';

export function PropertiesEnvironmentVariablesForm() {
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
    <EnvironmentVariablesForm
      onAddNew={addNew}
      items={envItems()}
      onUpdate={(value, index) => {
        editor.actions.updateEnvironmentVariableByIndex({
          index: index,
          value,
        });
      }}
      onDelete={(value, index) => {
        editor.actions.deleteEnvironmentVariableByIndex({index: index});
      }}
    />
  );
}
