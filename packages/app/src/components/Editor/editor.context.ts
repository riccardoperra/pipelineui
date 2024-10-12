import {createContext, useContext} from 'solid-js';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';

export const EditorContext = createContext<{
  context: any;
  template: WorkflowTemplate;
  source: string;
} | null>(null);

export function useEditorContext() {
  return useContext(EditorContext)!;
}
