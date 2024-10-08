import * as styles from './FlowItem.css';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';
import {provideState} from 'statebuilder';
import {EditorStore} from '../store/editor.store';

interface FlowItemProps {
  job: WorkflowTemplate['jobs'][number];
}

export function FlowItem(props: FlowItemProps) {
  const editor = provideState(EditorStore);

  const onClick = () => editor.set('selectedJobId', props.job.id.value);

  return (
    <div
      class={styles.flowItem}
      data-selected={
        editor.get.selectedJobId === props.job.id.value ? '' : null
      }
      onClick={onClick}
    >
      <div class={styles.flowItemHeader}>{props.job.name?.toString()}</div>
    </div>
  );
}
