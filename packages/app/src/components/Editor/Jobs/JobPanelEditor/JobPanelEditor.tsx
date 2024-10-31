import {provideState} from 'statebuilder';
import {Match, Show, Switch} from 'solid-js';
import {JobStepForm} from './JobStepsForm/JobStep/JobStepForm';
import {PanelGroup} from '#editor-layout/Panel/Form/PanelGroup';
import {PanelEditorStore} from './panel-editor.store';
import {JobForm} from './JobForm/JobForm';
import {IconButton} from '@codeui/kit';
import {Icon} from '#ui/components/Icon';
import * as styles from './JobPanelEditor.css';
import {EditorState} from '@codemirror/state';
import {EditorStore} from '../../../../store/editor/editor.store';

export function JobPanelEditor() {
  const panelStore = provideState(PanelEditorStore);

  return (
    <>
      <div class={styles.nav}>
        <IconButton
          aria-label={'Back'}
          size={'sm'}
          theme={'secondary'}
          variant={'ghost'}
          onClick={() => panelStore.back()}
        >
          <Icon name={'arrow_left_alt'} />
        </IconButton>
        <span>{panelStore.headerPanelLabel()}</span>
      </div>
      <PanelGroup>
        <Switch>
          <Match when={!!panelStore.get.activeStep}>
            <JobStepForm />
          </Match>
          <Match when={!panelStore.get.activeStep}>
            <JobForm />
          </Match>
        </Switch>
      </PanelGroup>
    </>
  );
}
