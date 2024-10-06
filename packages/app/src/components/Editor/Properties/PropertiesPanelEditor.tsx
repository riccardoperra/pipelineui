import {WorkflowDispatchForm} from './WorkflowDispatchForm/WorkflowDispatchForm';
import {WorkflowConcurrencyForm} from './WorkflowConcurrencyForm/WorkflowConcurrencyForm';
import {PanelGroup} from '#editor-layout/Panel/Form/PanelGroup';
import {EnvironmentVariablesForm} from './EnvironmentVariablesForm/EnvironmentVariablesForm';
import {PanelDivider} from '#editor-layout/Panel/Form/PanelDivider';

export function PropertiesPanelEditor() {
  return (
    <PanelGroup>
      <WorkflowDispatchForm />

      <PanelDivider />

      <EnvironmentVariablesForm />

      <PanelDivider />

      <WorkflowConcurrencyForm />
    </PanelGroup>
  );
}
