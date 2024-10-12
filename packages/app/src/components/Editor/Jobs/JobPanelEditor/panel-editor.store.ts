import {defineStore} from 'statebuilder';
import {EditorStore} from '#editor-store/editor.store';
import {createMemo} from 'solid-js';
import {withProxyCommands} from 'statebuilder/commands';

export interface PanelEditorState {
  activeStep: string | null;
}

export const PanelEditorStore = defineStore<PanelEditorState>(() => ({
  activeStep: null,
}))
  .extend(
    withProxyCommands<{
      setActiveStepId: string;
    }>(),
  )
  .extend(_ => {
    _.hold(_.commands.setActiveStepId, (id, {set}) => set('activeStep', id));
  })
  .extend((_, context) => {
    const editorStore = context.inject(EditorStore);

    const selectedStep = createMemo(() => {
      const activeStep = _.get.activeStep;
      if (activeStep === null) {
        return null;
      }
      return editorStore
        .selectedJob()!
        .steps.find(step => step.$nodeId === activeStep)!;
    });

    return {
      get selectedJob() {
        return editorStore.selectedJob();
      },
      selectedStep,
      get headerPanelLabel() {
        const selectedJob = editorStore.selectedJob()!;
        const activeStep = selectedStep();
        const jobName = `${selectedJob.name || selectedJob.id}`;
        if (activeStep === null) {
          return jobName;
        }
        return `${jobName} / ${activeStep.name ?? activeStep.id}`;
      },
    };
  });
