import * as styles from './PropertiesPanelEditor.css';
import {provideState} from 'statebuilder';
import {EditorStore} from '../store/editor.store';
import {createSignal} from 'solid-js';
import {createStore} from 'solid-js/store';
import {useEditorContext} from '../editor.context';
import {WorkflowDispatchForm} from './WorkflowDispatchForm/WorkflowDispatchForm';

interface Form {}

export function PropertiesPanelEditor() {
  const editorStore = provideState(EditorStore);
  const {template, context} = useEditorContext();

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

  // createEffect(() => {
  //   const workflowJob = job() as WorkflowTemplateTypes.Job | null;
  //   if (!workflowJob) {
  //     return;
  //   }
  //
  //   function parseEnvironment(token: any) {
  //     if (isString(token)) {
  //       return {
  //         type: 'value',
  //         name: token.value,
  //       } as const;
  //     }
  //     const ref = environmentConverters.convertToActionsEnvironmentRef(
  //       context,
  //       token,
  //     );
  //     return {
  //       type: 'reference',
  //       name: ref.name?.assertString('Name should be string')?.value,
  //       url: ref.url?.assertString('Url should be string')?.value,
  //     } as const;
  //   }
  //
  //   const environment = workflowJob.environment
  //     ? parseEnvironment(workflowJob.environment)
  //     : null;
  //
  //   setForm(form => ({
  //     ...form,
  //     name: workflowJob.name?.toString(),
  //     needs: workflowJob.needs?.map(need => need.value) ?? [],
  //     environment: environment,
  //   }));
  // });

  return (
    <div class={styles.jobPanelEditor}>
      <WorkflowDispatchForm />
    </div>
  );
}
