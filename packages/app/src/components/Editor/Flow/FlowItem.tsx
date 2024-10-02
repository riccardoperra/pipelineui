import * as styles from './FlowItem.css';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';

interface FlowItemProps {
  job: WorkflowTemplate['jobs'][number];
}

export function FlowItem(props: FlowItemProps) {
  return (
    <div class={styles.flowItem}>
      <div class={styles.flowItemHeader}>{props.job.name?.toString()}</div>
    </div>
  );
}
