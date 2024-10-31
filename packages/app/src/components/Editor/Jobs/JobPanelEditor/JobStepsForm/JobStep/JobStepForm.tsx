import {FullWidthPanelRow} from '#editor-layout/Panel/Form/PanelRow';
import {
  SegmentedControl,
  SegmentedControlItem,
  TextArea,
  TextField,
} from '@codeui/kit';
import * as formStyles from '#editor-layout/Panel/Form/Form.css';
import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {provideState} from 'statebuilder';
import {EditorStore} from '~/store/editor/editor.store';
import {PanelContent} from '#editor-layout/Panel/Form/PanelContent';
import {Show} from 'solid-js';
import type {
  WorkflowStructureJobActionStep,
  WorkflowStructureJobRunStep,
} from '~/store/editor/editor.types';
import {PanelEditorStore} from '../../panel-editor.store';
import {PanelDivider} from '#editor-layout/Panel/Form/PanelDivider';
import {EnvironmentVariablesForm} from '../../../../common/EnvironmentVariables/EnvironmentVariablesForm';

export function JobStepForm() {
  const {selectedJob, actions, get} = provideState(EditorStore);
  const panelStore = provideState(PanelEditorStore);

  const jobStep = panelStore.selectedStep;

  return (
    <Show when={jobStep()}>
      {jobStep => (
        <>
          <PanelHeader label={`Step properties`} />

          <PanelContent withGap>
            <FullWidthPanelRow>
              <TextField
                slotClasses={{
                  root: formStyles.inlineInputRoot,
                  label: formStyles.inlineInputLabel,
                }}
                size={'sm'}
                theme={'filled'}
                label={'Name'}
                value={jobStep()?.name}
                onChange={name =>
                  actions.updateJobStepName({
                    jobId: selectedJob()!.$nodeId,
                    stepId: jobStep().$nodeId,
                    name,
                  })
                }
              />
            </FullWidthPanelRow>

            <FullWidthPanelRow>
              <TextField
                slotClasses={{
                  root: formStyles.inlineInputRoot,
                  label: formStyles.inlineInputLabel,
                }}
                size={'sm'}
                theme={'filled'}
                label={'If'}
                value={jobStep()?.if}
                onChange={value =>
                  actions.updateJobStepIf({
                    jobId: selectedJob()!.$nodeId,
                    stepId: jobStep().$nodeId,
                    value,
                  })
                }
              />
            </FullWidthPanelRow>

            <FullWidthPanelRow>
              <div class={formStyles.inlineInputRoot}>
                <label class={formStyles.inlineInputLabel}>Type</label>
                <SegmentedControl
                  variant={'solid'}
                  size={'sm'}
                  autoWidth
                  fluid
                  value={jobStep()?.type}
                  onChange={type =>
                    actions.updateJobStepType({
                      jobId: selectedJob()!.$nodeId,
                      stepId: jobStep().$nodeId,
                      type,
                    })
                  }
                >
                  <SegmentedControlItem value={'run'}>Run</SegmentedControlItem>
                  <SegmentedControlItem value={'action'}>
                    Action
                  </SegmentedControlItem>
                </SegmentedControl>
              </div>
            </FullWidthPanelRow>

            <Show
              when={
                jobStep().type === 'action' &&
                (jobStep() as WorkflowStructureJobActionStep)
              }
            >
              {jobStep => (
                <FullWidthPanelRow>
                  <TextField
                    slotClasses={{
                      root: formStyles.inlineInputRoot,
                      label: formStyles.inlineInputLabel,
                    }}
                    size={'sm'}
                    theme={'filled'}
                    label={'Uses'}
                    value={jobStep().uses}
                    onChange={uses =>
                      actions.updateJobStepUses({
                        jobId: selectedJob()!.$nodeId,
                        stepId: jobStep().$nodeId,
                        uses,
                      })
                    }
                  />
                </FullWidthPanelRow>
              )}
            </Show>

            <Show
              when={
                jobStep().type === 'run' &&
                (jobStep() as WorkflowStructureJobRunStep)
              }
            >
              {jobStep => (
                <FullWidthPanelRow>
                  <TextArea
                    slotClasses={{
                      root: formStyles.inlineInputRoot,
                      label: formStyles.inlineInputLabel,
                    }}
                    options={{
                      autoResize: true,
                      rows: 2,
                    }}
                    size={'sm'}
                    theme={'filled'}
                    label={'Run'}
                    value={jobStep()?.run}
                    onChange={run =>
                      actions.updateJobStepRun({
                        jobId: selectedJob()!.$nodeId,
                        stepId: jobStep().$nodeId,
                        run,
                      })
                    }
                  />
                </FullWidthPanelRow>
              )}
            </Show>
          </PanelContent>

          <PanelDivider />

          <EnvironmentVariablesForm
            onAddNew={() => {
              actions.addNewJobStepEnv({
                jobId: selectedJob()!.$nodeId,
                stepId: jobStep().$nodeId,
                value: {
                  name: '',
                  type: 'string',
                  value: '',
                },
              });
            }}
            items={jobStep().env?.array ?? []}
            onUpdate={(value, index) => {
              actions.updateJobStepEnv({
                jobId: selectedJob()!.$nodeId,
                stepId: jobStep().$nodeId,
                index,
                value,
              });
            }}
            onDelete={(item, index) => {
              actions.deleteJobStepEnv({
                jobId: selectedJob()!.$nodeId,
                stepId: jobStep().$nodeId,
                index,
              });
            }}
          />
        </>
      )}
    </Show>
  );
}
