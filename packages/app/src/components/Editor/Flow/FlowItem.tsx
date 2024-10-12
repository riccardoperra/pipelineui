import * as styles from './FlowItem.css';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';
import {provideState} from 'statebuilder';
import {EditorStore} from '../store/editor.store';
import {flowItemContent} from './FlowItem.css';
import {Show} from 'solid-js';

interface FlowItemProps {
  job: WorkflowTemplate['jobs'][number];
}

export function FlowItem(props: FlowItemProps) {
  const editor = provideState(EditorStore);

  const job = () =>
    editor.get.structure.jobs.find(job => job.id === props.job.id.value);

  const onClick = () => editor.set('selectedJobId', props.job.id.value);

  return (
    <div
      class={styles.flowItem}
      data-selected={
        editor.get.selectedJobId === props.job.id.value ? '' : null
      }
      onClick={onClick}
    >
      <div class={styles.flowItemHeader}>{job()?.name}</div>
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

          <Show when={job()?.runsOn}>
            {runsOn => (
              <span
                style={{
                  padding: '2px 6px',
                  'background-color': '#2d2d2d',
                  'border-radius': '8px',
                }}
              >
                {job()?.runsOn}
              </span>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
