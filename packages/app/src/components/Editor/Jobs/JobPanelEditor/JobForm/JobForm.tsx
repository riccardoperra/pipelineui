import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {PanelContent} from '#editor-layout/Panel/Form/PanelContent';
import {FullWidthPanelRow} from '#editor-layout/Panel/Form/PanelRow';
import {Select, TextField} from '@codeui/kit';
import {EnvironmentControl} from '../Environment/EnvironmentControl';
import {PanelDivider} from '#editor-layout/Panel/Form/PanelDivider';
import {JobStepsForm} from '../JobStepsForm/JobStepsForm';
import {formStyles} from '#editor-layout/Panel/Form/Form.css';
import {provideState} from 'statebuilder';
import {PanelEditorStore} from '../panel-editor.store';
import {EditorStore} from '#editor-store/editor.store';

export function JobForm() {
  const panelStore = provideState(PanelEditorStore);
  const editorStore = provideState(EditorStore);

  const job = () => panelStore.selectedJob!;

  const needs = () => {
    const templateJobs = editorStore.get.structure.jobs.filter(
      _job => _job.id !== job().id,
    );
    return templateJobs ?? [];
  };
  const needsOptions = () => {
    return needs().map(need => need.id);
  };

  return (
    <>
      <PanelHeader label={'General'} />

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
            value={job()?.name}
            onChange={value => {
              editorStore.actions.updateJobName({
                jobId: job().$nodeId,
                name: value,
              });
            }}
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
            label={'Runs on'}
            value={job().runsOn}
            onChange={value => {
              editorStore.actions.updateJobRunsOn({
                jobId: job().$nodeId,
                runsOn: value,
              });
            }}
          />
        </FullWidthPanelRow>

        <FullWidthPanelRow>
          <Select
            aria-label={'Needs input'}
            multiple={true}
            options={needsOptions()}
            value={job().needs}
            onChange={options => {
              console.log('change needs', options);
            }}
            size={'sm'}
            theme={'filled'}
            label={'Needs'}
            slotClasses={{
              root: formStyles.inlineInputRoot,
              label: formStyles.inlineInputLabel,
            }}
          />
        </FullWidthPanelRow>

        <FullWidthPanelRow>
          <EnvironmentControl
            value={job().environment ?? null}
            onValueChange={value => {
              setForm('environment', value);
              editorStore.yamlSession.setJobEnvironment(job()!.id, value);
            }}
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
            label={'Concurrency'}
          />
        </FullWidthPanelRow>
      </PanelContent>

      <PanelDivider />

      <PanelHeader label={'Steps'} />

      <JobStepsForm />

      <PanelDivider />
    </>
  );
}
