import {YAMLSession} from '../plugins/yamlSession';
import {findJob, findJobStep} from './helper';

export const setJobStepIf =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, stepIndex: number, value: string | null) => {
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
