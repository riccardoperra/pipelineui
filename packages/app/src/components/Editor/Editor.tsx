import {LeftSidebar} from './LeftSidebar/LeftSidebar';
import * as styles from './Editor.css';
import {JobPanelEditor} from './Jobs/JobPanelEditor/JobPanelEditor';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';

interface EditorProps {
  template: WorkflowTemplate;
}

export function Editor(props: EditorProps) {
  return (
    <div class={styles.editor}>
      <LeftSidebar>Content</LeftSidebar>

      <div class={styles.canvas}>Content</div>
      <LeftSidebar>
        <JobPanelEditor />
      </LeftSidebar>
    </div>
  );
}
