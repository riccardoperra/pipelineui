import {Scalar} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob, findJobStep} from './helper';

export const setJobStepRun =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, stepIndex: number, run: string | null) => {
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
