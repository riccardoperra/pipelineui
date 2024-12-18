import {type WorkflowTemplate} from '@pipelineui/workflow-parser';
import {batch, createEffect, on, untrack, useContext} from 'solid-js';
import {defineStore} from 'statebuilder';
import {withProxyCommands} from 'statebuilder/commands';
import type {Diagnostic} from 'vscode-languageserver-protocol';
import {EditorContext} from '../../components/Editor/editor.context';
import type {
  EditorWorkflowStructure,
  JobEnvironment,
  WorkflowDispatchInput,
  WorkflowStructureEnvItem,
  WorkflowStructureJob,
  WorkflowStructureJobActionStep,
  WorkflowStructureJobRunStep,
  WorkflowStructureJobStep,
  WorkflowTypesTriggerEvent,
} from './editor.types';
import {withEditorSessionState} from './plugins/editorUpdater';
import {withGithubYamlManager} from './plugins/githubYamlManager';
import {withYamlDocumentSession} from './plugins/yamlSession';

export interface EditorState {
  selectedJobId: string | null;
  template: WorkflowTemplate | null;
  structure: EditorWorkflowStructure;
  diagnostics: readonly Diagnostic[];
  remoteId: string | null;
}

export function getInitialWorkflowStructureState(): EditorWorkflowStructure {
  return {
    name: '',
    events: {
      triggerEvents: [],
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
  diagnostics: [],
  remoteId: null,
}))
  .extend(withYamlDocumentSession())
  .extend(withGithubYamlManager())
  .extend(withEditorSessionState())
  .extend((_, context) => {
    return {
      selectedJob: (): WorkflowStructureJob => {
        const selectedJobId = _.get.selectedJobId;
        if (!selectedJobId) {
          // TODO: Fix type ! . here the job should always be valuated
          return null as unknown as WorkflowStructureJob;
        }
        // TODO: Fix type ! . here the job should always be valuated
        return _.get.structure?.jobs.find(job => {
          return job.$nodeId === selectedJobId;
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
    };
  })
  .extend((_, context) => {
    const editorContext = useContext(EditorContext)!;

    context.hooks.onInit(() => {
      // Support reactivity when using hybrid routing
      createEffect(
        on(
          () => editorContext.source,
          source => {
            _.initEditSession(editorContext.source).then();
          },
          // {defer: true},
        ),
      );

      createEffect(
        on(
          () => editorContext.remoteId,
          remoteId => {
            _.set('remoteId', remoteId);
          },
        ),
      );
    });

    return {
      scratch() {
        return editorContext.scratch?.();
      },
      canEditCurrent() {
        return editorContext.scratch?.()?.canEdit === true;
      },
    };
  })
  .extend(
    withProxyCommands<{
      setSelectedJobId: string | null;
      setDiagnostics: Diagnostic[];

      addNewTriggerEventTypes: {value: WorkflowTypesTriggerEvent};
      // TODO: should add $nodeId
      updateTriggerEventTypes: {
        index: number;
        value: WorkflowTypesTriggerEvent;
      };
      deleteTriggerEventTypes: {$nodeId: string};

      addNewEnvironmentVariable: {value: WorkflowStructureEnvItem};
      // TODO: should add $nodeId
      updateEnvironmentVariableByIndex: {
        index: number;
        value: WorkflowStructureEnvItem;
      };
      // TODO: should add $nodeId
      deleteEnvironmentVariableByIndex: {index: number};

      addNewJob: {autoSelect: boolean};
      deleteJob: {jobId: string};
      updateJobName: {jobId: string; name: string | null};
      updateJobId: {jobId: string; id: string};
      updateJobNeeds: {jobId: string; needs: string[]};
      updateJobRunsOn: {jobId: string; runsOn: string | null};
      updateJobEnvironment: {jobId: string; value: JobEnvironment};
      addNewJobEnv: {jobId: string; value: WorkflowStructureEnvItem};
      updateJobEnv: {
        jobId: string;
        index: number;
        value: WorkflowStructureEnvItem;
      };
      deleteJobEnv: {jobId: string; index: number};
      updateJobStepName: {jobId: string; stepId: string; name: string | null};
      updateJobStepIf: {jobId: string; stepId: string; value: string | null};
      updateJobStepType: {jobId: string; stepId: string; type: string};
      updateJobStepRun: {jobId: string; stepId: string; run: string | null};
      addNewJobStepEnv: {
        jobId: string;
        stepId: string;
        value: WorkflowStructureEnvItem;
      };
      updateJobStepEnv: {
        jobId: string;
        stepId: string;
        index: number;
        value: WorkflowStructureEnvItem;
      };
      deleteJobStepEnv: {
        jobId: string;
        stepId: string;
        index: number;
      };
      updateJobStepUses: {jobId: string; stepId: string; uses: string | null};
      addNewJobStep: {jobId: string};
      deleteJobStep: {jobId: string; stepId: string};
    }>({
      devtools: {storeName: 'editor'},
    }),
  )
  .extend(_ => {
    _.hold(_.commands.setSelectedJobId, (value, {set}) =>
      set('selectedJobId', value),
    );

    _.hold(_.commands.setDiagnostics, (value, {set}) =>
      set('diagnostics', value),
    );

    _.hold(_.commands.addNewTriggerEventTypes, ({value}) => {
      _.set('structure', 'events', 'triggerEvents', items => [...items, value]);
      _.yamlSession.setEventTriggerTypes(value);
    });

    _.hold(_.commands.updateTriggerEventTypes, ({value, index}) => {
      _.set('structure', 'events', 'triggerEvents', index, value);
      _.yamlSession.setEventTriggerTypes(value);
    });

    _.hold(_.commands.deleteTriggerEventTypes, ({$nodeId}) => {
      const index = _().structure.events.triggerEvents.findIndex(
        ev => ev.$nodeId === $nodeId,
      );
      const item = _().structure.events.triggerEvents[index];
      if (index !== -1) {
        _.set('structure', 'events', 'triggerEvents', items =>
          items.toSpliced(index, 1),
        );
        _.yamlSession.deleteEventTriggerTypes(item);
      }
    });

    _.hold(_.commands.addNewEnvironmentVariable, ({value}) => {
      const length = untrack(() => _().structure.env.array.length);
      _.set('structure', 'env', 'array', items => [...items, value]);
      _.yamlSession.setEnvironmentVariable(length, value);
    });

    _.hold(_.commands.updateEnvironmentVariableByIndex, ({index, value}) => {
      _.set('structure', 'env', 'array', index, value);
      _.yamlSession.setEnvironmentVariable(index, value);
    });

    _.hold(_.commands.deleteEnvironmentVariableByIndex, ({index}) => {
      _.set('structure', 'env', 'array', array => array.toSpliced(index, 1));
      _.yamlSession.deleteEnvironmentVariable(index);
    });

    _.hold(_.commands.addNewJob, ({autoSelect}) => {
      const length = _.get.structure.jobs.length;
      const job: WorkflowStructureJob = {
        $nodeId: crypto.randomUUID().toString(),
        needs: [],
        name: `New job ${length}`,
        steps: [],
        id: `new_job_${length}`,
        env: {array: []},
        runsOn: '',
        environment: null,
        $index: _.get.structure.jobs.length,
      };

      batch(() => {
        _.set('structure', 'jobs', jobs => [...jobs, job]);
        if (autoSelect) {
          _.actions.setSelectedJobId(job.$nodeId);
        }
      });
      _.yamlSession.addNewJob();
    });

    _.hold(_.commands.deleteJob, ({jobId}) => {
      const index = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      if (index !== -1) {
        const existingJob = _.get.structure.jobs[index];
        _.set('structure', 'jobs', jobs =>
          jobs.filter(job => job.id !== existingJob.id),
        );
        _.yamlSession.removeJob(existingJob.id);
      }
    });

    _.hold(_.commands.updateJobId, ({jobId, id}) => {
      const index = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      _.set('structure', 'jobs', index, 'id', id);
      _.yamlSession.setJobId(index, id);
    });

    _.hold(_.commands.updateJobName, ({jobId, name}) => {
      const index = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      _.set('structure', 'jobs', index, 'name', name ?? '');
      _.yamlSession.setJobName(index, name ?? '');
    });

    _.hold(_.commands.updateJobEnvironment, ({jobId, value}) => {
      const index = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      _.set('structure', 'jobs', index, 'environment', value);
      _.yamlSession.setJobEnvironment(index, value);
    });

    _.hold(_.commands.updateJobEnv, ({jobId, value, index}) => {
      const jobIndex = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      if (jobIndex === -1) {
        return;
      }
      _.set('structure', 'jobs', index, 'env', 'array', index, value);
      _.yamlSession.setJobEnv(jobIndex, index, value);
    });

    _.hold(_.commands.deleteJobEnv, ({jobId, index}) => {
      const jobIndex = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      if (jobIndex === -1) {
        return;
      }
      _.set('structure', 'jobs', index, 'env', 'array', array =>
        array.toSpliced(index, 1),
      );
      _.yamlSession.deleteJobEnv(jobIndex, index);
    });

    _.hold(_.commands.addNewJobEnv, ({value, jobId}) => {
      const jobIndex = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      if (jobIndex === -1) {
        return;
      }
      const length = untrack(
        () => _().structure.jobs[jobIndex].env?.array?.length ?? 0,
      );
      _.set('structure', 'jobs', jobIndex, 'env', 'array', items => [
        ...items,
        value,
      ]);
      _.yamlSession.setJobEnv(jobIndex, length, value);
    });

    _.hold(_.commands.updateJobRunsOn, ({jobId, runsOn}) => {
      const index = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      _.set('structure', 'jobs', index, 'runsOn', runsOn ?? '');
      _.yamlSession.setJobRunsOn(index, runsOn ?? '');
    });

    _.hold(_.commands.updateJobNeeds, ({jobId, needs}) => {
      const index = _.get.structure.jobs.findIndex(
        job => job.$nodeId === jobId,
      );
      _.set('structure', 'jobs', index, 'needs', needs);
      _.yamlSession.setJobNeeds(index, needs ?? []);
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

    _.hold(_.commands.updateJobStepIf, ({jobId, stepId, value}) => {
      const updater = _.utils.createStepJobUpdater(jobId, stepId);
      if (!updater) {
        return;
      }
      updater.update('if', value ?? '');
      _.yamlSession.setJobStepIf(updater.jobIndex, updater.stepIndex, value);
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

    _.hold(_.commands.updateJobStepEnv, ({jobId, stepId, value, index}) => {
      const updater = _.utils.createStepJobUpdater<WorkflowStructureJobRunStep>(
        jobId,
        stepId,
      );
      if (!updater) {
        return;
      }
      updater.update('env', 'array', index, value);
      _.yamlSession.setJobStepEnv(
        updater.jobIndex,
        updater.stepIndex,
        index,
        value,
      );
    });

    _.hold(_.commands.deleteJobStepEnv, ({jobId, stepId, index}) => {
      const updater = _.utils.createStepJobUpdater<WorkflowStructureJobRunStep>(
        jobId,
        stepId,
      );
      if (!updater) {
        return;
      }
      updater.update('env', 'array', array => array.toSpliced(index, 1));
      _.yamlSession.deleteJobStepEnv(
        updater.jobIndex,
        updater.stepIndex,
        index,
      );
    });

    _.hold(_.commands.addNewJobStepEnv, ({value, jobId, stepId}) => {
      const updater = _.utils.createStepJobUpdater<WorkflowStructureJobRunStep>(
        jobId,
        stepId,
      );
      if (!updater) {
        return;
      }
      const length = untrack(
        () =>
          _().structure.jobs[updater.jobIndex].steps[updater.stepIndex].env
            ?.array?.length ?? 0,
      );
      updater.update('env', 'array', items => [...items, value]);
      _.yamlSession.setJobStepEnv(
        updater.jobIndex,
        updater.stepIndex,
        length,
        value,
      );
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

    _.hold(_.commands.deleteJobStep, ({jobId, stepId}) => {
      const updater =
        _.utils.createStepJobUpdater<WorkflowStructureJobActionStep>(
          jobId,
          stepId,
        );
      if (!updater) {
        return;
      }
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
      _.set('structure', 'jobs', jobIndex, 'steps', steps => [
        ...steps.toSpliced(stepIndex, 1),
      ]);
      _.yamlSession.deleteJobStep(jobIndex, stepIndex);
    });

    _.hold(_.commands.addNewJobStep, ({jobId}) => {
      const jobIndex = untrack(() =>
        _.get.structure.jobs.findIndex(job => job.$nodeId === jobId),
      );
      if (jobIndex === -1) {
        return;
      }
      const newIndex = _.get.structure.jobs[jobIndex].steps.length;
      const step: WorkflowStructureJobStep = {
        $nodeId: crypto.randomUUID(),
        $index: newIndex,
        id: `step-${newIndex}`,
        name: `Step ${newIndex}`,
        type: 'run',
        run: '',
        env: {array: []},
        if: undefined,
      };
      _.set('structure', 'jobs', jobIndex, 'steps', steps => [...steps, step]);
      _.yamlSession.addNewJobStep(jobIndex, step);
    });
  })
  .extend((_, context) => {
    context.hooks.onInit(() => {
      _.watchCommand([_.commands.updateJobNeeds]).subscribe(command => {});
    });
  });
