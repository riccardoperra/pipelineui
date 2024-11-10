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
        if (!run.endsWith('\n')) {
          // This removes |- at the start of the script
          run += `\n`;
        }
        const value = new Scalar(run);
        value.type = 'BLOCK_LITERAL';
        value.spaceBefore = false;
        step.set(new Scalar('run'), value);
      }
    });
  };
