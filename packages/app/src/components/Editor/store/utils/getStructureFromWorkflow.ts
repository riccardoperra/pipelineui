import {
  handleTemplateTokenErrors,
  isBasicExpression,
  isBoolean,
  isNumber,
  isString,
  type ParseWorkflowResult,
  Tokens,
  type WorkflowTemplate,
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
      ).map(([key, input], $index) => {
        return {
          $index,
          $nodeId: crypto.randomUUID().toString(),
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
    jobs: template.jobs
      .map((job, $index) => {
        if (job.type === 'job') {
          return {
            $index,
            $nodeId: crypto.randomUUID().toString(),
            id: job.id.value,
            name: (job.name as Tokens.StringToken)?.value ?? job.id.value,
            runsOn: job['runs-on']?.value,
            environment: null,
            needs: [...(job.needs?.values() ?? [])].map(value => value.value),
            steps: job.steps.map((step, $index) => {
              if ('run' in step) {
                return {
                  $index,
                  $nodeId: crypto.randomUUID().toString(),
                  type: 'run',
                  id: step.id,
                  name: step.name?.toString(),
                  env: step.env,
                  // @ts-expect-error TODO: fix type
                  run: step.run['value'],
                };
              } else {
                return {
                  $index,
                  $nodeId: crypto.randomUUID().toString(),
                  type: 'action',
                  id: step.id,
                  name: step.name?.toString(),
                  env: step.env,
                  uses: step.uses.value,
                };
              }
            }),
          };
        } else {
          // TODO: add support
          return null;
          // throw new Error(`Job with type ${job.type} is not supported`);
        }
      })
      .filter(_ => !!_),
  };
}
