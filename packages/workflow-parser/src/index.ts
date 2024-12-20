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
import type * as WorkflowTemplateTypes from '@actions/workflow-parser/model/workflow-template';

import * as environmentConverters from '@actions/workflow-parser/model/converter/job/environment';
import * as inputConverters from '@actions/workflow-parser/model/converter/job/inputs';
import * as secretConverters from '@actions/workflow-parser/model/converter/job/secrets';
import * as runsOnConverters from '@actions/workflow-parser/model/converter/job/runs-on';
import {handleTemplateTokenErrors} from '@actions/workflow-parser/model/converter/handle-errors';

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

export {handleTemplateTokenErrors};

export type {WorkflowTemplateTypes};
export {
  environmentConverters,
  inputConverters,
  secretConverters,
  runsOnConverters,
};

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

  return {
    result,
    template: convertWorkflowTemplate(result.context, result.value!),
  };
}
