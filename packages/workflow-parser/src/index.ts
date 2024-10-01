import {
  convertWorkflowTemplate,
  NoOperationTraceWriter,
  parseWorkflow,
  TraceWriter,
} from '@actions/workflow-parser';

const trace: TraceWriter = new NoOperationTraceWriter();

export function getWorkflowJson(name: string, content: string) {
  const result = parseWorkflow(
    {
      name,
      content,
    },
    trace,
  );

  return convertWorkflowTemplate(result.context, result.value!);
}
