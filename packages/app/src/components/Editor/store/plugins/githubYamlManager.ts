import {type GenericStoreApi, makePlugin} from 'statebuilder';
import type {YAMLDocument, YamlDocumentSessionPlugin} from './yamlSession';
import YAML, {Pair, Scalar, YAMLMap, YAMLSeq} from 'yaml';
import type {
  JobEnvironment,
  StringExpression,
  WorkflowDispatchInput,
  WorkflowStructureEnvItem,
} from '../editor.types';

export const withGithubYamlManager = () => {
  return makePlugin.typed<GenericStoreApi & YamlDocumentSessionPlugin>()(
    _ => {
      const {yamlSession} = _;

      const modifyEnvField = (
        yaml: YAMLDocument,
        createIfNotExists: boolean = true,
        updater: (on: YAMLMap<Scalar<string>>) => void,
      ) => {
        let envField = yaml.get('env') as YAMLMap<Scalar<string>>;
        if (!envField) {
          if (!createIfNotExists) {
            console.warn('`env` field missing. Skipping update.');
            return;
          }
          envField = new YAMLMap();
          yaml.set(new Scalar('env'), envField);
        }
        updater(envField);
      };

      const modifyOnField = (
        yaml: YAMLDocument,
        createIfNotExists: boolean = true,
        updater: (on: YAMLMap<Scalar<string>, YAMLMap>) => void,
      ) => {
        let onField = yaml.get('on') as YAMLMap<
          Scalar<string>,
          YAMLMap<Scalar<string>, YAMLMap>
        >;
        if (!onField) {
          if (!createIfNotExists) {
            console.warn('`on` field missing. Skipping update.');
            return;
          }
          onField = new YAMLMap();
          yaml.set(new Scalar('on'), onField);
        }
        updater(onField);
      };

      const deleteWorkflowDispatchItem = (index: number) => {
        yamlSession.updater(yaml => {
          const inputs = yaml.getIn([
            'on',
            'workflow_dispatch',
            'inputs',
          ]) as YAMLMap | null;
          if (!inputs) {
            return;
          }
          const inputAtIndex = inputs.items.at(index);
          inputs.delete(inputAtIndex?.key);
        });
      };

      const setWorkflowDispatch = (
        index: number,
        data: WorkflowDispatchInput,
        fallbackMissingName = true,
      ) => {
        yamlSession.updater(yaml => {
          modifyOnField(yaml, true, on => {
            let workflowDispatch = on.get('workflow_dispatch') as YAMLMap<
              Scalar<String>
            > | null;

            if (!workflowDispatch) {
              workflowDispatch = new YAMLMap();
              const pair = new YAML.Pair(
                new Scalar<string>('workflow_dispatch'),
                workflowDispatch,
              );
              on.add(pair);
            }

            let inputs = workflowDispatch.get('inputs') as YAMLMap<
              Scalar<string>,
              YAMLMap
            > | null;
            if (!inputs) {
              inputs = new YAMLMap();
              workflowDispatch.add(new YAML.Pair(new Scalar('inputs'), inputs));
            }

            let {name, ...others} = data;
            const inputAtIndex = inputs.items.at(index);
            const input = new YAMLMap<Scalar<string>, unknown>();
            if (!name && fallbackMissingName) {
              name = `input-${index}`;
            }
            if (!name) {
              console.warn(
                'Missing `name` for workflow_dispatch. Skipping update',
                {
                  index,
                  data,
                },
              );
              return;
            }
            const pair = new YAML.Pair(new Scalar(name), input);
            for (const [key, value] of Object.entries(others)) {
              if (value !== null && value !== undefined) {
                input.set(new Scalar(key), value);
              }
            }
            if (!inputAtIndex) {
              const value = new YAML.Pair(new Scalar(name), input);
              inputs.add(value);
            } else {
              inputs.items[index] = pair;
            }
          });
        });
      };

      const setEnvironmentVariable = (
        index: number,
        envItem: WorkflowStructureEnvItem,
      ) => {
        yamlSession.updater(yaml => {
          modifyEnvField(yaml, true, env => {
            const envAtIndex = env.items.at(index);
            if (!envItem.name) {
              console.warn('Missing `name` for env variable. Skipping update', {
                index,
                data: envItem,
              });
              return;
            }

            let value;
            if (
              envItem.type === 'string' ||
              envItem.type === 'number' ||
              envItem.type === 'boolean'
            ) {
              value = new YAML.Scalar(String(envItem.value));
            } else if (envItem.type === 'expression') {
              // TODO parse value?
              value = new YAML.Scalar(envItem.value as StringExpression).value;
            }
            if (!envAtIndex) {
              env.add(new YAML.Pair(new YAML.Scalar(envItem.name), value));
            } else {
              envAtIndex.key = new YAML.Scalar<string>(envItem.name);
              envAtIndex.value = value;
            }
          });
        });
      };

      const findJob = (yaml: YAMLDocument, jobId: number | string) => {
        const jobs = yaml.get('jobs') as YAMLMap<string, YAMLMap>;
        if (typeof jobId === 'number') {
          return jobs.items[jobId]?.value;
        } else {
          return jobs.get(jobId);
        }
      };

      const findJobStep = (jobYaml: YAML.YAMLMap, stepIndex: number) => {
        const steps = jobYaml.get('steps') as
          | YAML.YAMLSeq<YAML.YAMLMap>
          | undefined;
        if (!steps) {
          return null;
        }
        return steps.get(stepIndex);
      };

      const setJobName = (jobIdOrIndex: string | number, name: string) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          const hasJob = job.has('name');
          if (!hasJob) {
            // TODO: support ordering0
            job.items = [
              new Pair<unknown, unknown>(new Scalar('name'), name),
              ...job.items,
            ];
          } else {
            job.set('name', name);
          }
        });
      };

      const setJobNeeds = (jobIdOrIndex: string | number, needs: string[]) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (!job.has('needs')) {
            job.set('needs', needs);
          } else {
            const needsSeq = job.get('needs') as YAMLSeq;
            const jsonSeq = needsSeq.toJSON();
            for (let i = 0; i < jsonSeq.length; i++) {
              needsSeq.delete(0);
            }
            needs.forEach(need => needsSeq.add(need));
          }
        });
      };

      const setJobRunsOn = (jobIdOrIndex: string | number, runsOn: string) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          const hasJob = job.has('runs-on');
          if (!hasJob) {
            // TODO: support ordering0
            job.items = [
              new Pair<unknown, unknown>(new Scalar('runs-on'), runsOn),
              ...job.items,
            ];
          } else {
            job.set('runs-on', runsOn);
          }
        });
      };

      const setJobEnvironment = (
        jobIdOrIndex: string | number,
        environment: JobEnvironment,
      ) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (environment.type === 'value') {
            if (!environment.name) {
              job.delete('environment');
              return;
            }
            job.set('environment', new Scalar(environment.name));
          } else {
            const node = new YAMLMap();
            node.set('name', environment.name);
            node.set('url', environment.url);
            job.set('environment', node);
          }
        });
      };

      const setJobStepName = (
        jobIdOrIndex: string | number,
        stepIndex: number,
        name: string,
      ) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (!job) {
            return false;
          }
          const step = findJobStep(job, stepIndex);
          if (!step) {
            return false;
          }
          step.set(new Scalar('name'), name);
        });
      };

      const setJobStepRun = (
        jobIdOrIndex: string | number,
        stepIndex: number,
        run: string | null,
      ) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (!job) {
            return false;
          }
          const step = findJobStep(job, stepIndex);
          if (!step) {
            return false;
          }

          if (!run) {
            step.delete('run');
          } else {
            step.set(new Scalar('run'), run);
          }
        });
      };

      const setJobStepUses = (
        jobIdOrIndex: string | number,
        stepIndex: number,
        uses: string | null,
      ) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (!job) {
            return false;
          }
          const step = findJobStep(job, stepIndex);
          if (!step) {
            return false;
          }

          if (!uses) {
            step.delete('uses');
          } else {
            step.set(new Scalar('uses'), uses);
          }
        });
      };

      return {
        yamlSession: Object.assign(_.yamlSession, {
          deleteWorkflowDispatchItem,
          setEnvironmentVariable,
          setWorkflowDispatch,
          setJobName,
          setJobNeeds,
          setJobRunsOn,
          setJobEnvironment,
          setJobStepName,
          setJobStepRun,
          setJobStepUses,
        }),
      };
    },
    {
      name: 'githubYamlManager',
      dependencies: ['yamlSession'],
    },
  );
};
