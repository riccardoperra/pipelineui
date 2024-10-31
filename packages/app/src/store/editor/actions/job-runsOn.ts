import {Pair, Scalar} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob} from './helper';

export const setJobRunsOn =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, runsOn: string) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      const hasJob = job.has('runs-on');
      if (!hasJob) {
        // TODO: support ordering0
        job.items = [
          new Pair<unknown, unknown>(new Scalar('runs-on'), runsOn),
          ...job.items,
        ];
      } else {
        job.set('runs-on', runsOn);
      }
    });
  };
