import * as styles from './FlowItem.css';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../../store/editor/editor.store';
import {Show} from 'solid-js';
import type {WorkflowStructureJob} from '~/store/editor/editor.types';

interface FlowItemProps {
  job: WorkflowStructureJob;
}

export function FlowItem(props: FlowItemProps) {
  const editor = provideState(EditorStore);

  const job = () =>
    editor.get.structure.jobs.find(job => job.$nodeId === props.job.$nodeId);

  const onClick = () => {
    editor.actions.setSelectedJobId(props.job.$nodeId);
  };

  return (
    <div
      class={styles.flowItem}
      data-selected={editor.get.selectedJobId === props.job.$nodeId ? '' : null}
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
                {runsOn()}
              </span>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
