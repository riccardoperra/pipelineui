import {type GenericStoreApi, makePlugin, type Store} from 'statebuilder';
import type {YAMLDocument, YamlDocumentSessionPlugin} from './yamlSession';
import type {JobEnvironment, WorkflowDispatchInput} from '../editor.store';
import YAML, {Scalar, YAMLMap, YAMLSeq} from 'yaml';

export const withGithubYamlManager = () => {
  return makePlugin.typed<GenericStoreApi & YamlDocumentSessionPlugin>()(
    _ => {
      const {yamlSession} = _;

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

      const setWorkflowDispatch = (
        index: number,
        data: WorkflowDispatchInput,
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

            const {name, ...others} = data;
            const inputAtIndex = inputs.items.at(index);
            const input = new YAMLMap<Scalar<string>, unknown>();
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

      const findJob = (yaml: YAMLDocument, jobId: string) => {
        const jobs = yaml.get('jobs') as YAMLMap<String, YAMLMap>;
        return jobs.get(jobId);
      };

      const setJobName = (jobId: string, name: string) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobId)!;
          job.set('name', name);
        });
      };

      const setJobNeeds = (jobId: string, needs: string[]) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobId)!;
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

      const setJobEnvironment = (
        jobId: string,
        environment: JobEnvironment,
      ) => {
        yamlSession.updater(yaml => {
          const job = findJob(yaml, jobId)!;
          let node: YAMLMap | Scalar;
          if (environment.type === 'value') {
            node = new Scalar(environment.name);
          } else {
            node = new YAMLMap();
            node.set('name', environment.name);
            node.set('url', environment.url);
          }
          job.set('environment', node);
        });
      };

      return {
        yamlSession: Object.assign(_.yamlSession, {
          setWorkflowDispatch,
          setJobName,
          setJobNeeds,
          setJobEnvironment,
        }),
      };
    },
    {
      name: 'githubYamlManager',
      dependencies: ['yamlSession'],
    },
  );
};