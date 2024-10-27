import {YAMLSession} from '../plugins/yamlSession';
import {findJob, findJobStep} from './helper';

export const setJobStepName =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, stepIndex: number, name: string) => {
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
