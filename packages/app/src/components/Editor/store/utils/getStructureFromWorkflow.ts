import type {
  ParseWorkflowResult,
  WorkflowTemplate,
} from '@pipelineui/workflow-parser';
import type {
  EditorWorkflowStructure,
  WorkflowDispatchInput,
} from '../editor.types';

export function getStructureFromWorkflow(
  result: ParseWorkflowResult,
  template: WorkflowTemplate,
): EditorWorkflowStructure {
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
