import {
  environmentConverters,
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
  WorkflowTypesTriggerEvent,
} from '../editor.types';
import type {WorkflowJob} from '@actions/workflow-parser/model/workflow-template';

export function mapEventToWorkflowTriggerEventTypes(
  eventConfig: WorkflowTemplate['events'] | null | undefined,
): WorkflowTypesTriggerEvent[] {
  if (!eventConfig) {
    return [];
  }

  return Object.entries(eventConfig).reduce((acc, [event, value]) => {
    const unsafeValue = value as any;
    if (Array.isArray(unsafeValue)) {
      // TODO: schedule not supported;
      return acc;
    }
    if ('types' in unsafeValue) {
      acc.push({
        $nodeId: crypto.randomUUID().toString(),
        type: event,
        types: unsafeValue.types,
      } satisfies WorkflowTypesTriggerEvent);
    }
    return acc;
  }, [] as WorkflowTypesTriggerEvent[]);
}

export function getStructureFromWorkflow(
  result: ParseWorkflowResult,
  template: WorkflowTemplate,
): EditorWorkflowStructure {
  return {
    name: 'fileName',
    env: getWorkflowStructureEnv(result, template.env),
    events: {
      triggerEvents: [
        ...mapEventToWorkflowTriggerEventTypes(template.events),
      ].filter(value => !!value),

      workflowDispatch: Object.entries(
        template.events?.workflow_dispatch?.inputs ?? {},
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
            environment: getWorkflowJobEnvironment(result, job),
            needs: [...(job.needs?.values() ?? [])].map(value => value.value),
            env: job.env
              ? getWorkflowStructureEnv(result, job.env)
              : {array: []},
            steps: job.steps.map((step, $index) => {
              if ('run' in step) {
                return {
                  $index,
                  $nodeId: crypto.randomUUID().toString(),
                  type: 'run',
                  id: step.id,
                  name: step.name?.toString(),
                  env: step.env
                    ? getWorkflowStructureEnv(result, step.env)
                    : {array: []},
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
                  env: step.env
                    ? getWorkflowStructureEnv(result, step.env)
                    : {array: []},
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

function getWorkflowStructureEnv(
  result: ParseWorkflowResult,
  template: Tokens.TemplateToken,
): WorkflowStructureEnv {
  const defaultValue = {array: []} satisfies WorkflowStructureEnv;
  return handleTemplateTokenErrors(
    template,
    result.context,
    defaultValue,
    () => {
      if (template.assertMapping('template env')) {
        const token = template as Tokens.MappingToken;
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

function getWorkflowJobEnvironment(
  result: ParseWorkflowResult,
  workflowJob: WorkflowJob,
) {
  function parseEnvironment(token: any) {
    if (isString(token)) {
      return {
        type: 'value',
        name: token.value,
      } as const;
    }
    const ref = environmentConverters.convertToActionsEnvironmentRef(
      result.context as any,
      token,
    );
    return {
      type: 'reference',
      name: ref.name?.assertString('Name should be string')?.value,
      url: ref.url?.assertString('Url should be string')?.value,
    } as const;
  }

  return workflowJob.environment
    ? parseEnvironment(workflowJob.environment)
    : null;
}
