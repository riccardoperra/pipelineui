import {type GenericStoreApi, makePlugin} from 'statebuilder';
import YAML, {Pair, Scalar, YAMLMap, YAMLSeq} from 'yaml';
import type {
  JobEnvironment,
  StringExpression,
  WorkflowDispatchInput,
  WorkflowStructureEnvItem,
  WorkflowStructureJobStep,
  WorkflowTypesTriggerEvent,
} from '../editor.types';
import type {YAMLDocument, YamlDocumentSessionPlugin} from './yamlSession';

export const withGithubYamlManager = () => {
  return makePlugin.typed<GenericStoreApi & YamlDocumentSessionPlugin>()(
    _ => {
      const {yamlSession} = _;

      const convertEnvItemFieldToYaml = (envItem: WorkflowStructureEnvItem) => {
        let value: unknown;
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
        return value;
      };

      const modifyEnvField = (
        yaml: YAMLDocument | YAMLMap,
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

      const setEventTriggerTypes = (data: WorkflowTypesTriggerEvent) => {
        yamlSession.updater(yaml => {
          modifyOnField(yaml, true, on => {
            const map = new YAML.YAMLMap();

            if (data.types?.length) {
              map.set(new YAML.Scalar('types'), data.types);
              on.set(new YAML.Scalar(data.type as string), map);
            } else {
              on.set(new YAML.Scalar(data.type as string), map);
            }
          });
        });
      };

      const deleteEventTriggerTypes = (data: WorkflowTypesTriggerEvent) => {
        yamlSession.updater(yaml => {
          modifyOnField(yaml, true, on => {
            on.delete(data.type);
          });
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
            const value = convertEnvItemFieldToYaml(envItem);
            if (!envAtIndex) {
              env.add(new YAML.Pair(new YAML.Scalar(envItem.name), value));
            } else {
              envAtIndex.key = new YAML.Scalar<string>(envItem.name);
              envAtIndex.value = value;
            }
          });
        });
      };

      const deleteEnvironmentVariable = (index: number) => {
        yamlSession.updater(yaml => {
          modifyEnvField(yaml, true, env => {
            const updatedItems = env.items.toSpliced(index, 1);
            env.items = updatedItems;
            if (updatedItems.length === 0) {
              yaml.delete('env');
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

      const addNewJob = () => {
        yamlSession.updater(yaml => {
          let jobs = yaml.get('jobs') as YAMLMap<string, YAMLMap> | null;
          if (!jobs) {
            jobs = new YAML.YAMLMap<string, YAMLMap<unknown, unknown>>();
            yaml.set('jobs', jobs);
          }

          const job = new YAML.YAMLMap();
          job.set('steps', new YAML.YAMLMap());
          job.set('runs-on', '');
          jobs.add(new Pair('new-job', job));
        });
      };

      const removeJob = (jobId: string) => {
        yamlSession.updater(yaml => {
          let jobs = yaml.get('jobs') as YAMLMap<string, YAMLMap> | null;
          if (!jobs) {
            return;
          }
          jobs.delete(jobId);
        });
      };

      const setJobId = (index: number, id: string) => {
        yamlSession.updater(yaml => {
          const jobs = yaml.get('jobs') as YAMLMap<Scalar<string>, YAMLMap>;
          const pair = jobs.items[index];
          if (pair) {
            pair.key = new Scalar(id);
          }
        });
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
            const seq = new YAML.YAMLSeq();
            needs.forEach(need => seq.add(need));
            job.set('needs', seq);
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

      const setJobEnv = (
        jobIdOrIndex: string | number,
        index: number,
        envItem: WorkflowStructureEnvItem,
      ) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (!job) {
            return false;
          }
          modifyEnvField(job, true, env => {
            const envAtIndex = env.items.at(index);
            if (!envItem.name) {
              console.warn('Missing `name` for env variable. Skipping update', {
                index,
                data: envItem,
              });
              return;
            }
            const value = convertEnvItemFieldToYaml(envItem);
            if (!envAtIndex) {
              env.add(new YAML.Pair(new YAML.Scalar(envItem.name), value));
            } else {
              envAtIndex.key = new YAML.Scalar<string>(envItem.name);
              envAtIndex.value = value;
            }
          });
        });
      };

      const deleteJobEnv = (jobIdOrIndex: string | number, index: number) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (!job) {
            return false;
          }
          modifyEnvField(job, true, env => {
            const updatedItems = env.items.toSpliced(index, 1);
            env.items = updatedItems;
            if (updatedItems.length === 0) {
              job.delete('env');
            }
          });
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
          if (!name) {
            step.delete('name');
          } else {
            step.set('name', name);
          }
        });
      };

      const setJobStepIf = (
        jobIdOrIndex: string | number,
        stepIndex: number,
        value: string | null,
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

          if (!value) {
            step.delete('if');
          } else {
            step.set('if', value);
          }
        });
      };

      const addNewJobStep = (
        jobIdOrIndex: string | number,
        newStep: WorkflowStructureJobStep,
      ) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (!job) {
            return false;
          }
          let steps: YAMLSeq<YAMLMap>;
          if (!job.has('steps')) {
            steps = new YAML.YAMLSeq<YAMLMap<unknown, unknown>>(yaml.schema);
            job.set('steps', steps);
          } else {
            steps = job.get('steps') as YAMLSeq<YAMLMap>;
          }
          const step = new YAML.YAMLMap(yaml.schema);
          step.add(new Pair('name', newStep.name));
          if ('run' in newStep) {
            step.add(new Pair('run', newStep.run ?? ''));
          }
          steps.add(step);
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

      const setJobStepEnv = (
        jobIdOrIndex: string | number,
        stepIndex: number,
        index: number,
        envItem: WorkflowStructureEnvItem,
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
          modifyEnvField(step, true, env => {
            const envAtIndex = env.items.at(index);
            if (!envItem.name) {
              console.warn('Missing `name` for env variable. Skipping update', {
                index,
                data: envItem,
              });
              return;
            }
            const value = convertEnvItemFieldToYaml(envItem);
            if (!envAtIndex) {
              env.add(new YAML.Pair(new YAML.Scalar(envItem.name), value));
            } else {
              envAtIndex.key = new YAML.Scalar<string>(envItem.name);
              envAtIndex.value = value;
            }
          });
        });
      };

      const deleteJobStepEnv = (
        jobIdOrIndex: string | number,
        stepIndex: number,
        index: number,
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
          modifyEnvField(step, true, env => {
            const updatedItems = env.items.toSpliced(index, 1);
            env.items = updatedItems;
            if (updatedItems.length === 0) {
              step.delete('env');
            }
          });
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

      const deleteJobStep = (
        jobIdOrIndex: string | number,
        stepIndex: number,
      ) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobIdOrIndex)!;
          if (!job) {
            return false;
          }
          job.items = job.items.toSpliced(stepIndex, 1);
        });
      };

      return {
        yamlSession: Object.assign(_.yamlSession, {
          setEnvironmentVariable,
          deleteEnvironmentVariable,
          setWorkflowDispatch,
          deleteWorkflowDispatchItem,
          setEventTriggerTypes,
          deleteEventTriggerTypes,
          addNewJob,
          removeJob,
          setJobId,
          setJobName,
          setJobNeeds,
          setJobRunsOn,
          setJobEnvironment,
          setJobEnv,
          deleteJobEnv,
          setJobStepName,
          setJobStepIf,
          setJobStepRun,
          addNewJobStep,
          setJobStepUses,
          setJobStepEnv,
          deleteJobStepEnv,
          deleteJobStep,
        }),
      };
    },
    {
      name: 'githubYamlManager',
      dependencies: ['yamlSession'],
    },
  );
};
