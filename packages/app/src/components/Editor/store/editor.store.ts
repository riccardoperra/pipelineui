import {defineStore} from 'statebuilder';
import {Document, type ParsedNode, parseDocument, YAMLMap} from 'yaml';
import {createMemo, createSignal, untrack} from 'solid-js';
import {reconcile} from 'solid-js/store';
import {
  getWorkflowJson,
  type WorkflowTemplate,
} from '@pipelineui/workflow-parser';
import type {WorkflowConcurrency} from '../Properties/WorkflowConcurrencyForm/WorkflowConcurrencyForm';
import {withGithubYamlManager} from './plugins/githubYamlManager';
import {withYamlDocumentSession} from './plugins/yamlSession';
import {getStructureFromWorkflow} from './utils/getStructureFromWorkflow';
import type {
  EditorWorkflowStructure,
  WorkflowDispatchInput,
  WorkflowStructureEnvItem,
} from './editor.types';

export interface EditorState {
  selectedJobId: string | null;
  template: WorkflowTemplate | null;
  structure: EditorWorkflowStructure;
}

export function getInitialWorkflowStructureState(): EditorWorkflowStructure {
  return {
    name: '',
    events: {
      workflowDispatch: [],
    },
    jobs: [],
    env: {
      array: [],
    },
  };
}

export const EditorStore = defineStore<EditorState>(() => ({
  selectedJobId: null,
  template: null,
  structure: getInitialWorkflowStructureState(),
}))
  .extend(withYamlDocumentSession())
  .extend(withGithubYamlManager())
  .extend(_ => {
    const [session, setSession] =
      createSignal<Document.Parsed<ParsedNode, true>>();

    const [notifier, setNotifier] = createSignal([], {equals: false});

    const yamlCode = createMemo(() => {
      notifier();
      return session()?.toString() ?? '';
    });

    const yamlUpdater = (cb: () => void) => {
      cb();
      setNotifier([]);
      queueMicrotask(() => {
        getWorkflowJson('./yaml.json', session()!.toString()!).template.then(
          response => {
            _.set('template', reconcile(response));
          },
        );
      });
    };

    return {
      session,

      selectedJob: () => {
        const selectedJobId = _.get.selectedJobId;
        if (!selectedJobId) {
          return;
        }
        return _.get.structure?.jobs.find(job => {
          return job.id === selectedJobId;
        });
      },

      actions: {
        jobs: {
          stepUpdateName(jobId: string, stepId: string, name: string) {
            const jobIndex = untrack(() =>
              _.get.structure.jobs.findIndex(job => job.id === jobId),
            );
            if (jobIndex === -1) {
              return;
            }
            const stepIndex = _.get.structure.jobs[jobIndex].steps.findIndex(
              step => step.id === stepId,
            );
            if (stepIndex === -1) {
              return;
            }
            _.set(
              'structure',
              'jobs',
              jobIndex,
              'steps',
              stepIndex,
              'name',
              name,
            );
            _.yamlSession.setJobStepName(jobId, stepIndex, name);
          },

          stepUpdateType(jobId: string, stepId: string, type: string) {
            const jobIndex = untrack(() =>
              _.get.structure.jobs.findIndex(job => job.id === jobId),
            );
            if (jobIndex === -1) {
              return;
            }
            const stepIndex = _.get.structure.jobs[jobIndex].steps.findIndex(
              step => step.id === stepId,
            );
            if (stepIndex === -1 || (type !== 'action' && type !== 'run')) {
              return;
            }
            _.set(
              'structure',
              'jobs',
              jobIndex,
              'steps',
              stepIndex,
              'type',
              type as 'action' | 'run',
            );
          },

          stepUpdateRun(jobId: string, stepId: string, run: string) {
            const jobIndex = untrack(() =>
              _.get.structure.jobs.findIndex(job => job.id === jobId),
            );
            if (jobIndex === -1) {
              return;
            }
            const stepIndex = _.get.structure.jobs[jobIndex].steps.findIndex(
              step => step.id === stepId,
            );
            if (stepIndex === -1) {
              return;
            }
            _.set(
              'structure',
              'jobs',
              jobIndex,
              'steps',
              stepIndex,
              // @ts-expect-error TODO: fix type, union
              'run',
              run,
            );
            _.yamlSession.setJobStepRun(jobId, stepIndex, run);
          },

          stepUpdateUses(jobId: string, stepId: string, uses: string) {
            const jobIndex = untrack(() =>
              _.get.structure.jobs.findIndex(job => job.id === jobId),
            );
            if (jobIndex === -1) {
              return;
            }
            const stepIndex = _.get.structure.jobs[jobIndex].steps.findIndex(
              step => step.id === stepId,
            );
            if (stepIndex === -1) {
              return;
            }
            _.set(
              'structure',
              'jobs',
              jobIndex,
              'steps',
              stepIndex,
              // @ts-expect-error TODO: fix type, union
              'uses',
              uses,
            );
            _.yamlSession.setJobStepUses(jobId, stepIndex, uses);
          },
        },

        environmentVariables: {
          addNew: (value: WorkflowStructureEnvItem) => {
            const length = untrack(() => _().structure.env.array.length);
            _.set('structure', 'env', 'array', items => [...items, value]);
            _.yamlSession.setEnvironmentVariable(length, value);
          },
          updateByIndex: (index: number, value: WorkflowStructureEnvItem) => {
            _.set('structure', 'env', 'array', index, value);
            _.yamlSession.setEnvironmentVariable(index, value);
          },
        },

        workflowDispatch: {
          addNew: (value: WorkflowDispatchInput) => {
            const length = untrack(
              () => _().structure.events.workflowDispatch.length,
            );
            _.set('structure', 'events', 'workflowDispatch', items => [
              ...items,
              value,
            ]);
            _.yamlSession.setWorkflowDispatch(length, value);
          },
          updateAll: (value: WorkflowDispatchInput[]) => {
            _.set('structure', 'events', 'workflowDispatch', () => value);
          },
          updateByIndex: (index: number, value: WorkflowDispatchInput) => {
            _.set('structure', 'events', 'workflowDispatch', index, value);
            _.yamlSession.setWorkflowDispatch(index, value);
          },
          deleteByIndex: (index: number) => {
            _.set('structure', 'events', 'workflowDispatch', items =>
              items.filter((item, i) => i !== index),
            );
            _.yamlSession.deleteWorkflowDispatchItem(index);
          },
        },
      },

      sessionUpdate: {
        setConcurrency: (data: WorkflowConcurrency | null) => {
          const workflow = session()!;
          yamlUpdater(() => {
            if (data === null) {
              workflow.delete('concurrency');
            } else {
              const concurrency = new YAMLMap();
              concurrency.set('group', data.group);
              concurrency.set('cancel-in-progress', data.cancelInProgress);
              workflow.set('concurrency', concurrency);
            }
          });
        },
      },

      yamlCode,
      initEditSession(source: string): void {
        _.yamlSession.init(
          parseDocument(source, {
            merge: false,
            toStringDefaults: {
              simpleKeys: true,
              collectionStyle: 'any',
              flowCollectionPadding: true,
            },
          }),
        );
        const {result, template} = getWorkflowJson(
          './yaml.json',
          _.yamlSession.document()!.toString()!,
        );
        template.then(resolvedTemplate => {
          _.set('template', reconcile(resolvedTemplate));
          _.set(
            'structure',
            reconcile(getStructureFromWorkflow(result, resolvedTemplate)),
          );
        });
      },
    };
  });
