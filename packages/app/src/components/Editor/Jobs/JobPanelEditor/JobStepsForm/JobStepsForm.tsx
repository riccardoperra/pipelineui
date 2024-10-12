import {container, listItem} from './JobStepsForm.css';
import {createEffect, For} from 'solid-js';
import {provideState} from 'statebuilder';
import {PanelEditorStore} from '../panel-editor.store';

export function JobStepsForm() {
  const panelStore = provideState(PanelEditorStore);

  const steps = () => panelStore.selectedJob().steps;

  return (
    <div class={container}>
      <For each={steps()}>
        {step => (
          <button
            class={listItem}
            onClick={() => panelStore.actions.setActiveStepId(step.$nodeId)}
          >
            {step.name || step.id}
          </button>
        )}
      </For>
    </div>
  );
}
