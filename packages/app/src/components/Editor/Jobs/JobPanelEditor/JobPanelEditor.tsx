import {provideState} from 'statebuilder';
import {Match, Show, Switch} from 'solid-js';
import {JobStepForm} from './JobStepsForm/JobStep/JobStepForm';
import {type JobEnvironment} from './Environment/EnvironmentControl';
import {PanelGroup} from '#editor-layout/Panel/Form/PanelGroup';
import {PanelEditorStore} from './panel-editor.store';
import {JobForm} from './JobForm/JobForm';
import {IconButton} from '@codeui/kit';
import {Icon} from '#ui/components/Icon';

interface Form {
  name: string;
  runsOn: string;
  needs: string[];
  environment: JobEnvironment | null | undefined;
}

export function JobPanelEditor() {
  const panelStore = provideState(PanelEditorStore);

  return (
    <PanelGroup>
      <Show when={panelStore.get.activeStep}>
        <IconButton
          aria-label={'Back'}
          size={'sm'}
          theme={'secondary'}
          variant={'ghost'}
          onClick={() => panelStore.actions.setActiveStepId(null)}
        >
          <Icon name={'arrow_left_alt'} />
        </IconButton>

        {panelStore.headerPanelLabel}
      </Show>

      <Switch>
        <Match when={!!panelStore.get.activeStep}>
          <JobStepForm />
        </Match>
        <Match when={!panelStore.get.activeStep}>
          <JobForm />
        </Match>
      </Switch>
    </PanelGroup>
  );
}
