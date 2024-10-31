import {defineStore} from 'statebuilder';
import {EditorStore} from '~/store/editor/editor.store';
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
      setActiveStepId: string | null;
    }>(),
  )
  .extend(_ => {
    _.hold(_.commands.setActiveStepId, (id, {set}) => set('activeStep', id));
  })
  .extend((_, context) => {
    const editorStore = context.inject(EditorStore);

    context.hooks.onInit(() => {
      const command = `@@BEFORE/${editorStore.commands.setSelectedJobId.identity}`;
      editorStore.watchCommand(new RegExp(command)).subscribe(command => {
        _.actions.setActiveStepId(null);
      });
    });

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
      back() {
        if (_.get.activeStep) {
          _.actions.setActiveStepId(null);
        } else {
          editorStore.actions.setSelectedJobId(null);
        }
      },
      selectedJob: editorStore.selectedJob,
      deselectJob() {
        editorStore.actions.setSelectedJobId(null);
      },
      selectedStep,
      headerPanelLabel: () => {
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
