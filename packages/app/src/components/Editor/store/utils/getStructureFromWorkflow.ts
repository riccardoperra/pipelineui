import {
  handleTemplateTokenErrors,
  isBasicExpression,
  isBoolean,
  type ParseWorkflowResult,
  Tokens,
  type WorkflowTemplate,
  isString,
  isNumber,
} from '@pipelineui/workflow-parser';
import type {
  EditorWorkflowStructure,
  StringExpression,
  WorkflowDispatchInput,
  WorkflowStructureEnv,
  WorkflowStructureEnvItem,
} from '../editor.types';

function getWorkflowStructureEnv(
  result: ParseWorkflowResult,
  template: WorkflowTemplate,
): WorkflowStructureEnv {
  const defaultValue = {array: []} satisfies WorkflowStructureEnv;
  return handleTemplateTokenErrors(
    template.env,
    result.context,
    defaultValue,
    () => {
      if (template.env.assertMapping('template env')) {
        const token = template.env as Tokens.MappingToken;
        const array: WorkflowStructureEnvItem[] = [];
        for (const pair of token) {
          const name = handleTemplateTokenErrors(
            pair.key,
            result.context,
            null,
            () => {
              pair.key.assertString('key value');
              return (pair.key as Tokens.StringToken).value;
            },
          );
          if (!name) {
            continue;
          }

          let type = 'string' as WorkflowStructureEnvItem['type'];

          const value = handleTemplateTokenErrors(
            pair.value,
            result.context,
            null,
            () => {
              if (isBasicExpression(pair.value)) {
                const token = pair.value as Tokens.BasicExpressionToken;
                type = 'expression';
                return {
                  token: token,
                  value: token.toString(),
                  type: 'expression',
                } as StringExpression;
              }
              if (isBoolean(pair.value)) {
                type = 'boolean';
                return (pair.value as Tokens.BooleanToken).value;
              }
              if (isNumber(pair.value)) {
                type = 'number';
                return (pair.value as Tokens.NumberToken).value;
              }
              if (isString(pair.value)) {
                type = 'string';
                return (pair.value as Tokens.StringToken).value;
              }
              return null;
            },
          );

          array.push({
            name,
            type,
            value,
          });
        }

        return {array};
      }
    },
  );
}

export function getStructureFromWorkflow(
  result: ParseWorkflowResult,
  template: WorkflowTemplate,
): EditorWorkflowStructure {
  return {
    name: 'fileName',
    env: getWorkflowStructureEnv(result, template),
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
