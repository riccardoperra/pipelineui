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
import {EditorStore} from '#editor-store/editor.store';
import {PanelContent} from '#editor-layout/Panel/Form/PanelContent';
import {Show} from 'solid-js';
import type {
  WorkflowStructureJobActionStep,
  WorkflowStructureJobRunStep,
} from '#editor-store/editor.types';

export interface JobStepFormProp {
  stepId: string;
}

export function JobStepForm(props: JobStepFormProp) {
  const {selectedJob, actions} = provideState(EditorStore);

  const jobStep = () => {
    const job = selectedJob();
    if (!job) {
      return null;
    }
    return job.steps.find(step => step.id === props.stepId);
  };

  return (
    <Show when={jobStep()}>
      {jobStep => (
        <>
          <PanelHeader label={`Step > ${jobStep()?.id}`} />

          <PanelContent withGap>
            <FullWidthPanelRow>
              <TextField
                slotClasses={{
                  root: formStyles.inlineInputRoot,
                  label: formStyles.inlineInputLabel,
                }}
                size={'sm'}
                theme={'filled'}
                label={'Id'}
                value={jobStep()?.id}
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
                label={'Name'}
                value={jobStep()?.name}
                onChange={name =>
                  actions.jobs.stepUpdateName(
                    selectedJob()?.id!,
                    props.stepId,
                    name,
                  )
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
                  onChange={value =>
                    actions.jobs.stepUpdateType(
                      selectedJob()?.id!,
                      props.stepId,
                      value as string,
                    )
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
                      actions.jobs.stepUpdateUses(
                        selectedJob()?.id!,
                        props.stepId,
                        uses,
                      )
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
                      actions.jobs.stepUpdateRun(
                        selectedJob()?.id!,
                        props.stepId,
                        run,
                      )
                    }
                  />
                </FullWidthPanelRow>
              )}
            </Show>
          </PanelContent>
        </>
      )}
    </Show>
  );
}
