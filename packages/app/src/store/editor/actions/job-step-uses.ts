import {Scalar} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob, findJobStep} from './helper';

export const setJobStepUses =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, stepIndex: number, uses: string | null) => {
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
