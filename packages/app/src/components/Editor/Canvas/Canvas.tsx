import * as styles from './Canvas.css';
import {FlowItem} from '../Flow/FlowItem';
import {FlowContainer} from '../Flow/FlowContainer';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';
import {For} from 'solid-js';

export interface CanvasProps {
  template: WorkflowTemplate;
}

export function Canvas(props: CanvasProps) {
  return (
    <div class={styles.canvasContainer}>
      <FlowContainer template={props.template}>
        <For each={props.template.jobs}>{job => <FlowItem job={job} />}</For>
      </FlowContainer>
    </div>
  );
}
