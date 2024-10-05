import * as styles from './PropertiesPanelEditor.css';
import {WorkflowDispatchForm} from './WorkflowDispatchForm/WorkflowDispatchForm';
import {PanelDivider} from '../Jobs/JobPanelEditor/Form/PanelDivider';
import {WorkflowConcurrencyForm} from './WorkflowConcurrencyForm/WorkflowConcurrencyForm';

interface Form {}

export function PropertiesPanelEditor() {
  return (
    <div class={styles.jobPanelEditor}>
      <WorkflowDispatchForm />

      <PanelDivider />

      <WorkflowConcurrencyForm />
    </div>
  );
}
