import {WorkflowDispatchForm} from './WorkflowDispatchForm/WorkflowDispatchForm';
import {PanelDivider} from '../Layout/Panel/Form/PanelDivider';
import {WorkflowConcurrencyForm} from './WorkflowConcurrencyForm/WorkflowConcurrencyForm';
import {PanelGroup} from '#editor-layout/Panel/Form/PanelGroup';
import {EnvironmentVariablesForm} from './EnvironmentVariablesForm/EnvironmentVariablesForm';

interface Form {}

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
