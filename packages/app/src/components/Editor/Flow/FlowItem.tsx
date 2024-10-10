import * as styles from './FlowItem.css';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';
import {provideState} from 'statebuilder';
import {EditorStore} from '../store/editor.store';
import {flowItemContent} from './FlowItem.css';

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
      <div class={styles.flowItemContent}>
        <div>
          <span
            style={{
              padding: '2px 6px',
              'background-color': '#2d2d2d',
              'border-radius': '8px',
            }}
          >
            {props.job?.steps?.length} steps
          </span>

          <span
            style={{
              padding: '2px 6px',
              'background-color': '#2d2d2d',
              'border-radius': '8px',
            }}
          >
            {props.job.type === 'job' && props.job['runs-on']?.['value']}
          </span>
        </div>
      </div>
    </div>
  );
}
