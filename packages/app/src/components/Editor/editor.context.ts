import {createContext, useContext} from 'solid-js';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';
import type {GithubRepository} from '../../lib/api';

export const EditorContext = createContext<{
  context: any;
  template: WorkflowTemplate;
  source: string;
  repository: GithubRepository;
} | null>(null);

export function useEditorContext() {
  return useContext(EditorContext)!;
}
