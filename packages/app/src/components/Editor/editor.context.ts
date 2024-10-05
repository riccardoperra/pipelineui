import {createContext, useContext} from 'solid-js';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';

export const EditorContext = createContext<{
  context: any;
  template: WorkflowTemplate;
} | null>(null);

export function useEditorContext() {
  return useContext(EditorContext)!;
}
