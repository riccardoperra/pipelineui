import * as styles from './FlowItem.css';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';

interface FlowItemProps {
  job: WorkflowTemplate['jobs'][number];
}

export function FlowItem(props: FlowItemProps) {
  return <div class={styles.flowItem}>{props.job.name?.toString()}</div>;
}
