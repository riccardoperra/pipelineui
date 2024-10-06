import {Tokens} from '@pipelineui/workflow-parser';

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

export type StringExpression = {
  type: 'expression';
  token: Tokens.ExpressionToken;
  value: string;
};

export interface WorkflowStructureEnvItem {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'expression';
  value: StringExpression | number | boolean | string | null;
}

export interface WorkflowStructureEnv {
  map: Record<string, WorkflowStructureEnvItem>;
  array: readonly WorkflowStructureEnvItem[];
}

export interface EditorWorkflowStructure {
  name: string;
  env: WorkflowStructureEnv;
  events: WorkflowStructureEvents;
  jobs: WorkflowStructureJob[];
}
