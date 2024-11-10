import {Pair, Scalar} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob} from './helper';

export const setJobRunsOn =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, runsOn: string) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      job.set('runs-on', runsOn);
    });
  };
