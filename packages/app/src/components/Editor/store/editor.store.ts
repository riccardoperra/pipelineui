import {defineStore} from 'statebuilder';
import {Document, type ParsedNode, parseDocument} from 'yaml';
import {createSignal, untrack} from 'solid-js';
import {reconcile, type SetStoreFunction} from 'solid-js/store';
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
  WorkflowStructureJob,
  WorkflowStructureJobActionStep,
  WorkflowStructureJobRunStep,
} from './editor.types';
import {withProxyCommands} from 'statebuilder/commands';

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

    const createStepJobUpdater = <
      T extends WorkflowStructureJobRunStep | WorkflowStructureJobActionStep,
    >(
      jobId: string,
      stepId: string,
    ) => {
      const jobIndex = untrack(() =>
        _.get.structure.jobs.findIndex(job => job.$nodeId === jobId),
      );
      if (jobIndex === -1) {
        return;
      }
      const stepIndex = _.get.structure.jobs[jobIndex].steps.findIndex(
        step => step.$nodeId === stepId,
      );
      if (stepIndex === -1) {
        return;
      }

      const setter = (...args: any[]) => {
        // @ts-expect-error
        _.set('structure', 'jobs', jobIndex, 'steps', stepIndex, ...args);
      };

      return {
        update: setter as SetStoreFunction<T>,
        jobIndex,
        stepIndex,
      } as const;
    };

    return {
      session,

      utils: {
        createStepJobUpdater,
      },

      selectedJob: (): WorkflowStructureJob => {
        const selectedJobId = _.get.selectedJobId;
        if (!selectedJobId) {
          // TODO: Fix type ! . here the job should always be valuated
          return null as unknown as WorkflowStructureJob;
        }
        // TODO: Fix type ! . here the job should always be valuated
        return _.get.structure?.jobs.find(job => {
          return job.id === selectedJobId;
        })!;
      },

      // TODO @deprecated
      actionsDeprecated: {
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
          // TODO: add update
          // yamlUpdater(() => {
          //   if (data === null) {
          //     workflow.delete('concurrency');
          //   } else {
          //     const concurrency = new YAMLMap();
          //     concurrency.set('group', data.group);
          //     concurrency.set('cancel-in-progress', data.cancelInProgress);
          //     workflow.set('concurrency', concurrency);
          //   }
          // });
        },
      },

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
  })
  .extend(
    withProxyCommands<{
      setSelectedJobId: string | null;

      addNewEnvironmentVariable: {value: WorkflowStructureEnvItem};
      updateEnvironmentVariableByIndex: {
        index: number;
        value: WorkflowStructureEnvItem;
      };

      updateJobName: {jobId: string; name: string | null};
      updateJobRunsOn: {jobId: string; runsOn: string | null};
      updateJobStepName: {jobId: string; stepId: string; name: string | null};
      updateJobStepType: {jobId: string; stepId: string; type: string};
      updateJobStepRun: {jobId: string; stepId: string; run: string | null};
      updateJobStepUses: {jobId: string; stepId: string; uses: string | null};
    }>({
      devtools: {storeName: 'editor'},
    }),
  )
  .extend(_ => {
    _.hold(_.commands.setSelectedJobId, (value, {set}) =>
      set('selectedJobId', value),
    );

    _.hold(_.commands.addNewEnvironmentVariable, ({value}) => {
      const length = untrack(() => _().structure.env.array.length);
      _.set('structure', 'env', 'array', items => [...items, value]);
      _.yamlSession.setEnvironmentVariable(length, value);
    });

    _.hold(_.commands.updateEnvironmentVariableByIndex, ({index, value}) => {
      _.set('structure', 'env', 'array', index, value);
      _.yamlSession.setEnvironmentVariable(index, value);
    });

    _.hold(_.commands.updateJobName, ({jobId, name}) => {
      const index = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      _.set('structure', 'jobs', index, 'name', name ?? '');
      _.yamlSession.setJobName(index, name ?? '');
    });

    _.hold(_.commands.updateJobRunsOn, ({jobId, runsOn}) => {
      const index = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      _.set('structure', 'jobs', index, 'runsOn', runsOn ?? '');
      _.yamlSession.setJobRunsOn(index, runsOn ?? '');
    });

    _.hold(_.commands.updateJobStepName, ({jobId, stepId, name}) => {
      const updater = _.utils.createStepJobUpdater(jobId, stepId);
      if (!updater) {
        return;
      }
      updater.update('name', name ?? '');
      _.yamlSession.setJobStepName(
        updater.jobIndex,
        updater.stepIndex,
        name ?? '',
      );
    });

    _.hold(_.commands.updateJobStepType, ({jobId, stepId, type}) => {
      const updater = _.utils.createStepJobUpdater(jobId, stepId);
      if (!updater) {
        return;
      }
      updater.update('type', type as 'action' | 'run');
      untrack(() => {
        const job = _.get.structure.jobs[updater.jobIndex];
        const step = job.steps[updater.stepIndex];

        if (type === 'action') {
          _.yamlSession.setJobStepUses(
            updater.jobIndex,
            updater.stepIndex,
            (step as WorkflowStructureJobActionStep)['uses'],
          );
          _.yamlSession.setJobStepRun(
            updater.jobIndex,
            updater.stepIndex,
            null,
          );
        } else {
          _.yamlSession.setJobStepUses(
            updater.jobIndex,
            updater.stepIndex,
            null,
          );
          _.yamlSession.setJobStepRun(
            updater.jobIndex,
            updater.stepIndex,
            (step as WorkflowStructureJobRunStep)['run'],
          );
        }
      });
    });

    _.hold(_.commands.updateJobStepRun, ({jobId, stepId, run}) => {
      const updater = _.utils.createStepJobUpdater<WorkflowStructureJobRunStep>(
        jobId,
        stepId,
      );
      if (!updater) {
        return;
      }
      updater.update('run', run ?? '');
      _.yamlSession.setJobStepRun(updater.jobIndex, updater.stepIndex, run);
    });

    _.hold(_.commands.updateJobStepUses, ({jobId, stepId, uses}) => {
      const updater =
        _.utils.createStepJobUpdater<WorkflowStructureJobActionStep>(
          jobId,
          stepId,
        );
      if (!updater) {
        return;
      }
      updater.update('uses', uses ?? '');
      _.yamlSession.setJobStepUses(updater.jobIndex, updater.stepIndex, uses);
    });
  });
