import {Tokens} from '@pipelineui/workflow-parser';

export interface WorkflowDispatchInput {
  readonly $index: number;
  readonly $nodeId: string;

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

export type WorkflowStructureJobBaseStep = {
  readonly $index: number;
  readonly $nodeId: string;

  id: string;
  name?: string;
  if: string;
  // "continue-on-error"?: boolean | ScalarToken;
  // env?: MappingToken;
};

export interface WorkflowStructureJobActionStep
  extends WorkflowStructureJobBaseStep {
  type: 'action';
  uses: string;
}

export interface WorkflowStructureJobRunStep
  extends WorkflowStructureJobBaseStep {
  type: 'run';
  run: string;
}

export type WorkflowStructureJobStep =
  | WorkflowStructureJobActionStep
  | WorkflowStructureJobRunStep;

export interface WorkflowStructureJob {
  readonly $index: number;
  readonly $nodeId: string;

  id: string;
  name: string;
  runsOn: string;
  needs: string[];
  environment: JobEnvironment | null | undefined;
  steps: WorkflowStructureJobStep[];
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
  array: WorkflowStructureEnvItem[];
}

export interface EditorWorkflowStructure {
  name: string;
  env: WorkflowStructureEnv;
  events: WorkflowStructureEvents;
  jobs: WorkflowStructureJob[];
}
