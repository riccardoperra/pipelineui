export interface WorkflowDispatchInput {
  name?: string;
  type?: 'string' | 'choice' | 'boolean' | 'number' | 'environment';
  deprecationMessage?: string;
  required?: boolean;
  // TODO: better type. also support expression!
  default?: any;
  description?: string;
  options?: string[];
}

export interface WorkflowStructureEvents {
  workflowDispatch: WorkflowDispatchInput[];
}

export type JobEnvironment = {
  type: 'value' | 'reference';
  name?: string;
  url?: string;
};

export interface WorkflowStructureJob {
  name: string;
  runsOn: string;
  needs: string[];
  environment: JobEnvironment | null | undefined;
}

export interface EditorWorkflowStructure {
  name: string;
  events: WorkflowStructureEvents;
  jobs: WorkflowStructureJob[];
}
