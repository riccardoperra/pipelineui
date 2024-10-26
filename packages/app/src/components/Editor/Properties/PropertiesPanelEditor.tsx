import {WorkflowDispatchForm} from './WorkflowDispatchForm/WorkflowDispatchForm';
import {TriggerForm} from './TriggerForm/TriggerForm';
import {PanelGroup} from '#editor-layout/Panel/Form/PanelGroup';
import {PropertiesEnvironmentVariablesForm} from './EnvironmentVariablesForm/EnvironmentVariablesForm';
import {PanelDivider} from '#editor-layout/Panel/Form/PanelDivider';
import {JobsListForm} from './JobsListForm/JobsListForm';

export function PropertiesPanelEditor() {
  return (
    <PanelGroup noGap>
      <TriggerForm />

      <PanelDivider/>

      <WorkflowDispatchForm />

      <PanelDivider />

      <PropertiesEnvironmentVariablesForm />

      <PanelDivider />

      <JobsListForm />
    </PanelGroup>
  );
}
