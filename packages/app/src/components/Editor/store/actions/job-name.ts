import {Pair, Scalar} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob} from './helper';

export const setJobName =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, name: string) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      const hasJob = job.has('name');
      if (!hasJob) {
        // TODO: support ordering0
        job.items = [
          new Pair<unknown, unknown>(new Scalar('name'), name),
          ...job.items,
        ];
      } else {
        job.set('name', name);
      }
    });
  };
