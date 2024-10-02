import {LeftSidebar} from './LeftSidebar/LeftSidebar';
import * as styles from './Editor.css';
import {JobPanelEditor} from './Jobs/JobPanelEditor/JobPanelEditor';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';
import {Canvas} from './Canvas/Canvas';
import {EditorHeader} from './Header/Header';
import {provideState} from 'statebuilder';
import {EditorUiStore} from './store/ui.store';
import {Show} from 'solid-js';

interface EditorProps {
  template: WorkflowTemplate;
}

export function Editor(props: EditorProps) {
  const editorUi = provideState(EditorUiStore);

  return (
    <div>
      <EditorHeader />
      <div class={styles.editor}>
        <Show when={editorUi.get.leftPanel !== 'none' && editorUi.get}>
          {leftPanel => (
            <LeftSidebar>
              <JobPanelEditor />
            </LeftSidebar>
          )}
        </Show>

        <Canvas template={props.template} />
      </div>
    </div>
  );
}
