import { Tokens, WorkflowTemplate } from '@pipelineui/workflow-parser';

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

type EventsConfig = WorkflowTemplate['events'];

export const AVAILABLE_WORKFLOW_TRIGGER_TYPES = [
  'branch_protection_rule',
  'check_run',
  'check_suite',
  'discussion',
  'discussion_comment',
  'issue_comment',
  'issues',
  'label',
  'merge_group',
  'milestone',
  'project',
  'project_card',
  'project_column',
  'pull_request',
  'pull_request_review',
  'pull_request_target',
  'pull_request_review_comment',
  'registry_package',
  'repository_dispatch',
  'release',
  'watch',
] as const satisfies (keyof EventsConfig & string)[];

type AvailableWorkflowTriggerTypesKey =
  (typeof AVAILABLE_WORKFLOW_TRIGGER_TYPES)[number];

export const WORKFLOW_TRIGGER_TYPES_CONFIG: Record<
  AvailableWorkflowTriggerTypesKey,
  {
    availableTypes: string[];
    type: 'multiple' | 'single' | 'custom';
  }
> = {
  branch_protection_rule: {
    availableTypes: ['created', 'edited', 'deleted'],
    type: 'multiple',
  },
  check_run: {
    availableTypes: ['created', 'rerequested', 'completed', 'requested_action'],
    type: 'multiple',
  },
  check_suite: {
    availableTypes: ['completed', 'requested', 'rerequested'],
    type: 'multiple',
  },
  discussion: {
    availableTypes: [
      'created',
      'edited',
      'deleted',
      'transferred',
      'pinned',
      'unpinned',
      'labeled',
      'unlabeled',
      'locked',
      'unlocked',
      'category_changed',
      'answered',
      'unanswered',
    ],
    type: 'multiple',
  },
  discussion_comment: {
    availableTypes: ['created', 'edited', 'deleted'],
    type: 'multiple',
  },
  issue_comment: {
    availableTypes: ['created', 'edited', 'deleted'],
    type: 'multiple',
  },
  issues: {
    availableTypes: [
      'opened',
      'edited',
      'deleted',
      'transferred',
      'pinned',
      'unpinned',
      'closed',
      'reopened',
      'assigned',
      'unassigned',
      'labeled',
      'unlabeled',
      'locked',
      'unlocked',
      'milestoned',
      'demilestoned',
    ],
    type: 'multiple',
  },
  label: {
    availableTypes: ['created', 'edited', 'deleted'],
    type: 'multiple',
  },
  merge_group: {
    availableTypes: ['checks_requested'],
    type: 'multiple',
  },
  milestone: {
    availableTypes: ['created', 'closed', 'opened', 'edited', 'deleted'],
    type: 'multiple',
  },
  project: {
    availableTypes: [
      'created',
      'updated',
      'closed',
      'reopened',
      'edited',
      'deleted',
    ],
    type: 'multiple',
  },
  project_card: {
    availableTypes: ['created', 'moved', 'converted', 'edited', 'deleted'],
    type: 'multiple',
  },
  project_column: {
    availableTypes: ['created', 'updated', 'moved', 'deleted'],
    type: 'multiple',
  },
  pull_request_review: {
    availableTypes: ['submitted', 'edited', 'dismissed'],
    type: 'multiple',
  },
  pull_request: {
    availableTypes: [
      'assigned',
      'unassigned',
      'labeled',
      'unlabeled',
      'opened',
      'edited',
      'closed',
      'reopened',
      'synchronize',
      'converted_to_draft',
      'ready_for_review',
      'locked',
      'unlocked',
      'milestoned',
      'demilestoned',
      'review_requested',
      'review_request_removed',
      'auto_merge_enabled',
      'auto_merge_disabled',
    ],
    type: 'multiple',
  },
  pull_request_review_comment: {
    availableTypes: ['created', 'edited', 'deleted'],
    type: 'multiple',
  },
  pull_request_target: {
    availableTypes: [
      'assigned',
      'unassigned',
      'labeled',
      'unlabeled',
      'opened',
      'edited',
      'closed',
      'reopened',
      'synchronize',
      'converted_to_draft',
      'ready_for_review',
      'locked',
      'unlocked',
      'review_requested',
      'review_request_removed',
      'auto_merge_enabled',
      'auto_merge_disabled',
    ],
    type: 'multiple',
  },
  registry_package: {
    availableTypes: ['published', 'updated'],
    type: 'multiple',
  },
  release: {
    availableTypes: [
      'published',
      'unpublished',
      'created',
      'edited',
      'deleted',
      'prereleased',
      'released',
    ],
    type: 'multiple',
  },
  watch: {
    availableTypes: ['started'],
    type: 'multiple',
  },
  repository_dispatch: {
    availableTypes: [],
    type: 'custom',
  },
};

export interface WorkflowTypesTriggerEvent extends WorkflowTriggerEvent {
  type: keyof EventsConfig | (string & {});
  types: string[];
}

export interface WorkflowTriggerEvent {
  readonly $nodeId: string;
}

export interface WorkflowStructureEvents {
  workflowDispatch: WorkflowDispatchInput[];
  triggerEvents: WorkflowTypesTriggerEvent[];
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
  if?: string;
  // "continue-on-error"?: boolean | ScalarToken;
  env: WorkflowStructureEnv;
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
  env: WorkflowStructureEnv;
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
