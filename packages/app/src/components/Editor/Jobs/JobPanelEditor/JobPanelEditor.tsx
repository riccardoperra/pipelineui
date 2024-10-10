import {Select, TextField} from '@codeui/kit';
import * as formStyles from '#editor-layout/Panel/Form/Form.css';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import {PanelHeader} from '../../Layout/Panel/Form/PanelHeader';
import {FullWidthPanelRow} from '../../Layout/Panel/Form/PanelRow';
import {PanelDivider} from '../../Layout/Panel/Form/PanelDivider';
import {JobStepsForm} from './JobStepsForm/JobStepsForm';
import {createEffect, createSignal, Match, Show, Switch} from 'solid-js';
import {JobStepForm} from './JobStepsForm/JobStep/JobStepForm';
import {useEditorContext} from '../../editor.context';
import {createStore} from 'solid-js/store';
import {
  environmentConverters,
  isString,
  WorkflowTemplateTypes,
} from '@pipelineui/workflow-parser';
import {
  EnvironmentControl,
  type JobEnvironment,
} from './Environment/EnvironmentControl';
import {PanelGroup} from '#editor-layout/Panel/Form/PanelGroup';
import {PanelContent} from '#editor-layout/Panel/Form/PanelContent';

interface Form {
  name: string;
  runsOn: string;
  needs: string[];
  environment: JobEnvironment | null | undefined;
}

export function JobPanelEditor() {
  const editorStore = provideState(EditorStore);
  const {template, context} = useEditorContext();

  const job = () => editorStore.selectedJob();

  const jobValue = () =>
    editorStore.get.structure.jobs.find(_ => _.id === job()?.id.value);

  const needs = () => {
    const templateJobs = template.jobs.filter(_job => _job.id !== job()?.id);
    return templateJobs ?? [];
  };
  const needsOptions = () => {
    return needs().map(need => need.id?.toString());
  };

  const [activeStep, setActiveStep] = createSignal<string | null>();

  const [form, setForm] = createStore<Form>({
    name: '',
    runsOn: '',
    needs: [],
    environment: {
      type: 'value',
      url: undefined,
      name: undefined,
    },
  });

  createEffect(() => {
    const workflowJob = job() as WorkflowTemplateTypes.Job | null;
    if (!workflowJob) {
      return;
    }

    function parseEnvironment(token: any) {
      if (isString(token)) {
        return {
          type: 'value',
          name: token.value,
        } as const;
      }
      const ref = environmentConverters.convertToActionsEnvironmentRef(
        context,
        token,
      );
      return {
        type: 'reference',
        name: ref.name?.assertString('Name should be string')?.value,
        url: ref.url?.assertString('Url should be string')?.value,
      } as const;
    }

    const environment = workflowJob.environment
      ? parseEnvironment(workflowJob.environment)
      : null;

    setForm(form => ({
      ...form,
      name: workflowJob.name?.toString(),
      needs: workflowJob.needs?.map(need => need.value) ?? [],
      environment: environment,
    }));
  });

  return (
    <PanelGroup>
      <Switch>
        <Match when={!!activeStep()}>
          <JobStepForm />
        </Match>
        <Match when={!activeStep()}>
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
                value={jobValue()?.name}
                onChange={value => {
                  editorStore.set('structure', 'jobs', 0, 'name', value);
                  editorStore.yamlSession.setJobName(job()!.id.value!, value);
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
                value={jobValue()?.runsOn}
                onChange={value => {
                  editorStore.set('structure', 'jobs', 0, 'runsOn', value);
                  editorStore.yamlSession.setJobRunsOn(job()!.id.value!, value);
                }}
              />
            </FullWidthPanelRow>

            <FullWidthPanelRow>
              <Select
                aria-label={'Needs input'}
                multiple={true}
                options={needsOptions()}
                value={form.needs}
                onChange={options => {
                  setForm('needs', options);
                  editorStore.yamlSession.setJobNeeds(job()!.id.value, options);
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
                value={form.environment}
                onValueChange={value => {
                  setForm('environment', value);
                  editorStore.yamlSession.setJobEnvironment(
                    job()!.id.value,
                    value,
                  );
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
        </Match>
      </Switch>
    </PanelGroup>
  );
}
