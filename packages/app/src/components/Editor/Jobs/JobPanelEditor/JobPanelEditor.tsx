import {
  createSelectOptions,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  TextField,
} from '@codeui/kit';
import * as styles from './JobPanelEditor.css';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import {PanelHeader} from './Form/PanelHeader';
import {FullWidthPanelRow, PanelRow, TwoColumnPanelRow} from './Form/PanelRow';
import {PanelDivider} from './Form/PanelDivider';
import {JobStepsForm} from './JobStepsForm/JobStepsForm';
import {createEffect, createSignal, Match, onMount, Switch} from 'solid-js';
import {JobStepForm} from './JobStepsForm/JobStep/JobStepForm';
import {useEditorContext} from '../../editor.context';
import {createStore, unwrap} from 'solid-js/store';
import {
  environmentConverters,
  isString,
  WorkflowTemplateTypes,
} from '@pipelineui/workflow-parser';
import {
  EnvironmentControl,
  type JobEnvironment,
} from './Environment/EnvironmentControl';

interface Form {
  name: string;
  runsOn: string;
  needs: string[];
  environment: JobEnvironment | null | undefined;
}

export function JobPanelEditor() {
  const editorStore = provideState(EditorStore);
  const {template, context} = useEditorContext();

  const job = () => {
    if (!editorStore.get.selectedJobId) {
      return;
    }
    return template.jobs.find(
      job => job.id.value === editorStore.get.selectedJobId,
    );
  };

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
    <div class={styles.jobPanelEditor}>
      <Switch>
        <Match when={!!activeStep()}>
          <JobStepForm />
        </Match>
        <Match when={!activeStep()}>
          <PanelHeader label={'General'} />

          <FullWidthPanelRow>
            <TextField
              slotClasses={{
                root: styles.inlineInputRoot,
                label: styles.inlineInputLabel,
              }}
              size={'sm'}
              theme={'filled'}
              label={'Name'}
              value={form.name}
              onChange={value => {
                setForm('name', value);
                editorStore.sessionUpdate.setJobName(job()!.id.value!, value);
              }}
            />
          </FullWidthPanelRow>

          <FullWidthPanelRow>
            <TextField
              slotClasses={{
                root: styles.inlineInputRoot,
                label: styles.inlineInputLabel,
              }}
              size={'sm'}
              theme={'filled'}
              label={'Runs on'}
              value={form.runsOn}
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
                editorStore.sessionUpdate.setNeeds(job()!.id.value, options);
              }}
              size={'sm'}
              theme={'filled'}
              label={'Needs'}
              slotClasses={{
                root: styles.inlineInputRoot,
                label: styles.inlineInputLabel,
              }}
            />
          </FullWidthPanelRow>

          <FullWidthPanelRow>
            <EnvironmentControl
              value={form.environment}
              onValueChange={value => {
                setForm('environment', value);
                editorStore.sessionUpdate.setEnvironment(
                  job()!.id.value,
                  value,
                );
              }}
            />
            {/*<Popover>*/}
            {/*  <PopoverTrigger>Content</PopoverTrigger>*/}
            {/*  <PopoverContent>*/}
            {/*    <SegmentedControl>*/}
            {/*      <SegmentedControlItem>Reference</SegmentedControlItem>*/}
            {/*      <SegmentedControlItem>Value</SegmentedControlItem>*/}
            {/*    </SegmentedControl>*/}
            {/*  </PopoverContent>*/}
            {/*</Popover>*/}
            {/*<TextField*/}
            {/*  slotClasses={{*/}
            {/*    root: styles.inlineInputRoot,*/}
            {/*    label: styles.inlineInputLabel,*/}
            {/*  }}*/}
            {/*  size={'sm'}*/}
            {/*  theme={'filled'}*/}
            {/*  label={'Environment'}*/}
            {/*/>*/}
          </FullWidthPanelRow>

          <FullWidthPanelRow>
            <TextField
              slotClasses={{
                root: styles.inlineInputRoot,
                label: styles.inlineInputLabel,
              }}
              size={'sm'}
              theme={'filled'}
              label={'Concurrency'}
            />
          </FullWidthPanelRow>

          <PanelDivider />

          <PanelHeader label={'Steps'} />

          <JobStepsForm />

          <PanelDivider />
        </Match>
      </Switch>
    </div>
  );
}
