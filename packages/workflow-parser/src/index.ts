import {
  convertWorkflowTemplate,
  NoOperationTraceWriter,
  parseWorkflow,
  TraceWriter,
  isString,
  isBoolean,
  isLiteral,
  isMapping,
  isNumber,
  isScalar,
  WorkflowTemplate,
  isSequence,
  ParseWorkflowResult,
  isBasicExpression,
} from '@actions/workflow-parser';

export {
  isString,
  isBoolean,
  isLiteral,
  isMapping,
  isNumber,
  isScalar,
  isSequence,
  isBasicExpression,
};

export * as Tokens from '@actions/workflow-parser/templates/tokens/index';

export type {WorkflowTemplate, ParseWorkflowResult};

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
