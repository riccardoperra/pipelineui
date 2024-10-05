import type {
  WorkflowDispatchInput,
  EditorWorkflowStructure,
} from '../editor.store';
import type {
  ParseWorkflowResult,
  WorkflowTemplate,
} from '@pipelineui/workflow-parser';

export function getStructureFromWorkflow(
  result: ParseWorkflowResult,
  template: WorkflowTemplate,
): WorkflowStructure {
  console.debug(result, template);
  return {
    name: 'fileName',
    events: {
      workflowDispatch: Object.entries(
        template.events.workflow_dispatch?.inputs ?? {},
      ).map(([key, input]) => {
        return {
          name: key,
          default: input.default,
          type: input.type,
          options: input.options,
          deprecationMessage: (input as any).deprecationMessage,
          description: input.description,
          required: input.required,
        } satisfies WorkflowDispatchInput;
      }),
    },
    jobs: [],
  };
}
