import {type GenericStoreApi, makePlugin} from 'statebuilder';
import {addNewJob, removeJob} from '../actions/job';
import {deleteJobEnv, setJobEnv} from '../actions/job-env';
import {setJobEnvironment} from '../actions/job-environment';
import {setJobId} from '../actions/job-id';
import {setJobName} from '../actions/job-name';
import {setJobNeeds} from '../actions/job-needs';
import {setJobRunsOn} from '../actions/job-runsOn';
import {addNewJobStep, deleteJobStep} from '../actions/job-step';
import {deleteJobStepEnv, setJobStepEnv} from '../actions/job-step-env';
import {setJobStepIf} from '../actions/job-step-if';
import {setJobStepName} from '../actions/job-step-name';
import {setJobStepRun} from '../actions/job-step-run';
import {setJobStepUses} from '../actions/job-step-uses';
import {
  deleteWorkflowDispatchItem,
  setWorkflowDispatch,
} from '../actions/workflow-dispatch';
import {
  deleteEnvironmentVariable,
  setEnvironmentVariable,
} from '../actions/workflow-env';
import {
  deleteEventTriggerTypes,
  setEventTriggerTypes,
} from '../actions/workflow-event-trigger';
import type {YamlDocumentSessionPlugin} from './yamlSession';

export const withGithubYamlManager = () => {
  return makePlugin.typed<GenericStoreApi & YamlDocumentSessionPlugin>()(
    _ => {
      return {
        yamlSession: Object.assign(_.yamlSession, {
          setEnvironmentVariable: setEnvironmentVariable(_.yamlSession),
          deleteEnvironmentVariable: deleteEnvironmentVariable(_.yamlSession),
          setWorkflowDispatch: setWorkflowDispatch(_.yamlSession),
          deleteWorkflowDispatchItem: deleteWorkflowDispatchItem(_.yamlSession),
          setEventTriggerTypes: setEventTriggerTypes(_.yamlSession),
          deleteEventTriggerTypes: deleteEventTriggerTypes(_.yamlSession),
          addNewJob: addNewJob(_.yamlSession),
          removeJob: removeJob(_.yamlSession),
          setJobId: setJobId(_.yamlSession),
          setJobName: setJobName(_.yamlSession),
          setJobNeeds: setJobNeeds(_.yamlSession),
          setJobRunsOn: setJobRunsOn(_.yamlSession),
          setJobEnvironment: setJobEnvironment(_.yamlSession),
          setJobEnv: setJobEnv(_.yamlSession),
          deleteJobEnv: deleteJobEnv(_.yamlSession),
          setJobStepName: setJobStepName(_.yamlSession),
          setJobStepIf: setJobStepIf(_.yamlSession),
          setJobStepRun: setJobStepRun(_.yamlSession),
          addNewJobStep: addNewJobStep(_.yamlSession),
          deleteJobStep: deleteJobStep(_.yamlSession),
          setJobStepUses: setJobStepUses(_.yamlSession),
          setJobStepEnv: setJobStepEnv(_.yamlSession),
          deleteJobStepEnv: deleteJobStepEnv(_.yamlSession),
        }),
      };
    },
    {
      name: 'githubYamlManager',
      dependencies: ['yamlSession'],
    },
  );
};
