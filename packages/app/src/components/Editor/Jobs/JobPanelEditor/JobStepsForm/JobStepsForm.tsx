import {container, listItem} from './JobStepsForm.css';
import type {WorkflowStructureJobStep} from '#editor-store/editor.types';
import {createEffect, For} from 'solid-js';

export interface JobStepsFormProps {
  steps: WorkflowStructureJobStep[];
  onClickStep: (stepId: string) => void;
}

export function JobStepsForm(props: JobStepsFormProps) {
  return (
    <div class={container}>
      <For each={props.steps}>
        {step => (
          <button class={listItem} onClick={() => props.onClickStep(step.id)}>
            {step.id}
          </button>
        )}
      </For>
    </div>
  );
}
